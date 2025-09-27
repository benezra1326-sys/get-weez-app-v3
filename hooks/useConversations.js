import { useState, useEffect } from 'react'

const STORAGE_KEY = 'getweez_conversations'

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  // Charger les conversations depuis localStorage
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return
    
    const savedConversations = localStorage.getItem(STORAGE_KEY)
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        setConversations(parsed)
        
        // Sélectionner la première conversation si aucune n'est sélectionnée
        if (parsed.length > 0 && !currentConversationId) {
          setCurrentConversationId(parsed[0].id)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error)
        // En cas d'erreur, nettoyer le localStorage
        localStorage.removeItem(STORAGE_KEY)
        setConversations([])
        setCurrentConversationId(null)
      }
    }
  }, []) // Ne pas inclure currentConversationId dans les dépendances

  // Sauvegarder les conversations dans localStorage
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return
    
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    }
  }, [conversations])

  // Créer une nouvelle conversation
  const createConversation = () => {
    // Protection contre les créations multiples
    if (isCreating) {
      console.log('⚠️ Création déjà en cours, annulation')
      return currentConversationId
    }

    console.log('🔍 Tentative de création de conversation...')
    console.log('🔍 Conversations actuelles:', conversations.length)
    console.log('🔍 ID actuel:', currentConversationId)
    
    // Si on a déjà une conversation active, ne pas en créer une nouvelle
    if (currentConversationId && conversations.some(conv => conv.id === currentConversationId)) {
      console.log('⚠️ Une conversation est déjà active, utilisation de celle-ci')
      return currentConversationId
    }

    console.log('✅ Création d\'une nouvelle conversation')
    setIsCreating(true)
    
    // Calculer le prochain numéro de conversation
    const nextNumber = conversations.length + 1
    
    const newConversation = {
      id: Date.now().toString(),
      name: `Conversation ${nextNumber}`,
      messages: [],
      lastMessage: '',
      createdAt: new Date().toISOString(),
      updatedAt: formatDate(new Date())
    }
    
    setConversations(prev => {
      const updated = [newConversation, ...prev]
      // Limiter à 10 conversations maximum
      return updated.slice(0, 10)
    })
    
    // Utiliser setTimeout pour éviter les problèmes de state
    setTimeout(() => {
      setCurrentConversationId(newConversation.id)
      setIsCreating(false)
    }, 0)
    
    return newConversation.id
  }

  // Sélectionner une conversation
  const selectConversation = (id) => {
    setCurrentConversationId(id)
  }

  // Supprimer une conversation
  const deleteConversation = (id) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id)
      
      // Si on supprime la conversation actuelle, sélectionner la première disponible
      if (currentConversationId === id) {
        setCurrentConversationId(filtered.length > 0 ? filtered[0].id : null)
      }
      
      return filtered
    })
  }

  // Renommer une conversation
  const renameConversation = (id, newName) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, name: newName, updatedAt: formatDate(new Date()) }
          : conv
      )
    )
  }

  // Ajouter un message à la conversation actuelle
  const addMessage = (message) => {
    if (!currentConversationId) return

    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.text.length > 50 
                ? message.text.substring(0, 50) + '...' 
                : message.text,
              updatedAt: formatDate(new Date())
            }
          : conv
      )
    )
  }

  // Obtenir la conversation actuelle
  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === currentConversationId)
  }

  // Obtenir les messages de la conversation actuelle
  const getCurrentMessages = () => {
    const current = getCurrentConversation()
    return current ? current.messages : []
  }

  // Formater la date pour l'affichage
  function formatDate(date) {
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) { // Moins d'1 minute
      return 'À l\'instant'
    } else if (diff < 3600000) { // Moins d'1 heure
      const minutes = Math.floor(diff / 60000)
      return `Il y a ${minutes}min`
    } else if (diff < 86400000) { // Moins d'1 jour
      const hours = Math.floor(diff / 3600000)
      return `Il y a ${hours}h`
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return {
    conversations,
    currentConversationId,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    addMessage,
    getCurrentConversation,
    getCurrentMessages
  }
}
