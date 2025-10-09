import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, X, Volume2 } from 'lucide-react'

const VoiceInterface = ({ isOpen, onClose, onTranscription }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioLevels, setAudioLevels] = useState([])
  const recognitionRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      initializeSpeechRecognition()
    } else {
      cleanup()
    }

    return () => cleanup()
  }, [isOpen])

  useEffect(() => {
    if (isListening) {
      startAudioVisualization()
    } else {
      stopAudioVisualization()
    }
  }, [isListening])

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'fr-FR'

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognitionRef.current.onresult = (event) => {
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

      setTranscript(finalTranscript + interimTranscript)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      if (transcript.trim()) {
        setIsProcessing(true)
        setTimeout(() => {
          onTranscription(transcript.trim())
          setIsProcessing(false)
          onClose()
        }, 1000)
      }
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    stopAudioVisualization()
  }

  const startAudioVisualization = () => {
    const levels = []
    for (let i = 0; i < 20; i++) {
      levels.push(Math.random() * 100)
    }
    setAudioLevels(levels)

    const animate = () => {
      setAudioLevels(prev => prev.map(() => Math.random() * 100))
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
  }

  const stopAudioVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setAudioLevels([])
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClose}
    >
      <div 
        className="relative p-8 rounded-3xl max-w-md w-full mx-4"
        style={{
          background: 'rgba(11, 11, 12, 0.95)',
          border: '1px solid rgba(192, 192, 192, 0.2)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#C0C0C0'
          }}
        >
          <X size={20} />
        </button>

        {/* Audio visualization */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-1">
            {audioLevels.map((level, index) => (
              <div
                key={index}
                className="rounded-full"
                style={{
                  width: '4px',
                  height: `${Math.max(level, 10)}px`,
                  background: isListening 
                    ? 'linear-gradient(180deg, #C0C0C0, #A0A0A0)' 
                    : '#C0C0C0',
                  transition: 'all 0.1s ease',
                  animation: isListening ? 'pulse 0.5s ease-in-out infinite' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            {isProcessing ? (
              <div className="relative">
                <Volume2 
                  size={64} 
                  style={{ color: '#C0C0C0' }}
                  className="animate-pulse"
                />
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(192, 192, 192, 0.3) 0%, transparent 70%)',
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                  }}
                />
              </div>
            ) : (
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: isListening 
                      ? 'radial-gradient(circle, rgba(192, 192, 192, 0.4) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(192, 192, 192, 0.2) 0%, transparent 70%)',
                    animation: isListening ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'
                  }}
                />
                {isListening ? (
                  <Mic 
                    size={64} 
                    style={{ color: '#C0C0C0' }}
                    className="animate-pulse"
                  />
                ) : (
                  <MicOff 
                    size={64} 
                    style={{ color: '#C0C0C0' }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Status text */}
          <h3 
            className="text-2xl font-bold mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF'
            }}
          >
            {isProcessing ? 'Traitement...' : isListening ? 'Écoute...' : 'Interface Vocale'}
          </h3>

          <p 
            className="text-lg mb-6"
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            {isProcessing 
              ? 'Analyse de votre message...'
              : isListening 
                ? 'Parlez maintenant'
                : 'Appuyez pour commencer à parler'
            }
          </p>

          {/* Transcript */}
          {transcript && (
            <div 
              className="mb-6 p-4 rounded-xl"
              style={{
                background: 'rgba(192, 192, 192, 0.1)',
                border: '1px solid rgba(192, 192, 192, 0.2)',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                minHeight: '60px'
              }}
            >
              {transcript}
            </div>
          )}

          {/* Control button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className="w-full py-4 px-8 rounded-xl font-semibold transition-all duration-300"
            style={{
              background: isListening 
                ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.8), rgba(185, 28, 28, 0.8))'
                : 'linear-gradient(135deg, rgba(192, 192, 192, 0.8), rgba(192, 192, 192, 0.6))',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)',
              opacity: isProcessing ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(192, 192, 192, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(192, 192, 192, 0.3)'
            }}
          >
            {isProcessing ? 'Traitement...' : isListening ? 'Arrêter' : 'Commencer'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export default VoiceInterface
