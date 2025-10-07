# 🚀 Déploiement Gliitz V3 sur Vercel

## Méthode 1 : Via l'interface Vercel (Recommandé)

### Étape 1 : Aller sur Vercel
1. Ouvrez https://vercel.com
2. Connectez-vous avec GitHub

### Étape 2 : Importer le projet
1. Cliquez sur **"New Project"**
2. Sélectionnez le repository : `benezra1326-sys/get-weez-app-v3`
3. **Important** : Sélectionnez la branche **`v3`**

### Étape 3 : Configuration
**Framework Preset** : Next.js (auto-détecté)

**Build Command** : `npm run build` (par défaut)

**Output Directory** : `.next` (par défaut)

**Install Command** : `npm install` (par défaut)

### Étape 4 : Variables d'environnement

Ajoutez ces variables :

```
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_ELEVENLABS_API_KEY=... (optionnel)
NEXT_PUBLIC_SUPABASE_URL=... (optionnel)
NEXT_PUBLIC_SUPABASE_ANON_KEY=... (optionnel)
```

**Important** : Seule `NEXT_PUBLIC_OPENAI_API_KEY` est requise pour le chat

### Étape 5 : Déployer
1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Votre site sera en ligne ! 🎉

---

## Méthode 2 : Via Git Push (Auto-deploy)

### Configuration initiale
1. Sur Vercel, importez le projet une première fois
2. Vercel se connecte automatiquement à GitHub

### Déploiements automatiques
Ensuite, chaque fois que vous faites :
```bash
git push origin v3
```

Vercel redéploie automatiquement ! ✅

---

## 🔧 Après le déploiement

### Votre URL
Vercel vous donnera une URL type :
```
https://get-weez-app-v3.vercel.app
```

### Domaine personnalisé (optionnel)
1. Allez dans **Settings** > **Domains**
2. Ajoutez votre domaine (ex: gliitz.com)
3. Suivez les instructions DNS

---

## ⚡ Performance Vercel

Vercel optimise automatiquement :
- ✅ CDN mondial (déploiement edge)
- ✅ Cache intelligent
- ✅ Compression images
- ✅ HTTPS automatique
- ✅ Serverless functions pour l'API

---

## 🐛 Problèmes courants

### "Build failed"
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez qu'il n'y a pas d'erreurs de linting

### "API not working"
- Vérifiez que `NEXT_PUBLIC_OPENAI_API_KEY` est bien configurée
- Les variables d'environnement avec `NEXT_PUBLIC_` sont accessibles côté client

### "Site is blank"
- Videz le cache de votre navigateur
- Vérifiez la console (F12) pour les erreurs

---

## 📊 Monitoring

Sur Vercel dashboard :
- **Analytics** : Visiteurs, pages vues
- **Speed Insights** : Performance
- **Logs** : Erreurs en temps réel

---

## 🎯 Prêt pour la production !

Votre Gliitz V3 est optimisé pour :
- ✅ Performance maximale
- ✅ SEO
- ✅ Scalabilité
- ✅ Sécurité

---

**🎉 Bon déploiement !**

