import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Bouton chat flottant simple et efficace
 * Visible partout SAUF dans le chat et quand le chat mobile est ouvert
 */
export default function FloatingChatButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)
  
  console.log('🔍 FloatingChatButton - Composant monté', { isVisible, isClient })

  useEffect(() => {
    // Vérifier si on est côté client
    setIsClient(true)
    
    // Fonction pour vérifier la visibilité - CORRECTION COMPLÈTE
    const checkVisibility = () => {
      // Vérifier que document existe (côté client uniquement)
      if (typeof document === 'undefined') return
      
      const isMobileChatOpen = document.body.classList.contains('mobile-chat-open')
      const isMobileMenuOpen = document.body.classList.contains('mobile-menu-open')
      const isKeyboardOpen = document.body.classList.contains('keyboard-open')
      
      // CORRECTION : Le bouton doit TOUJOURS être visible
      // Ne plus le cacher même quand le chat mobile est ouvert
      const shouldHide = false // TOUJOURS VISIBLE
      
      console.log('🔍 FloatingChatButton - État:', {
        isMobileChatOpen,
        isMobileMenuOpen,
        isKeyboardOpen,
        shouldHide,
        bodyClasses: document.body.className,
        decision: 'TOUJOURS VISIBLE'
      })
      
      setIsVisible(!shouldHide)
    }

    // Vérification initiale
    checkVisibility()

    // Observer pour détecter les changements - AMÉLIORÉ
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          shouldCheck = true
        }
        if (mutation.type === 'childList') {
          shouldCheck = true
        }
      })
      if (shouldCheck) {
        checkVisibility()
      }
    })
    
    // Vérifier que document existe avant d'observer
    if (typeof document !== 'undefined') {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      })
    }

    // Écouter les événements de changement de route - Vérifier window
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', checkVisibility)
      
      // Écouter les événements personnalisés
      window.addEventListener('mobileChatToggle', checkVisibility)
      window.addEventListener('mobileMenuToggle', checkVisibility)
    }

    return () => {
      observer.disconnect()
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', checkVisibility)
        window.removeEventListener('mobileChatToggle', checkVisibility)
        window.removeEventListener('mobileMenuToggle', checkVisibility)
      }
    }
  }, [])

  const handleClick = () => {
    // Vérifier que window existe (côté client uniquement)
    if (typeof window === 'undefined') return
    
    const isMobile = window.innerWidth < 1024
    
    console.log('🖱️ FloatingChatButton - Clic détecté', { isMobile, windowWidth: window.innerWidth })
    
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

  // DEBUG : Toujours afficher le bouton pour tester
  if (isClient && typeof document !== 'undefined') {
    console.log('🔍 FloatingChatButton - Rendu:', { isVisible, isClient, bodyClasses: document.body?.className })
  }

  // FORCER le rendu - ne plus vérifier isVisible
  console.log('🔍 FloatingChatButton - Tentative de rendu', { isClient, isVisible })
  
  if (!isClient) {
    console.log('🔍 FloatingChatButton - Pas côté client, pas de rendu')
    return null
  }

  // Utiliser createPortal pour sortir le bouton de la hiérarchie DOM normale
  // Vérifier que document existe avant de créer le portal
  if (typeof document === 'undefined') {
    console.log('🔍 FloatingChatButton - Document undefined, pas de rendu')
    return null
  }
  
  console.log('🔍 FloatingChatButton - Rendu du bouton')
  
  return createPortal(
    <>
      <button
        id="gliitz-floating-chat-btn"
        onClick={handleClick}
        className="floating-chat-button"
        aria-label="Ouvrir le chat Gliitz"
        style={{
          position: 'fixed !important',
          bottom: '20px !important',
          right: '20px !important',
          zIndex: '2147483647 !important',
          transform: 'translateZ(0) !important',
          willChange: 'transform !important',
          backfaceVisibility: 'hidden !important',
          // DEBUG : Forcer la visibilité
          display: 'flex !important',
          visibility: 'visible !important',
          opacity: '1 !important',
          pointerEvents: 'auto !important',
          top: 'auto !important',
          left: 'auto !important',
          margin: '0 !important',
          padding: '0 !important',
          width: '56px !important',
          height: '56px !important',
          borderRadius: '50% !important',
          background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0) !important',
          boxShadow: '0 8px 25px rgba(192, 192, 192, 0.6) !important',
          cursor: 'pointer !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          fontSize: '20px !important',
          color: 'white !important',
          transition: 'all 0.3s ease !important'
        }}
      >
        💬
      </button>
      
      <style jsx>{`
            .floating-chat-button {
              position: fixed !important;
              bottom: 20px !important;
              right: 20px !important;
              transform: translateZ(0) !important;
              width: 56px !important;
              height: 56px !important;
              background: linear-gradient(135deg, #E5E5E5, #C0C0C0) !important;
              border: none !important;
              border-radius: 50% !important;
              box-shadow: 0 8px 25px rgba(192, 192, 192, 0.6) !important;
              cursor: pointer !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 2147483647 !important;
              font-size: 20px !important;
              color: white !important;
              transition: all 0.3s ease !important;
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
              /* FORCER la position fixe - CORRECTION COMPLÈTE */
              top: auto !important;
              left: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              /* FORCER le positionnement même avec mobile-chat-open */
              position: fixed !important;
              bottom: 20px !important;
              right: 20px !important;
              z-index: 2147483647 !important;
              display: flex !important;
              visibility: visible !important;
              opacity: 1 !important;
              pointer-events: auto !important;
            }
        
        .floating-chat-button:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 12px 35px rgba(192, 192, 192, 0.8) !important;
        }
        
        .floating-chat-button:active {
          transform: scale(0.95) !important;
        }
        
        /* Desktop - plus grand */
        @media (min-width: 768px) {
          .floating-chat-button {
            width: 60px !important;
            height: 60px !important;
            font-size: 24px !important;
            bottom: 20px !important;
            right: 20px !important;
          }
        }
        
            /* Mobile - plus petit et bien positionné */
            @media (max-width: 767px) {
              .floating-chat-button {
                width: 56px !important;
                height: 56px !important;
                font-size: 20px !important;
                bottom: 16px !important;
                right: 16px !important;
                position: fixed !important;
                transform: translateZ(0) !important;
                will-change: transform !important;
                backface-visibility: hidden !important;
              }
            }
      `}</style>
    </>,
    document.body,
    'body'
  )
}
