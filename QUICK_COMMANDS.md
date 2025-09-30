# ⚡ Commandes Rapides - Système d'Automatisation Get Weez

## 🚀 Commandes Essentielles

### 💾 Backups
```bash
# Backup manuel immédiat
./scripts/auto-backup.sh manual

# Backup quotidien
./scripts/auto-backup.sh daily

# Backup complet
./scripts/auto-backup.sh full

# Voir tous les backups
ls -la backups/get-weez-backups/*/
```

### 🔧 Hooks Git
```bash
# Installer/réinstaller les hooks
./scripts/install-git-hooks.sh

# Désactiver temporairement un hook
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled

# Réactiver un hook
mv .git/hooks/pre-commit.disabled .git/hooks/pre-commit
```

### 📊 Monitoring
```bash
# Rapport de backup mensuel
cat backups/get-weez-backups/backup-report-$(date +%Y%m).txt

# Logs de backup
tail -f /tmp/backup.log

# Espace disque backups
du -sh backups/get-weez-backups/

# Statistiques projet
find . -name "*.js" -o -name "*.jsx" | grep -v node_modules | wc -l
```

### 🧪 Tests
```bash
# Tester le système complet
./scripts/setup-automation.sh

# Test de commit (déclenche hooks)
git add . && git commit -m "test: Validation hooks automatiques"

# Test de build
npm run build

# Test de lint
npm run lint
```

### 🔄 GitHub Actions
```bash
# Voir les workflows
ls -la .github/workflows/

# Push pour déclencher CI/CD
git push origin main

# Voir les résultats sur GitHub
# Aller dans l'onglet Actions du repository
```

### ⚙️ Configuration
```bash
# Éditer configuration CodeRabbit
nano .coderabbit.yaml

# Voir la config des hooks
cat .git/hooks/hooks-config.json

# Planifier les backups automatiques
crontab -e
# Puis ajouter:
# 0 2 * * * cd /workspace && ./scripts/auto-backup.sh daily
```

### 🆘 Dépannage
```bash
# Vérifier les prérequis
git --version && node --version && npm --version

# Permissions des scripts
chmod +x scripts/*.sh hooks/*

# Réinitialiser la configuration
./scripts/setup-automation.sh

# Mode debug backup
bash -x scripts/auto-backup.sh manual
```

## 📋 Checklist Post-Installation

### ✅ Configuration GitHub Secrets
- [ ] `VERCEL_TOKEN` configuré
- [ ] `VERCEL_ORG_ID` configuré  
- [ ] `VERCEL_PROJECT_ID` configuré
- [ ] `OPENAI_API_KEY` configuré (optionnel)

### ✅ Tests de Validation
- [ ] Backup manuel réussi : `./scripts/auto-backup.sh manual`
- [ ] Hooks Git fonctionnels : commit de test
- [ ] GitHub Actions activés : vérifier onglet Actions
- [ ] CodeRabbit configuré : créer une PR de test

### ✅ Planification
- [ ] Cron jobs configurés pour backups automatiques
- [ ] Notifications configurées (optionnel)
- [ ] Documentation lue et comprise

## 🔗 Liens Utiles

- **Repository** : Settings > Secrets and variables > Actions
- **Vercel Dashboard** : https://vercel.com/dashboard  
- **GitHub Actions** : Onglet Actions du repository
- **CodeRabbit** : Commentaires automatiques sur les PRs

---

*💡 Gardez ce fichier à portée de main pour un accès rapide aux commandes !*