import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useTranslation } from 'next-i18next'
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Plus, 
  Menu, 
  X, 
  Sparkles,
  MapPin,
  Clock,
  Star,
  Heart,
  Utensils,
  Car,
  Hotel,
  Calendar,
  Camera,
  Music,
  ShoppingBag,
  Plane
} from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import { useToast } from '../ui/Toast'
import ChatLoadingSpinner from '../ui/LoadingSpinner'
import { useTheme } from '../../contexts/ThemeContextSimple'

const ChatGPTMobileInterface = ({ user, initialMessage, establishmentName }) => {
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const { isDarkMode } = useTheme()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [inputHeight, setInputHeight] = useState(44)
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputContainerRef = useRef(null)

  const {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation
  } = useConversations()

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
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    setInputHeight(44)
    setShowSuggestions(false)
    
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

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value)
    // Auto-resize du textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 120)
    textarea.style.height = `${newHeight}px`
    setInputHeight(newHeight)
  }, [])

  const handleSuggestionClick = useCallback((suggestion) => {
    setInput(suggestion)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Suggestions visuelles avec images et bordures colorées - Spécifiques à Marbella
  const suggestions = [
    {
      id: 1,
      title: "Restaurants Marbella",
      description: "Nobu, El Lago, La Cabane",
      icon: Utensils,
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50",
      image: "🍽️",
      suggestion: "Je veux réserver une table dans un restaurant gastronomique à Marbella"
    },
    {
      id: 2,
      title: "Hôtels 5 étoiles",
      description: "Puente Romano, Marbella Club",
      icon: Hotel,
      color: "from-blue-500 to-indigo-500",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      image: "🏨",
      suggestion: "Je cherche un hôtel de luxe avec spa à Marbella"
    },
    {
      id: 3,
      title: "Transport Privé",
      description: "Mercedes, Ferrari, Yacht",
      icon: Car,
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
      image: "🚗",
      suggestion: "J'ai besoin d'un transport privé pour mes déplacements"
    },
    {
      id: 4,
      title: "Événements VIP",
      description: "Soirées exclusives",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
      image: "🎉",
      suggestion: "Quels sont les événements exclusifs ce week-end ?"
    },
    {
      id: 5,
      title: "Spa & Wellness",
      description: "Thalasso, Massages",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      borderColor: "border-pink-200",
      bgColor: "bg-pink-50",
      image: "💆‍♀️",
      suggestion: "Je veux un spa day avec massage et soins thalasso"
    },
    {
      id: 6,
      title: "Shopping Golden Mile",
      description: "Puerto Banús, boutiques",
      icon: ShoppingBag,
      color: "from-yellow-500 to-orange-500",
      borderColor: "border-yellow-200",
      bgColor: "bg-yellow-50",
      image: "🛍️",
      suggestion: "Où faire du shopping de luxe à Puerto Banús ?"
    },
    {
      id: 7,
      title: "Photographie Pro",
      description: "Sessions lifestyle",
      icon: Camera,
      color: "from-cyan-500 to-blue-500",
      borderColor: "border-cyan-200",
      bgColor: "bg-cyan-50",
      image: "📸",
      suggestion: "Je veux organiser une séance photo professionnelle"
    },
    {
      id: 8,
      title: "Nightlife VIP",
      description: "Clubs, bars exclusifs",
      icon: Music,
      color: "from-violet-500 to-purple-500",
      borderColor: "border-violet-200",
      bgColor: "bg-violet-50",
      image: "🎵",
      suggestion: "Quels sont les meilleurs clubs VIP ce soir ?"
    },
    {
      id: 9,
      title: "Golf & Sports",
      description: "Terrains de golf",
      icon: Star,
      color: "from-emerald-500 to-teal-500",
      borderColor: "border-emerald-200",
      bgColor: "bg-emerald-50",
      image: "⛳",
      suggestion: "Je veux jouer au golf sur un parcours prestigieux"
    },
    {
      id: 10,
      title: "Yacht & Mer",
      description: "Croisières privées",
      icon: Plane,
      color: "from-sky-500 to-blue-500",
      borderColor: "border-sky-200",
      bgColor: "bg-sky-50",
      image: "⛵",
      suggestion: "Je veux louer un yacht pour une croisière"
    },
    {
      id: 11,
      title: "Art & Culture",
      description: "Galerie, musées",
      icon: Star,
      color: "from-amber-500 to-yellow-500",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50",
      image: "🎨",
      suggestion: "Quelles expositions d'art sont à voir en ce moment ?"
    },
    {
      id: 12,
      title: "Plages Privées",
      description: "Beach clubs exclusifs",
      icon: MapPin,
      color: "from-teal-500 to-cyan-500",
      borderColor: "border-teal-200",
      bgColor: "bg-teal-50",
      image: "🏖️",
      suggestion: "Je veux accéder à une plage privée avec service VIP"
    }
  ]

  return (
    <>
      <style jsx>{`
        .chatgpt-mobile-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          background: ${isDarkMode ? '#0D0D0D' : '#FFFFFF'};
          z-index: 50;
        }
        
        .chatgpt-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: ${isDarkMode ? 'rgba(13, 13, 13, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          backdrop-filter: blur(20px);
          border-bottom: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        }
        
        .chatgpt-messages {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 16px;
          padding-bottom: 0;
        }
        
        .chatgpt-input-container {
          position: sticky;
          bottom: 0;
          background: ${isDarkMode ? 'rgba(13, 13, 13, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          backdrop-filter: blur(20px);
          border-top: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          padding: 16px;
          padding-bottom: env(safe-area-inset-bottom, 16px);
        }
        
        .chatgpt-input-wrapper {
          position: relative;
          background: ${isDarkMode ? '#1F1F1F' : '#F7F7F8'};
          border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 24px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }
        
        .chatgpt-input-wrapper:focus-within {
          border-color: #10A37F;
          box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.1);
        }
        
        .chatgpt-textarea {
          width: 100%;
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
        
        .chatgpt-textarea::placeholder {
          color: ${isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
        }
        
        .chatgpt-send-button {
          position: absolute;
          right: 8px;
          bottom: 8px;
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
        
        .chatgpt-send-button:hover {
          background: ${input.trim() ? '#0D8A6B' : '#8E8EA0'};
        }
        
        .chatgpt-send-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .chatgpt-message {
          margin-bottom: 24px;
          animation: fadeInUp 0.3s ease-out;
        }
        
        .chatgpt-message.user {
          display: flex;
          justify-content: flex-end;
        }
        
        .chatgpt-message.assistant {
          display: flex;
          justify-content: flex-start;
        }
        
        .chatgpt-message-bubble {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
          line-height: 1.4;
        }
        
        .chatgpt-message.user .chatgpt-message-bubble {
          background: #10A37F;
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .chatgpt-message.assistant .chatgpt-message-bubble {
          background: ${isDarkMode ? '#1F1F1F' : '#F7F7F8'};
          color: ${isDarkMode ? '#FFFFFF' : '#000000'};
          border-bottom-left-radius: 4px;
          border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        }
        
        .chatgpt-suggestions {
          padding: 16px;
          background: ${isDarkMode ? '#0D0D0D' : '#FFFFFF'};
          border-top: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        }
        
        .chatgpt-suggestion-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .chatgpt-suggestion-card {
          padding: 16px;
          border-radius: 16px;
          border: 2px solid;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .chatgpt-suggestion-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .chatgpt-suggestion-card:active {
          transform: translateY(0);
        }
        
        .chatgpt-suggestion-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-size: 20px;
        }
        
        .chatgpt-suggestion-title {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: #1F2937;
        }
        
        .chatgpt-suggestion-description {
          font-size: 12px;
          color: #6B7280;
          line-height: 1.3;
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .chatgpt-loading {
          animation: pulse 1.5s infinite;
        }
      `}</style>

      <div className="chatgpt-mobile-container">
        {/* Header ChatGPT style */}
        <div className="chatgpt-header">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Get Weez</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Concierge IA</p>
              </div>
            </div>
            
            <button
              onClick={() => createConversation()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Plus size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatgpt-messages">
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatgpt-message ${msg.role}`}
              >
                <div className="chatgpt-message-bubble">
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
            <div className="chatgpt-message assistant">
              <div className="chatgpt-message-bubble">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                  <span className="text-sm">Get Weez réfléchit...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions visuelles */}
        {showSuggestions && messages && messages.length === 0 && (
          <div className="chatgpt-suggestions">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Que puis-je faire pour vous ?
            </h3>
            <div className="chatgpt-suggestion-grid">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon
                return (
                  <div
                    key={suggestion.id}
                    className={`chatgpt-suggestion-card ${suggestion.borderColor} ${suggestion.bgColor}`}
                    onClick={() => handleSuggestionClick(suggestion.suggestion)}
                  >
                    <div className={`chatgpt-suggestion-icon bg-gradient-to-r ${suggestion.color} text-white`}>
                      {suggestion.image}
                    </div>
                    <div className="chatgpt-suggestion-title">
                      {suggestion.title}
                    </div>
                    <div className="chatgpt-suggestion-description">
                      {suggestion.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Zone de saisie ChatGPT style */}
        <div className="chatgpt-input-container" ref={inputContainerRef}>
          <div className="chatgpt-input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Get Weez..."
              className="chatgpt-textarea"
              rows={1}
              disabled={isLoading}
              style={{ 
                height: `${inputHeight}px`,
                fontSize: '16px' // Empêche le zoom sur iOS
              }}
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="chatgpt-send-button"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between text-xs mt-2 text-gray-500 dark:text-gray-400">
            <span>Entrée pour envoyer</span>
            <span>Shift + Entrée pour nouvelle ligne</span>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  )
}

export default ChatGPTMobileInterface
