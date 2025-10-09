import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader } from 'lucide-react'
import { feedbackSystem } from '../../lib/feedbackSystem'

/**
 * Composant de dictée simple intégré dans la barre de chat
 * Permet de dicter du texte au lieu de le taper
 */
export default function SimpleDictation({ 
  onTranscript, 
  isDarkMode,
  disabled = false 
}) {
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Vérifier le support de la reconnaissance vocale
    if (typeof window === 'undefined') return
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false)
      return
    }

    // Initialiser la reconnaissance vocale
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false // Une seule phrase à la fois
    recognition.interimResults = true
    recognition.lang = 'fr-FR'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      feedbackSystem.micOn()
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }
      
      if (final && onTranscript) {
        onTranscript(final)
        setInterimText('')
      } else {
        setInterimText(interim)
      }
    }

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error)
      setIsListening(false)
      setInterimText('')
      
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        feedbackSystem.error()
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
      feedbackSystem.micOff()
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    }
  }, [onTranscript])

  const toggleDictation = () => {
    if (!recognitionRef.current || !isSupported) return

    if (isListening) {
      // Arrêter la dictée
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.error('Erreur arrêt dictée:', e)
      }
    } else {
      // Démarrer la dictée
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.error('Erreur démarrage dictée:', e)
        feedbackSystem.error()
      }
    }
  }

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-3 rounded-xl opacity-50 cursor-not-allowed"
        title="Reconnaissance vocale non supportée"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          background: 'transparent'
        }}
      >
        <MicOff size={22} />
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDictation}
        disabled={disabled}
        className="p-3 rounded-xl transition-all relative"
        style={{
          color: isListening 
            ? '#FFFFFF'
            : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666666'),
          background: isListening 
            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
            : 'transparent'
        }}
        onMouseEnter={(e) => {
          if (!isListening) {
            e.currentTarget.style.background = isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.05)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isListening) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
        title={isListening ? "Arrêter la dictée" : "Dicter le texte"}
      >
        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
        
        {/* Pulsation pendant l'écoute */}
        {isListening && (
          <>
            <span 
              className="absolute inset-0 rounded-xl animate-ping"
              style={{
                background: 'rgba(239, 68, 68, 0.3)',
                animationDuration: '1.5s'
              }}
            />
            <style jsx>{`
              @keyframes ping {
                0% {
                  transform: scale(1);
                  opacity: 0.8;
                }
                50%, 100% {
                  transform: scale(1.5);
                  opacity: 0;
                }
              }
              .animate-ping {
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              }
            `}</style>
          </>
        )}
      </button>

      {/* Texte intermédiaire (preview) */}
      {interimText && (
        <div
          className="absolute bottom-full left-0 mb-2 px-3 py-2 rounded-lg whitespace-nowrap"
          style={{
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${isDarkMode 
              ? 'rgba(192, 192, 192, 0.2)' 
              : 'rgba(192, 192, 192, 0.3)'}`,
            backdropFilter: 'blur(10px)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.85rem',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <div className="flex items-center gap-2">
            <Loader size={14} className="animate-spin" />
            <span style={{ opacity: 0.7 }}>{interimText}</span>
          </div>
        </div>
      )}
    </div>
  )
}

