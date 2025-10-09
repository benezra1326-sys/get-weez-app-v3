import React, { createContext, useContext } from 'react'
import { useConversations } from '../hooks/useConversations'

const ConversationsContext = createContext(null)

export function ConversationsProvider({ children }) {
  const conversationsData = useConversations()
  
  return (
    <ConversationsContext.Provider value={conversationsData}>
      {children}
    </ConversationsContext.Provider>
  )
}

export function useConversationsContext() {
  const context = useContext(ConversationsContext)
  if (!context) {
    throw new Error('useConversationsContext must be used within ConversationsProvider')
  }
  return context
}

export default ConversationsContext

