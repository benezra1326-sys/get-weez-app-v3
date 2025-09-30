import { useState, useCallback, useMemo, useRef } from 'react'
import { useConversations } from './useConversations'
import { useToast } from '../components/ui/Toast'

/**
 * Hook optimisé pour la gestion du chat
 * Sépare la logique business de l'UI
 */
export const useChatOptimized = (user, initialMessage) => {
  const { showToast } = useToast()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef(null)

  const {
    conversations,
    currentConversationId,
    messages,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation
  } = useConversations()

  // Mémorise la fonction d'envoi de message
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = createConversation()
    }

    // Ajouter le message utilisateur
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }, conversationId)
    
    setIsLoading(true)

    try {
      const currentMessages = conversations.find(conv => conv.id === conversationId)?.messages || []
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userName: user?.name || 'Utilisateur',
          isMember: user?.isMember || false,
          conversationHistory: currentMessages
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      addMessage({
        id: (Date.now() + 1).toString(),
        content: data.reply,
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
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, currentConversationId, createConversation, addMessage, showToast, conversations, user])

  // Mémorise la gestion des touches
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      if (input.trim() && !isLoading) {
        handleSend()
      }
    }
  }, [input, isLoading, handleSend])

  // Mémorise la fonction de dictée
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToast('Reconnaissance vocale non supportée', 'error')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'fr-FR'
    
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => {
      setIsListening(false)
      showToast('Erreur de reconnaissance vocale', 'error')
    }
    recognition.onend = () => setIsListening(false)
    
    recognition.start()
  }, [showToast])

  // Mémorise la fermeture de conversation
  const handleCloseConversation = useCallback(() => {
    if (currentConversationId) {
      selectConversation(null)
      showToast('Conversation fermée', 'info')
    }
  }, [currentConversationId, selectConversation, showToast])

  // Valeurs mémorisées
  const chatState = useMemo(() => ({
    input,
    setInput,
    isLoading,
    isListening,
    textareaRef,
    conversations,
    currentConversationId,
    messages,
    hasMessages: messages && messages.length > 0
  }), [input, isLoading, isListening, conversations, currentConversationId, messages])

  const chatActions = useMemo(() => ({
    handleSend,
    handleKeyDown,
    startListening,
    createConversation,
    selectConversation,
    deleteConversation,
    handleCloseConversation
  }), [handleSend, handleKeyDown, startListening, createConversation, selectConversation, deleteConversation, handleCloseConversation])

  return {
    ...chatState,
    ...chatActions
  }
}