import React, { memo, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { Loader2, Mic, MicOff } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import styles from '../../styles/chat-input.module.css'

const SendIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
  </svg>
)

const ChatInput = memo(({
  value,
  onChange,
  onSend,
  onKeyDown,
  disabled = false,
  isLoading = false,
  placeholder,
  messages = [],
  showToast
}) => {
  const { t } = useTranslation('common')
  const { isDarkMode } = useTheme()
  const textareaRef = useRef(null)
  const [isListening, setIsListening] = React.useState(false)

  // Auto-resize du textarea
  const handleTextareaChange = useCallback((e) => {
    onChange(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [onChange])

  // Gestion des raccourcis clavier
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      if (value.trim() && !isLoading) {
        onSend()
      }
    }
    // Appeler le handler parent s'il existe
    onKeyDown?.(e)
  }, [value, isLoading, onSend, onKeyDown])

  // Fonction de dictée vocale
  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'fr-FR'
      
      recognition.onstart = () => {
        setIsListening(true)
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onChange(transcript)
        setIsListening(false)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
        showToast?.('Erreur de reconnaissance vocale', 'error')
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    } else {
      showToast?.('Reconnaissance vocale non supportée', 'error')
    }
  }, [onChange, showToast])

  // Gestion du clic sur le bouton d'envoi
  const handleSendClick = useCallback(() => {
    if (value.trim() && !isLoading) {
      onSend()
    }
  }, [value, isLoading, onSend])

  // Placeholder dynamique
  const getPlaceholder = useCallback(() => {
    if (placeholder) return placeholder
    return messages.length === 0 
      ? "Demandez-moi n'importe quoi sur Marbella..." 
      : t('chat.placeholder')
  }, [placeholder, messages.length, t])

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className={`${styles.textarea} ${isDarkMode ? styles.dark : styles.light}`}
          rows={1}
          disabled={disabled || isLoading}
        />
        
        {/* Bouton de dictée vocale */}
        <button
          onClick={startListening}
          disabled={isListening || disabled || isLoading}
          className={`${styles.voiceButton} ${isListening ? styles.listening : styles.idle}`}
          title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
          type="button"
        >
          {isListening ? (
            <>
              <MicOff size={14} className={styles.micIcon} />
              <MicOff size={16} className={styles.micIconLg} />
            </>
          ) : (
            <>
              <Mic size={14} className={styles.micIcon} />
              <Mic size={16} className={styles.micIconLg} />
            </>
          )}
        </button>
        
        {/* Bouton d'envoi */}
        <button
          onClick={handleSendClick}
          disabled={!value.trim() || isLoading || disabled}
          className={`${styles.sendButton} ${
            !value.trim() || isLoading || disabled ? styles.disabled : styles.enabled
          }`}
          type="button"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className={`animate-spin ${styles.sendIcon}`} />
              <Loader2 size={16} className={`animate-spin ${styles.sendIconLg}`} />
            </>
          ) : (
            <>
              <SendIcon size={14} className={styles.sendIcon} />
              <SendIcon size={16} className={styles.sendIconLg} />
            </>
          )}
        </button>
      </div>
      
      {/* Texte d'information */}
      <div className={styles.helpText}>
        <span className="hidden sm:inline">
          Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </span>
        <span className="sm:hidden">Entrée pour envoyer</span>
      </div>
    </div>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput