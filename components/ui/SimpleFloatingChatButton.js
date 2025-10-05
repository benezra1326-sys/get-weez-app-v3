import { useEffect } from 'react'
import { useRouter } from 'next/router'

/**
 * Bouton chat flottant avec JavaScript pur pour contourner les bugs CSS
 * Injecte directement dans le body après le montage
 */
export default function SimpleFloatingChatButton() {
  const router = useRouter()

  useEffect(() => {
    console.log('🔵 SimpleFloatingChatButton useEffect triggered')
    console.log('🔵 Window width:', window.innerWidth)
    
    // Ne créer que sur mobile
    if (typeof window === 'undefined') {
      console.log('❌ Window is undefined')
      return
    }
    
    if (window.innerWidth >= 1024) {
      console.log('❌ Desktop detected, not showing button')
      return
    }
    
    console.log('✅ Mobile detected, creating button...')

    // Créer le bouton avec JavaScript pur
    const button = document.createElement('button')
    button.id = 'gliitz-floating-chat-btn'
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `
    
    // Styles inline TRÈS FORTS
    button.style.cssText = `
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      width: 56px !important;
      height: 56px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%) !important;
      border: 2px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 8px 32px rgba(168, 85, 247, 0.35) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483647 !important;
      opacity: 0.85 !important;
      transition: all 0.3s ease !important;
      padding: 0 !important;
      margin: 0 !important;
      transform: none !important;
    `
    
    // Click handler
    button.onclick = () => {
      if (window.location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        router.push('/')
      }
    }
    
    // Hover effect
    button.onmouseenter = () => {
      button.style.opacity = '1'
      button.style.transform = 'scale(1.05)'
    }
    button.onmouseleave = () => {
      button.style.opacity = '0.85'
      button.style.transform = 'scale(1)'
    }
    
    // Touch effect pour mobile
    button.ontouchstart = () => {
      button.style.opacity = '1'
      button.style.transform = 'scale(1.05)'
    }
    button.ontouchend = () => {
      button.style.opacity = '0.85'
      button.style.transform = 'scale(1)'
    }
    
    // Ajouter au body
    document.body.appendChild(button)
    console.log('✅ Button added to body!')
    console.log('Button element:', button)
    
    // Nettoyer au démontage
    return () => {
      console.log('🧹 Cleaning up button')
      const btn = document.getElementById('gliitz-floating-chat-btn')
      if (btn) btn.remove()
    }
  }, [router])
  
  console.log('🔄 SimpleFloatingChatButton rendering')

  return null // Pas de JSX, tout en JavaScript pur
}

