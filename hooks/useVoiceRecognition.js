import { useState, useCallback, useRef } from 'react'

/**
 * Hook personnalisé pour la reconnaissance vocale
 * Gère l'état et les interactions avec l'API Speech Recognition
 */
export const useVoiceRecognition = (onTranscriptReceived, onError, language = 'fr-FR') => {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  // Vérification du support de la reconnaissance vocale
  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  // Initialisation de la reconnaissance vocale
  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onTranscriptReceived?.(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      let errorMessage = 'Erreur de reconnaissance vocale'
      switch (event.error) {
        case 'network':
          errorMessage = 'Erreur réseau lors de la reconnaissance vocale'
          break
        case 'not-allowed':
          errorMessage = 'Microphone non autorisé'
          break
        case 'no-speech':
          errorMessage = 'Aucun son détecté'
          break
        default:
          errorMessage = 'Erreur de reconnaissance vocale'
      }
      
      onError?.(errorMessage)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    return recognition
  }, [isSupported, language, onTranscriptReceived, onError])

  // Démarrer l'écoute
  const startListening = useCallback(() => {
    if (!isSupported) {
      onError?.('Reconnaissance vocale non supportée')
      return
    }

    if (isListening) {
      return // Déjà en train d'écouter
    }

    try {
      const recognition = initializeRecognition()
      if (recognition) {
        recognitionRef.current = recognition
        recognition.start()
      }
    } catch (error) {
      console.error('Error starting recognition:', error)
      onError?.('Impossible de démarrer la reconnaissance vocale')
    }
  }, [isSupported, isListening, initializeRecognition, onError])

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  // Toggle l'écoute
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening
  }
}

export default useVoiceRecognition
