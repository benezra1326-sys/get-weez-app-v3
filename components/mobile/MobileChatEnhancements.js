import { useState, useEffect, useCallback, memo } from 'react'
import { MessageCircle, Send, Mic, MicOff, X, ChevronDown } from 'lucide-react'
import { useMobileOptimizations, useTouchOptimizations } from './MobileOptimizations'

/**
 * Composant de chat mobile optimisé avec gestes tactiles
 */
export const MobileChatEnhanced = memo(({ 
  messages = [], 
  onSend, 
  isLoading = false,
  placeholder = "Tapez votre message...",
  className = ""
}) => {
  const { isTouchDevice } = useMobileOptimizations()
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchOptimizations()
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputHeight, setInputHeight] = useState(40)

  // Gestion du swipe pour fermer le clavier
  const handleTouchEnd = useCallback((e) => {
    const result = onTouchEnd()
    if (result?.isLeftSwipe && input.trim()) {
      // Swipe gauche pour envoyer
      handleSend()
    }
  }, [onTouchEnd, input, onSend])

  const handleSend = useCallback(() => {
    if (input.trim() && !isLoading) {
      onSend(input.trim())
      setInput('')
      setInputHeight(40)
    }
  }, [input, isLoading, onSend])

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value)
    // Auto-resize du textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 120)
    textarea.style.height = `${newHeight}px`
    setInputHeight(newHeight)
  }, [])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  // Suggestions rapides pour mobile
  const quickSuggestions = [
    "Restaurants près de moi",
    "Événements ce soir",
    "Services de transport",
    "Réservation table"
  ]

  return (
    <>
      <style jsx>{`
        .mobile-chat-input {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-chat-input:focus-within {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
        }
        
        .mobile-chat-input textarea {
          font-size: 16px; /* Empêche le zoom sur iOS */
          line-height: 1.4;
          resize: none;
          border: none;
          outline: none;
          background: transparent;
          padding: 12px 16px;
          width: 100%;
          min-height: 40px;
          max-height: 120px;
        }
        
        .mobile-send-button {
          position: absolute;
          right: 8px;
          bottom: 8px;
          width: 32px;
          height: 32px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .mobile-send-button:active {
          transform: scale(0.95);
        }
        
        .mobile-suggestions {
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          margin-bottom: 8px;
          padding: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transform: translateY(10px);
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        
        .mobile-suggestions.show {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        
        .suggestion-chip {
          display: inline-block;
          padding: 6px 12px;
          margin: 2px;
          background: rgba(139, 92, 246, 0.1);
          color: #C0C0C0;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .suggestion-chip:active {
          transform: scale(0.95);
          background: rgba(139, 92, 246, 0.2);
        }
        
        .mobile-voice-button {
          position: absolute;
          left: 8px;
          bottom: 8px;
          width: 32px;
          height: 32px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .mobile-voice-button.recording {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .mobile-message {
          margin-bottom: 12px;
          animation: slideInUp 0.3s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-message.user {
          display: flex;
          justify-content: flex-end;
        }
        
        .mobile-message.assistant {
          display: flex;
          justify-content: flex-start;
        }
        
        .mobile-message-bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 20px;
          word-wrap: break-word;
          line-height: 1.4;
        }
        
        .mobile-message.user .mobile-message-bubble {
          background: linear-gradient(135deg, #E5E5E5, #C0C0C0);
          color: white;
          border-bottom-right-radius: 6px;
        }
        
        .mobile-message.assistant .mobile-message-bubble {
          background: rgba(243, 244, 246, 0.9);
          color: #374151;
          border-bottom-left-radius: 6px;
        }
      `}</style>

      <div className={`mobile-chat-container ${className}`}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`mobile-message ${message.role}`}
            >
              <div className="mobile-message-bubble">
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="mobile-message assistant">
              <div className="mobile-message-bubble">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span>Gliitz réfléchit...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions rapides */}
        {showSuggestions && (
          <div className="mobile-suggestions show">
            <div className="flex flex-wrap">
              {quickSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-chip"
                  onClick={() => {
                    setInput(suggestion)
                    setShowSuggestions(false)
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie mobile optimisée */}
        <div className="mobile-chat-input">
          <div className="flex items-end space-x-2 p-2">
            {/* Bouton vocal */}
            <button
              className="mobile-voice-button"
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? "Arrêter l'enregistrement" : "Enregistrement vocal"}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* Zone de texte */}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={handleTouchEnd}
                placeholder={placeholder}
                className="w-full"
                rows={1}
                disabled={isLoading}
              />
              
              {/* Bouton d'envoi */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="mobile-send-button"
                style={{
                  backgroundColor: input.trim() ? '#C0C0C0' : '#D1D5DB',
                  color: 'white'
                }}
              >
                <Send size={16} />
              </button>
            </div>

            {/* Bouton suggestions */}
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
            >
              <ChevronDown 
                size={16} 
                className={`transition-transform ${showSuggestions ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  )
})

MobileChatEnhanced.displayName = 'MobileChatEnhanced'

/**
 * Composant de navigation mobile avec gestes
 */
export const MobileNavigationEnhanced = memo(({ 
  isOpen, 
  onClose, 
  children,
  className = ""
}) => {
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchOptimizations()
  const [dragStart, setDragStart] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = useCallback((e) => {
    setDragStart(e.touches[0].clientX)
    setIsDragging(true)
    onTouchStart(e)
  }, [onTouchStart])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return
    onTouchMove(e)
  }, [isDragging, onTouchMove])

  const handleTouchEnd = useCallback((e) => {
    if (!isDragging) return
    
    const result = onTouchEnd()
    if (result?.isLeftSwipe && result.distance > 100) {
      onClose()
    }
    
    setIsDragging(false)
    setDragStart(null)
  }, [isDragging, onTouchEnd, onClose])

  return (
    <>
      <style jsx>{`
        .mobile-nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          z-index: 50;
          transition: opacity 0.3s ease;
        }
        
        .mobile-nav-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          height: 100dvh;
          width: 320px;
          max-width: 85vw;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 51;
        }
        
        .mobile-nav-panel.open {
          transform: translateX(0);
        }
        
        .mobile-nav-panel.dragging {
          transition: none;
        }
      `}</style>

      {isOpen && (
        <div className="mobile-nav-overlay" onClick={onClose}>
          <div 
            className={`mobile-nav-panel ${isOpen ? 'open' : ''} ${isDragging ? 'dragging' : ''} ${className}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
})

MobileNavigationEnhanced.displayName = 'MobileNavigationEnhanced'

export default {
  MobileChatEnhanced,
  MobileNavigationEnhanced
}
