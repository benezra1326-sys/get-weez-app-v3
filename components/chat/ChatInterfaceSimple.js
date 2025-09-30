import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useTranslation } from 'next-i18next'
import { MessageCircle, Send, Plus } from 'lucide-react'
import { useConversationsSimple } from '../../hooks/useConversationsSimple'
import { useToast } from '../ui/Toast'
import { useTheme } from '../../contexts/ThemeContextSimple'
import MobileChatInterface from './MobileChatInterface'

const ChatInterfaceSimple = ({ user, initialMessage, establishmentName }) => {
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const { isDarkMode } = useTheme()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)

  const {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    addMessage,
    isLoaded
  } = useConversationsSimple()

  // Effet pour pré-remplir le message de réservation
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }, [initialMessage])

  // Créer une conversation par défaut au chargement
  useEffect(() => {
    if (isLoaded && !currentConversationId) {
      createConversation()
    }
  }, [isLoaded, currentConversationId, createConversation])

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
    
    // Créer une conversation si nécessaire
    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = createConversation()
    }

    // Ajouter le message utilisateur
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }, conversationId)
    
    setIsLoading(true)

    try {
      const currentMessages = conversations.find(conv => conv.id === conversationId)?.messages || []
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages,
          establishmentName,
          user: user
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le serveur')
      }

      const data = await response.json()
      
      // Ajouter la réponse de l'IA
      addMessage({
        id: Date.now().toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)

    } catch (error) {
      console.error('Erreur:', error)
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, currentConversationId, createConversation, addMessage, showToast, conversations, establishmentName, user])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  // Ne pas rendre avant que les conversations soient chargées
  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .chat-container {
          display: flex;
          height: 100vh;
          background: ${isDarkMode ? '#0D0D0D' : '#FFFFFF'};
        }
        
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          -webkit-overflow-scrolling: touch;
        }
        
        .chat-input-container {
          padding: 20px;
          border-top: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          background: ${isDarkMode ? '#0D0D0D' : '#FFFFFF'};
        }
        
        .chat-input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          background: ${isDarkMode ? '#1F1F1F' : '#F7F7F8'};
          border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 24px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }
        
        .chat-input-wrapper:focus-within {
          border-color: #10A37F;
          box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.1);
        }
        
        .chat-textarea {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          resize: none;
          font-size: 16px;
          line-height: 1.4;
          color: ${isDarkMode ? '#FFFFFF' : '#000000'};
          font-family: inherit;
          min-height: 20px;
          max-height: 120px;
        }
        
        .chat-textarea::placeholder {
          color: ${isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
        }
        
        .chat-send-button {
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
        
        .chat-send-button:hover {
          background: ${input.trim() ? '#0D8A6B' : '#8E8EA0'};
        }
        
        .chat-send-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .chat-message {
          margin-bottom: 20px;
          animation: fadeInUp 0.3s ease-out;
        }
        
        .chat-message.user {
          display: flex;
          justify-content: flex-end;
        }
        
        .chat-message.assistant {
          display: flex;
          justify-content: flex-start;
        }
        
        .chat-message-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
          line-height: 1.4;
        }
        
        .chat-message.user .chat-message-bubble {
          background: #10A37F;
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .chat-message.assistant .chat-message-bubble {
          background: ${isDarkMode ? '#1F1F1F' : '#F7F7F8'};
          color: ${isDarkMode ? '#FFFFFF' : '#000000'};
          border-bottom-left-radius: 4px;
          border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
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
          .chat-container {
            display: none;
          }
        }
      `}</style>

      {/* Version desktop */}
      <div className="chat-container">
        <div className="chat-main">
          {/* Messages */}
          <div className="chat-messages">
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${msg.role}`}
                >
                  <div className="chat-message-bubble">
                    {msg.content || 'Message vide'}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Bienvenue sur Get Weez
                </h3>
                <p className="text-gray-600 dark:text-gray-400 px-4 leading-relaxed">
                  Votre concierge IA personnel pour Marbella. Demandez-moi n'importe quoi !
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="chat-message assistant">
                <div className="chat-message-bubble">
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
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Get Weez..."
                className="chat-textarea"
                rows={1}
                disabled={isLoading}
                style={{ fontSize: '16px' }}
              />
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="chat-send-button"
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

export default ChatInterfaceSimple
