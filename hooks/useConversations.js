import { useState, useEffect, useCallback } from 'react'
import { generateConversationTitle } from '../lib/autoLanguageDetection'

const STORAGE_KEY = 'gliitz_conversations'

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  // Nettoyer les conversations vides (mais garder celles récentes)
  const cleanEmptyConversations = (conversationsList) => {
    return conversationsList.filter(conv => {
      // Garder la conversation si elle a des messages
      const hasMessages = conv.messages && conv.messages.length > 0
      
      // Ou si elle a été créée récemment (moins de 5 minutes)
      const isRecent = conv.createdAt && (Date.now() - new Date(conv.createdAt).getTime()) < 5 * 60 * 1000
      
      const shouldKeep = hasMessages || isRecent
      console.log(`🔍 Conversation ${conv.id} (${conv.title || conv.name}): ${shouldKeep ? 'GARDÉE' : 'SUPPRIMÉE (vide/ancienne)'}`)
      return shouldKeep
    })
  }

  // Charger les conversations depuis localStorage
  useEffect(() => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return
    
    const savedConversations = localStorage.getItem(STORAGE_KEY)
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        
        // Convertir les timestamps string en objets Date
        const withDates = parsed.map(conv => ({
          ...conv,
          messages: conv.messages?.map(msg => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          })) || []
        }))
        
        // Nettoyer les conversations vides au chargement
        const cleaned = cleanEmptyConversations(withDates)
        
        if (cleaned.length !== parsed.length) {
          console.log('🧹 Conversations vides supprimées au chargement')
          // Sauvegarder la version nettoyée
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
        }
        
        setConversations(cleaned)
        
        // Ne pas sélectionner automatiquement une conversation existante
        // L'utilisateur devra créer une nouvelle conversation ou en sélectionner une manuellement
        // setCurrentConversationId(null) // Garder null pour forcer la création d'une nouvelle conversation
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
    
    // Sauvegarder même les conversations vides pour éviter les pertes
    console.log('💾 Sauvegarde conversations:', conversations.length)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
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
    
    setIsCreating(true)
    
    // Générer un nom intelligent basé sur l'heure et la date
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
      name: `Chat du ${dateString} à ${timeString}`, // Sera mis à jour avec le premier message
      messages: [],
      lastMessage: '',
      createdAt: new Date().toISOString(),
      updatedAt: formatDate(new Date()),
      autoTitleGenerated: false // Pour savoir si on doit générer un titre
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
    console.log('📍 selectConversation appelé avec ID:', id)
    const conv = conversations.find(c => c.id === id)
    if (conv) {
      console.log('✅ Conversation trouvée:', conv.name, 'avec', conv.messages?.length || 0, 'messages')
      setCurrentConversationId(id)
    } else {
      console.error('❌ Conversation non trouvée pour ID:', id)
    }
  }

  // Supprimer une conversation
  const deleteConversation = (id) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id)
      
      // Si on supprime la conversation actuelle, revenir à l'écran d'accueil
      if (currentConversationId === id) {
        setCurrentConversationId(null)
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
  const addMessage = (message, targetConversationId = null) => {
    const conversationId = targetConversationId || currentConversationId
    console.log('🔧 addMessage appelé:', { message, targetConversationId, conversationId, currentConversationId })
    if (!conversationId) {
      console.log('❌ addMessage: Pas de conversationId, abandon')
      return
    }

    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id !== conversationId) return conv
        
        const updatedMessages = [...conv.messages, message]
        
        // Générer un titre automatique basé sur le premier message utilisateur
        let newName = conv.name
        if (!conv.autoTitleGenerated && message.role === 'user' && updatedMessages.length === 1) {
          newName = generateConversationTitle(message.content)
          console.log('📝 Titre auto-généré:', newName)
        }
        
        return {
          ...conv,
          name: newName,
          messages: updatedMessages,
          lastMessage: message.content.length > 50 
            ? message.content.substring(0, 50) + '...' 
            : message.content,
          updatedAt: formatDate(new Date()),
          autoTitleGenerated: true
        }
      })
      
      // Nettoyer les conversations vides après chaque ajout de message
      const cleaned = cleanEmptyConversations(updated)
      
      // Si des conversations vides ont été supprimées, mettre à jour la conversation actuelle
      if (cleaned.length !== updated.length) {
        console.log('🧹 Conversations vides supprimées automatiquement')
        
        // Si la conversation actuelle a été supprimée (elle était vide), créer une nouvelle
        if (!cleaned.find(conv => conv.id === conversationId)) {
          console.log('🆕 Création d\'une nouvelle conversation car l\'ancienne était vide')
          const newConv = {
            id: Date.now().toString(),
            title: 'Nouvelle conversation',
            messages: [],
            lastMessage: '',
            createdAt: formatDate(new Date()),
            updatedAt: formatDate(new Date())
          }
          setCurrentConversationId(newConv.id)
          return [...cleaned, newConv]
        }
      }
      
      return cleaned
    })
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
        month: 'short'
      })
    }
  }

  // Obtenir les messages de la conversation actuelle
  const messages = getCurrentMessages()

  return {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    addMessage,
    getCurrentConversation,
    getCurrentMessages
  }
}
