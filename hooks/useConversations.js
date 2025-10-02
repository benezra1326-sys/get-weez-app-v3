import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'getweez_conversations'

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationIdRaw] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // ID unique pour tracer chaque instance du hook
  const hookInstanceId = useRef('hook-' + Math.random().toString(36).substr(2, 9)).current
  
  // Référence pour annuler les timeouts en cours
  const timeoutRef = useRef(null)
  
  // INTERCEPTEUR GLOBAL - Tracer TOUS les renders
  console.log(`🔄 useConversations [${hookInstanceId}] RENDER:`, {
    conversationsCount: conversations.length,
    currentConversationId,
    isCreating
  })

  // COMPTEUR GLOBAL D'INSTANCES
  if (typeof window !== 'undefined') {
    if (!window.conversationHookInstances) {
      window.conversationHookInstances = new Set()
    }
    window.conversationHookInstances.add(hookInstanceId)
    console.log(`🚨 INSTANCES ACTIVES useConversations:`, Array.from(window.conversationHookInstances))
    
    // TRAÇAGE GLOBAL DES APPELS
    if (!window.allHookCalls) {
      window.allHookCalls = []
    }
    
    // Calculer messagesCount de façon sûre sans appeler getCurrentMessages()
    const currentMessages = currentConversationId 
      ? conversations.find(conv => conv.id === currentConversationId)?.messages || []
      : []
    
    window.allHookCalls.push({
      hookId: hookInstanceId,
      timestamp: new Date().toISOString(),
      conversationId: currentConversationId,
      messagesCount: currentMessages.length
    })
    
    // Garder seulement les 20 derniers appels
    if (window.allHookCalls.length > 20) {
      window.allHookCalls = window.allHookCalls.slice(-20)
    }
    
    console.log('📈 HISTORIQUE DES HOOKS:', window.allHookCalls)
  }

  // Wrapper pour tracer les changements de currentConversationId
  const setCurrentConversationId = (newId) => {
    const stack = new Error().stack
    console.log(`📝📝📝 [${hookInstanceId}] setCurrentConversationId APPELÉ!`)
    console.log('📝 Ancien ID:', currentConversationId)
    console.log('📝 Nouveau ID:', newId) 
    console.log('📝 Stack trace complet:')
    console.log(stack)
    console.log('📝📝📝 FIN TRACE')
    
    // PROTECTION ULTIME: Bloquer tout changement qui remet un ID après fermeture
    if (typeof window !== 'undefined' && (window.conversationJustClosed || window.conversationForceClosed) && newId !== null) {
      console.log('🚫🚫🚫 BLOCAGE! Tentative de réouverture après fermeture détectée!')
      console.log('🚫 Hook:', hookInstanceId)
      console.log('🚫 Tentative de remettre ID:', newId)
      console.log('🚫 IGNORÉ pour éviter réouverture automatique!')
      return // BLOQUER la réouverture
    }
    
    // Marquer qu'on a fermé si newId = null
    if (newId === null && typeof window !== 'undefined') {
      console.log('✅ Fermeture détectée - marquage pour bloquer réouvertures')
      window.conversationJustClosed = true
      // Reset après 1 seconde pour permettre créations manuelles futures
      setTimeout(() => {
        window.conversationJustClosed = false
        console.log('✅ Reset - réouvertures redeviennent possibles')
      }, 1000)
    }
    
    // Ajouter une pause pour voir dans les logs
    if (typeof window !== 'undefined') {
      window.lastConversationChange = {
        hookInstanceId,
        from: currentConversationId,
        to: newId,
        timestamp: new Date().toISOString(),
        stack: stack
      }
    }
    
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
    console.log('🏃 useEffect CHARGEMENT localStorage EXECUTE')
    
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
        
        console.log('📁 Conversations chargées:', cleaned.length)
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
    console.log('🏃 useEffect SAUVEGARDE localStorage EXECUTE - conversations:', conversations.length)
    
    // Vérifier si on est côté client
    if (typeof window === 'undefined') return
    
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
      console.log('💾 Conversations sauvegardées:', conversations.length)
    }
  }, [conversations])

  // Créer une nouvelle conversation
  const createConversation = () => {
    const stack = new Error().stack
    console.log(`🚫🚫🚫🚫🚫 [${hookInstanceId}] createConversation BLOQUÉ POUR DEBUG!`)
    console.log('🚫 Stack trace COMPLET:')
    console.log(stack)
    console.log('🚫🚫🚫🚫🚫 FIN TRACE CREATE BLOQUE')
    
    // BLOQUER COMPLÈTEMENT LA CRÉATION
    return null
    
    // CODE ORIGINAL COMMENTÉ POUR DEBUG
    /*
    console.log(`🆕🆕🆕🆕🆕 [${hookInstanceId}] createConversation APPELÉ!`)
    console.log('🆕 Stack trace COMPLET:')
    console.log(stack)
    console.log('🆕 isCreating:', isCreating)
    console.log('🆕 currentConversationId:', currentConversationId)
    console.log('🆕🆕🆕🆕🆕 FIN TRACE CREATE')
    
    // Ajouter une pause pour voir dans les logs
    if (typeof window !== 'undefined') {
      window.lastCreateConversation = {
        hookInstanceId,
        timestamp: new Date().toISOString(),
        stack: stack,
        currentId: currentConversationId
      }
    }
    
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
    
    // Annuler tout timeout en cours
    if (timeoutRef.current) {
      console.log('⏰ Annulation du timeout précédent')
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    // Utiliser setTimeout pour éviter les problèmes de state
    timeoutRef.current = setTimeout(() => {
      setCurrentConversationId(newConversation.id)
      setIsCreating(false)
      timeoutRef.current = null
    }, 0)
    
    return newConversation.id
    */
  }

  // Sélectionner une conversation
  const selectConversation = (id) => {
    const stack = new Error().stack
    console.log('🎯🎯🎯🎯🎯 selectConversation APPELÉ!')
    console.log('🎯 Ancien ID:', currentConversationId)
    console.log('🎯 Nouveau ID:', id)
    console.log('🎯 Stack trace COMPLET:')
    console.log(stack)
    console.log('🎯🎯🎯🎯🎯 FIN TRACE SELECT')
    
    // CRITICAL: Annuler les timeouts en cours si on ferme (id = null)
    if (id === null && timeoutRef.current) {
      console.log('🚫 ANNULATION du timeout createConversation en cours!')
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    setCurrentConversationId(id)
  }

  // Supprimer une conversation
  const deleteConversation = (id) => {
    // CRITICAL: Annuler les timeouts en cours
    if (timeoutRef.current) {
      console.log('🚫 ANNULATION du timeout createConversation lors de la suppression!')
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
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
