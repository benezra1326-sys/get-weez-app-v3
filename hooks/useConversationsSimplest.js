import { useState } from 'react'

export function useConversations() {
  console.log('🚀 HOOK ULTRA SIMPLE DEMARRE!')
  
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  
  console.log('🚀 HOOK ULTRA SIMPLE - État:', { 
    conversations: conversations.length,
    currentConversationId 
  })

  const createConversation = () => {
    console.log('🆕 Création conversation ultra simple')
    return null // Bloqué pour test
  }

  const selectConversation = (id) => {
    console.log('🎯 Sélection:', id)
    setCurrentConversationId(id)
  }

  const deleteConversation = () => {
    console.log('🗑️ Suppression')
  }

  const addMessage = () => {
    console.log('💬 Ajout message')
  }

  const messages = []

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