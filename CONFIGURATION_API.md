# 🔧 Configuration de l'API OpenAI pour Get Weez

## 🚨 Problème identifié

L'interface de chat utilise actuellement uniquement le système de fallback car la clé API OpenAI n'est pas configurée.

## 📋 Solution étape par étape

### 1. Configuration automatique (Recommandée)

```bash
# Exécuter le script de configuration
node setup-openai.js
```

Ce script vous guidera pour :
- Entrer votre clé API OpenAI
- Créer automatiquement le fichier `.env.local`
- Vérifier la configuration

### 2. Configuration manuelle

1. **Obtenir une clé API OpenAI :**
   - Allez sur [https://platform.openai.com/](https://platform.openai.com/)
   - Connectez-vous ou créez un compte
   - Allez dans "API Keys"
   - Cliquez sur "Create new secret key"
   - Copiez la clé (elle commence par `sk-`)

2. **Créer le fichier `.env.local` :**
   ```bash
   # À la racine du projet
   touch .env.local
   ```

3. **Ajouter la clé API :**
   ```bash
   # Dans .env.local
   OPENAI_API_KEY=sk-votre-cle-api-ici
   ```

### 3. Redémarrer le serveur

```bash
npm run dev
```

## 🧪 Tests de vérification

### Test 1: Vérifier la clé API
```bash
node test-openai.js
```

### Test 2: Tester l'API complète (serveur démarré)
```bash
# Dans un autre terminal, après avoir démarré le serveur
node test-chat-api.js
```

### Test 3: Test manuel dans le navigateur
1. Ouvrez [http://localhost:3000](http://localhost:3000)
2. Allez dans la section chat
3. Tapez "bonjour" et envoyez
4. Vérifiez que vous recevez une réponse intelligente

## 🔍 Diagnostic des problèmes

### Erreur "OPENAI_API_KEY n'est pas configurée"
- Vérifiez que le fichier `.env.local` existe
- Vérifiez que la clé commence par `sk-`
- Redémarrez le serveur après modification

### Erreur "401 Incorrect API key"
- Vérifiez que la clé est correcte
- Assurez-vous qu'il n'y a pas d'espaces dans `.env.local`
- Vérifiez votre solde sur [OpenAI Usage](https://platform.openai.com/usage)

### Erreur "Insufficient quota"
- Ajoutez des crédits sur votre compte OpenAI
- Vérifiez les limites de votre plan

### Le chat ne répond pas intelligemment
- Ouvrez la console du navigateur (F12)
- Regardez les logs qui commencent par 🚀, 📝, 💬
- Vérifiez s'il y a des erreurs JavaScript

## ✅ Vérification finale

Une fois configuré correctement, le chat devrait :
- Répondre de manière intelligente et contextuelle
- Proposer des restaurants, villas, yachts, etc.
- S'adapter à la langue de l'utilisateur
- Gérer l'historique de conversation

## 🔄 Système de fallback

Si OpenAI n'est pas configuré, l'application utilise automatiquement un système de fallback qui répond aux questions courantes avec des réponses prédéfinies intelligentes.



