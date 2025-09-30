import React, { memo, useCallback, useRef, useEffect } from 'react'
import { MessageCircle, Sun, Moon, Sparkles, X, Trash2, Mic, MicOff } from 'lucide-react'
import styles from '../../styles/ChatInterface.module.css'
import useChatTheme from '../../hooks/useChatTheme'
import useMobileDetection from '../../hooks/useMobileDetection'
import useVoiceRecognition from '../../hooks/useVoiceRecognition'
import MessageBubble from '../ui/MessageBubble'
import WelcomeCard from '../ui/WelcomeCard'
import ChatButton from '../ui/ChatButton'
import ChatLoadingSpinner from '../ui/LoadingSpinner'

/**
 * Composant ChatArea optimisé
 * Contient la zone de messages, l'input et la toolbar mobile
 */
const ChatArea = memo(({ 
  messages,
  currentConversationId,
  conversations,
  input,
  isLoading,
  establishmentName,
  
  // Actions
  onInputChange,
  onSend,
  onKeyDown,
  onCreateConversation,
  onCloseConversation,
  onDeleteConversation,
  onToggleMobileHistory,
  onToggleTheme,
  
  // Toast
  showToast,
  
  className = ''
}) => {
  const { isDarkMode, themeClasses, getInlineStyles } = useChatTheme()
  const { isMobile } = useMobileDetection()
  const textareaRef = useRef(null)

  // Voice recognition setup
  const handleVoiceTranscript = useCallback((transcript) => {
    onInputChange?.(transcript)
  }, [onInputChange])

  const handleVoiceError = useCallback((error) => {
    showToast?.(error, 'error')
  }, [showToast])

  const { isListening, startListening, isSupported: isVoiceSupported } = useVoiceRecognition(
    handleVoiceTranscript,
    handleVoiceError
  )

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  // Focus input when establishment name is provided
  useEffect(() => {
    if (establishmentName && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [establishmentName])

  // Handlers optimisés
  const handleInputChange = useCallback((e) => {
    onInputChange?.(e.target.value)
  }, [onInputChange])

  const handleSend = useCallback(() => {
    onSend?.(showToast)
  }, [onSend, showToast])

  const handleKeyDownLocal = useCallback((e) => {
    onKeyDown?.(e, showToast)
  }, [onKeyDown, showToast])

  const handleDeleteCurrentConversation = useCallback(() => {
    if (confirm('Voulez-vous effacer cette conversation ?')) {
      if (currentConversationId) {
        onDeleteConversation?.(currentConversationId)
        showToast?.('Conversation effacée', 'success')
      }
    }
  }, [currentConversationId, onDeleteConversation, showToast])

  const handleFocusInput = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Render mobile toolbar
  const renderMobileToolbar = useCallback(() => (
    <div className={`${styles.mobileToolbar} ${styles.mobileOnly} ${themeClasses.main}`}>
      <div className="flex items-center space-x-2">
        <ChatButton
          variant="secondary"
          size="small"
          icon={<MessageCircle size={16} />}
          onClick={() => onToggleMobileHistory?.(true)}
          title="Voir les conversations"
        />
        <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
          {conversations?.length || 0} conversations
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <ChatButton
          variant="secondary"
          size="small"
          icon={isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          onClick={onToggleTheme}
          title={isDarkMode ? "Mode clair" : "Mode sombre"}
        />
        
        <ChatButton
          variant="primary"
          size="small"
          icon={<Sparkles size={16} />}
          onClick={onCreateConversation}
          title="Nouvelle conversation"
        />
        
        {currentConversationId && (
          <ChatButton
            variant="secondary"
            size="small"
            icon={<X size={16} />}
            onClick={onCloseConversation}
            title="Fermer la conversation"
          />
        )}
        
        {messages && messages.length > 0 && (
          <ChatButton
            variant="danger"
            size="small"
            icon={<Trash2 size={16} />}
            onClick={handleDeleteCurrentConversation}
            title="Effacer la conversation"
          />
        )}
      </div>
    </div>
  ), [
    themeClasses,
    conversations?.length,
    isDarkMode,
    currentConversationId,
    messages,
    onToggleMobileHistory,
    onToggleTheme,
    onCreateConversation,
    onCloseConversation,
    handleDeleteCurrentConversation
  ])

  // Render conversation header
  const renderConversationHeader = useCallback(() => {
    if (!currentConversationId || !messages || messages.length === 0) return null

    const currentConversation = conversations?.find(conv => conv.id === currentConversationId)

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${themeClasses.text.primary}`}>
              {currentConversation?.name || 'Conversation'}
            </h3>
            <p className={`text-xs ${themeClasses.text.tertiary}`}>
              {messages.length} message{messages.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChatButton
          variant="ghost"
          size="small"
          icon={<X size={16} />}
          onClick={onCloseConversation}
          title="Fermer la conversation"
        />
      </div>
    )
  }, [currentConversationId, messages, conversations, onCloseConversation, themeClasses])

  // Render messages
  const renderMessages = useCallback(() => {
    if (!messages || messages.length === 0) {
      return (
        <WelcomeCard 
          establishmentName={establishmentName}
          onFocus={handleFocusInput}
        />
      )
    }

    return (
      <div className={styles.messagesList}>
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg}
            isUser={msg.role === 'user'}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`${styles.messageBubble} ${styles.assistant}`}>
              <ChatLoadingSpinner />
            </div>
          </div>
        )}
      </div>
    )
  }, [messages, isLoading, establishmentName, handleFocusInput])

  // Render input area
  const renderInputArea = useCallback(() => {
    const canSend = input.trim() && !isLoading

    return (
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDownLocal}
            placeholder={
              messages && messages.length === 0 
                ? "Demandez-moi n'importe quoi sur Marbella..."
                : "Tapez votre message..."
            }
            className={`${styles.textInput} ${themeClasses.main}`}
            rows={1}
            disabled={isLoading}
          />
          
          {/* Voice button */}
          {isVoiceSupported && (
            <ChatButton
              variant={isListening ? "danger" : "secondary"}
              size="input"
              icon={isListening ? <MicOff size={14} /> : <Mic size={14} />}
              onClick={startListening}
              disabled={isListening}
              className={styles.voiceButton}
              title={isListening ? "Arrêter la dictée" : "Dictée vocale"}
            />
          )}
          
          {/* Send button */}
          <ChatButton
            variant={canSend ? "primary" : "secondary"}
            size="input"
            icon={
              isLoading ? (
                <div className="animate-spin">⟳</div>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                </svg>
              )
            }
            onClick={handleSend}
            disabled={!canSend}
            loading={isLoading}
            className={styles.sendButton}
            title="Envoyer le message"
          />
        </div>
        
        {/* Instructions */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="hidden sm:inline">
            Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
          </span>
          <span className="sm:hidden">Entrée pour envoyer</span>
        </div>
      </div>
    )
  }, [
    input,
    isLoading,
    messages,
    isVoiceSupported,
    isListening,
    handleInputChange,
    handleKeyDownLocal,
    handleSend,
    startListening,
    themeClasses
  ])

  return (
    <div className={`${styles.chatArea} ${className}`}>
      <div className={`${styles.chatContainer} ${themeClasses.main}`}>
        {renderMobileToolbar()}
        {renderConversationHeader()}
        
        {/* Messages container */}
        <div className={`${styles.messagesContainer} scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800`}>
          {renderMessages()}
        </div>
        
        {renderInputArea()}
      </div>
    </div>
  )
})

ChatArea.displayName = 'ChatArea'

export default ChatArea