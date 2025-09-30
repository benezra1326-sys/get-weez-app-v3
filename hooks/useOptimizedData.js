import { useState, useEffect, useCallback, useRef } from 'react'
import { dataCache } from '../lib/preloader'

// Hook pour optimiser le chargement des données
export function useOptimizedData(fetchFunction, dependencies = [], options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)
  
  const {
    cacheKey,
    cacheTTL = 300000, // 5 minutes
    enableCache = true,
    retryCount = 3,
    retryDelay = 1000
  } = options

  const fetchData = useCallback(async (retryAttempt = 0) => {
    try {
      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      setLoading(true)
      setError(null)

      // Vérifier le cache d'abord
      if (enableCache && cacheKey) {
        const cachedData = dataCache.get(cacheKey)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return
        }
      }

      // Récupérer les données
      const result = await fetchFunction(abortControllerRef.current.signal)
      
      if (!abortControllerRef.current.signal.aborted) {
        setData(result)
        
        // Mettre en cache si activé
        if (enableCache && cacheKey) {
          dataCache.set(cacheKey, result, cacheTTL)
        }
        
        setLoading(false)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Erreur lors du chargement des données:', err)
        
        // Retry logic
        if (retryAttempt < retryCount) {
          setTimeout(() => {
            fetchData(retryAttempt + 1)
          }, retryDelay * (retryAttempt + 1))
        } else {
          setError(err.message || 'Erreur lors du chargement des données')
          setLoading(false)
        }
      }
    }
  }, [fetchFunction, cacheKey, cacheTTL, enableCache, retryCount, retryDelay])

  useEffect(() => {
    fetchData()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [...dependencies, fetchData])

  const refetch = useCallback(() => {
    if (cacheKey && enableCache) {
      dataCache.clear() // Nettoyer le cache pour forcer le rechargement
    }
    fetchData()
  }, [fetchData, cacheKey, enableCache])

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Hook pour optimiser les requêtes API
export function useOptimizedAPI(endpoint, options = {}) {
  const fetchFunction = useCallback(async (signal) => {
    const response = await fetch(endpoint, {
      ...options,
      signal
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }, [endpoint, options])

  return useOptimizedData(fetchFunction, [endpoint], {
    cacheKey: endpoint,
    ...options
  })
}

// Hook pour le debouncing des recherches
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook pour optimiser les listes avec virtualisation
export function useVirtualization(items, itemHeight, containerHeight) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )
  
  const visibleItems = items.slice(visibleStart, visibleEnd)
  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  }
}

