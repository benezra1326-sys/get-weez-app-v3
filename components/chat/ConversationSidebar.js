import React, { memo, useCallback } from 'react'
import { MessageCircle, Sparkles, Trash2, X, Plus } from 'lucide-react'
import styles from '../../styles/ChatInterface.module.css'
import { useTheme } from '../../contexts/ThemeContextSimple'
import ChatButton from '../ui/ChatButton'

/**
 * Composant ConversationSidebar optimisé
 * Gère la liste des conversations et les actions associées
 */
const ConversationSidebar = memo(({ 
  conversations,
  currentConversationId,
  onCreateConversation,
  onSelectConversation,
  onDeleteConversation,
  onCloseConversation,
  showMobileHistory = false,
  onToggleMobileHistory,
  showToast,
  className = ''
}) => {
  const { isDarkMode } = useTheme()
  
  // Classes de thème simplifiées
  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200'
  }

  // Handlers optimisés
  const handleCreateConversation = useCallback(() => {
    onCreateConversation?.()
    onToggleMobileHistory?.(false) // Fermer sur mobile
  }, [onCreateConversation, onToggleMobileHistory])

  const handleSelectConversation = useCallback((conversationId) => {
    onSelectConversation?.(conversationId)
    onToggleMobileHistory?.(false) // Fermer sur mobile
  }, [onSelectConversation, onToggleMobileHistory])

  const handleDeleteConversation = useCallback((e, conversationId, conversationName) => {
    e.stopPropagation()
    if (confirm(`Supprimer "${conversationName}" ?`)) {
      onDeleteConversation?.(conversationId)
      showToast?.('Conversation supprimée', 'success')
    }
  }, [onDeleteConversation, showToast])

  const handleCloseConversation = useCallback(() => {
    onCloseConversation?.()
    onToggleMobileHistory?.(false) // Fermer sur mobile
  }, [onCloseConversation, onToggleMobileHistory])

  // Rendu de la liste des conversations
  const renderConversations = useCallback(() => {
    if (!conversations || conversations.length === 0) {
      return (
        <div className="text-center py-8 lg:block hidden">
          <MessageCircle size={48} className="text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-base">Aucune conversation</p>
        </div>
      )
    }

    return conversations.map((conversation) => (
      <div 
        key={conversation.id}
        className={`
          bg-gradient-to-r 
          ${conversation.id === currentConversationId 
            ? 'from-blue-500/30 to-purple-600/30 border-blue-500/50' 
            : 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
          } 
          border rounded-xl p-1 lg:p-4 hover:border-blue-400/50 transition-all duration-300 group relative
        `}
      >
        <div 
          className="cursor-pointer"
          onClick={() => handleSelectConversation(conversation.id)}
        >
          <div className="flex items-center space-x-1 lg:space-x-3 mb-1 lg:mb-2">
            <div className={`
              w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 
              ${conversation.id === currentConversationId 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
              }
            `}>
              <MessageCircle size={16} className="text-white lg:hidden" />
              <MessageCircle size={20} className="text-white hidden lg:block" />
            </div>
            <div className="flex-1">
              <h3 className={`
                font-semibold 
                ${conversation.id === currentConversationId 
                  ? themeClasses.text.primary 
                  : themeClasses.text.secondary
                }
              `}>
                {conversation.name}
              </h3>
              <p className={`
                text-sm 
                ${conversation.id === currentConversationId 
                  ? (isDarkMode ? 'text-blue-300' : 'text-blue-600')
                  : themeClasses.text.tertiary
                }
              `}>
                {conversation.messages?.length || 0} messages
              </p>
            </div>
          </div>
          <p className={`text-sm ${themeClasses.text.secondary}`}>
            {conversation.messages && conversation.messages.length > 0 
              ? conversation.messages[conversation.messages.length - 1]?.content?.substring(0, 50) + '...'
              : 'Conversation vide'
            }
          </p>
        </div>
        
        {/* Bouton de suppression */}
        <ChatButton
          variant="danger"
          size="small"
          icon={<Trash2 size={14} />}
          onClick={(e) => handleDeleteConversation(e, conversation.id, conversation.name)}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 !p-1"
          title="Supprimer la conversation"
        />
      </div>
    ))
  }, [conversations, currentConversationId, handleSelectConversation, handleDeleteConversation, themeClasses, isDarkMode])

  // Rendu du bouton nouvelle conversation
  const renderNewConversationButton = useCallback(() => (
    <button
      onClick={handleCreateConversation}
      className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-102 hover:shadow-md hover:shadow-purple-500/20 group mb-3"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center justify-center space-x-1.5">
        <div className="p-0.5 bg-white/20 rounded group-hover:bg-white/25 transition-colors duration-300">
          <Plus size={14} className="text-white" />
        </div>
        <span className="text-xs font-semibold truncate">Nouveau chat</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
          <Sparkles size={12} className="text-yellow-300" />
        </div>
      </div>
    </button>
  ), [handleCreateConversation])

  return (
    <>
      {/* Version desktop */}
      <div className={`${styles.conversationSidebar} ${styles.desktopOnly} ${themeClasses.main} ${className}`}>
        <div className="p-3 lg:p-5 flex-1 overflow-y-auto pb-1 lg:pb-6 min-h-0">
          <h2 className={`text-base lg:text-lg font-bold mb-3 lg:mb-4 ${themeClasses.text.primary}`}>
            Conversations
          </h2>
          <div className="space-y-2 lg:space-y-3">
            {renderNewConversationButton()}
            {renderConversations()}
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      {showMobileHistory && (
        <div 
          className={`lg:hidden fixed inset-0 backdrop-blur-sm z-50 ${isDarkMode ? 'bg-black/50' : 'bg-gray-900/20'}`} 
          onClick={() => onToggleMobileHistory?.(false)}
        >
          <div 
            className={`absolute top-16 left-4 right-4 backdrop-blur-md border rounded-2xl p-4 max-h-[70vh] overflow-y-auto ${
              isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-300'
            }`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${themeClasses.text.primary}`}>Conversations</h3>
              <ChatButton
                variant="ghost"
                size="small"
                icon={<X size={16} />}
                onClick={() => onToggleMobileHistory?.(false)}
              />
            </div>
            
            {/* Bouton nouvelle conversation mobile */}
            <ChatButton
              variant="primary"
              size="medium"
              icon={<Sparkles size={16} />}
              onClick={handleCreateConversation}
              className="w-full mb-4 !bg-gradient-to-r !from-purple-600 !to-indigo-600"
            >
              Nouveau Chat
            </ChatButton>
            
            {/* Bouton fermer conversation mobile */}
            {currentConversationId && (
              <ChatButton
                variant="secondary"
                size="medium"
                icon={<X size={18} />}
                onClick={handleCloseConversation}
                className="w-full mb-4"
              >
                Fermer Conversation
              </ChatButton>
            )}
            
            {/* Liste des conversations mobile */}
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
                  >
                    <div 
                      onClick={() => handleSelectConversation(conversation.id)}
                      className="flex-1"
                    >
                      <div className={`text-sm font-medium truncate mb-1 ${themeClasses.text.primary}`}>
                        {conversation.name}
                      </div>
                      <div className="text-gray-400 text-xs mb-2">
                        {conversation.messages?.length || 0} messages
                      </div>
                      <div className="text-gray-500 text-xs truncate">
                        {conversation.messages && conversation.messages.length > 0 
                          ? conversation.messages[conversation.messages.length - 1]?.content?.substring(0, 60) + '...'
                          : 'Conversation vide'
                        }
                      </div>
                    </div>
                    
                    <ChatButton
                      variant="danger"
                      size="small"
                      icon={<Trash2 size={14} />}
                      onClick={(e) => handleDeleteConversation(e, conversation.id, conversation.name)}
                      className="mt-2"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle size={32} className="text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Aucune conversation</p>
                  <p className="text-gray-500 text-xs mt-1">Créez votre première conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
})

ConversationSidebar.displayName = 'ConversationSidebar'

export default ConversationSidebar
