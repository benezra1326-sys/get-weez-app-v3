import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'getweez_conversations'

export function useConversationsBackup() {
  console.log('🚨 HOOK DE SECOURS ACTIVÉ!')
  
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  // Version ultra simple sans tous les logs qui peuvent casser
  const createConversation = () => {
    console.log('🆕 Création conversation de secours')
    const newId = Date.now().toString()
    
    const newConversation = {
      id: newId,
      name: `Chat ${new Date().toLocaleTimeString()}`,
      messages: [{
        id: 'welcome',
        content: "Bonjour ! Comment puis-je vous aider ?",
        role: 'assistant',
        timestamp: new Date()
      }],
      createdAt: new Date().toISOString()
    }
    
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newId)
    return newId
  }

  const selectConversation = (id) => {
    console.log('🎯 Sélection conversation:', id)
    setCurrentConversationId(id)
  }

  const deleteConversation = (id) => {
    console.log('🗑️ Suppression conversation:', id)
    setConversations(prev => prev.filter(conv => conv.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(null)
    }
  }

  const addMessage = (message, targetConversationId = null) => {
    const conversationId = targetConversationId || currentConversationId
    if (!conversationId) return
    
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId
        ? { ...conv, messages: [...conv.messages, message] }
        : conv
    ))
  }

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
    addMessage
  }
}