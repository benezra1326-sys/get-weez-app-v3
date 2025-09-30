import React, { memo } from 'react'
import ChatLoadingSpinner from '../../ui/LoadingSpinner'
import WelcomeScreen from './WelcomeScreen'
import styles from '../../../styles/ChatInterface.module.css'

/**
 * Composant optimisé pour afficher la liste des messages
 * Mémorisé pour éviter les re-renders inutiles
 */
const MessagesList = memo(({ 
  messages, 
  isLoading, 
  isDarkMode,
  establishmentName,
  onFocusInput 
}) => {
  // Si pas de messages, afficher l'écran d'accueil
  if (!messages || messages.length === 0) {
    return (
      <WelcomeScreen 
        isDarkMode={isDarkMode}
        establishmentName={establishmentName}
        onFocusInput={onFocusInput}
      />
    )
  }

  return (
    <div className={styles.messagesArea}>
      <div className={styles.messagesList}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isDarkMode={isDarkMode}
          />
        ))}
        
        {/* Indicateur de chargement */}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.assistant}`}>
            <div className={`${styles.messageBubble} ${styles.assistant}`}>
              <ChatLoadingSpinner />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

/**
 * Composant individuel pour chaque message
 * Mémorisé pour optimiser les performances
 */
const MessageBubble = memo(({ message, isDarkMode }) => {
  return (
    <div className={`${styles.messageWrapper} ${styles[message.role]}`}>
      <div className={`${styles.messageBubble} ${styles[message.role]}`}>
        <div className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap break-words">
          {message.content || 'Message vide'}
        </div>
      </div>
    </div>
  )
})

MessagesList.displayName = 'MessagesList'
MessageBubble.displayName = 'MessageBubble'

export default MessagesList