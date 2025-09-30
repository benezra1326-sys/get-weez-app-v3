const amqp = require('amqplib');
const winston = require('winston');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');
const OpenAI = require('openai');
const eslint = require('eslint');
const { createClient } = require('redis');
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
    new winston.transports.File({ filename: 'logs/worker-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/worker-combined.log' })
  ]
});

class CodeReviewWorker {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.redisClient = null;
    this.openai = null;
    
    // Configuration
    this.rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://getweez_admin:GetWeez2024!@localhost:5672/getweez';
    this.redisUrl = process.env.REDIS_URL || 'redis://:GetWeez2024!@localhost:6379';
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.workDir = process.env.WORK_DIR || './temp-repos';
    this.exchangeName = 'code_review';
    this.queueName = 'code_review.git_events';
    
    // Configuration ESLint
    this.eslintConfig = {
      baseConfig: {
        extends: [
          'eslint:recommended',
          '@eslint/js/recommended'
        ],
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true
          }
        },
        env: {
          browser: true,
          node: true,
          es2022: true
        },
        rules: {
          'no-console': 'warn',
          'no-unused-vars': 'error',
          'no-undef': 'error',
          'complexity': ['warn', 10],
          'max-lines': ['warn', 500],
          'max-lines-per-function': ['warn', 100],
          'no-duplicate-imports': 'error',
          'prefer-const': 'error'
        }
      },
      useEslintrc: false
    };

    this.initializeOpenAI();
  }

  initializeOpenAI() {
    if (this.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.openaiApiKey
      });
      logger.info('OpenAI client initialisé');
    } else {
      logger.warn('Clé API OpenAI non configurée - reviews IA désactivées');
    }
  }

  // Connexion à RabbitMQ
  async connectRabbitMQ() {
    try {
      logger.info('Connexion à RabbitMQ...', { url: this.rabbitmqUrl });
      
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      // Configuration du canal
      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      await this.channel.assertQueue(this.queueName, { durable: true });
      
      // Préfetch pour traiter un message à la fois
      await this.channel.prefetch(1);
      
      logger.info('Connexion RabbitMQ établie');
      
      // Gestion des événements
      this.connection.on('error', (error) => {
        logger.error('Erreur connexion RabbitMQ', { error: error.message });
      });
      
      this.connection.on('close', () => {
        logger.warn('Connexion RabbitMQ fermée');
        setTimeout(() => this.connectRabbitMQ(), 5000);
      });

    } catch (error) {
      logger.error('Échec connexion RabbitMQ', { error: error.message });
      setTimeout(() => this.connectRabbitMQ(), 5000);
      throw error;
    }
  }

  // Connexion à Redis
  async connectRedis() {
    try {
      logger.info('Connexion à Redis...');
      
      this.redisClient = createClient({ url: this.redisUrl });
      await this.redisClient.connect();
      
      logger.info('Connexion Redis établie');

    } catch (error) {
      logger.error('Échec connexion Redis', { error: error.message });
      throw error;
    }
  }

  // Traitement des messages
  async processMessage(msg) {
    const startTime = Date.now();
    let reviewData = null;

    try {
      const content = JSON.parse(msg.content.toString());
      logger.info('Traitement message de review', { 
        source: content.source,
        repository: content.repository?.name,
        event: content.event
      });

      // Vérifier si déjà traité (éviter doublons)
      const cacheKey = `review:${content.repository?.name}:${content.commits?.[0]?.id}`;
      const cached = await this.redisClient.get(cacheKey);
      
      if (cached) {
        logger.info('Review déjà en cache', { cacheKey });
        this.channel.ack(msg);
        return;
      }

      // Cloner le repository
      const repoPath = await this.cloneRepository(content.repository);
      
      if (!repoPath) {
        logger.warn('Impossible de cloner le repository', { repository: content.repository?.name });
        this.channel.ack(msg);
        return;
      }

      // Analyser les fichiers modifiés
      const filesToAnalyze = this.getModifiedFiles(content.commits);
      
      if (filesToAnalyze.length === 0) {
        logger.info('Aucun fichier à analyser', { repository: content.repository?.name });
        this.channel.ack(msg);
        return;
      }

      // Effectuer les analyses
      reviewData = {
        repository: content.repository,
        commits: content.commits,
        timestamp: new Date().toISOString(),
        analysis: {
          eslint: await this.runESLintAnalysis(repoPath, filesToAnalyze),
          complexity: await this.analyzeComplexity(repoPath, filesToAnalyze),
          security: await this.runSecurityAnalysis(repoPath, filesToAnalyze),
          performance: await this.analyzePerformance(repoPath, filesToAnalyzes),
          ai_review: this.openai ? await this.runAIReview(repoPath, filesToAnalyze) : null
        },
        summary: {},
        recommendations: []
      };

      // Générer le résumé et les recommandations
      reviewData.summary = this.generateSummary(reviewData.analysis);
      reviewData.recommendations = this.generateRecommendations(reviewData.analysis);

      // Calculer la note globale
      reviewData.score = this.calculateScore(reviewData.analysis);
      
      // Sauvegarder en cache
      await this.redisClient.setEx(cacheKey, 3600 * 24, JSON.stringify(reviewData)); // 24h

      // Publier les résultats
      await this.publishResults(reviewData);
      
      // Nettoyage
      await this.cleanup(repoPath);
      
      const processingTime = Date.now() - startTime;
      logger.info('Review terminée avec succès', {
        repository: content.repository?.name,
        processingTime: `${processingTime}ms`,
        filesAnalyzed: filesToAnalyze.length,
        score: reviewData.score
      });

      this.channel.ack(msg);

    } catch (error) {
      const processingTime = Date.now() - startTime;
      logger.error('Erreur traitement review', {
        error: error.message,
        stack: error.stack,
        processingTime: `${processingTime}ms`
      });

      // En cas d'erreur, publier un résultat d'erreur
      if (reviewData) {
        reviewData.error = {
          message: error.message,
          timestamp: new Date().toISOString()
        };
        await this.publishResults(reviewData);
      }

      this.channel.nack(msg, false, false); // Rejeter sans remettre en queue
    }
  }

  // Cloner le repository
  async cloneRepository(repository) {
    try {
      const repoName = repository.name.replace('/', '_');
      const repoPath = path.join(this.workDir, `${repoName}_${Date.now()}`);
      
      await fs.mkdir(this.workDir, { recursive: true });
      
      // Cloner le repository
      execSync(`git clone ${repository.clone_url} "${repoPath}"`, {
        stdio: 'pipe',
        timeout: 30000 // 30 secondes timeout
      });
      
      logger.info('Repository cloné', { repository: repository.name, path: repoPath });
      return repoPath;

    } catch (error) {
      logger.error('Erreur clonage repository', {
        repository: repository.name,
        error: error.message
      });
      return null;
    }
  }

  // Extraire les fichiers modifiés
  getModifiedFiles(commits) {
    const files = new Set();
    
    commits.forEach(commit => {
      commit.added?.forEach(file => files.add(file));
      commit.modified?.forEach(file => files.add(file));
    });
    
    // Filtrer pour les fichiers JavaScript/TypeScript
    const jsFiles = Array.from(files).filter(file => 
      file.match(/\.(js|jsx|ts|tsx)$/) && 
      !file.includes('node_modules') &&
      !file.includes('dist/') &&
      !file.includes('build/')
    );
    
    logger.info('Fichiers à analyser', { count: jsFiles.length, files: jsFiles });
    return jsFiles;
  }

  // Analyse ESLint
  async runESLintAnalysis(repoPath, files) {
    try {
      const cli = new eslint.ESLint(this.eslintConfig);
      const results = [];

      for (const file of files) {
        const filePath = path.join(repoPath, file);
        
        try {
          const fileStats = await fs.stat(filePath);
          if (fileStats.isFile()) {
            const lintResults = await cli.lintFiles([filePath]);
            results.push(...lintResults);
          }
        } catch (error) {
          logger.warn('Fichier non trouvé pour ESLint', { file, error: error.message });
        }
      }

      const formatted = eslint.ESLint.getFormatter('json')(results);
      const analysis = JSON.parse(formatted);
      
      // Calculer des métriques
      const metrics = {
        totalFiles: analysis.length,
        totalProblems: analysis.reduce((sum, file) => sum + file.errorCount + file.warningCount, 0),
        totalErrors: analysis.reduce((sum, file) => sum + file.errorCount, 0),
        totalWarnings: analysis.reduce((sum, file) => sum + file.warningCount, 0),
        details: analysis
      };

      logger.info('Analyse ESLint terminée', metrics);
      return metrics;

    } catch (error) {
      logger.error('Erreur analyse ESLint', { error: error.message });
      return { error: error.message, totalProblems: 0 };
    }
  }

  // Analyse de complexité
  async analyzeComplexity(repoPath, files) {
    try {
      const complexityResults = [];

      for (const file of files) {
        const filePath = path.join(repoPath, file);
        
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const complexity = this.calculateCyclomaticComplexity(content);
          const lines = content.split('\n').length;
          
          complexityResults.push({
            file,
            complexity,
            lines,
            functions: this.countFunctions(content),
            duplicateLines: this.findDuplicateLines(content)
          });
        } catch (error) {
          logger.warn('Erreur analyse complexité fichier', { file, error: error.message });
        }
      }

      const metrics = {
        totalFiles: complexityResults.length,
        averageComplexity: complexityResults.reduce((sum, f) => sum + f.complexity, 0) / complexityResults.length || 0,
        maxComplexity: Math.max(...complexityResults.map(f => f.complexity), 0),
        totalLines: complexityResults.reduce((sum, f) => sum + f.lines, 0),
        details: complexityResults
      };

      logger.info('Analyse complexité terminée', {
        totalFiles: metrics.totalFiles,
        averageComplexity: metrics.averageComplexity.toFixed(2),
        maxComplexity: metrics.maxComplexity
      });

      return metrics;

    } catch (error) {
      logger.error('Erreur analyse complexité', { error: error.message });
      return { error: error.message, averageComplexity: 0 };
    }
  }

  // Analyse de sécurité basique
  async runSecurityAnalysis(repoPath, files) {
    try {
      const securityIssues = [];
      const patterns = [
        { name: 'console.log', pattern: /console\.log\(/g, severity: 'low' },
        { name: 'eval', pattern: /eval\s*\(/g, severity: 'high' },
        { name: 'innerHTML', pattern: /\.innerHTML\s*=/g, severity: 'medium' },
        { name: 'document.write', pattern: /document\.write\(/g, severity: 'high' },
        { name: 'hardcoded-password', pattern: /(password|pwd|pass)\s*=\s*['"][^'"]+['"]/gi, severity: 'critical' },
        { name: 'hardcoded-key', pattern: /(api[_-]?key|secret[_-]?key|access[_-]?token)\s*=\s*['"][^'"]+['"]/gi, severity: 'critical' }
      ];

      for (const file of files) {
        const filePath = path.join(repoPath, file);
        
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const lines = content.split('\n');
          
          patterns.forEach(({ name, pattern, severity }) => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              const lineNumber = content.substring(0, match.index).split('\n').length;
              securityIssues.push({
                file,
                line: lineNumber,
                issue: name,
                severity,
                code: lines[lineNumber - 1]?.trim()
              });
            }
          });
        } catch (error) {
          logger.warn('Erreur analyse sécurité fichier', { file, error: error.message });
        }
      }

      const metrics = {
        totalIssues: securityIssues.length,
        critical: securityIssues.filter(i => i.severity === 'critical').length,
        high: securityIssues.filter(i => i.severity === 'high').length,
        medium: securityIssues.filter(i => i.severity === 'medium').length,
        low: securityIssues.filter(i => i.severity === 'low').length,
        details: securityIssues
      };

      logger.info('Analyse sécurité terminée', {
        totalIssues: metrics.totalIssues,
        critical: metrics.critical,
        high: metrics.high
      });

      return metrics;

    } catch (error) {
      logger.error('Erreur analyse sécurité', { error: error.message });
      return { error: error.message, totalIssues: 0 };
    }
  }

  // Analyse de performance
  async analyzePerformance(repoPath, files) {
    try {
      const performanceIssues = [];
      const patterns = [
        { name: 'large-bundle', check: (content) => content.length > 50000 }, // Fichier > 50KB
        { name: 'sync-require', pattern: /require\s*\([^)]*\)/g },
        { name: 'large-function', check: (content) => this.hasLargeFunctions(content) },
        { name: 'nested-loops', pattern: /for\s*\([^)]*\)[^{]*{[^}]*for\s*\(/g },
        { name: 'dom-query-loop', pattern: /for\s*\([^)]*\)[^{]*{[^}]*document\.(getElementById|querySelector)/g }
      ];

      for (const file of files) {
        const filePath = path.join(repoPath, file);
        
        try {
          const content = await fs.readFile(filePath, 'utf8');
          
          patterns.forEach(({ name, pattern, check }) => {
            if (check && check(content)) {
              performanceIssues.push({
                file,
                issue: name,
                severity: 'medium',
                details: name === 'large-bundle' ? `File size: ${content.length} bytes` : ''
              });
            } else if (pattern) {
              const matches = content.match(pattern);
              if (matches) {
                performanceIssues.push({
                  file,
                  issue: name,
                  severity: 'low',
                  count: matches.length
                });
              }
            }
          });
        } catch (error) {
          logger.warn('Erreur analyse performance fichier', { file, error: error.message });
        }
      }

      const metrics = {
        totalIssues: performanceIssues.length,
        high: performanceIssues.filter(i => i.severity === 'high').length,
        medium: performanceIssues.filter(i => i.severity === 'medium').length,
        low: performanceIssues.filter(i => i.severity === 'low').length,
        details: performanceIssues
      };

      logger.info('Analyse performance terminée', {
        totalIssues: metrics.totalIssues,
        medium: metrics.medium,
        low: metrics.low
      });

      return metrics;

    } catch (error) {
      logger.error('Erreur analyse performance', { error: error.message });
      return { error: error.message, totalIssues: 0 };
    }
  }

  // Review IA avec OpenAI
  async runAIReview(repoPath, files) {
    if (!this.openai) {
      return null;
    }

    try {
      const aiReviews = [];
      const maxFilesToReview = 3; // Limiter pour éviter les coûts élevés
      
      for (const file of files.slice(0, maxFilesToReview)) {
        const filePath = path.join(repoPath, file);
        
        try {
          const content = await fs.readFile(filePath, 'utf8');
          
          // Limiter la taille du code à analyser
          if (content.length > 10000) {
            logger.info('Fichier trop volumineux pour review IA', { file, size: content.length });
            continue;
          }

          const prompt = `Analyse ce code JavaScript/TypeScript et donne tes recommandations d'amélioration :

FICHIER: ${file}

CODE:
\`\`\`javascript
${content}
\`\`\`

Fournis une analyse focalisée sur :
1. Qualité du code et bonnes pratiques
2. Performance et optimisations possibles
3. Sécurité et vulnérabilités
4. Maintenabilité et lisibilité
5. Recommandations d'amélioration

Réponds en JSON avec cette structure :
{
  "rating": "score sur 10",
  "issues": ["liste des problèmes identifiés"],
  "recommendations": ["liste des recommandations"],
  "highlights": ["points positifs du code"]
}`;

          const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
            temperature: 0.3
          });

          const aiAnalysis = JSON.parse(response.choices[0].message.content);
          
          aiReviews.push({
            file,
            analysis: aiAnalysis,
            tokens_used: response.usage?.total_tokens || 0
          });

          // Pause pour éviter les limites de taux
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          logger.warn('Erreur review IA fichier', { file, error: error.message });
        }
      }

      const metrics = {
        filesReviewed: aiReviews.length,
        averageRating: aiReviews.reduce((sum, r) => sum + parseFloat(r.analysis.rating), 0) / aiReviews.length || 0,
        totalTokens: aiReviews.reduce((sum, r) => sum + r.tokens_used, 0),
        details: aiReviews
      };

      logger.info('Review IA terminée', {
        filesReviewed: metrics.filesReviewed,
        averageRating: metrics.averageRating.toFixed(1),
        totalTokens: metrics.totalTokens
      });

      return metrics;

    } catch (error) {
      logger.error('Erreur review IA', { error: error.message });
      return { error: error.message, filesReviewed: 0 };
    }
  }

  // Génération du résumé
  generateSummary(analysis) {
    return {
      totalFiles: analysis.complexity.totalFiles || 0,
      totalIssues: (analysis.eslint.totalProblems || 0) + 
                   (analysis.security.totalIssues || 0) + 
                   (analysis.performance.totalIssues || 0),
      criticalIssues: analysis.security.critical || 0,
      averageComplexity: analysis.complexity.averageComplexity || 0,
      maxComplexity: analysis.complexity.maxComplexity || 0,
      totalLines: analysis.complexity.totalLines || 0,
      aiRating: analysis.ai_review?.averageRating || null
    };
  }

  // Génération des recommandations
  generateRecommendations(analysis) {
    const recommendations = [];

    // Recommandations ESLint
    if (analysis.eslint.totalErrors > 0) {
      recommendations.push({
        type: 'error',
        priority: 'high',
        message: `Corriger ${analysis.eslint.totalErrors} erreurs ESLint critiques`
      });
    }

    // Recommandations complexité
    if (analysis.complexity.maxComplexity > 15) {
      recommendations.push({
        type: 'complexity',
        priority: 'medium',
        message: `Refactoriser les fonctions avec une complexité > 15 (max: ${analysis.complexity.maxComplexity})`
      });
    }

    // Recommandations sécurité
    if (analysis.security.critical > 0) {
      recommendations.push({
        type: 'security',
        priority: 'critical',
        message: `Corriger ${analysis.security.critical} problèmes de sécurité critiques`
      });
    }

    // Recommandations performance
    if (analysis.performance.medium > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: `Optimiser les ${analysis.performance.medium} problèmes de performance identifiés`
      });
    }

    return recommendations;
  }

  // Calcul du score global
  calculateScore(analysis) {
    let score = 10;

    // Pénalités ESLint
    score -= (analysis.eslint.totalErrors || 0) * 0.5;
    score -= (analysis.eslint.totalWarnings || 0) * 0.1;

    // Pénalités sécurité
    score -= (analysis.security.critical || 0) * 2;
    score -= (analysis.security.high || 0) * 1;
    score -= (analysis.security.medium || 0) * 0.5;

    // Pénalités complexité
    if (analysis.complexity.maxComplexity > 15) {
      score -= (analysis.complexity.maxComplexity - 15) * 0.2;
    }

    // Pénalités performance
    score -= (analysis.performance.medium || 0) * 0.3;
    score -= (analysis.performance.low || 0) * 0.1;

    return Math.max(0, Math.min(10, score));
  }

  // Méthodes utilitaires
  calculateCyclomaticComplexity(code) {
    const patterns = [
      /if\s*\(/g,
      /else\s+if\s*\(/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /&&/g,
      /\|\|/g,
      /\?/g
    ];

    let complexity = 1; // Base complexity
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  countFunctions(code) {
    const patterns = [
      /function\s+\w+/g,
      /=\s*function\s*\(/g,
      /=>\s*{/g,
      /async\s+function/g
    ];

    let count = 0;
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        count += matches.length;
      }
    });

    return count;
  }

  findDuplicateLines(code) {
    const lines = code.split('\n').map(line => line.trim()).filter(line => line.length > 5);
    const duplicates = [];
    const seen = new Map();

    lines.forEach((line, index) => {
      if (seen.has(line)) {
        duplicates.push({ line, occurrences: seen.get(line) + 1 });
        seen.set(line, seen.get(line) + 1);
      } else {
        seen.set(line, 1);
      }
    });

    return duplicates.filter(d => d.occurrences > 2);
  }

  hasLargeFunctions(code) {
    const functions = code.match(/function[^{]*{[^}]*}/g) || [];
    return functions.some(fn => fn.split('\n').length > 50);
  }

  // Publication des résultats
  async publishResults(reviewData) {
    try {
      const message = Buffer.from(JSON.stringify(reviewData));
      
      await this.channel.publish(
        this.exchangeName,
        'analysis.completed',
        message,
        {
          persistent: true,
          timestamp: Date.now(),
          headers: {
            repository: reviewData.repository?.name,
            score: reviewData.score?.toString()
          }
        }
      );

      // Publier aussi une notification si des problèmes critiques
      if (reviewData.analysis.security?.critical > 0 || reviewData.score < 5) {
        await this.publishNotification(reviewData, 'critical');
      } else if (reviewData.score < 7) {
        await this.publishNotification(reviewData, 'warning');
      }

      logger.info('Résultats publiés', {
        repository: reviewData.repository?.name,
        score: reviewData.score
      });

    } catch (error) {
      logger.error('Erreur publication résultats', { error: error.message });
    }
  }

  // Publication de notifications
  async publishNotification(reviewData, type) {
    try {
      const notification = {
        type,
        repository: reviewData.repository.name,
        score: reviewData.score,
        summary: reviewData.summary,
        recommendations: reviewData.recommendations,
        timestamp: new Date().toISOString()
      };

      const message = Buffer.from(JSON.stringify(notification));
      
      await this.channel.publish(
        this.exchangeName,
        `notification.${type}`,
        message,
        { persistent: true }
      );

      logger.info('Notification publiée', { type, repository: reviewData.repository.name });

    } catch (error) {
      logger.error('Erreur publication notification', { error: error.message });
    }
  }

  // Nettoyage des fichiers temporaires
  async cleanup(repoPath) {
    try {
      if (repoPath && repoPath.startsWith(this.workDir)) {
        await fs.rm(repoPath, { recursive: true, force: true });
        logger.info('Nettoyage effectué', { path: repoPath });
      }
    } catch (error) {
      logger.warn('Erreur nettoyage', { path: repoPath, error: error.message });
    }
  }

  // Démarrage du worker
  async start() {
    try {
      await this.connectRabbitMQ();
      await this.connectRedis();

      // Créer le répertoire de travail
      await fs.mkdir(this.workDir, { recursive: true });

      // Consumer les messages
      await this.channel.consume(this.queueName, (msg) => {
        if (msg) {
          this.processMessage(msg);
        }
      });

      logger.info(`🤖 Code Review Worker démarré et en écoute sur ${this.queueName}`);

    } catch (error) {
      logger.error('Échec démarrage worker', { error: error.message });
      process.exit(1);
    }
  }

  // Arrêt propre
  async shutdown() {
    logger.info('Arrêt du worker...');
    
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    if (this.redisClient) {
      await this.redisClient.quit();
    }
    
    logger.info('Worker arrêté proprement');
  }
}

// Démarrage du worker
const worker = new CodeReviewWorker();
worker.start().catch(console.error);

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => worker.shutdown());
process.on('SIGINT', () => worker.shutdown());

module.exports = CodeReviewWorker;