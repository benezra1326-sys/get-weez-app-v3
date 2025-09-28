import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Square } from 'lucide-react'

export default function VoiceDictationButton({ 
  onTranscript, 
  onInterimTranscript, 
  disabled = false,
  className = "",
  size = 16
}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState(null)
  const [interimTranscript, setInterimTranscript] = useState('')
  
  const recognitionRef = useRef(null)
  const timeoutRef = useRef(null)

  // Vérifier le support de la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      
      // Configurer la reconnaissance vocale
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'fr-FR' // Langue par défaut
      
      recognition.onstart = () => {
        console.log('🎤 Reconnaissance vocale démarrée')
        setIsListening(true)
        setError(null)
        setInterimTranscript('')
      }
      
      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          console.log('📝 Transcription finale:', finalTranscript)
          onTranscript?.(finalTranscript)
          setInterimTranscript('')
          
          // Arrêter la reconnaissance après une transcription finale
          setTimeout(() => {
            if (isListening) {
              stopListening()
            }
          }, 1000)
        }
        
        if (interimTranscript) {
          console.log('⏳ Transcription intermédiaire:', interimTranscript)
          setInterimTranscript(interimTranscript)
          onInterimTranscript?.(interimTranscript)
        }
      }
      
      recognition.onerror = (event) => {
        console.error('❌ Erreur reconnaissance vocale:', event.error)
        
        let errorMessage = 'Erreur de reconnaissance vocale'
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'Aucune parole détectée. Essayez à nouveau.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone non disponible'
            break
          case 'not-allowed':
            errorMessage = 'Permission microphone refusée'
            break
          case 'network':
            errorMessage = 'Erreur réseau'
            break
          default:
            errorMessage = `Erreur: ${event.error}`
        }
        
        setError(errorMessage)
        setIsListening(false)
        recognition.stop()
      }
      
      recognition.onend = () => {
        console.log('🛑 Reconnaissance vocale arrêtée')
        setIsListening(false)
        setInterimTranscript('')
      }
      
      recognitionRef.current = recognition
    } else {
      console.warn('⚠️ Reconnaissance vocale non supportée')
      setIsSupported(false)
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [onTranscript, onInterimTranscript, isListening])

  // Démarrer la reconnaissance vocale
  const startListening = () => {
    if (!isSupported || disabled) return
    
    try {
      setError(null)
      recognitionRef.current.start()
      
      // Timeout de sécurité après 30 secondes
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          stopListening()
        }
      }, 30000)
      
    } catch (err) {
      console.error('❌ Erreur lors du démarrage:', err)
      setError('Impossible de démarrer la reconnaissance vocale')
    }
  }

  // Arrêter la reconnaissance vocale
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // Gérer le clic sur le bouton
  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Si la reconnaissance vocale n'est pas supportée
  if (!isSupported) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          ${className}
          relative p-2 rounded-full transition-all duration-200
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        title={isListening ? 'Arrêter la dictée vocale' : 'Commencer la dictée vocale'}
      >
        {isListening ? (
          <MicOff size={size} />
        ) : (
          <Mic size={size} />
        )}
        
        {/* Indicateur d'écoute */}
        {isListening && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </button>
      
      {/* Affichage de la transcription intermédiaire */}
      {interimTranscript && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap">
          {interimTranscript}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800" />
        </div>
      )}
      
      {/* Affichage des erreurs */}
      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-red-500 text-white text-xs rounded-lg whitespace-nowrap max-w-xs">
          {error}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-500" />
        </div>
      )}
      
      {/* Instructions */}
      {!isListening && !error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          Cliquez pour dicter
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  )
}
