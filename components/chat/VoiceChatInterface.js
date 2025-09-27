// 🎤 INTERFACE CHAT VOCAL - COMME CHATGPT
// Objectif : Interface pour l'agent vocal

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react'
import { voiceAgent } from '../../lib/voice-agent'

export default function VoiceChatInterface({ onVoiceMessage, onVoiceResponse }) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [voiceStatus, setVoiceStatus] = useState({})
  const voiceAgentRef = useRef(null)

  useEffect(() => {
    // Initialiser l'agent vocal
    voiceAgentRef.current = voiceAgent
    initializeVoiceAgent()
  }, [])

  // === INITIALISER L'AGENT VOCAL ===
  const initializeVoiceAgent = async () => {
    try {
      const initialized = await voiceAgent.initializeVoiceAgent()
      if (initialized) {
        setIsVoiceEnabled(true)
        updateVoiceStatus()
      }
    } catch (error) {
      console.error('Erreur initialisation agent vocal:', error)
    }
  }

  // === METTRE À JOUR LE STATUT ===
  const updateVoiceStatus = () => {
    const status = voiceAgent.getAgentStatus()
    setVoiceStatus(status)
    setIsListening(status.isListening)
    setIsSpeaking(status.isSpeaking)
  }

  // === DÉMARRER L'ÉCOUTE ===
  const startListening = async () => {
    try {
      const started = await voiceAgent.startVoiceAgent()
      if (started) {
        setIsListening(true)
        updateVoiceStatus()
      }
    } catch (error) {
      console.error('Erreur démarrage écoute:', error)
    }
  }

  // === ARRÊTER L'ÉCOUTE ===
  const stopListening = () => {
    voiceAgent.stopListening()
    setIsListening(false)
    updateVoiceStatus()
  }

  // === DÉMARRER LA PAROLE ===
  const startSpeaking = async (text) => {
    try {
      setIsSpeaking(true)
      await voiceAgent.speakResponse(text)
      setIsSpeaking(false)
      updateVoiceStatus()
    } catch (error) {
      console.error('Erreur parole:', error)
      setIsSpeaking(false)
    }
  }

  // === ARRÊTER LA PAROLE ===
  const stopSpeaking = () => {
    if (voiceAgent.synthesis) {
      voiceAgent.synthesis.cancel()
    }
    setIsSpeaking(false)
    updateVoiceStatus()
  }

  // === BASCULER L'ÉCOUTE ===
  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // === BASCULER LA PAROLE ===
  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking()
    }
  }

  return (
    <div className="voice-chat-interface">
      {/* Contrôles vocaux */}
      <div className="voice-controls">
        <div className="voice-status">
          {isVoiceEnabled ? (
            <div className="status-indicators">
              <div className={`indicator ${isListening ? 'listening' : 'idle'}`}>
                <Mic size={16} />
                <span>{isListening ? 'Écoute...' : 'Prêt'}</span>
              </div>
              <div className={`indicator ${isSpeaking ? 'speaking' : 'idle'}`}>
                <Volume2 size={16} />
                <span>{isSpeaking ? 'Parle...' : 'Silencieux'}</span>
              </div>
            </div>
          ) : (
            <div className="status-error">
              <MicOff size={16} />
              <span>Microphone non disponible</span>
            </div>
          )}
        </div>

        <div className="voice-buttons">
          <button
            onClick={toggleListening}
            disabled={!isVoiceEnabled}
            className={`voice-button ${isListening ? 'active' : ''}`}
            style={{
              backgroundColor: isListening ? '#ef4444' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isVoiceEnabled ? 'pointer' : 'not-allowed',
              opacity: isVoiceEnabled ? 1 : 0.5
            }}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="voice-button stop"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <VolumeX size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Transcription en temps réel */}
      {transcript && (
        <div className="transcript-display">
          <div className="transcript-label">Transcription :</div>
          <div className="transcript-text">{transcript}</div>
        </div>
      )}

      {/* Instructions vocales */}
      <div className="voice-instructions">
        <h3>🎤 Agent Vocal Get Weez</h3>
        <p>Parlez naturellement avec votre concierge IA :</p>
        <ul>
          <li>Cliquez sur le microphone pour commencer</li>
          <li>Parlez clairement et naturellement</li>
          <li>L'IA vous répondra vocalement</li>
          <li>Demandez des réservations, des recommandations</li>
        </ul>
      </div>

      <style jsx>{`
        .voice-chat-interface {
          padding: 20px;
          background: var(--color-bg-secondary);
          border-radius: 12px;
          margin: 20px 0;
        }

        .voice-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .status-indicators {
          display: flex;
          gap: 16px;
        }

        .indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          background: var(--color-bg-primary);
          color: var(--color-text-secondary);
          font-size: 14px;
        }

        .indicator.listening {
          background: #10b981;
          color: white;
        }

        .indicator.speaking {
          background: #8b5cf6;
          color: white;
        }

        .voice-buttons {
          display: flex;
          gap: 12px;
        }

        .voice-button {
          transition: all 0.2s ease;
        }

        .voice-button:hover {
          transform: scale(1.05);
        }

        .voice-button.active {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .transcript-display {
          background: var(--color-bg-primary);
          padding: 16px;
          border-radius: 8px;
          margin: 16px 0;
        }

        .transcript-label {
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 8px;
        }

        .transcript-text {
          color: var(--color-text-secondary);
          font-style: italic;
        }

        .voice-instructions {
          background: var(--color-bg-primary);
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }

        .voice-instructions h3 {
          color: var(--color-text-primary);
          margin-bottom: 12px;
        }

        .voice-instructions p {
          color: var(--color-text-secondary);
          margin-bottom: 12px;
        }

        .voice-instructions ul {
          color: var(--color-text-secondary);
          padding-left: 20px;
        }

        .voice-instructions li {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  )
}
