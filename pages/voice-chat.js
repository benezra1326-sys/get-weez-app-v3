import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Mic, MicOff, Play, Pause, X, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContextSimple'
import { elevenLabs } from '../lib/elevenlabs'

export default function VoiceChat({ user }) {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { isDarkMode } = useTheme()
  
  // États
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [aiReply, setAiReply] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  
  // Références
  const recognitionRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const currentAudioRef = useRef(null)

  // Initialisation de la reconnaissance vocale
  useEffect(() => {
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
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript + ' '
          } else {
            interim += transcript
          }
        }
        
        if (final) {
          setTranscript(prev => prev + final)
        }
        setInterimTranscript(interim)
      }

      recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        if (isListening) {
          // Redémarrer automatiquement si on est en mode écoute
          recognition.start()
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Visualisation audio
  const startAudioVisualization = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
    }

    const analyser = analyserRef.current
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average / 255)
      animationFrameRef.current = requestAnimationFrame(updateLevel)
    }

    updateLevel()
  }

  // Démarrer/Arrêter l'écoute
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setInterimTranscript('')
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      setAudioLevel(0)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      startAudioVisualization()
    }
  }

  // Envoyer le message vocal à l'IA
  const sendVoiceMessage = async () => {
    if (!transcript.trim()) return

    setIsLoading(true)
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: transcript }],
          userId: user?.id
        })
      })

      if (!response.ok) throw new Error('Erreur API')

      const data = await response.json()
      const reply = data.message || "Je suis Gliitz, comment puis-je vous aider ?"
      
      setAiReply(reply)
      
      // Lecture audio avec ElevenLabs
      if (!isMuted) {
        setIsSpeaking(true)
        await elevenLabs.playAudio(reply)
        setIsSpeaking(false)
      }
      
    } catch (error) {
      console.error('Erreur:', error)
      setAiReply("Désolé, j'ai rencontré un problème technique. Pouvez-vous répéter ?")
    } finally {
      setIsLoading(false)
    }
  }

  // Rejouer la dernière réponse
  const replayLastResponse = async () => {
    if (!aiReply) return
    
    if (isSpeaking) {
      elevenLabs.stop()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      await elevenLabs.playAudio(aiReply)
      setIsSpeaking(false)
    }
  }

  // Nouvelle conversation
  const resetConversation = () => {
    setTranscript('')
    setInterimTranscript('')
    setAiReply('')
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  // Fermer et retourner au chat
  const handleClose = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    elevenLabs.stop()
    router.push('/')
  }

  return (
    <div 
      className="voice-chat-container"
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: isDarkMode 
          ? 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0B0B0C 100%)'
          : 'radial-gradient(circle at 50% 50%, #f8f9fa 0%, #e9ecef 100%)'
      }}
    >
      {/* Style intégré pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(192, 192, 192, 0.3),
                        0 0 40px rgba(192, 192, 192, 0.2),
                        0 0 60px rgba(192, 192, 192, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(192, 192, 192, 0.5),
                        0 0 60px rgba(192, 192, 192, 0.3),
                        0 0 90px rgba(192, 192, 192, 0.2);
          }
        }

        @keyframes wave {
          0% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.5); }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(192, 192, 192, 0.6);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .audio-wave {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 60px;
        }

        .wave-bar {
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #C0C0C0 0%, #E5E5E5 100%);
          border-radius: 4px;
          animation: wave 1s ease-in-out infinite;
          transform-origin: center;
        }

        .wave-bar:nth-child(2) { animation-delay: 0.1s; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar:nth-child(4) { animation-delay: 0.3s; }
        .wave-bar:nth-child(5) { animation-delay: 0.4s; }

        .control-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .control-button:hover {
          transform: scale(1.1);
        }

        .control-button.active {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .ripple-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(192, 192, 192, 0.5);
          animation: ripple 1.5s ease-out infinite;
        }

        .subtitle-box {
          background: ${isDarkMode 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(255, 255, 255, 0.9)'};
          backdrop-filter: blur(20px);
          border: 1px solid ${isDarkMode 
            ? 'rgba(192, 192, 192, 0.2)' 
            : 'rgba(192, 192, 192, 0.3)'};
          border-radius: 20px;
          padding: 24px;
          min-height: 120px;
          max-height: 300px;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(192, 192, 192, 0.3);
          border-radius: 3px;
        }
      `}</style>

      {/* Particules animées en arrière-plan */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Bouton Fermer */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 50,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'
          e.currentTarget.style.color = '#FFFFFF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'
          e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#0B0B0C'
        }}
      >
        <X size={24} />
      </button>

      {/* Contenu principal */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px'
        }}
      >
        {/* Logo et titre */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Sparkles
            size={64}
            style={{
              color: '#C0C0C0',
              marginBottom: '16px',
              filter: 'drop-shadow(0 0 20px rgba(192, 192, 192, 0.5))'
            }}
          />
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2.5rem',
              fontWeight: '700',
              color: isDarkMode ? '#E5E5E5' : '#0B0B0C',
              marginBottom: '8px',
              textShadow: isDarkMode ? '0 0 30px rgba(192, 192, 192, 0.3)' : 'none'
            }}
          >
            Gliitz Voice
          </h1>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1rem',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              fontWeight: '300'
            }}
          >
            Parlez naturellement, je vous écoute...
          </p>
        </div>

        {/* Visualisation audio centrale */}
        <div
          style={{
            marginBottom: '48px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {(isListening || isSpeaking) && (
            <>
              <div className="ripple-effect" />
              <div className="audio-wave">
                <div className="wave-bar" style={{ height: `${30 + audioLevel * 30}px` }} />
                <div className="wave-bar" style={{ height: `${40 + audioLevel * 40}px` }} />
                <div className="wave-bar" style={{ height: `${50 + audioLevel * 50}px` }} />
                <div className="wave-bar" style={{ height: `${40 + audioLevel * 40}px` }} />
                <div className="wave-bar" style={{ height: `${30 + audioLevel * 30}px` }} />
              </div>
            </>
          )}
          {!isListening && !isSpeaking && (
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.3)'} 0%, transparent 70%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={48} style={{ color: '#C0C0C0', opacity: 0.6 }} />
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '48px'
          }}
        >
          {/* Bouton Micro */}
          <div
            className={`control-button ${isListening ? 'active' : ''}`}
            onClick={toggleListening}
            style={{
              background: isListening
                ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                : `linear-gradient(135deg, ${isDarkMode ? '#C0C0C0' : '#E5E5E5'}, ${isDarkMode ? '#A8A8A8' : '#C0C0C0'})`,
              border: isListening ? 'none' : `2px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.5)'}`,
              color: '#FFFFFF'
            }}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </div>

          {/* Bouton Play/Pause */}
          {aiReply && (
            <div
              className="control-button"
              onClick={replayLastResponse}
              style={{
                background: `linear-gradient(135deg, ${isDarkMode ? '#A7C7C5' : '#9DB4C0'}, ${isDarkMode ? '#9DB4C0' : '#8CA0A8'})`,
                border: 'none',
                color: '#FFFFFF',
                width: '64px',
                height: '64px'
              }}
            >
              {isSpeaking ? <Pause size={24} /> : <Play size={24} />}
            </div>
          )}

          {/* Bouton Muet */}
          <div
            className="control-button"
            onClick={() => setIsMuted(!isMuted)}
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
              border: `2px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.3)'}`,
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
              width: '56px',
              height: '56px'
            }}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </div>
        </div>

        {/* Sous-titres utilisateur */}
        {(transcript || interimTranscript) && (
          <div className="subtitle-box custom-scrollbar" style={{ marginBottom: '24px', width: '100%', maxWidth: '800px' }}>
            <div style={{ marginBottom: '12px' }}>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#C0C0C0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Vous
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                margin: 0
              }}
            >
              {transcript}
              {interimTranscript && (
                <span style={{ opacity: 0.5 }}>{interimTranscript}</span>
              )}
            </p>
            {transcript && !isLoading && (
              <button
                onClick={sendVoiceMessage}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #A7C7C5, #9DB4C0)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(167, 199, 197, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(167, 199, 197, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(167, 199, 197, 0.4)'
                }}
              >
                Envoyer
              </button>
            )}
          </div>
        )}

        {/* Loader */}
        {isLoading && (
          <div style={{ marginBottom: '24px' }}>
            <div className="audio-wave">
              <div className="wave-bar" style={{ height: '30px' }} />
              <div className="wave-bar" style={{ height: '40px' }} />
              <div className="wave-bar" style={{ height: '50px' }} />
              <div className="wave-bar" style={{ height: '40px' }} />
              <div className="wave-bar" style={{ height: '30px' }} />
            </div>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.9rem',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                marginTop: '16px',
                textAlign: 'center'
              }}
            >
              Gliitz réfléchit...
            </p>
          </div>
        )}

        {/* Réponse IA */}
        {aiReply && (
          <div className="subtitle-box custom-scrollbar" style={{ width: '100%', maxWidth: '800px' }}>
            <div style={{ marginBottom: '12px' }}>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#C0C0C0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Gliitz
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                margin: 0,
                whiteSpace: 'pre-wrap'
              }}
            >
              {aiReply}
            </p>
          </div>
        )}

        {/* Bouton Nouvelle conversation */}
        {(transcript || aiReply) && (
          <button
            onClick={resetConversation}
            style={{
              marginTop: '32px',
              padding: '12px 32px',
              borderRadius: '12px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.3)'}`,
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Nouvelle conversation
          </button>
        )}
      </div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

