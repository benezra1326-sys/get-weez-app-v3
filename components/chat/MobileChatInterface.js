import React from 'react'
import MobileChatOptimized from './MobileChatOptimized'

const MobileChatInterface = ({ user, initialMessage, establishmentName }) => {
  // Utiliser la version optimisée sans dépendances problématiques
  return (
    <MobileChatOptimized 
      user={user} 
      initialMessage={initialMessage} 
      establishmentName={establishmentName} 
    />
  )
}

export default MobileChatInterface