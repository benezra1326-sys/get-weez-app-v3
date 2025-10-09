// Feedback System - Audio & Visual feedback for interactions
// Gère les micro-interactions audio et visuelles pour une UX premium

class FeedbackSystem {
  constructor() {
    this.audioContext = null
    this.enabled = true
    this.volume = 0.3
  }

  // Initialiser l'AudioContext
  init() {
    if (typeof window === 'undefined') return
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Générer un son de clic élégant
  playClickSound() {
    if (!this.enabled || !this.audioContext) return
    
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      // Son cristallin et élégant
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        400, 
        this.audioContext.currentTime + 0.05
      )
      
      gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        this.audioContext.currentTime + 0.1
      )
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.1)
    } catch (error) {
      console.error('Erreur son de clic:', error)
    }
  }

  // Son pour l'envoi d'un message
  playSendSound() {
    if (!this.enabled || !this.audioContext) return
    
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      // Son ascendant élégant
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        1200, 
        this.audioContext.currentTime + 0.15
      )
      
      gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        this.audioContext.currentTime + 0.2
      )
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.2)
    } catch (error) {
      console.error('Erreur son d\'envoi:', error)
    }
  }

  // Son pour la réception d'un message
  playReceiveSound() {
    if (!this.enabled || !this.audioContext) return
    
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      // Son doux et accueillant
      oscillator.frequency.setValueAtTime(900, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        600, 
        this.audioContext.currentTime + 0.12
      )
      
      gainNode.gain.setValueAtTime(this.volume * 0.35, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        this.audioContext.currentTime + 0.15
      )
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.15)
    } catch (error) {
      console.error('Erreur son de réception:', error)
    }
  }

  // Son pour l'activation du micro
  playMicOnSound() {
    if (!this.enabled || !this.audioContext) return
    
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(700, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        1000, 
        this.audioContext.currentTime + 0.1
      )
      
      gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        this.audioContext.currentTime + 0.15
      )
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.15)
    } catch (error) {
      console.error('Erreur son micro on:', error)
    }
  }

  // Son pour la désactivation du micro
  playMicOffSound() {
    if (!this.enabled || !this.audioContext) return
    
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        500, 
        this.audioContext.currentTime + 0.1
      )
      
      gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        this.audioContext.currentTime + 0.12
      )
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.12)
    } catch (error) {
      console.error('Erreur son micro off:', error)
    }
  }

  // Son d'erreur élégant
  playErrorSound() {
    if (!this.enabled || !this.audioContext) return
    
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        200, 
        this.audioContext.currentTime + 0.2
      )
      
      gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        this.audioContext.currentTime + 0.25
      )
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.25)
    } catch (error) {
      console.error('Erreur son d\'erreur:', error)
    }
  }

  // Créer une vibration haptique (mobile)
  vibrate(pattern = [10]) {
    if (typeof window === 'undefined' || !window.navigator.vibrate) return
    
    try {
      window.navigator.vibrate(pattern)
    } catch (error) {
      console.error('Erreur vibration:', error)
    }
  }

  // Feedback combiné pour un clic (son + vibration)
  click() {
    this.playClickSound()
    this.vibrate([5])
  }

  // Feedback combiné pour l'envoi d'un message
  send() {
    this.playSendSound()
    this.vibrate([10, 5, 10])
  }

  // Feedback combiné pour la réception d'un message
  receive() {
    this.playReceiveSound()
    this.vibrate([8])
  }

  // Feedback combiné pour le micro
  micOn() {
    this.playMicOnSound()
    this.vibrate([15])
  }

  micOff() {
    this.playMicOffSound()
    this.vibrate([10])
  }

  // Feedback pour une erreur
  error() {
    this.playErrorSound()
    this.vibrate([20, 50, 20])
  }

  // Activer/désactiver le feedback
  setEnabled(enabled) {
    this.enabled = enabled
  }

  // Régler le volume (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // Créer un feedback visuel (ripple effect)
  createVisualFeedback(element, color = 'rgba(192, 192, 192, 0.3)') {
    if (!element) return

    const ripple = document.createElement('span')
    const rect = element.getBoundingClientRect()
    
    const size = Math.max(rect.width, rect.height)
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = '50%'
    ripple.style.top = '50%'
    ripple.style.transform = 'translate(-50%, -50%)'
    
    ripple.style.position = 'absolute'
    ripple.style.borderRadius = '50%'
    ripple.style.background = color
    ripple.style.pointerEvents = 'none'
    ripple.style.animation = 'ripple-animation 0.6s ease-out'
    
    // Ajouter le CSS de l'animation si pas déjà présent
    if (!document.getElementById('ripple-animation-style')) {
      const style = document.createElement('style')
      style.id = 'ripple-animation-style'
      style.textContent = `
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }
    
    element.style.position = element.style.position || 'relative'
    element.style.overflow = 'hidden'
    element.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }
}

// Export singleton instance
export const feedbackSystem = new FeedbackSystem()

// Auto-initialiser au premier clic (nécessaire pour l'AudioContext)
if (typeof window !== 'undefined') {
  let initialized = false
  const initOnFirstInteraction = () => {
    if (!initialized) {
      feedbackSystem.init()
      initialized = true
      document.removeEventListener('click', initOnFirstInteraction)
      document.removeEventListener('touchstart', initOnFirstInteraction)
    }
  }
  
  document.addEventListener('click', initOnFirstInteraction, { once: true })
  document.addEventListener('touchstart', initOnFirstInteraction, { once: true })
}

export default feedbackSystem

