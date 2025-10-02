import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'getweez_conversations'

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationIdRaw] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  // Wrapper pour tracer les changements de currentConversationId
  const setCurrentConversationId = (newId) => {
    console.log('📝 setCurrentConversationId:', currentConversationId, '->', newId)
    console.log('📝 Stack trace:', new Error().stack.split('\n')[1])
    setCurrentConversationIdRaw(newId)
  }

  // Nettoyer les conversations vides
  const cleanEmptyConversations = (conversationsList) => {
    return conversationsList.filter(conv => {
      // Garder la conversation si elle a des messages
      const hasMessages = conv.messages && conv.messages.length > 0
      console.log(`🔍 Conversation ${conv.id} (${conv.title}): ${hasMessages ? 'GARDÉE' : 'SUPPRIMÉE (vide)'}`)
      return hasMessages
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
        
        // Nettoyer les conversations vides au chargement
        const cleaned = cleanEmptyConversations(parsed)
        
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
    
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    }
  }, [conversations])

  // Créer une nouvelle conversation
  const createConversation = () => {
    console.log('🆕🆕🆕 createConversation APPELÉ!')
    console.log('🆕 Stack trace:', new Error().stack)
    console.log('🆕 isCreating:', isCreating)
    console.log('🆕 currentConversationId:', currentConversationId)
    
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
    
    // Message de bienvenue automatique amélioré
    const welcomeMessage = {
      id: `welcome-${Date.now()}`,
      content: "✨ **Bienvenue sur Get Weez !** 🏖️\n\nJe suis votre **concierge IA personnel** pour vivre Marbella comme un local ! 🇪🇸\n\n🎯 **Je peux vous aider avec :**\n• 🍽️ **Restaurants** exclusifs et tables VIP\n• 🎉 **Événements** et soirées privées\n• 🛥️ **Yachts** et expériences de luxe\n• 🏨 **Hébergements** premium\n• 🚁 **Activités** uniques\n\n💬 **Dites-moi simplement ce dont vous rêvez** et je m'occupe de tout ! ✨",
      role: 'assistant',
      timestamp: new Date()
    }

    const newConversation = {
      id: Date.now().toString(),
      name: `Chat du ${dateString} à ${timeString}`,
      messages: [welcomeMessage],
      lastMessage: 'Bonjour ! Comment puis-je vous aider ?',
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
    console.log('🎯 selectConversation appelé avec ID:', id)
    console.log('🎯 ID actuel:', currentConversationId)
    console.log('🎯 Stack trace:', new Error().stack)
    setCurrentConversationId(id)
  }

  // Supprimer une conversation
  const deleteConversation = (id) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id)
      
      // Si on supprime la conversation actuelle, la fermer (ne pas en sélectionner une autre)
      if (currentConversationId === id) {
        console.log('🗑️ Suppression de la conversation actuelle - fermeture')
        setCurrentConversationId(null) // Fermer au lieu de sélectionner une autre
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
      const updated = prev.map(conv => 
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content.length > 50 
                ? message.content.substring(0, 50) + '...' 
                : message.content,
              updatedAt: formatDate(new Date())
            }
          : conv
      )
      
      // Nettoyer les conversations vides après chaque ajout de message
      const cleaned = cleanEmptyConversations(updated)
      
      // Si des conversations vides ont été supprimées, mettre à jour la conversation actuelle
      if (cleaned.length !== updated.length) {
        console.log('🧹 Conversations vides supprimées automatiquement')
        
        // Si la conversation actuelle a été supprimée (elle était vide), la fermer
        if (!cleaned.find(conv => conv.id === conversationId)) {
          console.log('🗑️ Conversation actuelle supprimée car vide - fermeture')
          setCurrentConversationId(null) // Fermer au lieu de créer une nouvelle
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
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
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
