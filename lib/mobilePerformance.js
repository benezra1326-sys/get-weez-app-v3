/**
 * Utilitaires d'optimisation des performances mobiles
 */

/**
 * Mesure les Core Web Vitals pour mobile
 */
export function measureWebVitals(onPerfEntry) {
  if (typeof window !== 'undefined' && onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    })
  }
}

/**
 * Optimisation du rendu pour mobile
 */
export const mobileOptimizations = {
  // Préchargement des ressources critiques
  preloadCriticalResources: () => {
    if (typeof window === 'undefined') return

    // Précharger les fonts critiques
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    fontLink.as = 'style'
    fontLink.crossOrigin = 'anonymous'
    document.head.appendChild(fontLink)
  },

  // Optimisation des images
  optimizeImages: () => {
    if (typeof window === 'undefined') return

    // Lazy loading pour les images non critiques
    const images = document.querySelectorAll('img[data-lazy]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.lazy
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))
  },

  // Debounce pour les événements de scroll
  debounceScroll: (func, wait = 16) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle pour les events tactiles
  throttleTouch: (func, limit = 16) => {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

/**
 * Détection des capacités du navigateur mobile
 */
export function detectMobileCapabilities() {
  if (typeof window === 'undefined') return {}

  return {
    // Support du viewport dynamique
    supportsDynamicViewport: CSS.supports('height', '100dvh'),
    
    // Support des safe areas
    supportsSafeArea: CSS.supports('padding', 'env(safe-area-inset-top)'),
    
    // Support du lazy loading natif
    supportsLazyLoading: 'loading' in HTMLImageElement.prototype,
    
    // Support des Web Vitals
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    
    // Support de la reconnaissance vocale
    supportsSpeechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    
    // Détection tactile
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    
    // Support des notifications
    supportsNotifications: 'Notification' in window,
    
    // Support du service worker
    supportsServiceWorker: 'serviceWorker' in navigator,
    
    // Connexion réseau
    connectionType: navigator.connection?.effectiveType || 'unknown',
    
    // Économiseur de données
    saveData: navigator.connection?.saveData || false,
    
    // Mémoire approximative
    deviceMemory: navigator.deviceMemory || 'unknown'
  }
}

/**
 * Optimisation basée sur la connexion réseau
 */
export function adaptToNetworkCondition() {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return { quality: 'high' }
  }

  const connection = navigator.connection
  const effectiveType = connection.effectiveType
  const saveData = connection.saveData

  // Adapter la qualité en fonction de la connexion
  let quality = 'high'
  let optimizations = []

  if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
    quality = 'low'
    optimizations = [
      'reduceAnimations',
      'compressImages',
      'lazyLoadAll',
      'minimalUI'
    ]
  } else if (effectiveType === '3g') {
    quality = 'medium'
    optimizations = [
      'lazyLoadImages',
      'reduceMotion'
    ]
  }

  return {
    quality,
    optimizations,
    effectiveType,
    saveData,
    downlink: connection.downlink,
    rtt: connection.rtt
  }
}

/**
 * Optimisation de la mémoire pour les appareils low-end
 */
export function optimizeForLowEndDevices() {
  const capabilities = detectMobileCapabilities()
  const networkCondition = adaptToNetworkCondition()
  
  // Appareils avec peu de mémoire
  const isLowEndDevice = capabilities.deviceMemory <= 2

  if (isLowEndDevice || networkCondition.quality === 'low') {
    return {
      // Réduire les animations
      reduceAnimations: true,
      
      // Images de qualité réduite
      imageQuality: 'low',
      
      // Pagination plus agressive
      itemsPerPage: 10,
      
      // Cache réduit
      cacheSize: 'small',
      
      // Prefetch désactivé
      disablePrefetch: true,
      
      // Lazy loading agressif
      lazyLoadThreshold: '50px'
    }
  }

  return {
    reduceAnimations: false,
    imageQuality: 'high',
    itemsPerPage: 20,
    cacheSize: 'large',
    disablePrefetch: false,
    lazyLoadThreshold: '200px'
  }
}

/**
 * Hook React pour les optimisations mobiles automatiques
 */
export function useMobilePerformance() {
  if (typeof window === 'undefined') return {}

  const capabilities = detectMobileCapabilities()
  const networkCondition = adaptToNetworkCondition()
  const optimizations = optimizeForLowEndDevices()

  // Appliquer les optimisations automatiquement
  React.useEffect(() => {
    mobileOptimizations.preloadCriticalResources()
    mobileOptimizations.optimizeImages()
    
    // Logger les métriques de performance
    measureWebVitals((metric) => {
      console.log(`📊 ${metric.name}: ${metric.value}`)
    })
  }, [])

  return {
    capabilities,
    networkCondition,
    optimizations,
    isLowEndDevice: capabilities.deviceMemory <= 2,
    isSaveDataEnabled: networkCondition.saveData,
    isSlowConnection: ['slow-2g', '2g'].includes(networkCondition.effectiveType)
  }
}

export default {
  measureWebVitals,
  mobileOptimizations,
  detectMobileCapabilities,
  adaptToNetworkCondition,
  optimizeForLowEndDevices,
  useMobilePerformance
}