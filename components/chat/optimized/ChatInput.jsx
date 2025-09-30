import React, { memo } from 'react'
import { Loader2, Mic, MicOff } from 'lucide-react'
import { useTranslation } from 'next-i18next'
import styles from '../../../styles/ChatInterface.module.css'

/**
 * Composant optimisé pour la saisie de chat
 * Mémorisé et avec gestion optimisée des événements
 */
const ChatInput = memo(({ 
  input,
  setInput,
  isLoading,
  isListening,
  onSend,
  onKeyDown,
  onStartListening,
  textareaRef,
  messages,
  isDarkMode 
}) => {
  const { t } = useTranslation('common')

  // Gestionnaire d'auto-resize optimisé
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInput(newValue)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const placeholder = messages?.length === 0 
    ? "Demandez-moi n'importe quoi sur Marbella..." 
    : t('chat.placeholder')

  return (
    <div className={styles.chatInputContainer}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={styles.chatInput}
          rows={1}
          disabled={isLoading}
        />
        
        {/* Bouton de dictée */}
        <VoiceButton
          isListening={isListening}
          onStartListening={onStartListening}
          disabled={isLoading}
        />
        
        {/* Bouton d'envoi */}
        <SendButton
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          isLoading={isLoading}
        />
      </div>
      
      {/* Texte d'information */}
      <InputHelpText />
    </div>
  )
})

/**
 * Bouton de dictée vocale optimisé
 */
const VoiceButton = memo(({ isListening, onStartListening, disabled }) => (
  <button
    onClick={onStartListening}
    disabled={disabled || isListening}
    className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
    title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
  >
    {isListening ? (
      <>
        <MicOff size={14} className="lg:hidden" />
        <MicOff size={16} className="hidden lg:block" />
      </>
    ) : (
      <>
        <Mic size={14} className="lg:hidden" />
        <Mic size={16} className="hidden lg:block" />
      </>
    )}
  </button>
))

/**
 * Bouton d'envoi optimisé
 */
const SendButton = memo(({ onClick, disabled, isLoading }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={styles.sendButton}
  >
    {isLoading ? (
      <>
        <Loader2 size={14} className="animate-spin lg:hidden" />
        <Loader2 size={16} className="animate-spin hidden lg:block" />
      </>
    ) : (
      <>
        <SendIcon size={14} className="lg:hidden" />
        <SendIcon size={16} className="hidden lg:block" />
      </>
    )}
  </button>
))

/**
 * Icône d'envoi optimisée
 */
const SendIcon = memo(({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
  </svg>
))

/**
 * Texte d'aide optimisé
 */
const InputHelpText = memo(() => (
  <div className="flex items-center justify-between text-xs lg:text-xs text-gray-400">
    <span className="hidden sm:inline">Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne</span>
    <span className="sm:hidden">Entrée pour envoyer</span>
  </div>
))

// Noms d'affichage pour le debugging
ChatInput.displayName = 'ChatInput'
VoiceButton.displayName = 'VoiceButton'
SendButton.displayName = 'SendButton'
SendIcon.displayName = 'SendIcon'
InputHelpText.displayName = 'InputHelpText'

export default ChatInput