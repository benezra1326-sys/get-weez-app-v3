/**
 * Configuration desktop pour Gliitz
 * Optimisations et paramètres spécifiques au desktop
 */

export const desktopConfig = {
  // Breakpoints desktop
  breakpoints: {
    desktop: 1024,
    largeDesktop: 1280,
    ultraWide: 1536
  },

  // Layout configurations
  layout: {
    // Grille principale
    grid: {
      desktop: '320px 1fr 320px',
      largeDesktop: '360px 1fr 360px',
      ultraWide: '400px 1fr 400px'
    },
    
    // Largeurs maximales
    maxWidth: {
      desktop: '600px',
      largeDesktop: '800px',
      ultraWide: '1000px'
    },
    
    // Messages
    messageMaxWidth: {
      desktop: '60%',
      largeDesktop: '50%',
      ultraWide: '45%'
    }
  },

  // Animations et transitions
  animations: {
    // Durées
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s'
    },
    
    // Easing functions
    easing: {
      ease: 'ease',
      easeInOut: 'ease-in-out',
      cubicBezier: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    // Animations personnalisées
    custom: {
      fadeIn: 'fadeIn 0.4s ease-out',
      slideUp: 'slideUp 0.3s ease-out',
      messageSlide: 'messageSlide 0.3s ease-out',
      hoverLift: 'hoverLift 0.2s ease-in-out'
    }
  },

  // Performances
  performance: {
    // GPU acceleration
    gpuAcceleration: {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px'
    },
    
    // Optimisations de scroll
    scrollOptimizations: {
      scrollBehavior: 'smooth',
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--color-primary) transparent'
    },
    
    // Optimisations de rendu
    renderingOptimizations: {
      willChange: 'transform',
      contain: 'layout style paint'
    }
  },

  // Interactions desktop
  interactions: {
    // Hover effects
    hover: {
      lift: 'translateY(-2px)',
      scale: 'scale(1.05)',
      glow: '0 8px 25px rgba(139, 92, 246, 0.3)'
    },
    
    // Transitions
    transitions: {
      fast: 'all 0.2s ease',
      normal: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'all 0.5s ease'
    }
  },

  // Raccourcis clavier
  keyboardShortcuts: {
    global: {
      'Ctrl+/': 'Aide',
      'Ctrl+K': 'Recherche',
      'Ctrl+N': 'Nouvelle conversation',
      'Escape': 'Fermer modals'
    },
    chat: {
      'Enter': 'Envoyer message',
      'Shift+Enter': 'Nouvelle ligne',
      'Ctrl+Enter': 'Envoyer message',
      'Ctrl+Backspace': 'Supprimer conversation'
    }
  },

  // Classes CSS utilitaires
  cssClasses: {
    layout: {
      desktop: 'desktop-layout',
      sidebar: 'desktop-sidebar-left',
      main: 'desktop-main-content',
      right: 'desktop-sidebar-right'
    },
    
    components: {
      chat: 'desktop-chat-container',
      messages: 'desktop-chat-messages',
      input: 'desktop-input-container',
      conversation: 'desktop-conversation-item',
      suggestion: 'desktop-suggestion-item'
    },
    
    utilities: {
      scrollbar: 'desktop-scrollbar',
      hoverLift: 'desktop-hover-lift',
      hoverScale: 'desktop-hover-scale',
      fadeIn: 'desktop-fade-in'
    }
  },

  // Optimisations de mémoire
  memoryOptimizations: {
    // Debounce delay
    debounceDelay: 100,
    
    // Throttle delay
    throttleDelay: 16, // ~60fps
    
    // Lazy loading threshold
    lazyLoadThreshold: 200
  },

  // Accessibilité
  accessibility: {
    // Respect des préférences de mouvement
    respectReducedMotion: true,
    
    // Focus visible
    focusVisible: true,
    
    // Contraste
    highContrast: false
  },

  // Thème desktop
  theme: {
    // Couleurs spécifiques desktop
    colors: {
      primary: 'var(--color-primary)',
      primaryLight: 'var(--color-primary-light)',
      primaryDark: 'var(--color-primary-dark)',
      accent: 'var(--color-accent)',
      surface: 'var(--color-surface)',
      surfaceElevated: 'var(--color-surface-elevated)'
    },
    
    // Ombres desktop
    shadows: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
      glow: 'var(--shadow-glow)',
      luxury: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(245, 158, 11, 0.2)'
    }
  }
}

// Fonctions utilitaires
export const desktopUtils = {
  // Détection de la taille d'écran
  getScreenSize: () => {
    if (typeof window === 'undefined') return 'desktop'
    const width = window.innerWidth
    if (width >= 1536) return 'ultraWide'
    if (width >= 1280) return 'largeDesktop'
    if (width >= 1024) return 'desktop'
    return 'mobile'
  },

  // Application des optimisations selon la taille
  applyOptimizations: (screenSize) => {
    const config = desktopConfig.layout
    switch (screenSize) {
      case 'ultraWide':
        return {
          grid: config.grid.ultraWide,
          maxWidth: config.maxWidth.ultraWide,
          messageMaxWidth: config.messageMaxWidth.ultraWide
        }
      case 'largeDesktop':
        return {
          grid: config.grid.largeDesktop,
          maxWidth: config.maxWidth.largeDesktop,
          messageMaxWidth: config.messageMaxWidth.largeDesktop
        }
      case 'desktop':
        return {
          grid: config.grid.desktop,
          maxWidth: config.maxWidth.desktop,
          messageMaxWidth: config.messageMaxWidth.desktop
        }
      default:
        return {}
    }
  },

  // Génération des classes CSS
  generateClasses: (baseClasses = '', optimizations = {}) => {
    let classes = baseClasses
    
    if (optimizations.desktop) classes += ' desktop-optimized'
    if (optimizations.largeDesktop) classes += ' large-desktop-optimized'
    if (optimizations.ultraWide) classes += ' ultra-wide-optimized'
    if (optimizations.reducedMotion) classes += ' motion-reduce'
    
    return classes.trim()
  }
}

export default desktopConfig
