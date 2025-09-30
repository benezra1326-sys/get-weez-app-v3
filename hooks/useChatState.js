import { useState, useCallback, useMemo } from 'react'
import { useConversations } from './useConversations'

/**
 * Hook personnalisé pour gérer l'état du chat
 * Centralise toute la logique de gestion des messages et états UI
 */
export const useChatState = (initialMessage) => {
  // États groupés pour réduire les re-rendus
  const [uiState, setUiState] = useState({
    input: initialMessage || '',
    isLoading: false,
    showDeleteConfirm: false,
    conversationToDelete: null,
    sidebarFilter: 'all',
    showMobileHistory: false,
    isListening: false
  })

  const {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation
  } = useConversations()

  // Mémoisation des setters pour éviter les re-rendus
  const updateUiState = useCallback((updates) => {
    setUiState(prev => ({ ...prev, ...updates }))
  }, [])

  // Setter spécialisés mémorisés
  const setInput = useCallback((value) => {
    updateUiState({ input: value })
  }, [updateUiState])

  const setIsLoading = useCallback((value) => {
    updateUiState({ isLoading: value })
  }, [updateUiState])

  const setSidebarFilter = useCallback((filter) => {
    updateUiState({ sidebarFilter: filter })
  }, [updateUiState])

  const setShowMobileHistory = useCallback((show) => {
    updateUiState({ showMobileHistory: show })
  }, [updateUiState])

  const setIsListening = useCallback((listening) => {
    updateUiState({ isListening: listening })
  }, [updateUiState])

  // Gestion de la suppression de conversations
  const handleDeleteClick = useCallback((conversationId) => {
    updateUiState({
      conversationToDelete: conversationId,
      showDeleteConfirm: true
    })
  }, [updateUiState])

  const handleDeleteConfirm = useCallback(() => {
    if (uiState.conversationToDelete) {
      deleteConversation(uiState.conversationToDelete)
      updateUiState({
        conversationToDelete: null,
        showDeleteConfirm: false
      })
      return true // Indique que la suppression a eu lieu
    }
    return false
  }, [uiState.conversationToDelete, deleteConversation, updateUiState])

  const handleDeleteCancel = useCallback(() => {
    updateUiState({
      conversationToDelete: null,
      showDeleteConfirm: false
    })
  }, [updateUiState])

  // Fermeture de conversation
  const handleCloseConversation = useCallback(() => {
    if (currentConversationId) {
      selectConversation(null)
      return true // Indique que la fermeture a eu lieu
    }
    return false
  }, [currentConversationId, selectConversation])

  // Logique d'envoi de message optimisée
  const handleSend = useCallback(async (showToast) => {
    const messageContent = uiState.input.trim()
    
    if (!messageContent || uiState.isLoading) {
      return false
    }

    // Clear input et set loading immédiatement
    setUiState(prev => ({ 
      ...prev, 
      input: '',
      isLoading: true 
    }))

    try {
      // Créer une conversation si nécessaire
      let conversationId = currentConversationId
      if (!conversationId) {
        conversationId = createConversation()
      }

      // Ajouter le message utilisateur
      addMessage({
        id: Date.now().toString(),
        content: messageContent,
        role: 'user',
        timestamp: new Date()
      }, conversationId)

      // Obtenir l'historique des messages
      const currentMessages = conversations.find(conv => conv.id === conversationId)?.messages || []

      // Appel API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          userName: 'Utilisateur',
          isMember: false,
          conversationHistory: currentMessages
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Ajouter la réponse
      addMessage({
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)

      return true

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      
      // Message d'erreur
      const conversationId = currentConversationId || createConversation()
      addMessage({
        id: (Date.now() + 2).toString(),
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)
      
      if (showToast) {
        showToast('Erreur lors de l\'envoi du message', 'error')
      }
      
      return false
    } finally {
      setIsLoading(false)
    }
  }, [
    uiState.input, 
    uiState.isLoading, 
    currentConversationId, 
    createConversation, 
    addMessage, 
    conversations,
    setIsLoading
  ])

  // Handler pour les touches du clavier
  const handleKeyDown = useCallback((e, showToast) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      
      if (uiState.input.trim() && !uiState.isLoading) {
        handleSend(showToast)
      }
    }
  }, [uiState.input, uiState.isLoading, handleSend])

  // Valeurs calculées mémorisées
  const chatStats = useMemo(() => ({
    conversationsCount: conversations?.length || 0,
    messagesCount: messages?.length || 0,
    hasMessages: messages && messages.length > 0,
    hasConversations: conversations && conversations.length > 0,
    canSend: uiState.input.trim() && !uiState.isLoading
  }), [conversations, messages, uiState.input, uiState.isLoading])

  return {
    // États UI
    ...uiState,
    
    // Setters optimisés
    setInput,
    setIsLoading,
    setSidebarFilter,
    setShowMobileHistory,
    setIsListening,
    updateUiState,
    
    // Données du chat
    conversations,
    currentConversationId,
    messages,
    chatStats,
    
    // Actions du chat
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    
    // Handlers optimisés
    handleSend,
    handleKeyDown,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleCloseConversation
  }
}

export default useChatState
