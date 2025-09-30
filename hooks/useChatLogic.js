import { useCallback } from 'react'
import { useConversations } from './useConversations'
import { useChatState } from './useChatState'

/**
 * Hook partagé pour la logique de chat commune entre mobile et desktop
 * ÉLIMINE LA DUPLICATION de code entre ChatInterface et MobileChatInterface
 */
export function useChatLogic(initialMessage, showToast, establishmentName, user) {
  // État centralisé
  const chatState = useChatState(initialMessage)
  
  // Logique des conversations
  const conversationsLogic = useConversations()
  const {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation
  } = conversationsLogic

  // Fonction d'envoi de message UNIFIÉE
  const handleSend = useCallback(async () => {
    // Utiliser l'état dérivé optimisé
    if (!chatState.canSend) return

    const userMessage = chatState.input.trim()
    console.log('📝 Message utilisateur:', userMessage)
    
    // Actions optimisées du hook
    chatState.clearInput()
    
    // Créer une conversation si nécessaire
    let conversationId = currentConversationId
    if (!conversationId) {
      console.log('🔧 Création d\'une nouvelle conversation...')
      conversationId = createConversation()
    }

    // Ajouter le message utilisateur
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }, conversationId)
    
    chatState.setLoading(true)

    try {
      // Obtenir l'historique des messages
      const currentMessages = conversations.find(conv => conv.id === conversationId)?.messages || []
      
      // Appeler l'API de chat UNIFIÉE
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userName: user?.name || 'Utilisateur',
          isMember: user?.isMember || false,
          conversationHistory: currentMessages,
          establishmentName
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📥 Réponse reçue:', data)
      
      // Ajouter la réponse de l'IA
      addMessage({
        id: (Date.now() + 1).toString(),
        content: data.reply || data.message, // Support des deux formats d'API
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
      showToast?.('Erreur lors de l\'envoi du message', 'error')
    } finally {
      chatState.setLoading(false)
    }
  }, [
    chatState.canSend,
    chatState.input,
    chatState.clearInput,
    chatState.setLoading,
    currentConversationId,
    createConversation,
    addMessage,
    conversations,
    establishmentName,
    user,
    showToast
  ])

  // Fonction de fermeture de conversation UNIFIÉE
  const handleCloseConversation = useCallback(() => {
    if (currentConversationId) {
      selectConversation(null)
      showToast?.('Conversation fermée', 'info')
    }
  }, [currentConversationId, selectConversation, showToast])

  // Fonction de suppression UNIFIÉE
  const handleDeleteConfirm = useCallback(() => {
    if (chatState.conversationToDelete) {
      deleteConversation(chatState.conversationToDelete)
      chatState.hideDeleteConfirm()
      showToast?.('Conversation supprimée avec succès', 'success')
    }
  }, [chatState.conversationToDelete, deleteConversation, chatState.hideDeleteConfirm, showToast])

  // Actions rapides pour suggestions
  const handleSuggestionClick = useCallback((suggestion) => {
    chatState.setInput(suggestion)
    // Auto-focus optionnel selon la plateforme
  }, [chatState.setInput])

  // Retourner TOUTE la logique unifiée
  return {
    // État du chat
    ...chatState,
    
    // Logique des conversations
    conversations,
    currentConversationId,
    messages,
    
    // Actions unifiées
    handleSend,
    handleCloseConversation,
    handleDeleteConfirm,
    handleSuggestionClick,
    
    // Actions conversations
    createConversation,
    selectConversation,
    deleteConversation,
    
    // État dérivé utile
    hasMessages: messages && messages.length > 0,
    conversationCount: conversations?.length || 0
  }
}

export default useChatLogic