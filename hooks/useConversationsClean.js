import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'getweez_conversations'

export function useConversationsClean() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Référence pour éviter les créations multiples
  const creationLock = useRef(false)

  // Charger les conversations depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedConversations = JSON.parse(stored)
        setConversations(parsedConversations)
        console.log('📚 Conversations chargées:', parsedConversations.length)
      }
      setIsLoaded(true)
    } catch (error) {
      console.error('❌ Erreur chargement conversations:', error)
      setIsLoaded(true)
    }
  }, [])

  // Sauvegarder les conversations (seulement celles avec des messages)
  useEffect(() => {
    if (isLoaded) {
      const conversationsWithMessages = conversations.filter(conv => conv.messages && conv.messages.length > 0)
      if (conversationsWithMessages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationsWithMessages))
        console.log('💾 Conversations sauvegardées:', conversationsWithMessages.length)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [conversations, isLoaded])

  // Obtenir les messages de la conversation actuelle
  const messages = currentConversationId 
    ? conversations.find(conv => conv.id === currentConversationId)?.messages || []
    : []

  // Créer une nouvelle conversation
  const createConversation = useCallback(() => {
    if (creationLock.current || isCreating) {
      console.log('⚠️ Création déjà en cours, annulation')
      return currentConversationId
    }

    creationLock.current = true
    setIsCreating(true)

    const now = new Date()
    const timeString = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    const dateString = now.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    })

    // Pas de message de bienvenue automatique
    const newConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Chat ${dateString} ${timeString}`,
      timeString: timeString,
      messages: [],
      createdAt: now,
      lastActivity: now
    }

    setConversations(prev => {
      const updated = [newConversation, ...prev]
      return updated.slice(0, 10) // Limiter à 10 conversations
    })

    // Utiliser setTimeout pour éviter les problèmes de timing
    setTimeout(() => {
      setCurrentConversationId(newConversation.id)
      setIsCreating(false)
      creationLock.current = false
      console.log('✅ Nouvelle conversation créée:', newConversation.id)
    }, 0)

    return newConversation.id
  }, [isCreating, currentConversationId])

  // Sélectionner une conversation
  const selectConversation = useCallback((id) => {
    if (id === null) {
      setCurrentConversationId(null)
      console.log('📤 Conversation fermée')
      return
    }

    const conversation = conversations.find(conv => conv.id === id)
    if (conversation) {
      setCurrentConversationId(id)
      console.log('📥 Conversation sélectionnée:', id)
    }
  }, [conversations])

  // Fonction pour générer un titre intelligent basé sur le premier message
  const generateSmartTitle = useCallback((firstMessage) => {
    if (!firstMessage || !firstMessage.content) {
      return 'Nouvelle conversation'
    }

    const message = firstMessage.content.toLowerCase()
    
    // Patterns pour détecter les intentions
    const patterns = {
      restaurant: ['restaurant', 'manger', 'dîner', 'déjeuner', 'cuisine', 'gastronomique', 'table'],
      hotel: ['hôtel', 'hébergement', 'chambre', 'séjour', 'booking'],
      transport: ['transport', 'taxi', 'voiture', 'yacht', 'mercedes', 'ferrari', 'chauffeur'],
      evenement: ['événement', 'soirée', 'fête', 'party', 'concert', 'spectacle'],
      spa: ['spa', 'massage', 'wellness', 'relaxation', 'thalasso', 'soin'],
      shopping: ['shopping', 'magasin', 'boutique', 'acheter', 'vêtement', 'luxe'],
      golf: ['golf', 'parcours', 'terrain', 'sport'],
      plage: ['plage', 'beach', 'bain', 'mer', 'sable'],
      culture: ['musée', 'exposition', 'art', 'culture', 'galerie'],
      nightlife: ['club', 'bar', 'boîte', 'nightlife', 'alcool', 'cocktail']
    }

    // Chercher le pattern qui correspond le mieux
    for (const [category, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        switch (category) {
          case 'restaurant':
            if (message.includes('romantique')) return 'Restaurant Romantique 💕'
            if (message.includes('gastronomique')) return 'Restaurant Gastronomique 🍽️'
            if (message.includes('japonais') || message.includes('sushi')) return 'Restaurant Japonais 🍣'
            if (message.includes('italien')) return 'Restaurant Italien 🍝'
            return 'Restaurant 🍽️'
          
          case 'hotel':
            if (message.includes('luxe') || message.includes('5 étoiles')) return 'Hôtel de Luxe 🏨'
            if (message.includes('spa')) return 'Hôtel avec Spa 🧘‍♀️'
            return 'Hébergement 🏨'
          
          case 'transport':
            if (message.includes('yacht')) return 'Yacht Privé ⛵'
            if (message.includes('ferrari') || message.includes('sport')) return 'Voiture de Sport 🏎️'
            if (message.includes('mercedes')) return 'Transport Luxe 🚗'
            return 'Transport Privé 🚗'
          
          case 'evenement':
            if (message.includes('vip')) return 'Événement VIP 🎉'
            if (message.includes('concert')) return 'Concert 🎵'
            if (message.includes('mariage')) return 'Mariage 💒'
            return 'Événement 🎉'
          
          case 'spa':
            if (message.includes('massage')) return 'Massage & Relaxation 💆‍♀️'
            if (message.includes('thalasso')) return 'Thalasso 🌊'
            return 'Spa & Wellness 🧘‍♀️'
          
          case 'shopping':
            if (message.includes('luxe')) return 'Shopping de Luxe 🛍️'
            if (message.includes('banús')) return 'Puerto Banús 🛍️'
            return 'Shopping 🛍️'
          
          case 'golf':
            return 'Golf ⛳'
          
          case 'plage':
            return 'Plage Privée 🏖️'
          
          case 'culture':
            return 'Culture & Art 🎨'
          
          case 'nightlife':
            return 'Nightlife VIP 🍸'
          
          default:
            return `${category.charAt(0).toUpperCase() + category.slice(1)} 🎯`
        }
      }
    }

    // Si aucun pattern ne correspond, créer un titre basé sur les premiers mots
    const words = firstMessage.content.split(' ').slice(0, 4)
    const title = words.join(' ')
    return title.length > 30 ? title.substring(0, 27) + '...' : title
  }, [])

  // Ajouter un message à une conversation
  const addMessage = useCallback((message, conversationId = currentConversationId) => {
    if (!conversationId) {
      console.error('❌ Pas de conversation pour ajouter le message')
      return
    }

    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, message]
          
          // Garder le titre original (pas de génération automatique)
          let updatedTitle = conv.title
          
          return {
            ...conv,
            messages: updatedMessages,
            title: updatedTitle,
            lastActivity: new Date()
          }
        }
        return conv
      })
    )

    console.log('💬 Message ajouté à:', conversationId)
  }, [currentConversationId, generateSmartTitle])

  // Supprimer une conversation
  const deleteConversation = useCallback((id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id))
    
    if (currentConversationId === id) {
      setCurrentConversationId(null)
    }
    
    console.log('🗑️ Conversation supprimée:', id)
  }, [currentConversationId])

  // Renommer une conversation
  const renameConversation = useCallback((id, newTitle) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, title: newTitle }
          : conv
      )
    )
    console.log('✏️ Conversation renommée:', id, '->', newTitle)
  }, [])

  // Obtenir la conversation actuelle
  const getCurrentConversation = useCallback(() => {
    return conversations.find(conv => conv.id === currentConversationId)
  }, [conversations, currentConversationId])

  return {
    conversations,
    currentConversationId,
    messages,
    isCreating,
    isLoaded,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    renameConversation,
    getCurrentConversation
  }
}
