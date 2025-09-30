import { useState, useCallback, useMemo, useReducer } from 'react'

// Actions pour le reducer
const CHAT_ACTIONS = {
  SET_INPUT: 'SET_INPUT',
  SET_LOADING: 'SET_LOADING',
  SET_LISTENING: 'SET_LISTENING',
  SET_MOBILE_HISTORY: 'SET_MOBILE_HISTORY',
  SET_SIDEBAR_FILTER: 'SET_SIDEBAR_FILTER',
  TOGGLE_DELETE_MODAL: 'TOGGLE_DELETE_MODAL',
  SET_CONVERSATION_TO_DELETE: 'SET_CONVERSATION_TO_DELETE'
}

// État initial optimisé
const initialChatState = {
  input: '',
  isLoading: false,
  isListening: false,
  showMobileHistory: false,
  sidebarFilter: 'all',
  showDeleteConfirm: false,
  conversationToDelete: null
}

// Reducer pour optimiser les updates d'état
const chatStateReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.SET_INPUT:
      return { ...state, input: action.payload }
    
    case CHAT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case CHAT_ACTIONS.SET_LISTENING:
      return { ...state, isListening: action.payload }
    
    case CHAT_ACTIONS.SET_MOBILE_HISTORY:
      return { ...state, showMobileHistory: action.payload }
    
    case CHAT_ACTIONS.SET_SIDEBAR_FILTER:
      return { ...state, sidebarFilter: action.payload }
    
    case CHAT_ACTIONS.TOGGLE_DELETE_MODAL:
      return { 
        ...state, 
        showDeleteConfirm: action.payload.show,
        conversationToDelete: action.payload.conversationId || null
      }
    
    default:
      return state
  }
}

/**
 * Hook optimisé pour la gestion d'état du chat
 * Remplace les multiples useState du composant original
 */
export const useChatState = (initialMessage) => {
  const [state, dispatch] = useReducer(chatStateReducer, {
    ...initialChatState,
    input: initialMessage || ''
  })

  // Actions memoizées pour éviter les re-renders
  const actions = useMemo(() => ({
    setInput: (input) => dispatch({ type: CHAT_ACTIONS.SET_INPUT, payload: input }),
    setLoading: (loading) => dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: loading }),
    setListening: (listening) => dispatch({ type: CHAT_ACTIONS.SET_LISTENING, payload: listening }),
    setMobileHistory: (show) => dispatch({ type: CHAT_ACTIONS.SET_MOBILE_HISTORY, payload: show }),
    setSidebarFilter: (filter) => dispatch({ type: CHAT_ACTIONS.SET_SIDEBAR_FILTER, payload: filter }),
    showDeleteModal: (conversationId) => dispatch({ 
      type: CHAT_ACTIONS.TOGGLE_DELETE_MODAL, 
      payload: { show: true, conversationId }
    }),
    hideDeleteModal: () => dispatch({ 
      type: CHAT_ACTIONS.TOGGLE_DELETE_MODAL, 
      payload: { show: false }
    })
  }), [])

  return {
    state,
    actions
  }
}

/**
 * Hook pour la gestion des messages optimisée
 */
export const useMessageHandling = (conversations, currentConversationId, addMessage, createConversation) => {
  const handleSendMessage = useCallback(async (message, setLoading, showToast) => {
    if (!message.trim()) return

    // Créer une conversation si nécessaire
    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = createConversation()
    }

    // Ajouter le message utilisateur
    const userMessageId = Date.now().toString()
    addMessage({
      id: userMessageId,
      content: message,
      role: 'user',
      timestamp: new Date()
    }, conversationId)
    
    setLoading(true)

    try {
      // Obtenir l'historique des messages
      const currentMessages = conversations.find(conv => conv.id === conversationId)?.messages || []
      
      // Appeler l'API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
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
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      
      addMessage({
        id: (Date.now() + 2).toString(),
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        role: 'assistant',
        timestamp: new Date()
      }, conversationId)
      
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setLoading(false)
    }
  }, [conversations, currentConversationId, addMessage, createConversation])

  return {
    handleSendMessage
  }
}

/**
 * Hook pour la reconnaissance vocale optimisée
 */
export const useSpeechRecognition = (setInput, setListening, showToast) => {
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Reconnaissance vocale non supportée', 'error')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'fr-FR'
    
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => {
      setListening(false)
      showToast('Erreur de reconnaissance vocale', 'error')
    }
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }
    
    recognition.start()
  }, [setInput, setListening, showToast])

  return { startListening }
}

/**
 * Hook pour la gestion des événements clavier optimisée
 */
export const useKeyboardHandlers = (input, isLoading, handleSend) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      
      if (input.trim() && !isLoading) {
        handleSend()
      }
    }
  }, [input, isLoading, handleSend])

  return { handleKeyDown }
}

/**
 * Hook pour la détection mobile optimisée
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 1024)
  }, [])

  // Effect sera utilisé dans le composant
  return { isMobile, checkMobile }
}

/**
 * Hook pour les filtres de sidebar optimisés
 */
export const useSidebarFilters = () => {
  const filterOptions = useMemo(() => [
    { key: 'all', label: '🌟 Tout', gradient: 'from-blue-600 to-purple-600' },
    { key: 'events', label: '🎉 Événements', gradient: 'from-purple-600 to-pink-600' },
    { key: 'establishments', label: '🍽️ Restaurants', gradient: 'from-green-600 to-emerald-600' },
    { key: 'services', label: '⭐ Services', gradient: 'from-indigo-600 to-purple-600' },
    { key: 'luxury', label: '💎 Luxe', gradient: 'from-amber-600 to-orange-600' }
  ], [])

  return { filterOptions }
}

/**
 * Hook principal qui combine tous les hooks d'état
 */
export const useChatInterfaceState = (user, initialMessage, establishmentName) => {
  const { state, actions } = useChatState(initialMessage)
  const { isMobile, checkMobile } = useMobileDetection()
  const { filterOptions } = useSidebarFilters()

  // État dérivé memoizé
  const derivedState = useMemo(() => ({
    hasInput: !!state.input.trim(),
    canSend: !!state.input.trim() && !state.isLoading,
    isInputDisabled: state.isLoading
  }), [state.input, state.isLoading])

  return {
    // État principal
    ...state,
    isMobile,
    
    // Actions
    ...actions,
    checkMobile,
    
    // État dérivé
    ...derivedState,
    
    // Constantes
    filterOptions
  }
}