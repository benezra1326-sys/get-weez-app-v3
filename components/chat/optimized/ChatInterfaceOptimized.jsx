import React, { memo, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useTheme } from '../../../hooks/useTheme'
import { useChatOptimized } from '../../../hooks/useChatOptimized'
import { useToast } from '../../ui/Toast'

import MessagesList from './MessagesList'
import ChatInput from './ChatInput'
import ConversationSidebar from './ConversationSidebar'
import SuggestionsSidebar from './SuggestionsSidebar'
import MobileToolbar from './MobileToolbar'
import BrandCarousel from './BrandCarousel'
import ConfirmModal from '../../ui/ConfirmModal'

import styles from '../../../styles/ChatInterface.module.css'

/**
 * Interface de chat optimisée et modulaire
 * Remplace le composant monolithique original
 * 
 * Optimisations principales:
 * - Composants mémorisés pour éviter re-renders
 * - Styles CSS optimisés (plus de styles inline)
 * - Hooks personnalisés pour la logique
 * - Architecture modulaire
 */
const ChatInterfaceOptimized = memo(({ user, initialMessage, establishmentName }) => {
  console.log('🔄 ChatInterfaceOptimized loaded')
  
  const { t } = useTranslation('common')
  const { isDarkMode } = useTheme()
  const { ToastContainer } = useToast()
  
  // État UI local
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState(null)
  const [sidebarFilter, setSidebarFilter] = useState('all')
  const [showMobileHistory, setShowMobileHistory] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Hook optimisé pour la logique chat
  const {
    input,
    setInput,
    isLoading,
    isListening,
    textareaRef,
    conversations,
    currentConversationId,
    messages,
    hasMessages,
    handleSend,
    handleKeyDown,
    startListening,
    createConversation,
    selectConversation,
    deleteConversation,
    handleCloseConversation
  } = useChatOptimized(user, initialMessage)

  // Détection mobile optimisée
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    
    const handleResize = () => checkMobile()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Pré-remplir le message initial
  useEffect(() => {
    if (initialMessage && textareaRef.current) {
      setInput(initialMessage)
      textareaRef.current.focus()
      textareaRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [initialMessage, setInput])

  // Gestionnaires optimisés
  const handleDeleteClick = (conversationId) => {
    setConversationToDelete(conversationId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete)
      setConversationToDelete(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleDeleteCancel = () => {
    setConversationToDelete(null)
    setShowDeleteConfirm(false)
  }

  const handleFocusInput = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Rendu conditionnel pour mobile/desktop
  if (isMobile) {
    return (
      <MobileChatInterface 
        user={user}
        initialMessage={initialMessage}
        establishmentName={establishmentName}
      />
    )
  }

  return (
    <div className={`${styles.chatInterface} ${isDarkMode ? 'dark' : ''}`}>
      <main className={styles.mainContent}>
        
        {/* Sidebar gauche - Conversations */}
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          showMobileHistory={showMobileHistory}
          setShowMobileHistory={setShowMobileHistory}
          onCreateConversation={createConversation}
          onSelectConversation={selectConversation}
          onDeleteClick={handleDeleteClick}
          onCloseConversation={handleCloseConversation}
          isDarkMode={isDarkMode}
        />

        {/* Zone de chat principale */}
        <div className={styles.chatWindow}>
          <div className={styles.chatContainer}>
            
            {/* Barre d'outils mobile */}
            <MobileToolbar
              conversations={conversations}
              currentConversationId={currentConversationId}
              messages={messages}
              showMobileHistory={showMobileHistory}
              setShowMobileHistory={setShowMobileHistory}
              onCreateConversation={createConversation}
              onCloseConversation={handleCloseConversation}
              onDeleteConversation={deleteConversation}
              isDarkMode={isDarkMode}
            />

            {/* En-tête de conversation */}
            {hasMessages && (
              <ConversationHeader
                conversation={conversations.find(conv => conv.id === currentConversationId)}
                messageCount={messages.length}
                onClose={handleCloseConversation}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Liste des messages */}
            <MessagesList
              messages={messages}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
              establishmentName={establishmentName}
              onFocusInput={handleFocusInput}
            />

            {/* Suggestions mobile */}
            <MobileSuggestions 
              setInput={setInput}
              isDarkMode={isDarkMode}
            />

            {/* Zone de saisie */}
            <ChatInput
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              isListening={isListening}
              onSend={handleSend}
              onKeyDown={handleKeyDown}
              onStartListening={startListening}
              textareaRef={textareaRef}
              messages={messages}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Sidebar droite - Suggestions */}
        <SuggestionsSidebar
          filter={sidebarFilter}
          setFilter={setSidebarFilter}
          setInput={setInput}
          isDarkMode={isDarkMode}
        />

      </main>

      {/* Carrousel des marques */}
      <BrandCarousel isDarkMode={isDarkMode} />
      
      {/* Containers de notification */}
      <ToastContainer />
      
      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la conversation"
        message="Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  )
})

/**
 * En-tête de conversation optimisé
 */
const ConversationHeader = memo(({ conversation, messageCount, onClose, isDarkMode }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
        <MessageCircle size={16} className="text-white" />
      </div>
      <div>
        <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {conversation?.name || 'Conversation'}
        </h3>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {messageCount} message{messageCount > 1 ? 's' : ''}
        </p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all duration-300"
      title="Fermer la conversation"
    >
      <X size={16} />
    </button>
  </div>
))

// Import des composants mobiles (lazy loading possible)
const MobileChatInterface = React.lazy(() => import('../MobileChatInterface'))
const MobileSuggestions = React.lazy(() => import('./MobileSuggestions'))

// Noms d'affichage pour le debugging
ChatInterfaceOptimized.displayName = 'ChatInterfaceOptimized'
ConversationHeader.displayName = 'ConversationHeader'

export default ChatInterfaceOptimized