# 🔑 Configuration OpenAI pour Get Weez

## 📋 Étapes pour connecter OpenAI

### 1. Obtenir une clé API OpenAI
1. Allez sur [https://platform.openai.com/](https://platform.openai.com/)
2. Connectez-vous ou créez un compte
3. Allez dans "API Keys" dans le menu
4. Cliquez sur "Create new secret key"
5. Donnez un nom à votre clé (ex: "Get Weez Production")
6. Copiez la clé (elle commence par `sk-`)

### 2. Configurer la clé dans votre projet
1. Ouvrez le fichier `.env.local` à la racine du projet
2. Ajoutez ou modifiez cette ligne :
```bash
OPENAI_API_KEY=sk-votre-cle-api-ici
```

### 3. Redémarrer le serveur
```bash
npm run dev
```

## 🚨 Résolution des problèmes

### Erreur "401 Incorrect API key"
- Vérifiez que votre clé commence par `sk-`
- Assurez-vous qu'il n'y a pas d'espaces dans `.env.local`
- Redémarrez le serveur après modification

### Erreur "Insufficient quota"
- Vérifiez votre solde sur [https://platform.openai.com/usage](https://platform.openai.com/usage)
- Ajoutez des crédits si nécessaire

### Le chat ne fonctionne pas
- Ouvrez la console du navigateur (F12)
- Regardez les logs qui commencent par 🚀, 📝, 💬
- Vérifiez s'il y a des erreurs JavaScript

## 🔄 Système de fallback

Si OpenAI n'est pas configuré ou ne fonctionne pas, l'application utilise automatiquement un système de fallback qui répond aux questions courantes.

## 🧪 Test de la configuration

Une fois configuré, testez avec ces messages :
- "bonjour"
- "Réserve-moi un restaurant"
- "Je veux une villa"

L'IA devrait répondre de manière intelligente et contextuelle.