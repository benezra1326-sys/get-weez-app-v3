import React, { memo } from 'react'
import { User, Bot, Clock } from 'lucide-react'
import useChatTheme from '../../hooks/useChatTheme'

/**
 * Composant MessageBubble optimisé pour le chat
 * Affiche les messages utilisateur et assistant avec un design moderne
 */
const MessageBubble = memo(({ message, isUser, showAvatar = true, showTimestamp = true }) => {
  const { themeClasses } = useChatTheme()

  if (!message) return null

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderContent = () => {
    // Si le message contient des liens, les rendre cliquables
    const content = message.content || message.text || ''
    
    // Détecter et remplacer les liens
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = content.split(urlRegex)
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index}
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {part}
          </a>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        
        {/* Avatar */}
        {showAvatar && (
          <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
            }`}>
              {isUser ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
          </div>
        )}

        {/* Message container */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          
          {/* Message bubble */}
          <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            isUser 
              ? `${themeClasses.message.user} rounded-br-md` 
              : `${themeClasses.message.assistant} rounded-bl-md`
          }`}>
            
            {/* Message content */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {renderContent()}
            </div>

            {/* Loading indicator for assistant messages */}
            {!isUser && message.loading && (
              <div className="flex items-center space-x-1 mt-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Timestamp */}
          {showTimestamp && message.timestamp && (
            <div className={`flex items-center space-x-1 mt-1 px-2 ${
              isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            }`}>
              <Clock size={12} className={themeClasses.text.muted} />
              <span className={`text-xs ${themeClasses.text.muted}`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}

          {/* Status indicators */}
          {isUser && (
            <div className={`mt-1 px-2 ${themeClasses.text.muted}`}>
              {message.status === 'sending' && (
                <span className="text-xs">Envoi...</span>
              )}
              {message.status === 'sent' && (
                <span className="text-xs">✓</span>
              )}
              {message.status === 'delivered' && (
                <span className="text-xs">✓✓</span>
              )}
              {message.status === 'error' && (
                <span className="text-xs text-red-400">❌ Erreur</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

MessageBubble.displayName = 'MessageBubble'

export default MessageBubble