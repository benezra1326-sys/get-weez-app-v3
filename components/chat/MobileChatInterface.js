import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { MessageCircle, Sparkles, Trash2, Loader2, X, ArrowLeft, Send } from 'lucide-react'
import { useConversations } from '../../hooks/useConversations'
import { useToast } from '../ui/Toast'
import ChatLoadingSpinner from '../ui/LoadingSpinner'

const MobileChatInterface = ({ user, initialMessage, establishmentName }) => {
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const textareaRef = useRef(null)

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

  const handleCloseConversation = () => {
    if (currentConversationId) {
      selectConversation(null)
      showToast('Conversation fermée', 'info')
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
  .mobile-chat-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
    display: flex;
    flex-direction: column;
    background-color: #0D0D0D;
  }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }
        
        .input-container {
          flex-shrink: 0;
          min-height: 50px;
        }
        
        .suggestions-section {
          flex-shrink: 0;
          margin-top: 0;
        }
        
        
        .banner-large {
          height: 120px;
          border-radius: 16px;
        }
        
        .banner-medium {
          height: 80px;
          border-radius: 12px;
        }
        
        .banner-small {
          height: 60px;
          border-radius: 10px;
        }
        
        .slide-up {
          animation: slideInFromBottom 0.3s ease-out;
        }
      `}</style>

      {/* Conteneur principal mobile - plein écran */}
      <div className="lg:hidden mobile-chat-container">
        
        {/* Header mobile - style ChatGPT */}
        <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <MessageCircle size={14} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Get Weez</h3>
                <p className="text-gray-500 text-xs">Concierge IA</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>

        {/* Section Conversations - style ChatGPT compact */}
        {showHistory && (
          <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 p-3">
            <h3 className="text-white font-medium text-sm mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Conversations
            </h3>
            
            {/* Bouton nouvelle conversation */}
            <div 
              onClick={() => {
                createConversation()
                setShowHistory(false)
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-2 mb-2 cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-white" />
                <span className="text-white font-medium text-sm">Nouvelle Conversation</span>
              </div>
            </div>
            
            {/* Liste des conversations */}
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {conversations && conversations.length > 0 ? (
                conversations.slice(0, 3).map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-2 rounded-lg cursor-pointer transition-all border ${
                      conversation.id === currentConversationId 
                        ? 'bg-blue-600/30 border-blue-500/50' 
                        : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/60'
                    }`}
                    onClick={() => {
                      selectConversation(conversation.id)
                      setShowHistory(false)
                    }}
                  >
                    <div className="text-white text-sm font-medium truncate mb-1">
                      {conversation.name}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {conversation.messages?.length || 0} messages
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2">
                  <p className="text-gray-400 text-xs">Aucune conversation</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages container - style ChatGPT */}
        <div className="messages-container p-3 space-y-3">
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                style={{ animation: 'fadeInUp 0.3s ease-out' }}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-gradient-to-r from-purple-600 to-blue-600'
                      : 'rounded-bl-md bg-gray-800 border border-gray-700'
                  }`}
                  style={{
                    boxShadow: msg.role === 'user' 
                      ? '0 4px 12px rgba(139, 92, 246, 0.3)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words text-white">
                    {msg.content || 'Message vide'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                Bienvenue sur Get Weez
              </h3>
              <p className="text-gray-400 text-sm px-4 leading-relaxed">
                Votre concierge IA personnel pour Marbella. Demandez-moi n'importe quoi !
              </p>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-4 py-3 rounded-2xl rounded-bl-md border bg-gray-800 border-gray-600">
                <ChatLoadingSpinner />
              </div>
            </div>
          )}
        </div>

        {/* Zone de saisie - style ChatGPT */}
        <div className="input-container bg-gray-900 border-t border-gray-800 px-3 py-3">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto'
                    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Message Get Weez..."
                className="w-full px-3 py-2 pr-10 border rounded-xl text-white resize-none text-sm transition-all duration-300 focus:outline-none bg-gray-800 border-gray-700 focus:border-purple-500"
                style={{ 
                  minHeight: '40px',
                  maxHeight: '100px',
                  fontSize: '16px' // Empêche le zoom sur iOS
                }}
                rows={1}
                disabled={isLoading}
              />
              
              {/* Bouton d'envoi */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 p-1.5 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: !input.trim() || isLoading ? '#4B5563' : '#3B82F6',
                  boxShadow: !input.trim() || isLoading ? 'none' : '0 2px 8px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
            <span className="text-xs">Entrée pour envoyer</span>
            {currentConversationId && (
              <button
                onClick={handleCloseConversation}
                className="text-gray-500 hover:text-white transition-colors text-xs"
              >
                Fermer
              </button>
            )}
          </div>
        </div>


        {/* Overlay pour l'historique des conversations */}
        {showHistory && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowHistory(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Conversations</h3>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700/50"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Bouton nouvelle conversation */}
              <div 
                onClick={() => {
                  createConversation()
                  setShowHistory(false)
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-3 mb-4 cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles size={18} className="text-white" />
                  <span className="text-white font-medium">Nouvelle Conversation</span>
                </div>
              </div>
              
              {/* Liste des conversations */}
              <div className="space-y-2">
                {conversations && conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all border ${
                        conversation.id === currentConversationId 
                          ? 'bg-blue-600/30 border-blue-500/50' 
                          : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
                      }`}
                      onClick={() => {
                        selectConversation(conversation.id)
                        setShowHistory(false)
                      }}
                    >
                      <div className="text-white text-sm font-medium truncate mb-1">
                        {conversation.name}
                      </div>
                      <div className="text-gray-400 text-xs mb-2">
                        {conversation.messages?.length || 0} messages
                      </div>
                      <div className="text-gray-500 text-xs truncate">
                        {conversation.messages && conversation.messages.length > 0 
                          ? conversation.messages[conversation.messages.length - 1]?.content?.substring(0, 50) + '...'
                          : 'Conversation vide'
                        }
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle size={32} className="text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Aucune conversation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Section Suggestions avec bannières style Uber Eats */}
      <div className="lg:hidden suggestions-section bg-gray-900/50">
        <div className="p-3 space-y-3">
          {/* Bannière principale - Large */}
          <div className="banner-large bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
            <div className="relative p-4 h-full flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🍣</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Nobu Marbella</h3>
                  <p className="text-white/90 text-sm">Japonais Premium • ⭐ 4.9</p>
                  <p className="text-orange-100 text-xs">Livraison 30min</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white font-bold text-sm">€€€€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grille de bannières moyennes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="banner-medium bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
              <div className="relative p-3 h-full flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏖️</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Beach Party</h4>
                  <p className="text-white/90 text-xs">21 juin • 16h</p>
                </div>
              </div>
            </div>

            <div className="banner-medium bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
              <div className="relative p-3 h-full flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎷</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Soirée Jazz</h4>
                  <p className="text-white/90 text-xs">26 juin • 22h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grille de bannières petites */}
          <div className="grid grid-cols-4 gap-2">
            <div className="banner-small bg-gradient-to-br from-emerald-500 to-teal-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
              <div className="relative p-2 h-full flex flex-col items-center justify-center text-center">
                <span className="text-lg mb-1">🚗</span>
                <h5 className="text-white font-bold text-xs">Transport</h5>
              </div>
            </div>

            <div className="banner-small bg-gradient-to-br from-amber-500 to-orange-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
              <div className="relative p-2 h-full flex flex-col items-center justify-center text-center">
                <span className="text-lg mb-1">🧳</span>
                <h5 className="text-white font-bold text-xs">Concierge</h5>
              </div>
            </div>

            <div className="banner-small bg-gradient-to-br from-indigo-500 to-purple-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
              <div className="relative p-2 h-full flex flex-col items-center justify-center text-center">
                <span className="text-lg mb-1">✈️</span>
                <h5 className="text-white font-bold text-xs">Transfert</h5>
              </div>
            </div>

            <div className="banner-small bg-gradient-to-br from-rose-500 to-pink-500 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
              <div className="relative p-2 h-full flex flex-col items-center justify-center text-center">
                <span className="text-lg mb-1">💆</span>
                <h5 className="text-white font-bold text-xs">Spa</h5>
              </div>
            </div>
          </div>

          {/* Bannière finale - Medium */}
          <div className="banner-medium bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
            <div className="relative p-3 h-full flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏨</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">El Lago Restaurant</h4>
                  <p className="text-white/90 text-xs">Créatif • Vue sur lac</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white font-bold text-xs">€€€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  )
}

export default MobileChatInterface
