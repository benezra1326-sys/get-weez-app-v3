import { useEffect } from 'react'

/**
 * Bouton chat flottant avec JavaScript pur pour contourner les bugs CSS
 * Injecte directement dans le body après le montage
 */
export default function SimpleFloatingChatButton() {
  useEffect(() => {
    console.log('🔵 SimpleFloatingChatButton - Initialisation')
    
    // Ne créer que sur mobile
    if (typeof window === 'undefined') {
      return
    }
    
    // Vérifier si le bouton existe déjà
    let button = document.getElementById('gliitz-floating-chat-btn')
    if (button) {
      console.log('✅ Bouton déjà existant, pas de recréation')
      
      // Observer si le body a la classe mobile-chat-open pour cacher le bouton
      const observer = new MutationObserver(() => {
        if (document.body.classList.contains('mobile-chat-open')) {
          button.style.display = 'none'
        } else {
          button.style.display = 'flex'
        }
      })
      
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      })
      
      return () => observer.disconnect()
    }
    
    // Fonction pour vérifier si on est sur mobile
    const checkMobile = () => window.innerWidth < 1024
    
    if (!checkMobile()) {
      console.log('❌ Desktop détecté, bouton non créé')
      return
    }
    
    console.log('✅ Mobile détecté - Création du bouton...')

    // Créer le bouton avec JavaScript pur - Icône Sparkles centrée
    button = document.createElement('button')
    button.id = 'gliitz-floating-chat-btn'
    button.setAttribute('aria-label', 'Ouvrir le chat Gliitz')
    button.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
      </svg>
    `
    
    // Styles inline ULTRA FORTS - Bouton VRAIMENT flottant
    button.style.cssText = `
      all: unset !important;
      box-sizing: border-box !important;
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      width: 64px !important;
      height: 64px !important;
      min-width: 64px !important;
      min-height: 64px !important;
      max-width: 64px !important;
      max-height: 64px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%) !important;
      border: 3px solid rgba(255, 255, 255, 0.3) !important;
      box-shadow: 0 12px 40px rgba(168, 85, 247, 0.6) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      vertical-align: middle !important;
      z-index: 2147483647 !important;
      opacity: 1 !important;
      visibility: visible !important;
      transition: all 0.3s ease !important;
      padding: 0 !important;
      margin: 0 !important;
      transform: translate3d(0, 0, 1000px) scale(1) !important;
      will-change: transform !important;
      pointer-events: auto !important;
      isolation: isolate !important;
      -webkit-tap-highlight-color: transparent !important;
      user-select: none !important;
      top: auto !important;
      left: auto !important;
      contain: layout style paint !important;
      float: none !important;
      clear: none !important;
      overflow: visible !important;
      clip: auto !important;
      clip-path: none !important;
      mask: none !important;
      filter: none !important;
      backdrop-filter: none !important;
    `
    
    // Click handler - Ouvrir le chat sur mobile
    button.onclick = () => {
      console.log('🖱️ Bouton chat cliqué!')
      
      // Détecter si on est sur mobile
      const isMobile = window.innerWidth < 1024
      
      if (isMobile) {
        console.log('📱 Mobile détecté - Ouverture du chat')
        
        if (window.location.pathname === '/') {
          // Sur la page d'accueil, déclencher l'ouverture du chat
          console.log('🏠 Sur page accueil - Émission événement openMobileChat')
          window.dispatchEvent(new CustomEvent('openMobileChat'))
        } else {
          // Sur d'autres pages, rediriger vers l'accueil
          console.log('🔄 Redirection vers accueil')
          window.location.href = '/'
        }
      } else {
        // Sur desktop, juste scroller vers le haut ou rediriger
        if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          window.location.href = '/'
        }
      }
    }
    
    // Hover effect
    button.onmouseenter = () => {
      button.style.transform = 'translateZ(0) scale(1.1)'
      button.style.boxShadow = '0 12px 48px rgba(168, 85, 247, 0.6), 0 0 0 4px rgba(168, 85, 247, 0.2)'
    }
    button.onmouseleave = () => {
      button.style.transform = 'translateZ(0) scale(1)'
      button.style.boxShadow = '0 8px 32px rgba(168, 85, 247, 0.5), 0 0 0 0 rgba(168, 85, 247, 0.4)'
    }
    
    // Touch effect pour mobile
    button.ontouchstart = () => {
      button.style.transform = 'translateZ(0) scale(0.95)'
    }
    button.ontouchend = () => {
      button.style.transform = 'translateZ(0) scale(1)'
    }
    
    // Ajouter au body de manière FORCÉE et persistante
    document.body.appendChild(button)
    
    // Forcer la visibilité après ajout
    setTimeout(() => {
      button.style.display = 'flex !important'
      button.style.opacity = '1 !important'
      button.style.visibility = 'visible !important'
    }, 50)
    
    console.log('✅ Bouton ajouté au DOM!')
    console.log('📍 Position:', window.getComputedStyle(button).position)
    console.log('📍 Z-index:', window.getComputedStyle(button).zIndex)
    console.log('📍 Display:', window.getComputedStyle(button).display)
    console.log('📍 Visibility:', window.getComputedStyle(button).visibility)
    
    // Observer pour gérer la visibilité du bouton - Logique simplifiée
    const observer = new MutationObserver(() => {
      // Par défaut, garder le bouton visible
      button.style.display = 'flex !important'
      button.style.visibility = 'visible !important'
      button.style.opacity = '1 !important'
      
      // Ne le cacher que si le chat mobile est vraiment ouvert
      const chatOpen = document.querySelector('.chat-box-container[style*="display: flex"]') ||
                      document.querySelector('[data-chat-open="true"]')
      
      if (chatOpen) {
        button.style.display = 'none'
        button.style.visibility = 'hidden'
      }
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // Observer aussi les changements de style sur les éléments de chat
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'data-chat-open'],
      subtree: true
    })
    
    // Vérification périodique pour s'assurer que le bouton reste visible
    const keepVisibleInterval = setInterval(() => {
      if (button && button.parentNode) {
        const chatOpen = document.querySelector('.chat-box-container[style*="display: flex"]') ||
                        document.querySelector('[data-chat-open="true"]')
        
        if (!chatOpen) {
          const rect = button.getBoundingClientRect()
          if (rect.width === 0 || rect.height === 0) {
            console.log('🔧 Bouton invisible détecté, réparation...')
            button.style.display = 'flex !important'
            button.style.visibility = 'visible !important'
            button.style.opacity = '1 !important'
            button.style.position = 'fixed !important'
            button.style.zIndex = '2147483647 !important'
          }
        }
      }
    }, 2000)
    
    // Vérifier après un délai que le bouton est bien visible
    setTimeout(() => {
      const btn = document.getElementById('gliitz-floating-chat-btn')
      if (btn) {
        const rect = btn.getBoundingClientRect()
        const styles = window.getComputedStyle(btn)
        console.log('📐 État bouton:', {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          position: styles.position,
          zIndex: styles.zIndex,
          width: rect.width,
          height: rect.height,
          bottom: styles.bottom,
          right: styles.right,
          visible: rect.width > 0 && rect.height > 0 && styles.display !== 'none'
        })
      }
    }, 500)
    
    // Cleanup : déconnecter l'observer et l'intervalle
    return () => {
      observer.disconnect()
      if (keepVisibleInterval) {
        clearInterval(keepVisibleInterval)
      }
    }
  }, []) // Dépendances vides pour ne créer qu'une seule fois
  
  console.log('🔄 SimpleFloatingChatButton rendering')

  return null // Pas de JSX, tout en JavaScript pur
}

