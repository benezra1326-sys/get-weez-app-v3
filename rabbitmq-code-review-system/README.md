# 🐰 RabbitMQ Automatic Code Review System

## 🎯 Objectif
Système automatisé de review de code utilisant RabbitMQ pour analyser chaque push Git et identifier les problèmes de performance, architecture et qualité.

## 🏗️ Architecture du Système

```mermaid
graph LR
    A[Git Push] --> B[GitHub Webhook]
    B --> C[RabbitMQ Queue]
    C --> D[Code Analyzer Service]
    D --> E[Performance Checker]
    D --> F[Architecture Validator]
    D --> G[Quality Metrics]
    E --> H[Report Generator]
    F --> H
    G --> H
    H --> I[Slack/Teams Notification]
    H --> J[GitHub PR Comment]
```

## 📦 Components

### 1. GitHub Webhook Handler
```javascript
// webhook-handler/server.js
const express = require('express')
const amqp = require('amqplib')

const app = express()

app.post('/webhook/github', async (req, res) => {
  const { repository, commits, pull_request } = req.body
  
  // Envoyer vers RabbitMQ
  const connection = await amqp.connect(process.env.RABBITMQ_URL)
  const channel = await connection.createChannel()
  
  await channel.assertQueue('code-review-queue')
  
  const message = {
    repo: repository.name,
    commits: commits,
    pr: pull_request,
    timestamp: new Date()
  }
  
  channel.sendToQueue('code-review-queue', Buffer.from(JSON.stringify(message)))
  
  res.status(200).json({ status: 'queued' })
})
```

### 2. Code Analyzer Service
```javascript
// analyzer/code-analyzer.js
const amqp = require('amqplib')
const { execSync } = require('child_process')
const fs = require('fs')

class CodeAnalyzer {
  constructor() {
    this.rules = {
      performance: [
        { rule: 'large-component', limit: 500, severity: 'error' },
        { rule: 'inline-styles', severity: 'warning' },
        { rule: 'unmemoized-callbacks', severity: 'error' },
        { rule: 'excessive-re-renders', severity: 'error' }
      ],
      architecture: [
        { rule: 'separation-of-concerns', severity: 'error' },
        { rule: 'component-complexity', limit: 10, severity: 'warning' },
        { rule: 'duplicate-code', threshold: 0.8, severity: 'warning' }
      ],
      quality: [
        { rule: 'typescript-coverage', threshold: 0.9, severity: 'warning' },
        { rule: 'test-coverage', threshold: 0.8, severity: 'error' },
        { rule: 'eslint-errors', severity: 'error' }
      ]
    }
  }

  async analyze(codeFiles) {
    const results = {
      performance: await this.analyzePerformance(codeFiles),
      architecture: await this.analyzeArchitecture(codeFiles),
      quality: await this.analyzeQuality(codeFiles)
    }

    return this.generateReport(results)
  }

  async analyzePerformance(files) {
    const issues = []
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      
      // Check component size
      const lineCount = content.split('\n').length
      if (lineCount > 500) {
        issues.push({
          file,
          rule: 'large-component',
          severity: 'error',
          message: `Component too large: ${lineCount} lines (max: 500)`,
          suggestion: 'Split into smaller components'
        })
      }

      // Check inline styles
      if (content.includes('style={{')) {
        issues.push({
          file,
          rule: 'inline-styles',
          severity: 'warning',
          message: 'Inline styles detected - impacts performance',
          suggestion: 'Use CSS modules or styled-components'
        })
      }

      // Check unmemoized callbacks
      if (content.includes('onClick={() =>') || content.includes('onChange={() =>')) {
        issues.push({
          file,
          rule: 'unmemoized-callbacks',
          severity: 'error',
          message: 'Unmemoized inline functions cause re-renders',
          suggestion: 'Use useCallback for event handlers'
        })
      }
    }

    return issues
  }

  async analyzeArchitecture(files) {
    const issues = []
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      
      // Check separation of concerns
      if (this.hasBusinessLogicInUI(content)) {
        issues.push({
          file,
          rule: 'separation-of-concerns',
          severity: 'error',
          message: 'Business logic found in UI component',
          suggestion: 'Extract to custom hooks or services'
        })
      }

      // Check component complexity
      const complexity = this.calculateComplexity(content)
      if (complexity > 10) {
        issues.push({
          file,
          rule: 'component-complexity',
          severity: 'warning',
          message: `High cyclomatic complexity: ${complexity}`,
          suggestion: 'Simplify component logic or split into smaller parts'
        })
      }
    }

    return issues
  }

  hasBusinessLogicInUI(content) {
    const businessLogicPatterns = [
      /fetch\(/,
      /axios\./,
      /localStorage\./,
      /sessionStorage\./,
      /JSON\.parse/,
      /JSON\.stringify/
    ]
    
    return businessLogicPatterns.some(pattern => pattern.test(content))
  }

  calculateComplexity(content) {
    const complexityFactors = [
      (content.match(/if\s*\(/g) || []).length,
      (content.match(/for\s*\(/g) || []).length,
      (content.match(/while\s*\(/g) || []).length,
      (content.match(/switch\s*\(/g) || []).length,
      (content.match(/\?\s*:/g) || []).length
    ]
    
    return complexityFactors.reduce((sum, count) => sum + count, 0)
  }
}

// Message consumer
async function startConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL)
  const channel = await connection.createChannel()
  
  await channel.assertQueue('code-review-queue')
  
  channel.consume('code-review-queue', async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString())
      
      try {
        const analyzer = new CodeAnalyzer()
        const report = await analyzer.analyze(data.commits)
        
        // Send report to notification service
        await channel.sendToQueue('notification-queue', Buffer.from(JSON.stringify({
          ...data,
          report
        })))
        
        channel.ack(msg)
      } catch (error) {
        console.error('Analysis failed:', error)
        channel.nack(msg, false, false)
      }
    }
  })
}

startConsumer()
```

