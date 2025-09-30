import React, { memo, useCallback, useRef } from 'react'
import { MessageCircle, Sparkles, Trash2, X, Mic, MicOff } from 'lucide-react'
import styles from '../../styles/ChatInterface.module.css'
import useChatState from '../../hooks/useChatState'
import useChatTheme from '../../hooks/useChatTheme'
import useVoiceRecognition from '../../hooks/useVoiceRecognition'
import { useToast } from '../ui/Toast'
import MessageBubble from '../ui/MessageBubble'
import WelcomeCard from '../ui/WelcomeCard'
import ChatButton from '../ui/ChatButton'
import SuggestionCard from '../ui/SuggestionCard'
import ChatLoadingSpinner from '../ui/LoadingSpinner'

/**
 * Interface de chat optimisée pour mobile
 * Version allégée avec fonctionnalités adaptées au mobile
 */
const MobileChatInterfaceOptimized = memo(({ 
  user, 
  initialMessage, 
  establishmentName 
}) => {
  const { showToast, ToastContainer } = useToast()
  const { themeClasses } = useChatTheme()
  const textareaRef = useRef(null)

  const {
    input,
    isLoading,
    conversations,
    currentConversationId,
    messages,
    setInput,
    createConversation,
    selectConversation,
    deleteConversation,
    handleSend,
    handleKeyDown,
    handleCloseConversation
  } = useChatState(initialMessage)

  // Voice recognition
  const handleVoiceTranscript = useCallback((transcript) => {
    setInput(transcript)
  }, [setInput])

  const { isListening, startListening, isSupported: isVoiceSupported } = useVoiceRecognition(
    handleVoiceTranscript,
    (error) => showToast(error, 'error')
  )

  // Suggestions mobiles rapides
  const quickSuggestions = [
    { text: '🚗 Transport VIP', gradient: 'indigo' },
    { text: '🛥️ Yacht privé', gradient: 'blue' },
    { text: '🚁 Hélicoptère', gradient: 'purple' },
    { text: '💆 Spa à domicile', gradient: 'rose' }
  ]

  const eventSuggestions = [
    { title: 'Beach Party', subtitle: '21 juin', icon: '🏖️', gradient: 'blue', action: 'Réserver pour la Beach Party' },
    { title: 'Soirée Jazz', subtitle: '26 juin', icon: '🎷', gradient: 'purple', action: 'Réserver pour la soirée jazz' },
    { title: 'Nobu Marbella', subtitle: 'Japonais Premium', icon: '🍣', gradient: 'amber', action: 'Réserver une table chez Nobu' },
    { title: 'La Terraza', subtitle: 'Méditerranéen', icon: '🏖️', gradient: 'teal', action: 'Réserver une table à La Terraza' }
  ]

  // Handlers
  const handleSendMobile = useCallback(() => {
    handleSend(showToast)
  }, [handleSend, showToast])

  const handleKeyDownMobile = useCallback((e) => {
    handleKeyDown(e, showToast)
  }, [handleKeyDown, showToast])

  const handleSuggestionClick = useCallback((text) => {
    setInput(text)
  }, [setInput])

  const handleFocusInput = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className={`${styles.mainContainer} ${themeClasses.main} min-h-screen`}>
      {/* En-tête mobile */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Get Weez</h1>
              <p className="text-purple-100 text-sm">Votre concierge IA</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ChatButton
              variant="secondary"
              size="small"
              icon={<Sparkles size={16} />}
              onClick={createConversation}
              className="!bg-white/20 !border-white/30"
            />
            {currentConversationId && (
              <ChatButton
                variant="secondary"
                size="small"
                icon={<X size={16} />}
                onClick={handleCloseConversation}
                className="!bg-white/20 !border-white/30"
              />
            )}
          </div>
        </div>
      </div>

      {/* Zone de messages */}
      <div className="flex-1 p-4 pb-0">
        {messages && messages.length > 0 ? (
          <div className="space-y-4 mb-4">
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
        ) : (
          <WelcomeCard 
            establishmentName={establishmentName}
            onFocus={handleFocusInput}
          />
        )}

        {/* Suggestions rapides pour mobile */}
        {(!messages || messages.length === 0) && (
          <div className="mb-6">
            <h3 className={`font-semibold text-sm mb-3 flex items-center ${themeClasses.text.primary}`}>
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              💡 Suggestions Premium
            </h3>
            
            {/* Événements et restaurants */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {eventSuggestions.map((item, index) => (
                <SuggestionCard
                  key={index}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  gradient={item.gradient}
                  size="small"
                  actionText="Réserver"
                  onClick={() => handleSuggestionClick(item.action)}
                />
              ))}
            </div>
            
            {/* Services rapides */}
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((service, index) => (
                <ChatButton
                  key={index}
                  variant="ghost"
                  size="small"
                  onClick={() => handleSuggestionClick(service.text)}
                  className="!bg-gray-800 !border-gray-600 !text-white hover:!bg-gray-700"
                >
                  {service.text}
                </ChatButton>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zone d'input mobile - sticky bottom */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDownMobile}
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
            />
          )}
          
          {/* Send button */}
          <ChatButton
            variant={input.trim() && !isLoading ? "primary" : "secondary"}
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
            onClick={handleSendMobile}
            disabled={!input.trim() || isLoading}
            className={styles.sendButton}
          />
        </div>
        
        <div className="text-center text-xs text-gray-400 mt-2">
          Entrée pour envoyer
        </div>
      </div>

      <ToastContainer />
    </div>
  )
})

MobileChatInterfaceOptimized.displayName = 'MobileChatInterfaceOptimized'

export default MobileChatInterfaceOptimized