// 🧠 Hook pour gérer l'état global du chat de manière optimisée
import { useReducer, useCallback, useMemo } from 'react'

const initialState = {
  input: '',
  isLoading: false,
  showDeleteConfirm: false,
  conversationToDelete: null,
  sidebarFilter: 'all',
  showMobileHistory: false,
  isListening: false,
  isMobile: false
}

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_MOBILE_HISTORY':
      return { ...state, showMobileHistory: action.payload }
    
    case 'SET_SIDEBAR_FILTER':
      return { ...state, sidebarFilter: action.payload }
    
    case 'SET_LISTENING':
      return { ...state, isListening: action.payload }
    
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload }
    
    case 'SHOW_DELETE_CONFIRM':
      return { 
        ...state, 
        showDeleteConfirm: true, 
        conversationToDelete: action.payload 
      }
    
    case 'HIDE_DELETE_CONFIRM':
      return { 
        ...state, 
        showDeleteConfirm: false, 
        conversationToDelete: null 
      }
    
    case 'CLEAR_INPUT':
      return { ...state, input: '' }
    
    case 'RESET_STATE':
      return { ...initialState, isMobile: state.isMobile }
    
    default:
      return state
  }
}

export function useChatState() {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  
  // Actions mémorisées pour éviter les re-renders
  const actions = useMemo(() => ({
    setInput: (value) => dispatch({ type: 'SET_INPUT', payload: value }),
    setLoading: (value) => dispatch({ type: 'SET_LOADING', payload: value }),
    setMobileHistory: (value) => dispatch({ type: 'SET_MOBILE_HISTORY', payload: value }),
    setSidebarFilter: (value) => dispatch({ type: 'SET_SIDEBAR_FILTER', payload: value }),
    setListening: (value) => dispatch({ type: 'SET_LISTENING', payload: value }),
    setIsMobile: (value) => dispatch({ type: 'SET_IS_MOBILE', payload: value }),
    showDeleteConfirm: (conversationId) => dispatch({ type: 'SHOW_DELETE_CONFIRM', payload: conversationId }),
    hideDeleteConfirm: () => dispatch({ type: 'HIDE_DELETE_CONFIRM' }),
    clearInput: () => dispatch({ type: 'CLEAR_INPUT' }),
    resetState: () => dispatch({ type: 'RESET_STATE' })
  }), [])

  // État dérivé mémorisé
  const derived = useMemo(() => ({
    hasInput: state.input.trim().length > 0,
    canSend: state.input.trim().length > 0 && !state.isLoading,
    showMobileOnly: state.isMobile,
    showDesktopOnly: !state.isMobile
  }), [state.input, state.isLoading, state.isMobile])

  return {
    ...state,
    ...derived,
    actions
  }
}