const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');
const amqp = require('amqplib');
const winston = require('winston');
require('dotenv').config();

// Configuration du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/webhook-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/webhook-combined.log' })
  ]
});

class WebhookService {
  constructor() {
    this.app = express();
    this.connection = null;
    this.channel = null;
    this.port = process.env.WEBHOOK_PORT || 3001;
    this.rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://getweez_admin:GetWeez2024!@localhost:5672/getweez';
    this.webhookSecret = process.env.WEBHOOK_SECRET || 'GetWeezWebhookSecret2024';
    this.exchangeName = 'code_review';
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.raw({ type: 'application/json', limit: '10mb' }));
    
    // Middleware de logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        rabbitmq: this.connection ? 'connected' : 'disconnected',
        uptime: process.uptime()
      });
    });

    // GitHub webhook
    this.app.post('/webhook/github', this.verifyGitHubSignature.bind(this), this.handleGitHubWebhook.bind(this));
    
    // GitLab webhook
    this.app.post('/webhook/gitlab', this.verifyGitLabToken.bind(this), this.handleGitLabWebhook.bind(this));
    
    // Generic git webhook
    this.app.post('/webhook/git', this.handleGenericGitWebhook.bind(this));

    // Manual trigger pour tests
    this.app.post('/trigger/manual', this.handleManualTrigger.bind(this));

    // Webhook status
    this.app.get('/webhook/status', (req, res) => {
      res.json({
        service: 'GetWeez Code Review Webhook Service',
        version: '1.0.0',
        status: 'active',
        endpoints: [
          '/webhook/github',
          '/webhook/gitlab', 
          '/webhook/git',
          '/trigger/manual'
        ]
      });
    });
  }

  // Vérification signature GitHub
  verifyGitHubSignature(req, res, next) {
    const signature = req.headers['x-hub-signature-256'];
    
    if (!signature) {
      logger.warn('GitHub webhook sans signature', { ip: req.ip });
      return res.status(401).json({ error: 'Signature manquante' });
    }

    const payload = JSON.stringify(req.body);
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload, 'utf8')
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      logger.warn('Signature GitHub invalide', { ip: req.ip, signature });
      return res.status(401).json({ error: 'Signature invalide' });
    }

    next();
  }

  // Vérification token GitLab
  verifyGitLabToken(req, res, next) {
    const token = req.headers['x-gitlab-token'];
    
    if (!token || token !== this.webhookSecret) {
      logger.warn('Token GitLab invalide', { ip: req.ip });
      return res.status(401).json({ error: 'Token invalide' });
    }

    next();
  }

  // Handler GitHub webhook
  async handleGitHubWebhook(req, res) {
    try {
      const event = req.headers['x-github-event'];
      const payload = req.body;

      logger.info('GitHub webhook reçu', { 
        event, 
        repository: payload.repository?.full_name,
        action: payload.action 
      });

      let routingKey = '';
      let processEvent = false;

      switch (event) {
        case 'push':
          routingKey = 'git.push';
          processEvent = true;
          break;
        case 'pull_request':
          if (['opened', 'synchronize', 'reopened'].includes(payload.action)) {
            routingKey = 'git.pull_request';
            processEvent = true;
          }
          break;
        default:
          logger.info('Événement GitHub ignoré', { event });
      }

      if (processEvent) {
        const message = {
          source: 'github',
          event,
          timestamp: new Date().toISOString(),
          repository: {
            name: payload.repository.full_name,
            url: payload.repository.html_url,
            clone_url: payload.repository.clone_url,
            default_branch: payload.repository.default_branch
          },
          commits: this.extractCommits(payload, 'github'),
          pull_request: payload.pull_request ? {
            number: payload.pull_request.number,
            title: payload.pull_request.title,
            head: payload.pull_request.head.sha,
            base: payload.pull_request.base.sha,
            url: payload.pull_request.html_url
          } : null
        };

        await this.publishMessage(routingKey, message);
        
        res.status(200).json({ 
          status: 'success', 
          message: 'Webhook traité avec succès',
          event,
          routing_key: routingKey
        });
      } else {
        res.status(200).json({ 
          status: 'ignored', 
          message: 'Événement ignoré',
          event 
        });
      }

    } catch (error) {
      logger.error('Erreur webhook GitHub', { error: error.message, stack: error.stack });
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

  // Handler GitLab webhook
  async handleGitLabWebhook(req, res) {
    try {
      const event = req.headers['x-gitlab-event'];
      const payload = req.body;

      logger.info('GitLab webhook reçu', { 
        event, 
        project: payload.project?.path_with_namespace 
      });

      let routingKey = '';
      let processEvent = false;

      switch (event) {
        case 'Push Hook':
          routingKey = 'git.push';
          processEvent = true;
          break;
        case 'Merge Request Hook':
          if (['open', 'reopen', 'update'].includes(payload.object_attributes?.action)) {
            routingKey = 'git.pull_request';
            processEvent = true;
          }
          break;
        default:
          logger.info('Événement GitLab ignoré', { event });
      }

      if (processEvent) {
        const message = {
          source: 'gitlab',
          event,
          timestamp: new Date().toISOString(),
          repository: {
            name: payload.project.path_with_namespace,
            url: payload.project.web_url,
            clone_url: payload.project.git_http_url,
            default_branch: payload.project.default_branch
          },
          commits: this.extractCommits(payload, 'gitlab'),
          pull_request: payload.object_attributes ? {
            number: payload.object_attributes.iid,
            title: payload.object_attributes.title,
            head: payload.object_attributes.last_commit?.id,
            base: payload.object_attributes.target_branch,
            url: payload.object_attributes.url
          } : null
        };

        await this.publishMessage(routingKey, message);
        
        res.status(200).json({ 
          status: 'success', 
          message: 'Webhook traité avec succès',
          event,
          routing_key: routingKey
        });
      } else {
        res.status(200).json({ 
          status: 'ignored', 
          message: 'Événement ignoré',
          event 
        });
      }

    } catch (error) {
      logger.error('Erreur webhook GitLab', { error: error.message, stack: error.stack });
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

  // Handler generic git webhook
  async handleGenericGitWebhook(req, res) {
    try {
      const payload = req.body;
      
      logger.info('Generic git webhook reçu', { 
        repository: payload.repository?.name 
      });

      const message = {
        source: 'generic',
        event: 'push',
        timestamp: new Date().toISOString(),
        repository: payload.repository || {},
        commits: payload.commits || [],
        raw_payload: payload
      };

      await this.publishMessage('git.push', message);
      
      res.status(200).json({ 
        status: 'success', 
        message: 'Webhook générique traité avec succès'
      });

    } catch (error) {
      logger.error('Erreur webhook générique', { error: error.message, stack: error.stack });
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

  // Handler pour déclenchement manuel (tests)
  async handleManualTrigger(req, res) {
    try {
      const { repository, commits, type = 'push' } = req.body;

      if (!repository) {
        return res.status(400).json({ error: 'Repository requis' });
      }

      const message = {
        source: 'manual',
        event: type,
        timestamp: new Date().toISOString(),
        repository,
        commits: commits || [{
          id: 'manual-test',
          message: 'Test manuel de review de code',
          author: 'Manual Trigger',
          added: ['test-file.js'],
          modified: [],
          removed: []
        }]
      };

      await this.publishMessage(`git.${type}`, message);
      
      res.status(200).json({ 
        status: 'success', 
        message: 'Déclenchement manuel effectué avec succès'
      });

    } catch (error) {
      logger.error('Erreur déclenchement manuel', { error: error.message, stack: error.stack });
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

  // Extraction des commits selon la source
  extractCommits(payload, source) {
    switch (source) {
      case 'github':
        return payload.commits?.map(commit => ({
          id: commit.id,
          message: commit.message,
          author: commit.author.name,
          timestamp: commit.timestamp,
          url: commit.url,
          added: commit.added || [],
          modified: commit.modified || [],
          removed: commit.removed || []
        })) || [];
      
      case 'gitlab':
        return payload.commits?.map(commit => ({
          id: commit.id,
          message: commit.message,
          author: commit.author.name,
          timestamp: commit.timestamp,
          url: commit.url,
          added: commit.added || [],
          modified: commit.modified || [],
          removed: commit.removed || []
        })) || [];
      
      default:
        return [];
    }
  }

  // Publication d'un message vers RabbitMQ
  async publishMessage(routingKey, message) {
    try {
      if (!this.channel) {
        throw new Error('Canal RabbitMQ non initialisé');
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));
      
      const published = await this.channel.publish(
        this.exchangeName,
        routingKey,
        messageBuffer,
        {
          persistent: true,
          timestamp: Date.now(),
          messageId: crypto.randomUUID(),
          headers: {
            source: message.source,
            event: message.event,
            repository: message.repository?.name
          }
        }
      );

      if (published) {
        logger.info('Message publié vers RabbitMQ', {
          routingKey,
          messageId: messageBuffer.messageId,
          repository: message.repository?.name
        });
      } else {
        throw new Error('Échec de publication du message');
      }

    } catch (error) {
      logger.error('Erreur publication RabbitMQ', {
        error: error.message,
        routingKey,
        repository: message.repository?.name
      });
      throw error;
    }
  }

  // Connexion à RabbitMQ
  async connectRabbitMQ() {
    try {
      logger.info('Connexion à RabbitMQ...', { url: this.rabbitmqUrl });
      
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      // Vérifier que l'exchange existe
      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      
      logger.info('Connexion RabbitMQ établie avec succès');
      
      // Gestion des événements de connexion
      this.connection.on('error', (error) => {
        logger.error('Erreur connexion RabbitMQ', { error: error.message });
      });
      
      this.connection.on('close', () => {
        logger.warn('Connexion RabbitMQ fermée');
        setTimeout(() => this.connectRabbitMQ(), 5000); // Reconnexion automatique
      });

    } catch (error) {
      logger.error('Échec connexion RabbitMQ', { error: error.message });
      setTimeout(() => this.connectRabbitMQ(), 5000); // Retry
      throw error;
    }
  }

  // Démarrage du service
  async start() {
    try {
      await this.connectRabbitMQ();
      
      this.app.listen(this.port, () => {
        logger.info(`🚀 Webhook Service démarré sur le port ${this.port}`);
        logger.info(`🔗 Endpoints disponibles:`);
        logger.info(`   - POST http://localhost:${this.port}/webhook/github`);
        logger.info(`   - POST http://localhost:${this.port}/webhook/gitlab`);
        logger.info(`   - POST http://localhost:${this.port}/webhook/git`);
        logger.info(`   - GET  http://localhost:${this.port}/health`);
      });

    } catch (error) {
      logger.error('Échec démarrage service', { error: error.message });
      process.exit(1);
    }
  }

  // Arrêt propre du service
  async shutdown() {
    logger.info('Arrêt du service...');
    
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    
    logger.info('Service arrêté proprement');
  }
}

// Démarrage du service
const webhookService = new WebhookService();
webhookService.start().catch(console.error);

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => webhookService.shutdown());
process.on('SIGINT', () => webhookService.shutdown());

module.exports = WebhookService;