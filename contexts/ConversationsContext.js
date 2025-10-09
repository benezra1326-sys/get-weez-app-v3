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
  // Ne pas throw d'erreur, juste retourner null si pas de provider
  // Cela permet aux composants de fonctionner même sans le context
  return context
}

export default ConversationsContext

