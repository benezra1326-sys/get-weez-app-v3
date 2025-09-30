import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'getweez_conversations'

export function useConversationsSimple() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Charger les conversations depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const savedConversations = localStorage.getItem(STORAGE_KEY)
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations)
        setConversations(parsed)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Sauvegarder les conversations dans localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return
    
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    }
  }, [conversations, isLoaded])

  // Créer une nouvelle conversation
  const createConversation = useCallback(() => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    const dateString = now.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
    
    const newConversation = {
      id: Date.now().toString(),
      name: `Chat du ${dateString} à ${timeString}`,
      messages: [],
      createdAt: new Date().toISOString()
    }
    
    setConversations(prev => {
      const updated = [newConversation, ...prev]
      return updated.slice(0, 10) // Limiter à 10 conversations
    })
    
    setCurrentConversationId(newConversation.id)
    return newConversation.id
  }, [])

  // Sélectionner une conversation
  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id)
  }, [])

  // Supprimer une conversation
  const deleteConversation = useCallback((id) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id)
      
      if (currentConversationId === id) {
        setCurrentConversationId(filtered.length > 0 ? filtered[0].id : null)
      }
      
      return filtered
    })
  }, [currentConversationId])

  // Ajouter un message à la conversation actuelle
  const addMessage = useCallback((message, targetConversationId = null) => {
    const conversationId = targetConversationId || currentConversationId
    if (!conversationId) return

    setConversations(prev => {
      return prev.map(conv => 
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content.length > 50 
                ? message.content.substring(0, 50) + '...' 
                : message.content
            }
          : conv
      )
    })
  }, [currentConversationId])

  // Obtenir les messages de la conversation actuelle
  const messages = currentConversationId 
    ? conversations.find(conv => conv.id === currentConversationId)?.messages || []
    : []

  return {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    deleteConversation,
    addMessage,
    isLoaded
  }
}
