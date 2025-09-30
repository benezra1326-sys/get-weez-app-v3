import { useState, useReducer, useCallback } from 'react'

// Types d'actions pour le reducer
const CHAT_ACTIONS = {
  SET_INPUT: 'SET_INPUT',
  SET_LOADING: 'SET_LOADING',
  SET_SIDEBAR_FILTER: 'SET_SIDEBAR_FILTER',
  TOGGLE_MOBILE_HISTORY: 'TOGGLE_MOBILE_HISTORY',
  SHOW_DELETE_CONFIRM: 'SHOW_DELETE_CONFIRM',
  HIDE_DELETE_CONFIRM: 'HIDE_DELETE_CONFIRM',
  SET_CONVERSATION_TO_DELETE: 'SET_CONVERSATION_TO_DELETE',
  RESET_DELETE_STATE: 'RESET_DELETE_STATE'
}

// État initial du chat
const initialChatState = {
  input: '',
  isLoading: false,
  sidebarFilter: 'all', // 'all', 'events', 'establishments', 'services', 'luxury'
  showMobileHistory: false,
  showDeleteConfirm: false,
  conversationToDelete: null
}

// Reducer pour gérer l'état du chat
function chatStateReducer(state, action) {
  switch (action.type) {
    case CHAT_ACTIONS.SET_INPUT:
      return { ...state, input: action.payload }
    
    case CHAT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case CHAT_ACTIONS.SET_SIDEBAR_FILTER:
      return { ...state, sidebarFilter: action.payload }
    
    case CHAT_ACTIONS.TOGGLE_MOBILE_HISTORY:
      return { ...state, showMobileHistory: !state.showMobileHistory }
    
    case CHAT_ACTIONS.SHOW_DELETE_CONFIRM:
      return { 
        ...state, 
        showDeleteConfirm: true,
        conversationToDelete: action.payload
      }
    
    case CHAT_ACTIONS.HIDE_DELETE_CONFIRM:
      return { 
        ...state, 
        showDeleteConfirm: false,
        conversationToDelete: null
      }
    
    case CHAT_ACTIONS.RESET_DELETE_STATE:
      return {
        ...state,
        showDeleteConfirm: false,
        conversationToDelete: null
      }
    
    default:
      return state
  }
}

/**
 * Hook personnalisé pour gérer l'état du chat
 * Centralise toute la logique d'état dispersée dans le composant
 */
export function useChatState(initialMessage = '') {
  // État principal du chat avec reducer
  const [chatState, dispatch] = useReducer(chatStateReducer, {
    ...initialChatState,
    input: initialMessage
  })

  // État pour détecter si on est sur mobile
  const [isMobile, setIsMobile] = useState(false)

  // Actions optimisées avec useCallback
  const actions = {
    // Gestion de l'input
    setInput: useCallback((value) => {
      dispatch({ type: CHAT_ACTIONS.SET_INPUT, payload: value })
    }, []),

    clearInput: useCallback(() => {
      dispatch({ type: CHAT_ACTIONS.SET_INPUT, payload: '' })
    }, []),

    // Gestion du loading
    setLoading: useCallback((loading) => {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: loading })
    }, []),

    // Gestion des filtres de la sidebar
    setSidebarFilter: useCallback((filter) => {
      dispatch({ type: CHAT_ACTIONS.SET_SIDEBAR_FILTER, payload: filter })
    }, []),

    // Gestion de l'historique mobile
    toggleMobileHistory: useCallback(() => {
      dispatch({ type: CHAT_ACTIONS.TOGGLE_MOBILE_HISTORY })
    }, []),

    closeMobileHistory: useCallback(() => {
      if (chatState.showMobileHistory) {
        dispatch({ type: CHAT_ACTIONS.TOGGLE_MOBILE_HISTORY })
      }
    }, [chatState.showMobileHistory]),

    // Gestion de la suppression de conversations
    showDeleteConfirm: useCallback((conversationId) => {
      dispatch({ 
        type: CHAT_ACTIONS.SHOW_DELETE_CONFIRM, 
        payload: conversationId 
      })
    }, []),

    hideDeleteConfirm: useCallback(() => {
      dispatch({ type: CHAT_ACTIONS.HIDE_DELETE_CONFIRM })
    }, []),

    resetDeleteState: useCallback(() => {
      dispatch({ type: CHAT_ACTIONS.RESET_DELETE_STATE })
    }, []),

    // Gestion du mobile
    setIsMobile: useCallback((mobile) => {
      setIsMobile(mobile)
    }, [])
  }

  // État dérivé (getters)
  const derived = {
    canSend: chatState.input.trim() && !chatState.isLoading,
    hasInput: Boolean(chatState.input.trim()),
    isDeleteDialogOpen: chatState.showDeleteConfirm && Boolean(chatState.conversationToDelete)
  }

  return {
    // État
    ...chatState,
    isMobile,
    
    // Actions
    ...actions,
    
    // État dérivé
    ...derived
  }
}

export default useChatState