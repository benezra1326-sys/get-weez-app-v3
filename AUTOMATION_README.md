# 🚀 Système d'Automatisation Get Weez

## 📋 Vue d'ensemble

Ce système d'automatisation complet pour Get Weez inclut :
- ✅ **Backups automatiques** avec rotation intelligente
- 🤖 **CodeRabbit** pour reviews de code IA
- 🔧 **Hooks Git** pour vérifications pre/post-commit
- 🚀 **GitHub Actions** pour CI/CD automatique

## 🏃‍♂️ Installation Rapide

```bash
# Installation complète en une commande
./scripts/setup-automation.sh
```

## 📁 Structure des Fichiers

```
📦 Get Weez Automation
├── 🔧 hooks/
│   ├── pre-commit          # Vérifications avant commit
│   └── post-commit         # Actions après commit
├── 🤖 .github/workflows/
│   ├── ci-cd.yml          # Pipeline principal CI/CD
│   └── coderabbit-review.yml # Reviews automatiques
├── 📋 scripts/
│   ├── setup-automation.sh    # Installation complète
│   ├── install-git-hooks.sh   # Installation hooks Git
│   └── auto-backup.sh         # Système de backup
└── ⚙️ .coderabbit.yaml       # Configuration CodeRabbit
```

## 🔧 Composants du Système

### 1. 🗃️ Système de Backup

**Types de backup disponibles:**
- `daily` : Sauvegarde quotidienne (garde 7 jours)
- `weekly` : Sauvegarde hebdomadaire (garde 4 semaines)
- `monthly` : Sauvegarde mensuelle (garde 12 mois)
- `manual` : Sauvegarde manuelle (garde 5 backups)
- `incremental` : Backup incrémental (garde 14 jours)

**Utilisation:**
```bash
# Backup manuel
./scripts/auto-backup.sh manual

# Backup quotidien
./scripts/auto-backup.sh daily

# Backup complet
./scripts/auto-backup.sh full
```

**Planification automatique (cron):**
```bash
# Éditer la crontab
crontab -e

# Ajouter ces lignes pour l'automatisation:
0 2 * * *   cd /chemin/vers/get-weez && ./scripts/auto-backup.sh daily
0 3 * * 0   cd /chemin/vers/get-weez && ./scripts/auto-backup.sh weekly
0 4 1 * *   cd /chemin/vers/get-weez && ./scripts/auto-backup.sh monthly
```

### 2. 🔧 Hooks Git

#### Pre-commit Hook
Exécuté **avant** chaque commit :
- ✅ Linting ESLint automatique
- 🔐 Détection de secrets/tokens
- 📏 Vérification taille des fichiers
- 🧹 Validation syntaxe JavaScript

#### Post-commit Hook  
Exécuté **après** chaque commit :
- 💾 Création backup automatique
- 📤 Push automatique vers remote (branche main)
- 📊 Mise à jour des statistiques
- 📝 Log des commits

**Installation:**
```bash
./scripts/install-git-hooks.sh
```

### 3. 🤖 CodeRabbit (Reviews IA)

Configuration optimisée pour Get Weez :
- 🇫🇷 **Langue**: Français
- 📱 **Focus**: Mobile & Performance  
- 🔒 **Sécurité**: API & authentification
- ⚡ **Performance**: React & Next.js

**Fonctionnalités:**
- Reviews automatiques sur les Pull Requests
- Suggestions d'amélioration personnalisées
- Détection des problèmes de sécurité
- Optimisations performance mobile

### 4. 🚀 GitHub Actions

#### CI/CD Pipeline (`ci-cd.yml`)
- 🔍 Tests qualité code (ESLint, build)
- 🔐 Audit de sécurité
- 💾 Backups automatiques quotidiens
- 🚀 Déploiement auto sur Vercel (branche main)

#### CodeRabbit Reviews (`coderabbit-review.yml`)
- 🤖 Analyse IA des Pull Requests
- 📋 Reviews personnalisées par type de fichier
- 💬 Commentaires constructifs en français

## ⚙️ Configuration

### 1. Secrets GitHub Requis

Dans **Settings > Secrets and variables > Actions** :

```bash
# Pour Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id  
VERCEL_PROJECT_ID=your_project_id

# Pour CodeRabbit (optionnel)
OPENAI_API_KEY=your_openai_key
```

### 2. Variables d'Environnement Locales

```bash
# Dans .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

## 🧪 Tests et Validation

### Test Complet du Système
```bash
# Tester tous les composants
./scripts/setup-automation.sh

# Vérifier les hooks
git add . && git commit -m "test automation"

# Vérifier les backups  
ls -la ../get-weez-backups/

# Tester CodeRabbit
# Créer une Pull Request sur GitHub
```

### Commandes de Diagnostic
```bash
# Vérifier les hooks installés
ls -la .git/hooks/

# Voir les workflows GitHub Actions
ls -la .github/workflows/

# Vérifier la config CodeRabbit
cat .coderabbit.yaml

# Statistiques des backups
du -sh ../get-weez-backups/
```

## 📊 Monitoring et Logs

### Logs de Backup
```bash
# Voir les logs de backup
tail -f /tmp/backup.log

# Rapport mensuel des backups
cat ../get-weez-backups/backup-report-$(date +%Y%m).txt
```

### GitHub Actions
- Voir les résultats dans l'onglet **Actions** du repository
- Notifications par email en cas d'échec
- Artifacts de backup téléchargeables

### CodeRabbit
- Comments automatiques sur les PRs
- Résumés high-level des changements
- Métriques d'amélioration du code

## 🛠️ Maintenance

### Nettoyage Périodique
```bash
# Nettoyer les anciens backups manuellement
find ../get-weez-backups -name "*.tar.gz" -mtime +30 -delete

# Purger les logs
> /tmp/backup.log

# Réinstaller les hooks (si nécessaire)
./scripts/install-git-hooks.sh
```

### Mise à jour des Configurations
```bash
# Mise à jour CodeRabbit
# Éditez .coderabbit.yaml puis commitez

# Mise à jour des workflows
# Éditez .github/workflows/*.yml puis pushev

# Mise à jour des hooks
# Éditez hooks/* puis réinstallez avec install-git-hooks.sh
```

## 🆘 Dépannage

### Problèmes Courants

**Hook pre-commit échoue :**
```bash
# Désactiver temporairement
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled

# Réactiver après correction
mv .git/hooks/pre-commit.disabled .git/hooks/pre-commit
```

**Backup échoue :**
```bash
# Vérifier l'espace disque
df -h

# Vérifier les permissions
ls -la scripts/auto-backup.sh

# Mode debug
bash -x scripts/auto-backup.sh manual
```

**GitHub Actions échouent :**
- Vérifiez les secrets dans Settings > Secrets
- Consultez les logs dans l'onglet Actions
- Vérifiez les limites d'utilisation GitHub

**CodeRabbit ne répond pas :**
- Vérifiez que `.coderabbit.yaml` existe
- Assurez-vous que les PRs sont créées correctement
- Vérifiez la configuration OpenAI API

## 🤝 Support

### Ressources
- 📖 [Documentation GitHub Actions](https://docs.github.com/actions)
- 🤖 [Documentation CodeRabbit](https://docs.coderabbit.ai/)
- 🚀 [Documentation Vercel](https://vercel.com/docs)

### Contact
- 📧 Consultez les logs d'erreur dans `/tmp/backup.log`
- 🔍 Vérifiez les GitHub Actions dans l'interface web
- 📋 Lisez `automation-setup-summary.md` pour les détails

---

*🎉 Système d'automatisation Get Weez - Backups sécurisés & Reviews IA automatiques*