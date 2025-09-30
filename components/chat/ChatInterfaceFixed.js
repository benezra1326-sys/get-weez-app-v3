import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useTranslation } from 'next-i18next'
import { MessageCircle, Send } from 'lucide-react'
import { useToast } from '../ui/Toast'
import MobileChatInterface from './MobileChatInterface'

const ChatInterfaceFixed = ({ user, initialMessage, establishmentName }) => {
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Effet pour pré-remplir le message de réservation
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }, [initialMessage])

  // Fonction pour scroller vers le bas
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Effet pour scroller automatiquement vers le bas quand les messages changent
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Ajouter le message utilisateur
    const userMsg = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          establishmentName,
          user: user
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le serveur')
      }

      const data = await response.json()
      
      // Ajouter la réponse de l'IA
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMsg])

    } catch (error) {
      console.error('Erreur:', error)
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, showToast, establishmentName, user])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <>
      <style jsx>{`
        .chat-container-fixed {
          display: flex;
          height: 100%;
          width: 100%;
          max-width: 100%;
          background: #FFFFFF;
          margin: 0 auto;
          padding: 0;
          justify-content: center;
          align-items: stretch;
        }
        
        .chat-main-fixed {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin: 0 auto;
          padding: 0;
          max-width: 1200px;
          width: 100%;
        }
        
        .chat-messages-fixed {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          -webkit-overflow-scrolling: touch;
          margin: 0;
          min-height: 0;
        }
        
        .chat-input-container-fixed {
          padding: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: #FFFFFF;
          margin: 0;
        }
        
        .chat-input-wrapper-fixed {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          background: #F7F7F8;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 24px;
          padding: 12px 16px;
          transition: all 0.2s ease;
          margin: 0;
        }
        
        .chat-input-wrapper-fixed:focus-within {
          border-color: #10A37F;
          box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.1);
        }
        
        .chat-textarea-fixed {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          resize: none;
          font-size: 16px;
          line-height: 1.4;
          color: #000000;
          font-family: inherit;
          min-height: 20px;
          max-height: 120px;
          margin: 0;
          padding: 0;
        }
        
        .chat-textarea-fixed::placeholder {
          color: rgba(0, 0, 0, 0.5);
        }
        
        .chat-send-button-fixed {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          border: none;
          background: ${input.trim() ? '#10A37F' : '#8E8EA0'};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: ${input.trim() ? 1 : 0.5};
        }
        
        .chat-send-button-fixed:hover {
          background: ${input.trim() ? '#0D8A6B' : '#8E8EA0'};
        }
        
        .chat-send-button-fixed:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .chat-message-fixed {
          margin-bottom: 20px;
          animation: fadeInUp 0.3s ease-out;
        }
        
        .chat-message-fixed.user {
          display: flex;
          justify-content: flex-end;
        }
        
        .chat-message-fixed.assistant {
          display: flex;
          justify-content: flex-start;
        }
        
        .chat-message-bubble-fixed {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
          line-height: 1.4;
        }
        
        .chat-message-fixed.user .chat-message-bubble-fixed {
          background: #10A37F;
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .chat-message-fixed.assistant .chat-message-bubble-fixed {
          background: #F7F7F8;
          color: #000000;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 1023px) {
          .chat-container-fixed {
            display: none;
          }
        }
      `}</style>

      {/* Version desktop */}
      <div className="chat-container-fixed">
        <div className="chat-main-fixed">
          {/* Messages */}
          <div className="chat-messages-fixed">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message-fixed ${msg.role}`}
                >
                  <div className="chat-message-bubble-fixed">
                    {msg.content || 'Message vide'}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Bienvenue sur Get Weez
                </h3>
                <p className="text-gray-600 px-4 leading-relaxed">
                  Votre concierge IA personnel pour Marbella. Demandez-moi n'importe quoi !
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="chat-message-fixed assistant">
                <div className="chat-message-bubble-fixed">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    <span className="text-sm">Get Weez réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="chat-input-container-fixed">
            <div className="chat-input-wrapper-fixed">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Get Weez..."
                className="chat-textarea-fixed"
                rows={1}
                disabled={isLoading}
                style={{ fontSize: '16px' }}
              />
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="chat-send-button-fixed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Version mobile */}
      <div className="lg:hidden">
        <MobileChatInterface 
          user={user} 
          initialMessage={initialMessage} 
          establishmentName={establishmentName} 
        />
      </div>

      <ToastContainer />
    </>
  )
}

export default ChatInterfaceFixed
