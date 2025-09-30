import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Hook pour la reconnaissance vocale
 * Utilise l'API Web Speech Recognition
 */
export function useVoiceRecognition(onTranscript, onError, options = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  // Options par défaut
  const defaultOptions = {
    lang: 'fr-FR',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1,
    timeout: 5000 // Timeout en millisecondes
  }

  const config = { ...defaultOptions, ...options }

  // Vérifier le support au chargement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
    }
  }, [])

  // Initialiser la reconnaissance vocale
  const initRecognition = useCallback(() => {
    if (!isSupported) return null

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = config.lang
    recognition.continuous = config.continuous
    recognition.interimResults = config.interimResults
    recognition.maxAlternatives = config.maxAlternatives

    // Événements
    recognition.onstart = () => {
      console.log('🎤 Reconnaissance vocale démarrée')
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      const currentTranscript = finalTranscript || interimTranscript
      setTranscript(currentTranscript)

      // Appeler le callback si on a un résultat final
      if (finalTranscript && onTranscript) {
        onTranscript(finalTranscript.trim())
      }
    }

    recognition.onerror = (event) => {
      console.error('❌ Erreur reconnaissance vocale:', event.error)
      setIsListening(false)
      
      const errorMessages = {
        'network': 'Erreur réseau - vérifiez votre connexion',
        'not-allowed': 'Accès au microphone refusé',
        'no-speech': 'Aucune parole détectée',
        'audio-capture': 'Problème avec le microphone',
        'service-not-allowed': 'Service de reconnaissance non autorisé',
        'bad-grammar': 'Erreur de grammaire',
        'language-not-supported': 'Langue non supportée'
      }

      const message = errorMessages[event.error] || `Erreur: ${event.error}`
      
      if (onError) {
        onError(message)
      }
    }

    recognition.onend = () => {
      console.log('🛑 Reconnaissance vocale terminée')
      setIsListening(false)
    }

    // Timeout automatique
    if (config.timeout) {
      setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognition.stop()
        }
      }, config.timeout)
    }

    return recognition
  }, [isSupported, config, onTranscript, onError, isListening])

  // Démarrer l'écoute
  const startListening = useCallback(() => {
    if (!isSupported) {
      if (onError) {
        onError('La reconnaissance vocale n\'est pas supportée par ce navigateur')
      }
      return
    }

    if (isListening) {
      console.log('⚠️ Reconnaissance vocale déjà en cours')
      return
    }

    try {
      const recognition = initRecognition()
      if (recognition) {
        recognitionRef.current = recognition
        recognition.start()
        setTranscript('')
      }
    } catch (error) {
      console.error('❌ Erreur démarrage reconnaissance:', error)
      if (onError) {
        onError('Impossible de démarrer la reconnaissance vocale')
      }
    }
  }, [isSupported, isListening, initRecognition, onError])

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  // Toggle écoute
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  // Nettoyage
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    
    // Utilitaires
    canUse: isSupported && !isListening,
    status: isListening ? 'listening' : 'idle'
  }
}

export default useVoiceRecognition