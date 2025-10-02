# 🤖 GetWeez Code Review System

Système automatisé de review de code utilisant RabbitMQ pour traiter les événements Git et générer des analyses de qualité de code avec IA.

## 📋 Table des Matières

- [🎯 Objectifs](#-objectifs)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [💻 Utilisation](#-utilisation)
- [📊 Analyses Disponibles](#-analyses-disponibles)
- [🔧 API Endpoints](#-api-endpoints)
- [📈 Monitoring](#-monitoring)
- [🛠️ Développement](#️-développement)
- [📄 License](#-license)

## 🎯 Objectifs

Ce système permet de :
- ✅ **Analyser automatiquement** le code pushé sur Git
- 🔍 **Détecter les problèmes** de qualité, sécurité, performance
- 🤖 **Utiliser l'IA** pour des reviews intelligentes
- 📊 **Générer des rapports** détaillés avec recommandations
- 🔔 **Notifier** les développeurs des problèmes critiques
- 📈 **Suivre l'évolution** de la qualité du code dans le temps

## 🏗️ Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Git Repo  │───▶│   Webhook    │───▶│  RabbitMQ   │
│  (GitHub/   │    │   Service    │    │  Exchange   │
│   GitLab)   │    │              │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
                   ┌─────────────┐           │
                   │    Redis    │◀──────────┼──────────┐
                   │   Cache     │           │          │
                   └─────────────┘           ▼          │
                                   ┌─────────────┐      │
                                   │    Code     │      │
                                   │   Review    │      │
                                   │   Worker    │      │
                                   └─────────────┘      │
                                           │            │
                   ┌─────────────┐        │            │
                   │   OpenAI    │◀───────┘            │
                   │     API     │                     │
                   └─────────────┘                     │
                                                       │
                   ┌─────────────┐                     │
                   │ ESLint +    │◀────────────────────┘
                   │ Security +  │
                   │ Performance │
                   └─────────────┘
```

### Composants Principaux

1. **Webhook Service** : Reçoit les événements Git et les publie vers RabbitMQ
2. **Code Review Worker** : Analyse le code et génère les rapports
3. **RabbitMQ** : Queue system pour traiter les événements de manière asynchrone
4. **Redis** : Cache pour éviter les analyses redondantes
5. **OpenAI Integration** : Reviews IA optionnelles pour une analyse avancée

## 🚀 Installation

### Prérequis

- **Node.js** >= 18.0.0
- **Docker** et **Docker Compose**
- **Git** installé
- **Ports disponibles** : 3001 (webhook), 5672 (RabbitMQ), 6379 (Redis), 15672 (RabbitMQ UI)

### Installation Rapide

```bash
# 1. Cloner le repository
git clone <votre-repo>
cd code-review-system

# 2. Copier la configuration
cp .env.example .env

# 3. Configurer les variables d'environnement
nano .env

# 4. Démarrer tout le système
./scripts/start.sh all
```

### Installation Manuel

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer l'infrastructure
./scripts/start.sh infrastructure

# 3. Démarrer les services
./scripts/start.sh webhook
./scripts/start.sh worker
```

## ⚙️ Configuration

### Variables d'Environnement Principales

```bash
# RabbitMQ
RABBITMQ_URL=amqp://getweez_admin:GetWeez2024!@localhost:5672/getweez
RABBITMQ_PASSWORD=GetWeez2024!

# Redis
REDIS_URL=redis://:GetWeez2024!@localhost:6379

# Webhook
WEBHOOK_PORT=3001
WEBHOOK_SECRET=GetWeezWebhookSecret2024

# OpenAI (Optionnel)
OPENAI_API_KEY=sk-...

# GitHub/GitLab (Optionnel)
GITHUB_TOKEN=ghp_...
GITLAB_TOKEN=glpat-...
```

### Configuration Git Repository

#### GitHub

1. Aller dans **Settings** → **Webhooks** de votre repository
2. Ajouter une nouvelle webhook :
   - **Payload URL** : `http://votre-serveur:3001/webhook/github`
   - **Content type** : `application/json`
   - **Secret** : Votre `WEBHOOK_SECRET`
   - **Events** : `Push`, `Pull requests`

#### GitLab

1. Aller dans **Settings** → **Webhooks** de votre project
2. Ajouter une webhook :
   - **URL** : `http://votre-serveur:3001/webhook/gitlab`
   - **Secret Token** : Votre `WEBHOOK_SECRET`
   - **Trigger** : `Push events`, `Merge request events`

## 💻 Utilisation

### Démarrage du Système

```bash
# Démarrer tous les services
./scripts/start.sh all

# Vérifier l'état
./scripts/start.sh status

# Voir les logs
./scripts/start.sh logs webhook
./scripts/start.sh logs worker
```

### Test Manuel

```bash
# Déclencher une analyse test
curl -X POST http://localhost:3001/trigger/manual \
     -H "Content-Type: application/json" \
     -d '{
       "repository": {
         "name": "test/repo",
         "clone_url": "https://github.com/votre-repo.git"
       },
       "type": "push"
     }'
```

### Interfaces de Monitoring

- **RabbitMQ Management** : http://localhost:15672
  - Login : `getweez_admin` / `GetWeez2024!`
- **Webhook Health** : http://localhost:3001/health
- **Webhook Status** : http://localhost:3001/webhook/status

## 📊 Analyses Disponibles

### 1. 🔍 Analyse ESLint
- Erreurs de syntaxe
- Problèmes de style
- Bonnes pratiques JavaScript/TypeScript
- Complexité cyclomatique

### 2. 🔒 Analyse de Sécurité
- Détection de vulnérabilités communes
- Hardcoded passwords/API keys
- Injections potentielles
- Pratiques de sécurité

### 3. ⚡ Analyse de Performance
- Fichiers volumineux
- Boucles imbriquées
- Requêtes DOM dans les boucles
- Optimisations suggérées

### 4. 🤖 Review IA (OpenAI)
- Analyse contextuelle du code
- Recommandations d'amélioration
- Détection de patterns problématiques
- Suggestions d'optimisation

### 5. 📈 Métriques de Complexité
- Complexité cyclomatique
- Nombre de lignes par fonction
- Duplication de code
- Maintenabilité

## 🔧 API Endpoints

### Webhooks
```
POST /webhook/github    - GitHub webhook handler
POST /webhook/gitlab    - GitLab webhook handler  
POST /webhook/git       - Generic git webhook
POST /trigger/manual    - Manual trigger for testing
```

### Status & Health
```
GET /health            - Service health check
GET /webhook/status    - Service status and info
```

### Exemple de Réponse d'Analyse

```json
{
  "repository": {
    "name": "getweez/frontend",
    "url": "https://github.com/getweez/frontend"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "score": 7.5,
  "summary": {
    "totalFiles": 12,
    "totalIssues": 23,
    "criticalIssues": 2,
    "averageComplexity": 8.4,
    "totalLines": 2847
  },
  "analysis": {
    "eslint": {
      "totalProblems": 15,
      "totalErrors": 3,
      "totalWarnings": 12
    },
    "security": {
      "totalIssues": 2,
      "critical": 1,
      "high": 1
    },
    "performance": {
      "totalIssues": 6,
      "medium": 4,
      "low": 2
    },
    "ai_review": {
      "averageRating": 7.2,
      "filesReviewed": 5
    }
  },
  "recommendations": [
    {
      "type": "security",
      "priority": "critical",
      "message": "Corriger 1 problèmes de sécurité critiques"
    },
    {
      "type": "complexity",
      "priority": "medium", 
      "message": "Refactoriser les fonctions avec complexité > 15"
    }
  ]
}
```

## 📈 Monitoring

### Métriques RabbitMQ

Les queues importantes à surveiller :
- `code_review.git_events` : Événements Git en attente
- `code_review.analysis_results` : Résultats d'analyse
- `code_review.notifications` : Notifications à envoyer

### Logs de Debug

```bash
# Logs en temps réel
tail -f logs/webhook.log
tail -f logs/worker.log

# Logs par niveau
grep "ERROR" logs/*.log
grep "WARN" logs/*.log
```

### Alertes Recommandées

- Queue RabbitMQ avec > 100 messages
- Worker non responsif > 5 minutes
- Erreurs critiques de sécurité détectées
- Score de code < 5/10

## 🛠️ Développement

### Structure du Projet

```
code-review-system/
├── src/
│   ├── webhook-service.js     # Service webhook principal
│   ├── code-review-worker.js  # Worker d'analyse
│   └── utils/                 # Utilitaires partagés
├── scripts/
│   └── start.sh              # Script de démarrage
├── logs/                     # Fichiers de logs
├── temp-repos/              # Repositories temporaires
├── rabbitmq/               # Configuration RabbitMQ
└── docs/                   # Documentation détaillée
```

### Ajout d'Analyseurs Personnalisés

```javascript
// Dans code-review-worker.js
async runCustomAnalysis(repoPath, files) {
  // Votre logique d'analyse personnalisée
  return {
    totalIssues: 0,
    details: []
  };
}
```

### Tests

```bash
# Tests unitaires
npm test

# Test d'intégration
./scripts/start.sh test
```

### Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 🚨 Résolution de Problèmes

### Problèmes Courants

**1. RabbitMQ ne démarre pas**
```bash
# Vérifier les ports
sudo netstat -tlnp | grep :5672

# Vérifier les logs Docker
docker logs getweez_rabbitmq
```

**2. Worker ne traite pas les messages**
```bash
# Vérifier la connexion RabbitMQ
./scripts/start.sh status

# Voir les logs du worker
./scripts/start.sh logs worker
```

**3. Webhook ne reçoit pas les événements**
```bash
# Tester la connectivité
curl http://localhost:3001/health

# Vérifier les logs
./scripts/start.sh logs webhook
```

**4. Analyses IA échouent**
- Vérifier la clé OpenAI API dans `.env`
- Contrôler les limites de taux OpenAI
- Regarder les logs pour les erreurs spécifiques

### Performance

- **Limiter les fichiers analysés** : Filtrer par extension et taille
- **Utiliser le cache Redis** : Éviter les analyses redondantes  
- **Optimiser OpenAI** : Limiter le nombre de fichiers par review
- **Surveiller la mémoire** : Worker peut consommer beaucoup de RAM

## 📊 Métriques et KPIs

### Métriques de Performance
- Temps moyen d'analyse par commit
- Nombre de reviews par heure
- Taux d'utilisation des ressources
- Latence des webhooks

### Métriques de Qualité
- Score moyen des repositories
- Évolution des problèmes critiques
- Adoption des recommandations
- Réduction des bugs en production

## 🔒 Sécurité

### Bonnes Pratiques Implémentées
- ✅ Vérification des signatures webhook
- ✅ Validation des tokens d'accès
- ✅ Sandbox pour l'exécution du code
- ✅ Nettoyage automatique des fichiers temporaires
- ✅ Rate limiting sur les APIs
- ✅ Logs d'audit des actions sensibles

### Recommandations Déploiement
- Utiliser HTTPS en production
- Configurer un firewall approprié
- Régulièrement mettre à jour les dépendances
- Monitorer les accès non autorisés
- Sauvegarder les configurations critiques

## 📄 License

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

---

## 🤝 Support

Pour toute question ou problème :
- 📧 Email : support@getweez.com
- 💬 Slack : #code-review
- 🐛 Issues : [GitHub Issues](https://github.com/getweez/code-review-system/issues)

---

**Made with ❤️ by GetWeez Team**