# 🚀 GUIDE DE DÉPLOIEMENT GET WEEZ

## 🎯 **DÉPLOIEMENT SUR VERCEL (RECOMMANDÉ)**

### **Étape 1 : Préparer le projet**
```bash
# 1. Créer un compte GitHub (si pas déjà fait)
# 2. Créer un nouveau repository sur GitHub
# 3. Pousser votre code vers GitHub
```

### **Étape 2 : Déployer sur Vercel**
1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter avec GitHub**
3. **Cliquer sur "New Project"**
4. **Sélectionner votre repository "get-weez"**
5. **Configurer les variables d'environnement :**

```env
# Variables d'environnement à ajouter dans Vercel :
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

6. **Cliquer sur "Deploy"**

### **Étape 3 : Configuration Supabase**
1. **Aller sur [supabase.com](https://supabase.com)**
2. **Créer un nouveau projet**
3. **Copier l'URL et les clés API**
4. **Exécuter le script SQL dans l'éditeur SQL :**

```sql
-- Copier le contenu de supabase-schema.sql
-- dans l'éditeur SQL de Supabase
```

### **Étape 4 : Configuration OpenAI**
1. **Aller sur [platform.openai.com](https://platform.openai.com)**
2. **Créer une clé API**
3. **Ajouter la clé dans les variables d'environnement Vercel**

## 🌐 **LIENS DE DÉPLOIEMENT**

### **Vercel (Recommandé)**
- **Site** : [vercel.com](https://vercel.com)
- **Documentation** : [vercel.com/docs](https://vercel.com/docs)
- **Prix** : Gratuit pour les projets personnels

### **Netlify (Alternative)**
- **Site** : [netlify.com](https://netlify.com)
- **Documentation** : [docs.netlify.com](https://docs.netlify.com)
- **Prix** : Gratuit avec limitations

### **Railway (Avec base de données)**
- **Site** : [railway.app](https://railway.app)
- **Documentation** : [docs.railway.app](https://docs.railway.app)
- **Prix** : Gratuit avec limitations

## 🔧 **COMMANDES DE DÉPLOIEMENT**

### **Build local pour test**
```bash
npm run build
npm run start
```

### **Variables d'environnement requises**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## 📱 **FONCTIONNALITÉS DÉPLOYÉES**

- ✅ **Interface responsive** (mobile + desktop)
- ✅ **Chat IA intelligent** avec OpenAI
- ✅ **Système d'authentification** Supabase
- ✅ **Base de données** pour les établissements
- ✅ **Système de réservations** intelligent
- ✅ **Multi-langues** (FR, EN, ES, etc.)
- ✅ **Design luxueux** et moderne

## 🎯 **ÉTAPES RAPIDES**

1. **Créer un repository GitHub**
2. **Pousser le code vers GitHub**
3. **Se connecter sur Vercel**
4. **Importer le projet**
5. **Ajouter les variables d'environnement**
6. **Déployer !**

**Votre application sera accessible via un lien Vercel ! 🚀**
