import { useState, useEffect, useCallback } from 'react'

/**
 * Hook personnalisé pour détecter l'ouverture/fermeture du clavier virtuel mobile
 * @returns {Object} - { isKeyboardOpen, viewportHeight, keyboardHeight }
 */
export const useVirtualKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [initialHeight, setInitialHeight] = useState(0)

  const handleResize = useCallback(() => {
    const currentHeight = window.innerHeight
    const currentWidth = window.innerWidth
    
    // Initialiser la hauteur si c'est la première fois
    if (initialHeight === 0) {
      setInitialHeight(currentHeight)
      setViewportHeight(currentHeight)
      return
    }

    // Calculer la différence de hauteur
    const heightDifference = initialHeight - currentHeight
    const keyboardThreshold = 150 // Seuil pour détecter le clavier
    
    // Détecter si le clavier est ouvert
    const keyboardOpen = heightDifference > keyboardThreshold
    
    setIsKeyboardOpen(keyboardOpen)
    setViewportHeight(currentHeight)
    setKeyboardHeight(keyboardOpen ? heightDifference : 0)
  }, [initialHeight])

  const handleFocus = useCallback(() => {
    // Délai pour laisser le clavier s'ouvrir
    setTimeout(() => {
      const currentHeight = window.innerHeight
      const heightDifference = initialHeight - currentHeight
      setIsKeyboardOpen(heightDifference > 100)
    }, 300)
  }, [initialHeight])

  const handleBlur = useCallback(() => {
    // Délai pour laisser le clavier se fermer
    setTimeout(() => {
      setIsKeyboardOpen(false)
    }, 300)
  }, [])

  // Détecter les changements d'orientation
  const handleOrientationChange = useCallback(() => {
    setTimeout(() => {
      const currentHeight = window.innerHeight
      setInitialHeight(currentHeight)
      setViewportHeight(currentHeight)
      setIsKeyboardOpen(false)
    }, 500) // Délai plus long pour l'orientation
  }, [])

  useEffect(() => {
    // Initialiser les valeurs
    const currentHeight = window.innerHeight
    setInitialHeight(currentHeight)
    setViewportHeight(currentHeight)

    // Écouter les événements
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [handleResize, handleOrientationChange])

  return {
    isKeyboardOpen,
    viewportHeight,
    keyboardHeight,
    initialHeight,
    handleFocus,
    handleBlur
  }
}

export default useVirtualKeyboard
