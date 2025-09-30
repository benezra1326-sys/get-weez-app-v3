// 🎯 Hook pour gérer les handlers du chat de manière optimisée
import { useCallback, useRef } from 'react'
import { useConversations } from '../../useConversations'

export function useChatHandlers(chatState, showToast) {
  const textareaRef = useRef(null)
  const {
    conversations,
    currentConversationId,
    createConversation,
    addMessage,
    deleteConversation,
    selectConversation
  } = useConversations()

  const { input, actions } = chatState
  const { setLoading, clearInput, hideDeleteConfirm, setMobileHistory } = actions

  // Handler d'envoi optimisé avec useCallback
  const handleSend = useCallback(async () => {
    if (!input.trim() || chatState.isLoading) return

    const userMessage = input.trim()
    clearInput()
    
    // Créer une conversation si nécessaire
    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = createConversation()
    }

    // Ajouter le message utilisateur
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }, conversationId)
    
    setLoading(true)

    try {
      // Obtenir l'historique des messages
      const currentMessages = conversations.find(conv => conv.id === conversationId)?.messages || []
      
      // Appel API optimisé
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userName: 'Utilisateur',
          isMember: false,
          conversationHistory: currentMessages
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      addMessage({
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage = 'Désolé, une erreur est survenue. Veuillez réessayer.'
      addMessage({
        id: (Date.now() + 2).toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setLoading(false)
    }
  }, [
    input,
    chatState.isLoading,
    currentConversationId,
    conversations,
    createConversation,
    addMessage,
    clearInput,
    setLoading,
    showToast
  ])

  // Handler pour les touches du clavier
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      if (input.trim() && !chatState.isLoading) {
        handleSend()
      }
    }
  }, [input, chatState.isLoading, handleSend])

  // Handler pour la suppression de conversation
  const handleDeleteConfirm = useCallback(() => {
    if (chatState.conversationToDelete) {
      deleteConversation(chatState.conversationToDelete)
      hideDeleteConfirm()
      showToast('Conversation supprimée avec succès', 'success')
    }
  }, [chatState.conversationToDelete, deleteConversation, hideDeleteConfirm, showToast])

  // Handler pour fermer une conversation
  const handleCloseConversation = useCallback(() => {
    if (currentConversationId) {
      selectConversation(null)
      showToast('Conversation fermée', 'info')
    }
  }, [currentConversationId, selectConversation, showToast])

  // Handler pour la reconnaissance vocale
  const handleVoiceInput = useCallback((transcript) => {
    actions.setInput(transcript)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [actions])

  // Handler pour toggle mobile history
  const toggleMobileHistory = useCallback(() => {
    setMobileHistory(!chatState.showMobileHistory)
  }, [chatState.showMobileHistory, setMobileHistory])

  // Handler pour sélectionner une conversation et fermer mobile history
  const handleSelectConversation = useCallback((conversationId) => {
    selectConversation(conversationId)
    if (chatState.isMobile) {
      setMobileHistory(false)
    }
  }, [selectConversation, chatState.isMobile, setMobileHistory])

  // Handler pour créer une nouvelle conversation
  const handleCreateConversation = useCallback(() => {
    createConversation()
    if (chatState.isMobile) {
      setMobileHistory(false)
    }
  }, [createConversation, chatState.isMobile, setMobileHistory])

  // Handler pour auto-resize du textarea
  const handleTextareaChange = useCallback((e) => {
    const value = e.target.value
    actions.setInput(value)
    
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [actions])

  return {
    textareaRef,
    handleSend,
    handleKeyDown,
    handleDeleteConfirm,
    handleCloseConversation,
    handleVoiceInput,
    toggleMobileHistory,
    handleSelectConversation,
    handleCreateConversation,
    handleTextareaChange,
    // État des conversations pour l'UI
    conversations,
    currentConversationId
  }
}