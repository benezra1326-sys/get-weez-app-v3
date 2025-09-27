// 🎤 AGENT VOCAL IA - COMME CHATGPT
// Objectif : L'IA fonctionne en tant qu'agent vocal

export class VoiceAgent {
  constructor() {
    this.isListening = false
    this.isSpeaking = false
    this.recognition = null
    this.synthesis = null
    this.conversationHistory = []
    this.voiceSettings = {
      voice: 'fr-FR',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    }
  }

  // === INITIALISER L'AGENT VOCAL ===
  async initializeVoiceAgent() {
    try {
      // Initialiser la reconnaissance vocale
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = 'fr-FR'
      }

      // Initialiser la synthèse vocale
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis
      }

      return true
    } catch (error) {
      console.error('Erreur initialisation agent vocal:', error)
      return false
    }
  }

  // === DÉMARRER L'ÉCOUTE ===
  startListening() {
    if (!this.recognition) return false

    this.recognition.onstart = () => {
      this.isListening = true
      console.log('🎤 Écoute démarrée')
    }

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      if (event.results[event.results.length - 1].isFinal) {
        this.handleVoiceInput(transcript)
      }
    }

    this.recognition.onerror = (event) => {
      console.error('Erreur reconnaissance vocale:', event.error)
      this.isListening = false
    }

    this.recognition.onend = () => {
      this.isListening = false
      console.log('🎤 Écoute arrêtée')
    }

    this.recognition.start()
    return true
  }

  // === ARRÊTER L'ÉCOUTE ===
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  // === GÉRER L'ENTRÉE VOCALE ===
  async handleVoiceInput(transcript) {
    console.log('🎤 Transcription:', transcript)
    
    // Ajouter à l'historique
    this.conversationHistory.push({
      type: 'user',
      text: transcript,
      timestamp: new Date().toISOString()
    })

    // Traiter avec l'IA
    const aiResponse = await this.processWithAI(transcript)
    
    // Parler la réponse
    await this.speakResponse(aiResponse)
  }

  // === TRAITER AVEC L'IA ===
  async processWithAI(message) {
    try {
      // Appeler l'API chat existante
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userName: 'Voice User',
          isMember: true,
          conversationHistory: this.conversationHistory.slice(-10)
        }),
      })

      const data = await response.json()
      
      // Ajouter la réponse à l'historique
      this.conversationHistory.push({
        type: 'ai',
        text: data.reply,
        timestamp: new Date().toISOString()
      })

      return data.reply
    } catch (error) {
      console.error('Erreur traitement IA:', error)
      return "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous répéter ?"
    }
  }

  // === PARLER LA RÉPONSE ===
  async speakResponse(text) {
    if (!this.synthesis) return false

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = this.voiceSettings.voice
      utterance.rate = this.voiceSettings.rate
      utterance.pitch = this.voiceSettings.pitch
      utterance.volume = this.voiceSettings.volume

      utterance.onstart = () => {
        this.isSpeaking = true
        console.log('🔊 Parole démarrée')
      }

      utterance.onend = () => {
        this.isSpeaking = false
        console.log('🔊 Parole terminée')
        resolve(true)
      }

      utterance.onerror = (event) => {
        console.error('Erreur synthèse vocale:', event.error)
        this.isSpeaking = false
        resolve(false)
      }

      this.synthesis.speak(utterance)
    })
  }

  // === CONFIGURER LA VOIX ===
  setVoiceSettings(settings) {
    this.voiceSettings = { ...this.voiceSettings, ...settings }
  }

  // === OBTENIR LES VOIX DISPONIBLES ===
  getAvailableVoices() {
    if (!this.synthesis) return []
    
    return this.synthesis.getVoices().map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default
    }))
  }

  // === DÉMARRER L'AGENT VOCAL ===
  async startVoiceAgent() {
    const initialized = await this.initializeVoiceAgent()
    if (initialized) {
      return this.startListening()
    }
    return false
  }

  // === ARRÊTER L'AGENT VOCAL ===
  stopVoiceAgent() {
    this.stopListening()
    if (this.synthesis) {
      this.synthesis.cancel()
    }
    this.isListening = false
    this.isSpeaking = false
  }

  // === ÉTAT DE L'AGENT ===
  getAgentStatus() {
    return {
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      hasRecognition: !!this.recognition,
      hasSynthesis: !!this.synthesis,
      conversationLength: this.conversationHistory.length
    }
  }

  // === RÉINITIALISER ===
  reset() {
    this.stopVoiceAgent()
    this.conversationHistory = []
  }
}

// === INSTANCE GLOBALE ===
export const voiceAgent = new VoiceAgent()
