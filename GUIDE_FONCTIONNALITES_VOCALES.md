# 🎤 Guide des Fonctionnalités Vocales Gliitz

## 📋 Vue d'ensemble

Gliitz dispose maintenant de **DEUX fonctionnalités vocales distinctes** pour s'adapter à tous les usages :

1. **🎤 Dictée Simple** : Pour dicter du texte dans le champ de chat
2. **✨ Mode Vocal Continu** : Pour avoir une vraie conversation vocale avec Gliitz

---

## 1. 🎤 **Dictée Simple (Speech-to-Text)**

### 🎯 Objectif
Remplacer la saisie clavier par la voix pour **dicter du texte** dans le champ de chat.

### 📍 Emplacement
**Bouton Micro (🎤)** à gauche dans la barre de chat (à côté de l'input)

### 🚀 Utilisation
1. **Cliquez sur le micro 🎤**
2. **Parlez** (le bouton devient rouge)
3. **Arrêtez de parler** → Le texte apparaît automatiquement dans le champ
4. **Continuez à taper** ou **cliquez sur Envoyer**

### ✨ Fonctionnalités
- ✅ **Transcription en temps réel** : Voir le texte pendant que vous parlez
- ✅ **Ajout au texte existant** : Le texte dicté s'ajoute à ce que vous avez déjà tapé
- ✅ **Multi-langues** : Détection automatique FR/EN/ES
- ✅ **Feedback visuel** : Animation de pulsation pendant l'écoute
- ✅ **Preview flottant** : Voir le texte intermédiaire au-dessus du bouton

### 🎨 Interface
```
┌─────────────────────────────────────────┐
│ [🎤] [Votre texte ici...]       [✨][➤] │
│  ↑                                       │
│  Dictée Simple                          │
└─────────────────────────────────────────┘
```

### 💡 Cas d'usage
- Dicter un message long sans taper
- Compléter un message déjà commencé
- Ajouter des détails rapidement
- Utilisation mains libres partielle

### 🔧 Caractéristiques Techniques
```javascript
// Fichier: components/chat/SimpleDictation.js
- Mode: continuous = false (une phrase à la fois)
- Langue: fr-FR
- Interim results: true (preview en direct)
- Auto-stop: dès qu'une phrase est détectée
```

---

## 2. ✨ **Mode Vocal Continu (Voice-to-Voice)**

### 🎯 Objectif
Avoir une **vraie conversation vocale** avec Gliitz, comme avec ChatGPT Voice ou un assistant vocal.

### 📍 Emplacement
**Bouton Sparkles (✨)** à gauche dans la barre de chat (à côté du micro)

### 🚀 Utilisation
1. **Cliquez sur le sparkles ✨**
2. **Une page plein écran s'ouvre**
3. **Parlez naturellement**
4. **Attendez 2 secondes de silence** → Message envoyé automatiquement
5. **Gliitz répond vocalement**
6. **L'écoute reprend automatiquement** → Conversation continue

### ✨ Fonctionnalités
- ✅ **Conversation continue** : Parlez → IA répond → Parlez → etc.
- ✅ **Détection de silence** : Auto-envoi après 2s sans parole
- ✅ **Lecture vocale ElevenLabs** : Voix naturelle et élégante
- ✅ **Interface immersive** : Plein écran avec animations
- ✅ **Visualisation audio** : Onde animée pendant la conversation
- ✅ **Mode mute** : Désactiver la voix tout en gardant la transcription
- ✅ **Historique** : Les messages sont sauvegardés dans l'historique

### 🎨 Interface
```
┌────────────────────────────────────────┐
│              ✨ Gliitz Voice           │
│                                         │
│         🌀  [Onde Audio Animée]        │
│                                         │
│    ┌─────────────────────────────┐    │
│    │ Vous:                        │    │
│    │ "Trouve-moi un restaurant    │    │
│    │  japonais à Marbella"        │    │
│    └─────────────────────────────┘    │
│                                         │
│    ┌─────────────────────────────┐    │
│    │ Gliitz:                      │    │
│    │ "Je vous recommande Nobu...  │    │
│    └─────────────────────────────┘    │
│                                         │
│       [🎤]    [🔊]    [✖]             │
└────────────────────────────────────────┘
```

### 💡 Cas d'usage
- Conversation naturelle complète
- Mains libres total (voiture, cuisine, etc.)
- Planification d'événements en parlant
- Recherche d'établissements vocalement

### 🔧 Caractéristiques Techniques
```javascript
// Fichier: components/chat/VoiceToVoiceMode.js
- Mode: continuous = true (conversation)
- Détection silence: 2000ms (2 secondes)
- Auto-restart: après chaque réponse
- TTS: ElevenLabs API
- Historique: intégré automatiquement
```

---

## 📊 Comparaison des Deux Modes

| Caractéristique | 🎤 Dictée Simple | ✨ Vocal Continu |
|----------------|------------------|------------------|
| **Icône** | Micro 🎤 | Sparkles ✨ |
| **Emplacement** | Barre de chat | Page plein écran |
| **Objectif** | Dicter du texte | Conversation vocale |
| **Mode** | Phrase par phrase | Continu |
| **Transcription** | ✅ Oui | ✅ Oui |
| **Lecture vocale** | ❌ Non | ✅ Oui (ElevenLabs) |
| **Auto-envoi** | ❌ Non (manuel) | ✅ Oui (2s silence) |
| **Conversation** | ❌ Non | ✅ Oui (automatique) |
| **Édition texte** | ✅ Avant envoi | ❌ Direct |
| **Mains libres** | 🔵 Partiel | 🟢 Total |
| **Historique** | ✅ Sauvegardé | ✅ Sauvegardé |

---

## 🎯 Quand Utiliser Chaque Mode ?

### Utilisez 🎤 **Dictée Simple** si :
- ✅ Vous voulez **dicter un message long** sans taper
- ✅ Vous voulez **relire avant d'envoyer**
- ✅ Vous voulez **combiner voix + clavier**
- ✅ Vous êtes dans un **environnement bruyant**
- ✅ Vous voulez **éditer le texte** après dictée

### Utilisez ✨ **Vocal Continu** si :
- ✅ Vous voulez une **vraie conversation** avec Gliitz
- ✅ Vous êtes **occupé** (cuisine, voiture, etc.)
- ✅ Vous préférez **écouter** plutôt que lire
- ✅ Vous voulez une **expérience immersive**
- ✅ Vous cherchez quelque chose **rapidement**

---

## 🔊 Feedback Audio

### Sons Distincts
- **Dictée Simple** :
  - 🔊 Son micro ON : 700Hz → 1000Hz (0.15s)
  - 🔊 Son texte reçu : 900Hz → 600Hz (0.15s)
  
- **Vocal Continu** :
  - 🔊 Son ouverture : 700Hz → 1000Hz (0.15s)
  - 🔊 Son fermeture : 1000Hz → 500Hz (0.12s)
  - 🔊 Son réponse : 900Hz → 600Hz (0.15s)

### Vibrations (Mobile)
- **Dictée** : [15] (courte)
- **Vocal** : [15] → [10] (double)

---

## 🎨 Animations

### Dictée Simple
```css
/* Pulsation rouge pendant écoute */
@keyframes ping {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}
```

### Vocal Continu
```css
/* Onde audio centrale */
@keyframes wave {
  0% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.5); }
}

/* Pulsation du cercle */
@keyframes pulse {
  0%, 100% { scale: 1; }
  50% { scale: 1.1; }
}
```

---

## 🔧 Configuration

### Activer/Désactiver
```javascript
// Dans lib/userPreferences.js
chat: {
  voiceInput: true,    // Activer dictée par défaut
  autoVoice: true,     // Activer lecture vocale auto
}
```

### Changer la Langue
```javascript
// Dans SimpleDictation.js (ligne 50)
recognition.lang = 'fr-FR'  // FR/EN/ES/DE/IT

// Dans VoiceToVoiceMode.js (ligne 32)
recognition.lang = 'fr-FR'
```

### Ajuster le Délai de Silence
```javascript
// Dans VoiceToVoiceMode.js (ligne 90)
if (timeSinceLastSpeech > 2000) {  // 2000ms = 2 secondes
  handleAutoSend()
}
```

---

## 🐛 Troubleshooting

### Dictée Simple ne fonctionne pas
**Problème:** Le bouton est grisé  
**Solution:** Navigateur non supporté → Utilisez Chrome/Edge

**Problème:** Rien ne se passe quand je parle  
**Solution:** Vérifiez les permissions du micro dans le navigateur

**Problème:** Le texte ne s'ajoute pas  
**Solution:** Parlez plus distinctement et attendez la fin de phrase

### Vocal Continu ne fonctionne pas
**Problème:** Pas de son de réponse  
**Solution:** Vérifiez la clé ElevenLabs dans `.env.local`

**Problème:** L'écoute ne reprend pas  
**Solution:** Cliquez manuellement sur le micro pour relancer

**Problème:** Auto-envoi trop rapide/lent  
**Solution:** Ajustez le délai dans `VoiceToVoiceMode.js` (ligne 90)

---

## 📱 Compatibilité

### Navigateurs
| Navigateur | Dictée Simple | Vocal Continu |
|-----------|---------------|---------------|
| Chrome | ✅ Parfait | ✅ Parfait |
| Edge | ✅ Parfait | ✅ Parfait |
| Safari | ✅ Bon | ✅ Bon |
| Firefox | ⚠️ Partiel | ⚠️ Partiel |
| Mobile Chrome | ✅ Bon | ✅ Bon |
| Mobile Safari | ✅ Bon | ✅ Bon |

### Plateformes
- **Desktop** : Toutes fonctionnalités ✅
- **Mobile** : Toutes fonctionnalités + vibrations ✅
- **Tablette** : Toutes fonctionnalités ✅

---

## 🎯 Résumé

### 🎤 Dictée Simple = **Dicter du texte**
- Bouton Micro dans la barre
- Remplace le clavier
- Éditable avant envoi
- Mains libres partiel

### ✨ Vocal Continu = **Conversation vocale**
- Bouton Sparkles plein écran
- Conversation naturelle
- Auto-envoi après silence
- Mains libres total

**Les deux modes sont maintenant disponibles et fonctionnels ! 🎉**

---

**Version:** 2.0  
**Date:** Octobre 2025  
**Status:** ✅ Production Ready

