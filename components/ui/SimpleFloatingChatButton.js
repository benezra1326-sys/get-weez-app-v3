import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Bouton chat flottant ULTRA SIMPLE - Version fonctionnelle
 */
export default function SimpleFloatingChatButton() {
  console.log('🔍 SimpleFloatingChatButton - Rendu')
  
  useEffect(() => {
    console.log('🔍 SimpleFloatingChatButton - useEffect côté client')
  }, [])
  
  // FORCER le rendu même côté serveur
  console.log('🔍 SimpleFloatingChatButton - Tentative de rendu')
  
  const handleClick = () => {
    if (typeof window === 'undefined') return
    
    const isMobile = window.innerWidth < 1024
    
    console.log('🖱️ SimpleFloatingChatButton - Clic détecté', { isMobile, windowWidth: window.innerWidth })
    
    if (isMobile) {
      // Mobile : Ouvrir le chat mobile
      console.log('📱 Ouverture du chat mobile')
      const event = new CustomEvent('openMobileChat', {
        detail: { source: 'floating-button' }
      })
      if (typeof document !== 'undefined') {
        document.dispatchEvent(event)
      }
    } else {
      // Desktop : Scroll vers le chat
      console.log('🖥️ Scroll vers le chat desktop')
      if (typeof document !== 'undefined') {
        const chatElement = document.querySelector('.chat-container, .chat-interface, #chat')
        if (chatElement) {
          chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }
  }
  
  console.log('🔍 SimpleFloatingChatButton - Création du bouton')
  
  // Vérifier que nous sommes côté client
  if (typeof window === 'undefined') {
    console.log('🔍 SimpleFloatingChatButton - Pas côté client, rendu simple')
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 2147483647,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white'
      }}>
        💬
      </div>
    )
  }
  
  if (typeof document === 'undefined') {
    console.log('🔍 SimpleFloatingChatButton - Document undefined, rendu simple')
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 2147483647,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white'
      }}>
        💬
      </div>
    )
  }
  
  return createPortal(
    <button
      id="gliitz-floating-chat-btn"
      onClick={handleClick}
      aria-label="Ouvrir le chat Gliitz"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 2147483647,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
        border: 'none',
        boxShadow: '0 8px 25px rgba(168, 85, 247, 0.6)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white',
        transition: 'all 0.3s ease',
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto'
      }}
    >
      💬
    </button>,
    document.body
  )
}
