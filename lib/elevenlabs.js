// ElevenLabs Voice Integration for Gliitz

class ElevenLabsVoice {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
    this.baseUrl = 'https://api.elevenlabs.io/v1'
    this.voiceId = 'pNInz6obpgDQGcFmaJgB' // Adam voice (elegant and professional)
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
    const audioBlob = await this.textToSpeech(text, options)
    
    if (!audioBlob) {
      console.warn('Could not generate audio')
      return
    }

    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        resolve()
      }
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl)
        reject(error)
      }
      audio.play()
    })
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

