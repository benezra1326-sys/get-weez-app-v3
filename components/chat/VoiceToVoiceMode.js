import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { elevenLabs } from '../../lib/elevenlabs'

export default function VoiceToVoiceMode({ isOpen, onClose, onMessage }) {
  const { isDarkMode } = useTheme()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  const [silenceTimer, setSilenceTimer] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  
  const recognitionRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const lastSpeechTimeRef = useRef(Date.now())

  // Initialiser la reconnaissance vocale avec détection de silence
  useEffect(() => {
    if (!isOpen) return

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'fr-FR'
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        let interim = ''
        let final = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcriptText + ' '
            lastSpeechTimeRef.current = Date.now()
          } else {
            interim += transcriptText
            lastSpeechTimeRef.current = Date.now()
          }
        }
        
        if (final) {
          setTranscript(prev => prev + final)
        }
        setInterimTranscript(interim)
      }

      recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error)
      }

      recognition.onend = () => {
        if (isListening) {
          recognition.start()
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current)
      }
    }
  }, [isOpen])

  // Détection du silence
  useEffect(() => {
    if (!isListening) return

    silenceTimerRef.current = setInterval(() => {
      const now = Date.now()
      const timeSinceLastSpeech = now - lastSpeechTimeRef.current
      
      // Si 2 secondes de silence et on a une transcription
      if (timeSinceLastSpeech > 2000 && transcript.trim().length > 0) {
        handleAutoSend()
      }
    }, 500)

    return () => {
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current)
      }
    }
  }, [isListening, transcript])

  // Démarrer l'écoute automatiquement en mode voice-to-voice
  useEffect(() => {
    if (isOpen && !isListening && !isSpeaking) {
      startListening()
    }
  }, [isOpen, isSpeaking])

  const startListening = () => {
    if (!recognitionRef.current) return
    
    try {
      recognitionRef.current.start()
      setIsListening(true)
      lastSpeechTimeRef.current = Date.now()
    } catch (error) {
      console.error('Erreur démarrage reconnaissance:', error)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleAutoSend = async () => {
    if (!transcript.trim()) return

    stopListening()
    setIsSpeaking(true)

    try {
      // Envoyer le message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: transcript }]
        })
      })

      if (!response.ok) throw new Error('Erreur API')

      const data = await response.json()
      const reply = data.message || "Je suis désolé, je n'ai pas compris."
      
      // Notifier le parent
      if (onMessage) {
        onMessage({ user: transcript, assistant: reply })
      }

      // Lire la réponse vocalement si non muted - UNIQUEMENT ElevenLabs
      if (!isMuted) {
        console.log('🔊 Lecture de la réponse vocale avec ElevenLabs...')
        setIsSpeaking(true)
        
        try {
          await elevenLabs.playAudio(reply)
          console.log('✅ Audio ElevenLabs joué avec succès')
        } catch (error) {
          console.error('❌ Erreur ElevenLabs:', error)
          // Afficher l'erreur à l'utilisateur mais ne pas utiliser de fallback
          console.error('Impossible de lire l\'audio. Vérifiez votre clé API ElevenLabs.')
        }
        
        setIsSpeaking(false)
      }

      // Réinitialiser et relancer l'écoute
      setTranscript('')
      setInterimTranscript('')
      setIsSpeaking(false)
      
      // Redémarrer l'écoute automatiquement après la réponse
      setTimeout(() => {
        if (isOpen) {
          startListening()
        }
      }, 500)

    } catch (error) {
      console.error('Erreur:', error)
      setIsSpeaking(false)
    }
  }

  const handleManualSend = () => {
    handleAutoSend()
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: isDarkMode 
            ? 'rgba(11, 11, 12, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-full transition-all"
          style={{
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.05)',
            border: `1px solid ${isDarkMode 
              ? 'rgba(192, 192, 192, 0.2)' 
              : 'rgba(192, 192, 192, 0.3)'}`,
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="w-full max-w-2xl text-center">
          {/* Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Sparkles 
              size={48} 
              className="mx-auto mb-4"
              style={{ 
                color: '#C0C0C0',
                filter: 'drop-shadow(0 0 10px rgba(192, 192, 192, 0.5))'
              }}
            />
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                fontWeight: '700',
                color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
                marginBottom: '8px'
              }}
            >
              Mode Vocal Continu
            </h2>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1rem',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontWeight: '300'
              }}
            >
              {isListening ? "Je vous écoute..." : isSpeaking ? "Gliitz répond..." : "En pause"}
            </p>
          </motion.div>

          {/* Visual Indicator - Sparkles avec ondes sonores */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Ondes sonores - 5 cercles concentriques */}
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2"
                style={{
                  inset: `${i * 16}px`,
                  borderColor: isDarkMode ? '#A7C7C5' : '#9DB4C0',
                  opacity: 0.15
                }}
                animate={isListening || isSpeaking ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.4, 0.15]
                } : {}}
                transition={{
                  duration: 2.5,
                  delay: i * 0.2,
                  repeat: (isListening || isSpeaking) ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Cercle central avec icône Sparkles */}
            <motion.div
              className="absolute inset-16 rounded-full flex items-center justify-center"
              style={{
                background: isListening 
                  ? 'linear-gradient(135deg, #A7C7C5, #9DB4C0)'
                  : isSpeaking
                    ? 'linear-gradient(135deg, #C0C0C0, #A8A8A8)'
                    : `linear-gradient(135deg, ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.3)'}, ${isDarkMode ? 'rgba(168, 168, 168, 0.2)' : 'rgba(168, 168, 168, 0.3)'})`,
                boxShadow: isListening || isSpeaking
                  ? '0 0 50px rgba(167, 199, 197, 0.6)'
                  : 'none',
                border: `2px solid ${isDarkMode ? '#C0C0C0' : '#A7C7C5'}`
              }}
              animate={isListening || isSpeaking ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 50px rgba(167, 199, 197, 0.6)',
                  '0 0 80px rgba(167, 199, 197, 0.8)',
                  '0 0 50px rgba(167, 199, 197, 0.6)'
                ]
              } : {}}
              transition={{
                duration: 1.5,
                repeat: (isListening || isSpeaking) ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <Sparkles 
                size={64} 
                color="#FFFFFF"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
                }}
              />
            </motion.div>

            {/* Particules animées autour du cercle */}
            {(isListening || isSpeaking) && [0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: '#C0C0C0',
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'center'
                }}
                animate={{
                  x: [0, Math.cos(angle * Math.PI / 180) * 100],
                  y: [0, Math.sin(angle * Math.PI / 180) * 100],
                  opacity: [0.8, 0],
                  scale: [1, 0.5]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Info Text - Simulation appel téléphonique */}
          <p
            className="mt-6"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1rem',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: '1.6'
            }}
          >
            {isListening 
              ? "🎤 Je vous écoute..."
              : isSpeaking
                ? "💬 Gliitz répond..."
                : "📞 Conversation vocale active"}
          </p>

          {/* Petit indicateur mute discret */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMuted(!isMuted)}
            className="mt-4 px-4 py-2 rounded-full text-xs"
            style={{
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              border: `1px solid ${isDarkMode 
                ? 'rgba(192, 192, 192, 0.15)' 
                : 'rgba(192, 192, 192, 0.2)'}`,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {isMuted ? '🔇 Son désactivé' : '🔊 Son activé'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