### 3. Notification Service
```javascript
// notification/slack-notifier.js
const { WebClient } = require('@slack/web-api')
const amqp = require('amqplib')

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

async function startNotificationService() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL)
  const channel = await connection.createChannel()
  
  await channel.assertQueue('notification-queue')
  
  channel.consume('notification-queue', async (msg) => {
    if (msg) {
      const { repo, report, pr } = JSON.parse(msg.content.toString())
      
      const message = formatSlackMessage(repo, report, pr)
      
      await slack.chat.postMessage({
        channel: process.env.SLACK_CHANNEL,
        text: 'Code Review Results',
        blocks: message.blocks
      })
      
      channel.ack(msg)
    }
  })
}

function formatSlackMessage(repo, report, pr) {
  const criticalIssues = report.filter(issue => issue.severity === 'error').length
  const warnings = report.filter(issue => issue.severity === 'warning').length
  
  const color = criticalIssues > 0 ? 'danger' : warnings > 0 ? 'warning' : 'good'
  
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🔍 Code Review: ${repo}`
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*PR:* <${pr?.html_url}|${pr?.title}>` },
          { type: 'mrkdwn', text: `*Status:* ${criticalIssues > 0 ? '❌ Failed' : '✅ Passed'}` },
          { type: 'mrkdwn', text: `*Critical Issues:* ${criticalIssues}` },
          { type: 'mrkdwn', text: `*Warnings:* ${warnings}` }
        ]
      },
      ...(report.slice(0, 5).map(issue => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${issue.severity === 'error' ? '🚨' : '⚠️'} ${issue.rule}*\n${issue.message}\n_Suggestion: ${issue.suggestion}_`
        }
      })))
    ]
  }
}

startNotificationService()
```

### 4. Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin123
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  webhook-handler:
    build: ./webhook-handler
    ports:
      - "3001:3001"
    environment:
      RABBITMQ_URL: amqp://admin:admin123@rabbitmq:5672
    depends_on:
      - rabbitmq

  code-analyzer:
    build: ./analyzer
    environment:
      RABBITMQ_URL: amqp://admin:admin123@rabbitmq:5672
    depends_on:
      - rabbitmq
    volumes:
      - /tmp/repos:/workspace

  notification-service:
    build: ./notification
    environment:
      RABBITMQ_URL: amqp://admin:admin123@rabbitmq:5672
      SLACK_BOT_TOKEN: ${SLACK_BOT_TOKEN}
      SLACK_CHANNEL: ${SLACK_CHANNEL}
    depends_on:
      - rabbitmq

volumes:
  rabbitmq_data:
```

## 🚀 Déploiement

### 1. Configuration GitHub Webhook
```bash
# Ajouter webhook dans les settings du repo
URL: https://your-domain.com/webhook/github
Content-Type: application/json
Events: Push, Pull Request
```

### 2. Variables d'environnement
```bash
# .env
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL=#code-reviews
GITHUB_TOKEN=github_pat_your_token
```

### 3. Lancement
```bash
docker-compose up -d
```

## 📊 Rapport Type

```
🔍 Code Review Report - ChatInterface.js

❌ CRITICAL ISSUES (3):
1. Component too large: 2457 lines (max: 500)
   → Split into smaller components
   
2. Unmemoized callbacks causing re-renders
   → Use useCallback for event handlers
   
3. Business logic in UI component
   → Extract to custom hooks

⚠️  WARNINGS (5):
1. Inline styles detected (47 occurrences)
2. High cyclomatic complexity: 23
3. Duplicate code detected (78% similarity)
4. Missing TypeScript types
5. Test coverage below 80%

✅ RECOMMENDATIONS:
- Implement component splitting strategy
- Add React.memo and useCallback optimizations
- Create custom hooks for business logic
- Migrate to TypeScript
- Add comprehensive tests
```

## 🎯 Bénéfices

### Automatisation
- Review automatique à chaque push
- Détection proactive des problèmes
- Standards de qualité cohérents

### Performance
- Identification rapide des goulots d'étranglement
- Suggestions d'optimisation concrètes
- Métriques de performance trackées

### Collaboration
- Notifications équipe en temps réel
- Rapports détaillés avec suggestions
- Historique des améliorations

## 📈 Métriques Trackées
- Taille des composants
- Performance score
- Complexité cyclomatique
- Couverture de tests
- Temps de build
- Bundle size