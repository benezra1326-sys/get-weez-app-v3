# 🎤 Configuration ElevenLabs pour Gliitz V3

## Comment obtenir votre clé API ElevenLabs

### 1. Créer un compte
1. Allez sur https://elevenlabs.io
2. Cliquez sur "Sign Up"
3. Créez votre compte

### 2. Obtenir la clé API
1. Connectez-vous à votre compte ElevenLabs
2. Allez dans **Settings** (Paramètres)
3. Cliquez sur **API Keys**
4. Copiez votre clé API

### 3. Configuration dans Gliitz

Créez le fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=votre_clé_api_ici
```

### 4. Redémarrer le serveur

```bash
npm run dev
```

---

## 🎯 Fonctionnalités activées

Une fois configuré, vous aurez :

### Reconnaissance vocale (Speech-to-Text)
- Cliquez sur le micro 🎤
- Parlez naturellement
- Le texte s'affiche dans le chat
- Fonctionne en français

### Lecture des réponses (Text-to-Speech)
- Gliitz lit ses réponses à voix haute
- Voix élégante et professionnelle
- Activation automatique après chaque réponse

---

## ⚙️ Configuration avancée

### Dans `lib/elevenlabs.js`

Vous pouvez personnaliser :

```javascript
// ID de la voix (défaut: Adam - élégant et professionnel)
this.voiceId = 'pNInz6obpgDQGcFmaJgB'

// Paramètres de la voix
voice_settings: {
  stability: 0.5,           // 0-1 (stabilité)
  similarity_boost: 0.75,   // 0-1 (fidélité)
  style: 0.5,              // 0-1 (expressivité)
  use_speaker_boost: true  // Amélioration audio
}
```

### Autres voix disponibles

Vous pouvez choisir d'autres voix sur ElevenLabs :
- **Rachel** - Féminine, élégante
- **Domi** - Masculine, confiante
- **Bella** - Féminine, douce
- **Antoni** - Masculine, professionnelle

Changez simplement `this.voiceId` dans `lib/elevenlabs.js`

---

## 💡 Utilisation

### Reconnaissance vocale
1. Cliquez sur 🎤
2. Parlez (le bouton devient rouge)
3. Le texte apparaît
4. Cliquez "Envoyer" ou appuyez Entrée

### Désactiver la lecture automatique
Si vous ne voulez pas que Gliitz lise ses réponses, commentez cette ligne dans `pages/index.js` :

```javascript
// elevenLabs.playAudio(data.message).catch(...)
```

---

## 🆓 Plan gratuit ElevenLabs

- **10,000 caractères/mois** gratuits
- Parfait pour tester
- Upgrade possible si besoin

---

## ⚠️ Mode sans ElevenLabs

Si vous ne configurez pas ElevenLabs :
- ✅ Le chat fonctionne normalement
- ✅ La reconnaissance vocale fonctionne (Web Speech API)
- ❌ Pas de lecture audio des réponses

Le site reste **100% fonctionnel** sans ElevenLabs !

---

## 📞 Support

Si vous avez des questions :
1. Consultez https://docs.elevenlabs.io
2. Vérifiez que la clé API est bien dans `.env.local`
3. Redémarrez le serveur après modification

---

**Prêt à donner la voix à Gliitz !** 🎤✨

