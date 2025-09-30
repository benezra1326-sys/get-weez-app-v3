import React, { memo } from 'react'
import styles from '../../styles/ChatInterface.module.css'

/**
 * Composant MessageBubble optimisé avec mémoisation
 * Affiche un message dans une bulle avec le style approprié
 */
const MessageBubble = memo(({ 
  message, 
  isUser = false,
  className = '',
  ...props 
}) => {
  // Validation des props
  if (!message?.content) {
    console.warn('MessageBubble: message.content is required')
    return null
  }

  const isUserMessage = isUser || message.role === 'user'
  
  return (
    <div 
      className={`${styles.messageWrapper} ${isUserMessage ? styles.user : styles.assistant} ${className}`}
      {...props}
    >
      <div 
        className={`${styles.messageBubble} ${isUserMessage ? styles.user : styles.assistant}`}
      >
        <div className={styles.messageText}>
          {message.content}
        </div>
        
        {/* Optionnel: Timestamp */}
        {message.timestamp && (
          <div className="text-xs opacity-70 mt-1">
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  )
})

MessageBubble.displayName = 'MessageBubble'

export default MessageBubble
