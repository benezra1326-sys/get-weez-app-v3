// 🚀 ChatInterface optimisé - Version modulaire et performante
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useToast } from '../ui/Toast'
import { useTheme } from '../../hooks/useTheme'
import { useChatState } from './hooks/useChatState'
import { useChatHandlers } from './hooks/useChatHandlers'
import ConfirmModal from '../ui/ConfirmModal'

// Composants modulaires (lazy loading pour performance)
import MobileChatInterface from './MobileChatInterface'
import ChatHeader from './components/ChatHeader'
import ConversationSidebar from './components/ConversationSidebar'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'
import SuggestionsSidebar from './components/SuggestionsSidebar'
import WelcomeScreen from './components/WelcomeScreen'

// Styles optimisés
import styles from './styles/ChatInterface.module.css'

const ChatInterfaceOptimized = memo(({ 
  user, 
  initialMessage, 
  establishmentName 
}) => {
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const { isDarkMode } = useTheme()
  const chatState = useChatState()
  const handlers = useChatHandlers(chatState, showToast)

  // Effet pour pré-remplir le message initial
  useEffect(() => {
    if (initialMessage && !chatState.input) {
      chatState.actions.setInput(initialMessage)
      // Focus sur la zone de saisie après un micro délai
      setTimeout(() => {
        if (handlers.textareaRef.current) {
          handlers.textareaRef.current.focus()
        }
      }, 100)
    }
  }, [initialMessage, chatState.input, chatState.actions])

  // Détection mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      chatState.actions.setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [chatState.actions])

  // Si c'est mobile, utiliser le composant mobile existant
  if (chatState.isMobile) {
    return (
      <MobileChatInterface 
        user={user} 
        initialMessage={initialMessage} 
        establishmentName={establishmentName} 
      />
    )
  }

  return (
    <div 
      className={styles.chatInterface}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <div className={styles.container}>
        {/* Sidebar gauche - Conversations */}
        <aside className={styles.sidebar}>
          <ConversationSidebar
            conversations={handlers.conversations}
            currentConversationId={handlers.currentConversationId}
            onSelectConversation={handlers.handleSelectConversation}
            onCreateConversation={handlers.handleCreateConversation}
            onDeleteConversation={chatState.actions.showDeleteConfirm}
            showMobileHistory={chatState.showMobileHistory}
            onToggleMobileHistory={handlers.toggleMobileHistory}
          />
        </aside>

        {/* Zone de chat principale */}
        <main className={styles.chatArea}>
          <div className={styles.chatContainer}>
            {/* Header avec contrôles */}
            <ChatHeader
              currentConversationId={handlers.currentConversationId}
              conversations={handlers.conversations}
              onCloseConversation={handlers.handleCloseConversation}
              onCreateConversation={handlers.handleCreateConversation}
              onDeleteConversation={chatState.actions.showDeleteConfirm}
            />

            {/* Zone des messages */}
            <div className={styles.messagesContainer}>
              {handlers.conversations.find(c => c.id === handlers.currentConversationId)?.messages?.length > 0 ? (
                <MessageList
                  conversationId={handlers.currentConversationId}
                  conversations={handlers.conversations}
                  isLoading={chatState.isLoading}
                />
              ) : (
                <WelcomeScreen
                  establishmentName={establishmentName}
                  onMessageSuggestion={chatState.actions.setInput}
                />
              )}
            </div>

            {/* Zone de saisie */}
            <div className={styles.inputArea}>
              <ChatInput
                ref={handlers.textareaRef}
                value={chatState.input}
                onChange={handlers.handleTextareaChange}
                onKeyDown={handlers.handleKeyDown}
                onSend={handlers.handleSend}
                onVoiceInput={handlers.handleVoiceInput}
                isLoading={chatState.isLoading}
                isListening={chatState.isListening}
                canSend={chatState.canSend}
                placeholder={
                  handlers.conversations.find(c => c.id === handlers.currentConversationId)?.messages?.length === 0
                    ? "Demandez-moi n'importe quoi sur Marbella..."
                    : t('chat.placeholder')
                }
              />
            </div>
          </div>
        </main>

        {/* Sidebar droite - Suggestions */}
        <aside className={styles.sidebar}>
          <SuggestionsSidebar
            filter={chatState.sidebarFilter}
            onFilterChange={chatState.actions.setSidebarFilter}
            onMessageSuggestion={chatState.actions.setInput}
          />
        </aside>
      </div>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={chatState.showDeleteConfirm}
        onClose={chatState.actions.hideDeleteConfirm}
        onConfirm={handlers.handleDeleteConfirm}
        title="Supprimer la conversation"
        message="Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  )
})

ChatInterfaceOptimized.displayName = 'ChatInterfaceOptimized'

export default ChatInterfaceOptimized