# 🤖 Rabbit Code Reviews - Guide Complet

## 🎯 Vue d'Ensemble

Ce guide vous accompagne dans la mise en place d'un système de code review automatisé avec **Rabbit AI** pour optimiser le composant `ChatInterface.js` et améliorer la qualité du code de Get Weez.

## 📋 Table des Matières

- [🚀 Installation Rapide](#-installation-rapide)
- [🔧 Configuration](#-configuration)
- [📊 Métriques et Seuils](#-métriques-et-seuils)
- [🛠️ Commandes Utiles](#️-commandes-utiles)
- [🎯 Plan d'Optimisation](#-plan-doptimisation)
- [🔄 Workflow GitHub Actions](#-workflow-github-actions)
- [📈 Métriques de Succès](#-métriques-de-succès)
- [🆘 Dépannage](#-dépannage)

## 🚀 Installation Rapide

### Option 1: Script Automatique (Recommandé)
```bash
# Rendre le script exécutable
chmod +x scripts/setup-rabbit-reviews.sh

# Exécuter l'installation
./scripts/setup-rabbit-reviews.sh
```

### Option 2: Installation Manuelle
```bash
# 1. Installer Rabbit CLI
npm install -g @rabbit-ai/cli

# 2. Installer les dépendances de dev
npm install --save-dev @rabbit-ai/eslint-plugin husky lint-staged

# 3. Initialiser Husky
npx husky install

# 4. Configurer les hooks
npx husky add .husky/pre-commit "npm run lint:rabbit"
```

## 🔧 Configuration

### Fichiers de Configuration Créés

```
📁 Projet/
├── 🤖 .rabbit/
│   └── config.yml                 # Configuration principale Rabbit
├── 🔧 .github/workflows/
│   └── rabbit-code-review.yml     # GitHub Actions
├── 📋 .husky/
│   ├── pre-commit                 # Hook pre-commit
│   └── commit-msg                 # Hook commit message
├── ⚙️  .eslintrc.rabbit.js        # ESLint personnalisé
├── 📝 .lintstagedrc.json          # Configuration lint-staged
├── 💬 .commitlintrc.json          # Convention commits
└── 🎯 OPTIMISATION_CHATINTERFACE.md
```

### Variables d'Environnement Requises

Ajoutez ces secrets dans GitHub Settings → Secrets:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
RABBIT_API_KEY=your_rabbit_api_key_here  # Si nécessaire
```

## 📊 Métriques et Seuils

### Seuils de Qualité Configurés

| Métrique | Seuil Actuel | Seuil Cible | Status |
|----------|--------------|-------------|--------|
| **Lignes par fichier** | 2457 | 200 | 🔴 Critique |
| **Console.log** | 15 | 0 | 🔴 Critique |
| **Styles inline** | 50+ | <5 | 🟡 Warning |
| **Complexité cyclomatique** | 20+ | <15 | 🟡 Warning |
| **Fonctions par fichier** | 15+ | <10 | 🟡 Warning |

### Niveaux de Gravité

```yaml
🔴 Error (Bloque le déploiement):
  - Console.log en production
  - Imports cassés
  - Plus de 300 lignes par fichier
  - Complexité > 20

🟡 Warning (Review requise):
  - 200-300 lignes par fichier
  - Plus de 5 styles inline
  - Callbacks non mémorisés

🔵 Info (Suggestions):
  - Optimisations possibles
  - Lazy loading recommandé
  - Patterns d'amélioration
```

## 🛠️ Commandes Utiles

### Analyse Locale

```bash
# Analyse complète
npm run lint:rabbit

# Analyse avec corrections automatiques
npm run lint:rabbit:fix

# Analyse d'un fichier spécifique
rabbit analyze --files components/chat/ChatInterface.js

# Review avant commit
npm run review:pre-commit

# Check qualité avec seuil
npm run quality:check
```

### Analyse de Performance

```bash
# Analyse du bundle
npm run bundle:analyze

# Test de performance
npm run test:performance

# Vérification des optimisations React
rabbit react-perf --components components/
```

### Debug et Validation

```bash
# Valider la configuration
rabbit validate --config .rabbit/config.yml

# Test à blanc (sans modifications)
rabbit analyze --dry-run

# Rapport détaillé
npm run review:full
```

## 🎯 Plan d'Optimisation

### Phase 1: Corrections Immédiates ⚡

**Priorité: CRITIQUE - À faire cette semaine**

```bash
# 1. Corriger l'import useTheme
# Dans components/chat/ChatInterface.js ligne 8:
- import { useTheme } from '../../hooks/useTheme'
+ import { useTheme } from '../../contexts/ThemeContext'

# 2. Nettoyer les console.log
npm run lint:rabbit:fix -- --rule no-console

# 3. Tester les corrections
npm run lint:rabbit
```

### Phase 2: Refactorisation Architecturale 🏗️

**Priorité: HAUTE - 2-3 semaines**

```bash
# Créer la structure modulaire
mkdir -p components/chat/components
mkdir -p components/chat/hooks
mkdir -p components/chat/styles

# Extraire les composants
# Voir: EXEMPLE_REFACTORING.md pour les détails
```

### Phase 3: Optimisations Avancées 🚀

**Priorité: MOYENNE - 1 mois**

- Lazy loading des composants lourds
- Virtualisation des listes longues
- Mémorisation intelligente des composants
- Bundle splitting optimisé

## 🔄 Workflow GitHub Actions

### Déclencheurs Automatiques

```yaml
Déclenchements:
  ✅ Push sur main/develop
  ✅ Pull Requests
  ✅ Modifications dans components/
  ✅ Modifications dans hooks/
```

### Jobs Exécutés

1. **🔍 Rabbit Analysis** - Analyse statique complète
2. **🎯 ChatInterface Checks** - Vérifications spécifiques
3. **⚡ Performance Analysis** - Analyse des performances
4. **🔒 Security Scan** - Scan de sécurité
5. **📢 Notifications** - Slack + GitHub comments
6. **🚦 Deployment Gate** - Blocage conditionnel

### Notifications Slack

Les résultats sont automatiquement postés sur `#dev-code-reviews`:

```
🤖 Rabbit Code Review Results

Repository: get-weez/main
Branch: feature/optimize-chat
Severity: 7/10
Status: ⚠️ NEEDS_ATTENTION

🔍 Issues Found:
❌ 3 erreurs critiques
⚠️ 12 warnings
💡 8 suggestions

🎯 Action Items:
- Refactoriser ChatInterface.js (2457 → 200 lignes)
- Corriger import useTheme cassé
- Nettoyer 15 console.log
```

## 📈 Métriques de Succès

### Tableau de Bord Rabbit

Accès: `https://rabbit-dashboard.getweez.com`

**KPIs Suivis:**

```
📊 Qualité de Code:
├── Score global: 6.2/10 → 9/10 (cible)
├── Dette technique: 142h → 20h (cible)
├── Couverture rules: 78% → 95% (cible)
└── Temps de review: 45min → 10min (cible)

🚀 Performance:
├── Bundle size: 2.1MB → 1.5MB (cible)
├── Re-renders: 156/sec → 45/sec (cible)
├── Time to Interactive: 3.2s → 2s (cible)
└── Lighthouse Score: 72 → 90 (cible)

👥 Équipe:
├── Bugs en production: 12/mois → 3/mois
├── Temps de debug: 6h/dev → 2h/dev
├── Satisfaction équipe: 6/10 → 9/10
└── Vélocité: +35%
```

### Rapports Hebdomadaires

Envoyés automatiquement chaque lundi à `dev@getweez.com`:

- Évolution des métriques
- Top 5 des améliorations
- Recommandations priorisées
- Comparaison avec les objectifs

## 🆘 Dépannage

### Problèmes Courants

#### ❌ "Rabbit command not found"
```bash
# Solution:
npm install -g @rabbit-ai/cli
# ou
export PATH=$PATH:./node_modules/.bin
```

#### ❌ "Configuration invalide"
```bash
# Vérifier la config:
rabbit validate --config .rabbit/config.yml

# Réinitialiser:
cp .rabbit/config.yml.backup .rabbit/config.yml
```

#### ❌ "Hooks Git ne fonctionnent pas"
```bash
# Réinstaller Husky:
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npm run lint:rabbit"
```

#### ❌ "GitHub Actions échouent"
```bash
# Vérifier les secrets:
# GitHub → Settings → Secrets → Actions
# Ajouter: SLACK_WEBHOOK_URL

# Logs détaillés:
# GitHub → Actions → Workflow → View raw logs
```

### Support et Contact

```
🆘 Support Technique:
├── 📧 Email: dev-support@getweez.com
├── 💬 Slack: #rabbit-support
├── 📖 Docs: https://docs.rabbit-ai.com
└── 🐛 Issues: GitHub Issues

🎯 Rabbit Specialists:
├── Tech Lead: @senior-dev
├── DevOps: @devops-lead
└── Architecture: @architect-lead
```

## 🚀 Next Steps

### Cette Semaine
- [ ] Exécuter le script d'installation
- [ ] Corriger les imports cassés
- [ ] Nettoyer les console.log
- [ ] Tester les hooks Git

### Prochaines Semaines
- [ ] Refactoriser ChatInterface.js
- [ ] Créer les composants modulaires
- [ ] Implémenter les tests unitaires
- [ ] Optimiser les performances

### Long Terme
- [ ] Monitoring continu avec Rabbit
- [ ] Formation équipe sur les best practices
- [ ] Extension à d'autres composants
- [ ] Intégration avec les métriques business

---

## 🎉 Félicitations !

Vous avez maintenant un système de code review automatisé de niveau enterprise ! 

**Rabbit** vous aidera à maintenir une qualité de code constante et à identifier proactivement les problèmes avant qu'ils n'impactent la production.

> **Pro Tip**: Consultez régulièrement le dashboard Rabbit et les rapports hebdomadaires pour suivre les progrès de votre équipe ! 📈

---

*Dernière mise à jour: $(date '+%d/%m/%Y')*  
*Version Rabbit: 2.1.0*  
*Get Weez - Code Quality Initiative* 🤖✨