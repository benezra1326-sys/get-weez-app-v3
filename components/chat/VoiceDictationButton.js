// 🎤 BOUTON DICTÉE VOCALE - COMME CHATGPT
// Objectif : Bouton pour dicter du texte au lieu d'écrire

import { useState, useEffect } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { voiceDictation } from '../../lib/voice-dictation'

export default function VoiceDictationButton({ onTranscript, onInterimTranscript, disabled = false }) {
  const [isListening, setIsListening] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [interimText, setInterimText] = useState('')

  useEffect(() => {
    initializeDictation()
  }, [])

  // === INITIALISER LA DICTÉE ===
  const initializeDictation = async () => {
    try {
      const initialized = await voiceDictation.initializeDictation()
      if (initialized) {
        voiceDictation.setCallbacks({
          onTranscript: (text) => {
            if (onTranscript) {
              onTranscript(text)
            }
          },
          onInterimTranscript: (text) => {
            setInterimText(text)
            if (onInterimTranscript) {
              onInterimTranscript(text)
            }
          }
        })
        setIsInitialized(true)
      }
    } catch (error) {
      console.error('Erreur initialisation dictée:', error)
    }
  }

  // === BASCULER LA DICTÉE ===
  const toggleDictation = () => {
    if (!isInitialized || disabled) return

    if (isListening) {
      voiceDictation.stopDictation()
      setIsListening(false)
      setInterimText('')
    } else {
      voiceDictation.startDictation()
      setIsListening(true)
    }
  }

  return (
    <div className="voice-dictation-container">
      {/* Bouton de dictée */}
      <button
        onClick={toggleDictation}
        disabled={!isInitialized || disabled}
        className={`voice-dictation-button ${isListening ? 'listening' : ''}`}
        style={{
          backgroundColor: isListening ? '#ef4444' : '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isInitialized && !disabled ? 'pointer' : 'not-allowed',
          opacity: isInitialized && !disabled ? 1 : 0.5,
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
        title={isListening ? 'Arrêter la dictée' : 'Commencer la dictée'}
      >
        {!isInitialized ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isListening ? (
          <MicOff size={16} />
        ) : (
          <Mic size={16} />
        )}
      </button>

      {/* Indicateur de dictée en cours */}
      {isListening && (
        <div className="dictation-indicator">
          <div className="pulse-dot"></div>
          <span>Dictée en cours...</span>
        </div>
      )}

      {/* Transcription intermédiaire */}
      {interimText && (
        <div className="interim-transcript">
          <div className="transcript-label">Transcription :</div>
          <div className="transcript-text">{interimText}</div>
        </div>
      )}

      <style jsx>{`
        .voice-dictation-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .voice-dictation-button {
          transition: all 0.2s ease;
        }

        .voice-dictation-button:hover {
          transform: scale(1.05);
        }

        .voice-dictation-button.listening {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .dictation-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          background: #ef4444;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse-dot 1s infinite;
        }

        @keyframes pulse-dot {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .interim-transcript {
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 12px;
          box-shadow: var(--shadow-md);
          z-index: 10;
          max-width: 300px;
        }

        .transcript-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary);
          margin-bottom: 4px;
        }

        .transcript-text {
          font-size: 14px;
          color: var(--color-text-primary);
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
