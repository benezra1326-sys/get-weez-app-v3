// 🎵 PARAMÈTRES VOCAUX - SÉLECTION DE VOIX
// Objectif : Permettre de changer la voix de l'agent comme ChatGPT

export class VoiceSettings {
  constructor() {
    this.availableVoices = []
    this.selectedVoice = null
    this.voiceSettings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      lang: 'fr-FR'
    }
  }

  // === CHARGER LES VOIX DISPONIBLES ===
  loadAvailableVoices() {
    if ('speechSynthesis' in window) {
      this.availableVoices = speechSynthesis.getVoices()
      
      // Filtrer les voix françaises
      const frenchVoices = this.availableVoices.filter(voice => 
        voice.lang.startsWith('fr') || voice.lang.includes('French')
      )
      
      // Si pas de voix françaises, prendre toutes les voix
      if (frenchVoices.length === 0) {
        this.availableVoices = this.availableVoices
      } else {
        this.availableVoices = frenchVoices
      }
      
      // Sélectionner la première voix par défaut
      if (this.availableVoices.length > 0) {
        this.selectedVoice = this.availableVoices[0]
      }
      
      return this.availableVoices
    }
    return []
  }

  // === SÉLECTIONNER UNE VOIX ===
  selectVoice(voiceName) {
    const voice = this.availableVoices.find(v => v.name === voiceName)
    if (voice) {
      this.selectedVoice = voice
      return true
    }
    return false
  }

  // === CONFIGURER LES PARAMÈTRES ===
  setVoiceSettings(settings) {
    this.voiceSettings = { ...this.voiceSettings, ...settings }
  }

  // === OBTENIR LA VOIX SÉLECTIONNÉE ===
  getSelectedVoice() {
    return this.selectedVoice
  }

  // === OBTENIR LES PARAMÈTRES ===
  getVoiceSettings() {
    return this.voiceSettings
  }

  // === OBTENIR TOUTES LES VOIX ===
  getAvailableVoices() {
    return this.availableVoices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      localService: voice.localService
    }))
  }

  // === APPLIQUER LES PARAMÈTRES À UN UTTERANCE ===
  applySettingsToUtterance(utterance) {
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice
    }
    
    utterance.rate = this.voiceSettings.rate
    utterance.pitch = this.voiceSettings.pitch
    utterance.volume = this.voiceSettings.volume
    utterance.lang = this.voiceSettings.lang
    
    return utterance
  }

  // === PARLER AVEC LES PARAMÈTRES ===
  speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      this.applySettingsToUtterance(utterance)
      
      speechSynthesis.speak(utterance)
      return true
    }
    return false
  }

  // === ARRÊTER LA PAROLE ===
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      return true
    }
    return false
  }

  // === TESTER UNE VOIX ===
  testVoice(voiceName, testText = "Bonjour, je suis votre concierge IA. Comment puis-je vous aider ?") {
    const voice = this.availableVoices.find(v => v.name === voiceName)
    if (voice) {
      const utterance = new SpeechSynthesisUtterance(testText)
      utterance.voice = voice
      utterance.rate = this.voiceSettings.rate
      utterance.pitch = this.voiceSettings.pitch
      utterance.volume = this.voiceSettings.volume
      
      speechSynthesis.speak(utterance)
      return true
    }
    return false
  }

  // === RÉINITIALISER ===
  reset() {
    this.selectedVoice = null
    this.voiceSettings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      lang: 'fr-FR'
    }
  }
}

// === INSTANCE GLOBALE ===
export const voiceSettings = new VoiceSettings()
