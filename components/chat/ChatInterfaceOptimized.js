import React, { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import styles from '../../styles/ChatInterface.module.css'
import useChatState from '../../hooks/useChatState'
import useChatTheme from '../../hooks/useChatTheme'
import useMobileDetection from '../../hooks/useMobileDetection'
import { useToast } from '../ui/Toast'
import ConfirmModal from '../ui/ConfirmModal'
import ConversationSidebar from './ConversationSidebar'
import ChatArea from './ChatArea'
import SuggestionsSidebar from './SuggestionsSidebar'
import BrandCarousel from '../ui/BrandCarousel'
import MobileChatInterfaceOptimized from './MobileChatInterfaceOptimized'

/**
 * Composant ChatInterface optimisé et refactorisé
 * Version allégée et performante de l'interface de chat
 * 
 * Améliorations:
 * - Taille réduite de ~3000 à ~200 lignes
 * - Composants séparés et réutilisables
 * - Hooks personnalisés pour la logique métier
 * - Mémoisation pour optimiser les performances
 * - Styles CSS modules au lieu d'inline
 * - Gestion d'état centralisée
 */
const ChatInterfaceOptimized = memo(({ 
  user, 
  initialMessage, 
  establishmentName 
}) => {
  console.log('🔄 ChatInterfaceOptimized component loaded')
  
  const { t } = useTranslation('common')
  const { showToast, ToastContainer } = useToast()
  const { isDarkMode, themeClasses } = useChatTheme()
  const { isMobile } = useMobileDetection()

  // État centralisé du chat avec hook personnalisé
  const {
    // États UI
    input,
    isLoading,
    showDeleteConfirm,
    sidebarFilter,
    showMobileHistory,
    
    // Données du chat
    conversations,
    currentConversationId,
    messages,
    chatStats,
    
    // Setters optimisés
    setInput,
    setSidebarFilter,
    setShowMobileHistory,
    updateUiState,
    
    // Actions du chat
    createConversation,
    selectConversation,
    deleteConversation,
    
    // Handlers optimisés avec mémoisation
    handleSend,
    handleKeyDown,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleCloseConversation
  } = useChatState(initialMessage)

  // Debug logs optimisés
  useEffect(() => {
    console.log('📊 ChatInterface state:', {
      conversationsCount: chatStats.conversationsCount,
      currentConversationId,
      messagesCount: chatStats.messagesCount,
      hasMessages: chatStats.hasMessages,
      canSend: chatStats.canSend
    })
  }, [chatStats, currentConversationId])

  // Handlers pour les composants enfants - mémorisés
  const handleSuggestionClick = useCallback((suggestionText) => {
    setInput(suggestionText)
  }, [setInput])

  const handleToggleMobileHistory = useCallback((show) => {
    setShowMobileHistory(show)
  }, [setShowMobileHistory])

  const handleToggleTheme = useCallback(() => {
    // Cette fonction sera implémentée via le contexte de thème
    console.log('Toggle theme requested')
  }, [])

  const handleDeleteConversationWithToast = useCallback((conversationId) => {
    const success = handleDeleteConfirm()
    if (success) {
      showToast('Conversation supprimée avec succès', 'success')
    }
  }, [handleDeleteConfirm, showToast])

  // Rendu conditionnel pour mobile
  if (isMobile) {
    return (
      <div className={styles.mobileOnly}>
        <MobileChatInterfaceOptimized 
          user={user} 
          initialMessage={initialMessage} 
          establishmentName={establishmentName} 
        />
      </div>
    )
  }

  return (
    <>
      {/* Interface desktop uniquement */}
      <div className={`${styles.desktopOnly}`}>
        <div className={`${styles.mainContainer} ${themeClasses.main}`}>
          
          {/* Contenu principal */}
          <main className={styles.mainContent}>
            
            {/* Sidebar gauche - Conversations */}
            <ConversationSidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onCreateConversation={createConversation}
              onSelectConversation={selectConversation}
              onDeleteConversation={handleDeleteClick}
              onCloseConversation={handleCloseConversation}
              showMobileHistory={showMobileHistory}
              onToggleMobileHistory={handleToggleMobileHistory}
              showToast={showToast}
            />

            {/* Zone de chat centrale */}
            <ChatArea
              messages={messages}
              currentConversationId={currentConversationId}
              conversations={conversations}
              input={input}
              isLoading={isLoading}
              establishmentName={establishmentName}
              
              // Actions
              onInputChange={setInput}
              onSend={handleSend}
              onKeyDown={handleKeyDown}
              onCreateConversation={createConversation}
              onCloseConversation={handleCloseConversation}
              onDeleteConversation={deleteConversation}
              onToggleMobileHistory={handleToggleMobileHistory}
              onToggleTheme={handleToggleTheme}
              
              // Toast
              showToast={showToast}
            />

            {/* Sidebar droite - Suggestions */}
            <SuggestionsSidebar
              sidebarFilter={sidebarFilter}
              onFilterChange={setSidebarFilter}
              onSuggestionClick={handleSuggestionClick}
            />

          </main>
          
          {/* Carrousel des marques */}
          <BrandCarousel />
          
        </div>
      </div>
      
      {/* Container pour les notifications toast */}
      <ToastContainer />
      
      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConversationWithToast}
        title="Supprimer la conversation"
        message="Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </>
  )
})

ChatInterfaceOptimized.displayName = 'ChatInterfaceOptimized'

export default ChatInterfaceOptimized