# 🎙️ Guide de Configuration - Gliitz Voice Chat

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✅ Un compte ElevenLabs (gratuit ou payant)
- ✅ Une clé API OpenAI
- ✅ Node.js et npm installés
- ✅ Le projet Gliitz en local

## 🔑 Étape 1 : Obtenir une clé API ElevenLabs

### 1. Créer un compte ElevenLabs
1. Allez sur [ElevenLabs.io](https://elevenlabs.io)
2. Cliquez sur "Sign Up" (gratuit)
3. Confirmez votre email

### 2. Générer une clé API
1. Connectez-vous à votre compte
2. Allez dans **Profile** → **API Keys**
3. Cliquez sur "Create API Key"
4. Copiez votre clé (elle commence par `sk_...`)

## 🔧 Étape 2 : Configuration du projet

### 1. Créer le fichier `.env.local`
À la racine du projet, créez un fichier `.env.local` :

```bash
# ElevenLabs Configuration
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_votre_cle_ici

# OpenAI Configuration (si pas déjà configuré)
OPENAI_API_KEY=sk-votre_cle_openai_ici
```

### 2. Vérifier la configuration
```bash
# Démarrer le serveur de développement
npm run dev

# Le serveur devrait démarrer sur http://localhost:3000
```

## 🎤 Étape 3 : Permissions du navigateur

### Chrome/Edge
1. Cliquez sur l'icône 🔒 à gauche de l'URL
2. Activez "Microphone" → Autoriser
3. Rechargez la page

### Safari
1. Safari → Préférences → Sites web
2. Microphone → Autoriser pour localhost
3. Rechargez la page

### Firefox
1. Cliquez sur l'icône 🔒 dans la barre d'adresse
2. Permissions → Microphone → Autoriser
3. Rechargez la page

## 🧪 Étape 4 : Test de fonctionnement

### 1. Test du chat vocal
```bash
# Ouvrez votre navigateur
http://localhost:3000

# Cliquez sur le bouton micro 🎙️
# Vous devriez être redirigé vers /voice-chat
```

### 2. Test de la reconnaissance vocale
1. Cliquez sur le gros bouton micro argenté
2. Dites "Bonjour Gliitz"
3. La transcription devrait apparaître en temps réel
4. Cliquez sur "Envoyer"

### 3. Test de la lecture audio
1. Attendez la réponse de Gliitz
2. Elle devrait être lue automatiquement
3. Vous pouvez la rejouer avec le bouton ▶️

## 🔍 Vérification de la configuration

### Vérifier les clés API
```javascript
// Ouvrez la console du navigateur (F12)
console.log('ElevenLabs:', process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ? '✅ Configuré' : '❌ Manquant')
```

### Test de la reconnaissance vocale
```javascript
// Ouvrez la console du navigateur (F12)
if ('webkitSpeechRecognition' in window) {
  console.log('✅ Reconnaissance vocale supportée')
} else {
  console.log('❌ Reconnaissance vocale non supportée')
}
```

## 🎨 Étape 5 : Personnalisation (optionnel)

### Changer la voix ElevenLabs

Dans `lib/elevenlabs.js`, ligne 7 :
```javascript
// Voix par défaut (Adam - masculine, élégante)
this.voiceId = 'pNInz6obpgDQGcFmaJgB'

// Alternatives populaires :
// Charlotte (feminine, claire) : 'XB0fDUnXU5powFXDhCwa'
// Bella (feminine, douce) : 'EXAVITQu4vr4xnSDxMaL'
// Rachel (feminine, pro) : '21m00Tcm4TlvDq8ikWAM'
```

### Changer la langue de reconnaissance

Dans `pages/voice-chat.js`, ligne 32 :
```javascript
// Français (par défaut)
recognition.lang = 'fr-FR'

// Alternatives :
// Anglais US : 'en-US'
// Espagnol : 'es-ES'
// Italien : 'it-IT'
// Allemand : 'de-DE'
```

## 🐛 Résolution des problèmes courants

### ❌ "ElevenLabs API key not configured"
**Solution** : Vérifiez que la clé est bien dans `.env.local` avec le préfixe `NEXT_PUBLIC_`

### ❌ "Speech recognition not supported"
**Solution** : Utilisez Chrome, Edge ou Safari. Firefox a un support limité.

### ❌ Pas de son lors de la lecture
**Solutions** :
1. Vérifiez le volume système
2. Cliquez sur le bouton mute (🔇) pour le désactiver
3. Vérifiez la clé API ElevenLabs
4. Regardez la console (F12) pour les erreurs

### ❌ "Permission denied" pour le micro
**Solution** : 
1. Réinitialisez les permissions du site dans les paramètres du navigateur
2. Utilisez HTTPS (requis pour la production)
3. Pour localhost, c'est automatique

### ❌ Transcription vide ou incorrecte
**Solutions** :
1. Parlez plus fort et distinctement
2. Réduisez les bruits de fond
3. Vérifiez que le micro est bien sélectionné dans les paramètres système

## 📊 Limites du plan gratuit ElevenLabs

| Plan | Caractères/mois | Voix | Qualité |
|------|----------------|------|---------|
| **Free** | 10,000 | 3 | Standard |
| **Starter** | 30,000 | 10 | Premium |
| **Creator** | 100,000 | 30 | Studio |

💡 **Astuce** : Le plan gratuit est suffisant pour tester, mais pour une production, passez au plan payant.

## 🔐 Sécurité des clés API

### ✅ À FAIRE
- Garder `.env.local` dans `.gitignore`
- Ne jamais commit les clés API
- Utiliser des variables d'environnement

### ❌ À NE PAS FAIRE
- Hardcoder les clés dans le code
- Partager les clés publiquement
- Utiliser la même clé pour dev et prod

## 🚀 Déploiement en production

### Vercel (recommandé)
```bash
# 1. Push votre code sur GitHub
git add .
git commit -m "Add voice chat feature"
git push

# 2. Dans Vercel Dashboard
# - Importez votre repo
# - Ajoutez les variables d'environnement :
#   NEXT_PUBLIC_ELEVENLABS_API_KEY
#   OPENAI_API_KEY
# - Déployez
```

### Variables d'environnement Vercel
1. Projet → Settings → Environment Variables
2. Ajoutez chaque variable une par une
3. Sélectionnez "Production, Preview, Development"
4. Redéployez

## 📞 Support

Si vous rencontrez des problèmes non couverts ici :
1. Vérifiez la console du navigateur (F12)
2. Consultez la documentation ElevenLabs : [docs.elevenlabs.io](https://docs.elevenlabs.io)
3. Vérifiez les issues GitHub du projet

## 🎓 Ressources supplémentaires

- [ElevenLabs Documentation](https://docs.elevenlabs.io)
- [Web Speech API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Gliitz Voice Chat** - Configuration terminée ! Vous êtes prêt à converser vocalement avec Gliitz. 🎉🎙️

