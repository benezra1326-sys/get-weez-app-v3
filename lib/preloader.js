import { useRouter } from 'next/router'
import { useEffect, useCallback } from 'react'

// Système de préchargement intelligent
export function usePreloader() {
  const router = useRouter()

  // Précharger les pages les plus importantes
  const preloadCriticalPages = useCallback(() => {
    const criticalPages = [
      '/establishments',
      '/services', 
      '/events',
      '/account'
    ]

    criticalPages.forEach(page => {
      router.prefetch(page)
    })
  }, [router])

  // Précharger au survol des liens
  const handleLinkHover = useCallback((href) => {
    if (href && href.startsWith('/')) {
      router.prefetch(href)
    }
  }, [router])

  // Précharger les pages au chargement initial
  useEffect(() => {
    // Délai pour ne pas bloquer le chargement initial
    const timer = setTimeout(() => {
      preloadCriticalPages()
    }, 1000)

    return () => clearTimeout(timer)
  }, [preloadCriticalPages])

  return {
    preloadPage: router.prefetch,
    handleLinkHover
  }
}

// Hook pour optimiser les transitions de page
export function usePageTransition() {
  const router = useRouter()

  const navigateWithTransition = useCallback((href, options = {}) => {
    // Précharger la page avant la navigation
    router.prefetch(href)
    
    // Navigation avec transition fluide
    return router.push(href, undefined, {
      shallow: false,
      scroll: true,
      ...options
    })
  }, [router])

  return {
    navigateWithTransition
  }
}

// Système de cache intelligent pour les données
export class DataCache {
  constructor(maxSize = 50) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.accessOrder = new Map()
  }

  set(key, value, ttl = 300000) { // 5 minutes par défaut
    // Nettoyer le cache si nécessaire
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    const expiry = Date.now() + ttl
    this.cache.set(key, { value, expiry })
    this.accessOrder.set(key, Date.now())
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // Vérifier l'expiration
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      this.accessOrder.delete(key)
      return null
    }

    // Mettre à jour l'ordre d'accès
    this.accessOrder.set(key, Date.now())
    return item.value
  }

  cleanup() {
    // Supprimer les éléments expirés
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
        this.accessOrder.delete(key)
      }
    }

    // Si toujours trop d'éléments, supprimer les plus anciens
    if (this.cache.size >= this.maxSize) {
      const sortedByAccess = Array.from(this.accessOrder.entries())
        .sort(([,a], [,b]) => a - b)
      
      const toRemove = sortedByAccess.slice(0, Math.floor(this.maxSize / 2))
      toRemove.forEach(([key]) => {
        this.cache.delete(key)
        this.accessOrder.delete(key)
      })
    }
  }

  clear() {
    this.cache.clear()
    this.accessOrder.clear()
  }
}

// Instance globale du cache
export const dataCache = new DataCache()
