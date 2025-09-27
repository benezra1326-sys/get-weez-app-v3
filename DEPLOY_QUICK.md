# 🚀 DÉPLOIEMENT RAPIDE GET WEEZ

## ⚡ **DÉPLOIEMENT EN 5 MINUTES**

### **1. Créer un repository GitHub**
```bash
# Aller sur github.com
# Créer un nouveau repository "get-weez"
# Copier l'URL du repository
```

### **2. Pousser le code vers GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Get Weez App"
git branch -M main
git remote add origin <URL_DU_REPOSITORY>
git push -u origin main
```

### **3. Déployer sur Vercel**
1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter avec GitHub**
3. **Cliquer sur "New Project"**
4. **Sélectionner le repository "get-weez"**
5. **Ajouter les variables d'environnement :**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

6. **Cliquer sur "Deploy"**

### **4. Configuration Supabase (Optionnel)**
1. **Aller sur [supabase.com](https://supabase.com)**
2. **Créer un nouveau projet**
3. **Copier l'URL et les clés API**
4. **Exécuter le script SQL dans l'éditeur SQL**

### **5. Configuration OpenAI (Optionnel)**
1. **Aller sur [platform.openai.com](https://platform.openai.com)**
2. **Créer une clé API**
3. **Ajouter la clé dans les variables d'environnement Vercel**

## 🎯 **RÉSULTAT**

**Votre application sera accessible via un lien Vercel ! 🚀**

**Exemple de lien :** `https://get-weez-abc123.vercel.app`

## 📱 **FONCTIONNALITÉS DÉPLOYÉES**

- ✅ **Interface responsive** (mobile + desktop)
- ✅ **Chat IA intelligent** avec OpenAI
- ✅ **Système d'authentification** Supabase
- ✅ **Base de données** pour les établissements
- ✅ **Système de réservations** intelligent
- ✅ **Multi-langues** (FR, EN, ES, etc.)
- ✅ **Design luxueux** et moderne

## 🔧 **COMMANDES UTILES**

```bash
# Build local
npm run build

# Test local
npm run start

# Script de déploiement
./deploy.sh
```

## 📖 **GUIDES COMPLETS**

- **Guide détaillé** : `DEPLOYMENT_GUIDE.md`
- **Script automatique** : `deploy.sh`
- **Configuration Vercel** : `vercel.json`

**Votre application Get Weez sera en ligne en quelques minutes ! 🎉**
