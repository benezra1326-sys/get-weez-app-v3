// 🎤 DICTÉE VOCALE - COMME CHATGPT
// Objectif : Permettre de dicter du texte au lieu d'écrire

export class VoiceDictation {
  constructor() {
    this.isListening = false
    this.recognition = null
    this.interimTranscript = ''
    this.finalTranscript = ''
    this.onTranscript = null
    this.onInterimTranscript = null
  }

  // === INITIALISER LA DICTÉE ===
  async initializeDictation() {
    try {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = 'fr-FR'
        
        this.recognition.onstart = () => {
          this.isListening = true
          console.log('🎤 Dictée démarrée')
        }

        this.recognition.onresult = (event) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          this.interimTranscript = interimTranscript
          this.finalTranscript += finalTranscript

          // Callback pour transcription intermédiaire
          if (this.onInterimTranscript && interimTranscript) {
            this.onInterimTranscript(interimTranscript)
          }

          // Callback pour transcription finale
          if (this.onTranscript && finalTranscript) {
            this.onTranscript(finalTranscript)
          }
        }

        this.recognition.onerror = (event) => {
          console.error('Erreur dictée:', event.error)
          this.isListening = false
        }

        this.recognition.onend = () => {
          this.isListening = false
          console.log('🎤 Dictée arrêtée')
        }

        return true
      } else {
        console.warn('Reconnaissance vocale non supportée')
        return false
      }
    } catch (error) {
      console.error('Erreur initialisation dictée:', error)
      return false
    }
  }

  // === DÉMARRER LA DICTÉE ===
  startDictation() {
    if (this.recognition && !this.isListening) {
      this.finalTranscript = ''
      this.interimTranscript = ''
      this.recognition.start()
      return true
    }
    return false
  }

  // === ARRÊTER LA DICTÉE ===
  stopDictation() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
      return true
    }
    return false
  }

  // === BASCULER LA DICTÉE ===
  toggleDictation() {
    if (this.isListening) {
      return this.stopDictation()
    } else {
      return this.startDictation()
    }
  }

  // === CONFIGURER LES CALLBACKS ===
  setCallbacks({ onTranscript, onInterimTranscript }) {
    this.onTranscript = onTranscript
    this.onInterimTranscript = onInterimTranscript
  }

  // === OBTENIR LE STATUT ===
  getStatus() {
    return {
      isListening: this.isListening,
      hasRecognition: !!this.recognition,
      interimTranscript: this.interimTranscript,
      finalTranscript: this.finalTranscript
    }
  }

  // === RÉINITIALISER ===
  reset() {
    this.stopDictation()
    this.finalTranscript = ''
    this.interimTranscript = ''
  }
}

// === INSTANCE GLOBALE ===
export const voiceDictation = new VoiceDictation()
