import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle } from 'lucide-react'

/**
 * Bouton chat flottant avec React Portal pour un positionnement parfait
 * Position fixe garantie en bas à droite de la viewport
 */
export default function FixedFloatingChatButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Vérifier si on est sur mobile
    const checkMobile = () => {
      return window.innerWidth < 1024
    }
    
    // Vérifier si on est sur une page où le bouton doit être visible
    const shouldShow = () => {
      const isMobile = checkMobile()
      const pathname = window.location.pathname
      
      // Ne pas afficher sur les pages d'erreur ou de loading
      if (pathname.includes('404') || pathname.includes('error') || pathname.includes('loading')) {
        return false
      }
      
      // Afficher seulement sur mobile
      return isMobile
    }
    
    setIsVisible(shouldShow())
    setIsMounted(true)
    
    // Écouter les changements de taille d'écran
    const handleResize = () => {
      setIsVisible(shouldShow())
    }
    
    // Écouter les changements de route
    const handleRouteChange = () => {
      setIsVisible(shouldShow())
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  const handleClick = () => {
    console.log('🖱️ Bouton chat cliqué!')
    
    if (window.location.pathname === '/') {
      // Sur la page d'accueil, déclencher l'ouverture du chat
      console.log('🏠 Sur page accueil - Émission événement openMobileChat')
      window.dispatchEvent(new CustomEvent('openMobileChat'))
    } else {
      // Sur d'autres pages, rediriger vers l'accueil
      console.log('🔄 Redirection vers accueil')
      window.location.href = '/'
    }
  }

  if (!isMounted || !isVisible) {
    return null
  }

  // Créer le bouton avec React Portal pour un meilleur contrôle
  const buttonElement = (
    <div
      id="fixed-floating-chat-btn"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '64px',
        height: '64px',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 12px 40px rgba(168, 85, 247, 0.6)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'translateZ(0)',
        willChange: 'transform',
        pointerEvents: 'auto',
        isolation: 'isolate',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        contain: 'layout style paint',
        overflow: 'visible',
        clip: 'auto',
        clipPath: 'none',
        mask: 'none',
        filter: 'none',
        backdropFilter: 'none',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateZ(0) scale(1.1)'
        e.target.style.boxShadow = '0 12px 48px rgba(168, 85, 247, 0.6), 0 0 0 4px rgba(168, 85, 247, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateZ(0) scale(1)'
        e.target.style.boxShadow = '0 8px 32px rgba(168, 85, 247, 0.5), 0 0 0 0 rgba(168, 85, 247, 0.4)'
      }}
      onTouchStart={(e) => {
        e.target.style.transform = 'translateZ(0) scale(0.95)'
      }}
      onTouchEnd={(e) => {
        e.target.style.transform = 'translateZ(0) scale(1)'
      }}
    >
      <MessageCircle 
        size={32} 
        color="white"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
        }}
      />
    </div>
  )

  // Utiliser React Portal pour rendre le bouton directement dans le body
  return typeof window !== 'undefined' ? createPortal(buttonElement, document.body) : null
}