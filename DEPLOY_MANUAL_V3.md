# 🚀 Déploiement Manuel Gliitz V3 - Sans CLI

## Étape par Étape (5 minutes)

### 1. Aller sur Vercel
🔗 https://vercel.com/dashboard

### 2. Nouveau Projet
Cliquez sur **"Add New..."** → **"Project"**

### 3. Importer depuis GitHub
1. Sélectionnez : **`benezra1326-sys/get-weez-app-v3`**
2. **IMPORTANT** : Changez la branche de `main` à **`v3`**

### 4. Configuration du Build
Laissez les valeurs par défaut :
- Framework : **Next.js** ✅
- Build Command : `npm run build`
- Output Directory : `.next`
- Install Command : `npm install`

### 5. Variables d'Environnement

Cliquez sur **"Environment Variables"** et ajoutez :

#### Obligatoire (pour le chat)
```
Name: NEXT_PUBLIC_OPENAI_API_KEY
Value: votre_clé_openai
```

#### Optionnel (pour la voix)
```
Name: NEXT_PUBLIC_ELEVENLABS_API_KEY
Value: votre_clé_elevenlabs
```

#### Optionnel (pour la base de données)
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: votre_url_supabase

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: votre_clé_supabase
```

### 6. Déployer
Cliquez sur **"Deploy"** 🚀

**Temps estimé** : 2-3 minutes

---

## ✅ Après le déploiement

### Votre URL
Vercel génère automatiquement :
```
https://get-weez-app-v3-[random].vercel.app
```

### Tester
1. Visitez l'URL
2. Testez le chat
3. Testez la navigation
4. Testez le mode sombre

---

## 🔄 Déploiements futurs

### Automatique
Chaque `git push origin v3` redéploie automatiquement ! ✅

### Manuel
Sur Vercel dashboard :
1. Allez dans **"Deployments"**
2. Cliquez **"Redeploy"**

---

## 🎨 Domaine personnalisé

### Sur Vercel
1. **Settings** → **Domains**
2. Ajoutez votre domaine (ex: `gliitz.com`)
3. Configurez les DNS chez votre registrar :

```
Type: CNAME
Name: @ (ou www)
Value: cname.vercel-dns.com
```

### Certificat SSL
Automatique avec Vercel ! 🔒

---

## 📊 Ce qui est déployé

### Branche V3
- ✅ 9 pages complètes
- ✅ Sidebar noir/blanc
- ✅ Chat IA
- ✅ Filtres fonctionnels
- ✅ Design élégant noir & or
- ✅ Responsive mobile/desktop

### Performance
- CDN mondial (fast partout)
- Cache automatique
- Edge functions
- HTTPS gratuit

---

## ⚠️ Checklist avant déploiement

- ✅ Code pushed sur GitHub (v3 branch) ✅
- ✅ Pas d'erreurs de build localement
- ✅ Clé OpenAI prête
- ⬜ Tester après déploiement

---

## 🎯 URL de déploiement

Une fois déployé, notez votre URL ici :

```
Production: ___________________.vercel.app
Preview: ___________________.vercel.app
```

---

## 🆘 Besoin d'aide ?

### Support Vercel
- Documentation : https://vercel.com/docs
- Status : https://vercel-status.com

### Logs en temps réel
Sur Vercel dashboard → **Functions** → **Logs**

---

**Prêt à mettre Gliitz en ligne ! 🌟**

Allez sur https://vercel.com/new et suivez les étapes ci-dessus !

