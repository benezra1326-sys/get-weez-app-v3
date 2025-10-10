// ElevenLabs Voice Integration for Gliitz

class ElevenLabsVoice {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
    this.baseUrl = 'https://api.elevenlabs.io/v1'
    
    // Voix disponibles
    this.voices = {
      victoire: 'O31r762Gb3WFygrEOGh0', // Victoire (voix féminine française)
      sebas: '5jCmrHdxbpU36l1wb3Ke' // Sébas (voix masculine française)
    }
    
    // Voix par défaut (Victoire)
    this.voiceId = this.getVoiceId()
    this.currentAudio = null // Track current audio instance
  }
  
  // Obtenir l'ID de la voix selon la préférence utilisateur
  getVoiceId() {
    if (typeof window !== 'undefined') {
      const preference = localStorage.getItem('gliitz_voice_preference') || 'victoire'
      return this.voices[preference] || this.voices.victoire
    }
    
    return this.voices.victoire // Par défaut
  }

  async textToSpeech(text, options = {}) {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not configured')
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: options.modelId || 'eleven_monolingual_v1',
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarityBoost || 0.75,
            style: options.style || 0.5,
            use_speaker_boost: true
          }
        })
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      return audioBlob
    } catch (error) {
      console.error('Error with ElevenLabs:', error)
      return null
    }
  }

  async playAudio(text, options = {}) {
    // Stop any currently playing audio
    this.stop()
    
    if (!this.apiKey) {
      console.error('❌ ElevenLabs API key not configured')
      throw new Error('ElevenLabs API key not configured')
    }
    
    // Mettre à jour la voix avant de jouer
    this.voiceId = this.getVoiceId()
    console.log('🎙️ Utilisation de la voix ElevenLabs:', this.voiceId)
    
    const audioBlob = await this.textToSpeech(text, options)
    
    if (!audioBlob) {
      throw new Error('Failed to generate audio with ElevenLabs')
    }

    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    this.currentAudio = audio
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        this.currentAudio = null
        resolve()
      }
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl)
        this.currentAudio = null
        reject(error)
      }
      
      // Jouer l'audio
      audio.play().catch(reject)
    })
  }

  // Fallback vers Web Speech API
  playWithWebSpeech(text) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Arrêter toute synthèse en cours
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      // Essayer de trouver une voix française
      const voices = speechSynthesis.getVoices()
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') || 
        voice.name.includes('French') || 
        voice.name.includes('français')
      )
      
      if (frenchVoice) {
        utterance.voice = frenchVoice
        console.log('🔊 Utilisation de la voix:', frenchVoice.name)
      } else {
        console.log('🔊 Voix française non trouvée, utilisation de la voix par défaut')
      }
      
      utterance.onend = () => {
        console.log('✅ Synthèse vocale terminée')
        resolve()
      }
      
      utterance.onerror = (error) => {
        console.error('❌ Erreur synthèse vocale:', error)
        reject(error)
      }
      
      console.log('🎤 Démarrage synthèse vocale Web Speech API')
      speechSynthesis.speak(utterance)
    })
  }

  // Stop currently playing audio
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
  }

  // Pause currently playing audio
  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause()
    }
  }

  // Resume paused audio
  resume() {
    if (this.currentAudio) {
      this.currentAudio.play()
    }
  }

  // Check if audio is currently playing
  isPlaying() {
    return this.currentAudio && !this.currentAudio.paused
  }

  // Speech to Text using browser's built-in Web Speech API
  startSpeechRecognition(onResult, onEnd) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported')
      return null
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'fr-FR'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      if (onResult) onResult(transcript)
    }

    recognition.onend = () => {
      if (onEnd) onEnd()
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (onEnd) onEnd()
    }

    recognition.start()
    return recognition
  }
}

// Export singleton instance
export const elevenLabs = new ElevenLabsVoice()

export default elevenLabs

