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

      // Lire la réponse vocalement si non muted
      if (!isMuted) {
        await elevenLabs.playAudio(reply)
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

          {/* Visual Indicator */}
          <motion.div
            className="relative w-32 h-32 mx-auto mb-8"
            animate={{
              scale: isListening || isSpeaking ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: (isListening || isSpeaking) ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${isDarkMode ? '#C0C0C0' : '#A7C7C5'}`,
                opacity: 0.3
              }}
              animate={{
                scale: isListening ? [1, 1.5, 1] : 1,
                opacity: isListening ? [0.3, 0, 0.3] : 0.3
              }}
              transition={{
                duration: 2,
                repeat: isListening ? Infinity : 0
              }}
            />

            {/* Inner Circle */}
            <motion.div
              className="absolute inset-4 rounded-full flex items-center justify-center"
              style={{
                background: isListening 
                  ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                  : isSpeaking
                    ? 'linear-gradient(135deg, #A7C7C5, #9DB4C0)'
                    : `linear-gradient(135deg, ${isDarkMode ? '#C0C0C0' : '#E5E5E5'}, ${isDarkMode ? '#A8A8A8' : '#C0C0C0'})`,
                boxShadow: isListening || isSpeaking
                  ? '0 0 30px rgba(192, 192, 192, 0.5)'
                  : 'none'
              }}
            >
              {isListening ? <Mic size={32} color="#FFFFFF" /> : 
               isSpeaking ? <Volume2 size={32} color="#FFFFFF" /> :
               <MicOff size={32} color="#FFFFFF" />}
            </motion.div>
          </motion.div>

          {/* Transcript */}
          {(transcript || interimTranscript) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 rounded-xl"
              style={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${isDarkMode 
                  ? 'rgba(192, 192, 192, 0.2)' 
                  : 'rgba(192, 192, 192, 0.3)'}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1.1rem',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  lineHeight: '1.6'
                }}
              >
                {transcript}
                {interimTranscript && (
                  <span style={{ opacity: 0.5 }}>{interimTranscript}</span>
                )}
              </p>
            </motion.div>
          )}

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

