// PATCH D'URGENCE - BLOQUE TOUTE CRÉATION AUTOMATIQUE
// Ce fichier override TOUTES les fonctions de création

console.log('🚨 PATCH D\'URGENCE ACTIVÉ - BLOQUE TOUTE CRÉATION')

// Override global pour bloquer createConversation
if (typeof window !== 'undefined') {
  const originalCreateConversation = window.createConversation
  
  window.BLOCK_ALL_CONVERSATION_CREATION = true
  window.CONVERSATION_CREATE_BLOCKED_COUNT = 0
  
  // Intercepter tous les appels à createConversation
  window.interceptCreateConversation = function() {
    window.CONVERSATION_CREATE_BLOCKED_COUNT++
    console.log('🚫🚫🚫 PATCH: CRÉATION BLOQUÉE #', window.CONVERSATION_CREATE_BLOCKED_COUNT)
    console.log('🚫 Stack trace:', new Error().stack)
    return null
  }
  
  // Bloquer setCurrentConversationId si elle remet un ID après fermeture
  window.interceptSetCurrentConversationId = function(originalFn, newId) {
    if (newId !== null && window.CONVERSATION_JUST_CLOSED) {
      console.log('🚫🚫🚫 PATCH: RÉOUVERTURE BLOQUÉE après fermeture!')
      console.log('🚫 Tentative ID:', newId)
      console.log('🚫 Stack trace:', new Error().stack)
      return // Bloquer
    }
    
    if (newId === null) {
      window.CONVERSATION_JUST_CLOSED = true
      console.log('✅ PATCH: Marquage fermeture')
      setTimeout(() => {
        window.CONVERSATION_JUST_CLOSED = false
        console.log('✅ PATCH: Reset fermeture')
      }, 2000)
    }
    
    return originalFn(newId)
  }
}

export const EMERGENCY_PATCH = 'ACTIVE'