# 🎤 Gliitz Voice Chat - Documentation

## 📋 Vue d'ensemble

La page **Voice Chat** offre une expérience de conversation vocale interactive et premium avec Gliitz, votre concierge IA de luxe.

## ✨ Fonctionnalités

### 1. **Interface Interactive Premium**
- 🌌 Fond animé avec effet halo argenté et particules flottantes
- 💎 Design glassmorphism avec effets de blur et transparence
- 🎨 Support complet du mode sombre et clair
- ✨ Animations fluides et élégantes

### 2. **Dictée Vocale (Speech-to-Text)**
- 🎙️ Reconnaissance vocale en temps réel
- 🇫🇷 Support multilingue (FR par défaut)
- 📝 Affichage des transcriptions en direct (interim + final)
- 🔄 Mode continu pour des conversations naturelles

### 3. **Lecture Audio (Text-to-Speech)**
- 🔊 Intégration avec ElevenLabs pour des voix naturelles
- ⏯️ Contrôles play/pause pour les réponses IA
- 🔇 Option de mute pour lecture silencieuse
- 🔁 Rejouer les réponses précédentes

### 4. **Visualisation Audio**
- 🌊 Onde audio animée réactive au son
- 📊 Barres de fréquence qui réagissent au niveau audio
- 💫 Effets de ripple pendant l'enregistrement
- ✨ Animation de pulsation pour les états actifs

### 5. **Contrôles Intuitifs**
- 🎙️ **Bouton Micro** : Démarrer/Arrêter l'enregistrement (rouge quand actif)
- ▶️ **Bouton Play** : Rejouer la dernière réponse de Gliitz
- 🔇 **Bouton Mute** : Désactiver/Activer le son
- ✖️ **Bouton Fermer** : Retour au chat principal

### 6. **Sous-titres Live**
- 📝 Zone de transcription en temps réel pour l'utilisateur
- 💬 Affichage de la réponse IA avec mise en forme
- 📋 Scrollable pour les conversations longues
- 🎯 Design épuré et lisible

## 🚀 Utilisation

### Accès à la page Voice Chat
Depuis le chat principal (`/`), cliquez sur le bouton micro (🎙️) pour ouvrir la page Voice Chat (`/voice-chat`).

### Workflow typique
1. **Cliquer sur le micro** pour démarrer l'enregistrement
2. **Parler naturellement** - la transcription apparaît en direct
3. **Cliquer à nouveau sur le micro** pour arrêter
4. **Cliquer sur "Envoyer"** pour envoyer votre message à Gliitz
5. **Gliitz répond** vocalement et par texte
6. **Rejouer** la réponse avec le bouton play si nécessaire

### Nouvelle conversation
Cliquez sur "Nouvelle conversation" pour réinitialiser et recommencer.

## 🔧 Configuration Technique

### Dépendances
```javascript
// Pages
pages/voice-chat.js

// Bibliothèques
lib/elevenlabs.js (TTS)
contexts/ThemeContextSimple.js (Thème)

// API
/api/chat (Backend OpenAI)
```

### Variables d'environnement requises
```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
OPENAI_API_KEY=your_api_key_here
```

### Compatibilité navigateurs
- ✅ Chrome/Edge (recommandé)
- ✅ Safari (support WebKit)
- ⚠️ Firefox (support partiel)
- ❌ IE (non supporté)

## 🎨 Design System

### Couleurs
```css
/* Argent principal */
--silver: #C0C0C0
--silver-light: #E5E5E5
--silver-dark: #A8A8A8

/* Fond gradient */
Dark Mode: radial-gradient(circle, #1a1a2e 0%, #0B0B0C 100%)
Light Mode: radial-gradient(circle, #f8f9fa 0%, #e9ecef 100%)
```

### Animations
- `float`: Particules flottantes (6s)
- `pulse-glow`: Pulsation lumineuse (2s)
- `wave`: Barres audio ondulantes (1s)
- `ripple`: Effet d'onde concentrique (1.5s)

## 📱 Responsive Design

La page est entièrement responsive et s'adapte à tous les écrans :
- 💻 **Desktop** : Contrôles larges et visuels immersifs
- 📱 **Mobile** : Optimisé pour utilisation tactile
- 🖥️ **Tablet** : Interface adaptative

## 🔐 Sécurité & Confidentialité

- 🔒 Les enregistrements audio ne sont pas stockés
- 🔐 Communication API sécurisée (HTTPS)
- 🚫 Pas de tracking des conversations vocales
- ✅ Traitement en temps réel uniquement

## 🐛 Troubleshooting

### Le micro ne fonctionne pas
- Vérifiez les permissions du navigateur
- Utilisez HTTPS (requis pour Web Speech API)
- Essayez Chrome/Edge pour une meilleure compatibilité

### Pas de son lors de la lecture
- Vérifiez la clé API ElevenLabs
- Vérifiez le bouton mute (🔇)
- Vérifiez le volume système

### Transcription incorrecte
- Parlez clairement et distinctement
- Réduisez les bruits de fond
- Vérifiez la langue de reconnaissance (FR par défaut)

## 🚀 Améliorations futures

- [ ] Support de plus de langues
- [ ] Choix de voix (masculine/féminine)
- [ ] Historique des conversations vocales
- [ ] Export audio des réponses
- [ ] Raccourcis clavier
- [ ] Visualisation avancée des fréquences

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement Gliitz.

---

**Gliitz Voice Chat** - Votre concierge de luxe, maintenant en vocal. ✨🎙️

