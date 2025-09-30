import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook pour gérer les gestes tactiles avancés sur mobile
 */
export const useMobileGestures = (options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onTap,
    onDoubleTap,
    onLongPress,
    minSwipeDistance = 50,
    maxSwipeTime = 300,
    longPressDelay = 500
  } = options

  const [gestureState, setGestureState] = useState({
    startX: 0,
    startY: 0,
    startTime: 0,
    isLongPress: false,
    touchCount: 0
  })

  const longPressTimer = useRef(null)
  const lastTapTime = useRef(0)

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    const now = Date.now()
    
    setGestureState({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: now,
      isLongPress: false,
      touchCount: e.touches.length
    })

    // Démarrer le timer pour le long press
    longPressTimer.current = setTimeout(() => {
      setGestureState(prev => ({ ...prev, isLongPress: true }))
      onLongPress?.(e)
    }, longPressDelay)
  }, [onLongPress, longPressDelay])

  const handleTouchMove = useCallback((e) => {
    // Annuler le long press si on bouge
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const now = Date.now()
    const { startX, startY, startTime, isLongPress, touchCount } = gestureState
    
    // Nettoyer le timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (e.changedTouches.length === 0) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY
    const deltaTime = now - startTime
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Vérifier si c'est un long press
    if (isLongPress) {
      return
    }

    // Vérifier si c'est un double tap
    const timeSinceLastTap = now - lastTapTime.current
    if (timeSinceLastTap < 300) {
      onDoubleTap?.(e)
      lastTapTime.current = 0
      return
    }

    // Vérifier si c'est un tap simple
    if (distance < 10 && deltaTime < 200) {
      lastTapTime.current = now
      onTap?.(e)
      return
    }

    // Vérifier les swipes
    if (distance > minSwipeDistance && deltaTime < maxSwipeTime) {
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (absX > absY) {
        // Swipe horizontal
        if (deltaX > 0) {
          onSwipeRight?.(e)
        } else {
          onSwipeLeft?.(e)
        }
      } else {
        // Swipe vertical
        if (deltaY > 0) {
          onSwipeDown?.(e)
        } else {
          onSwipeUp?.(e)
        }
      }
    }
  }, [gestureState, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, onDoubleTap, minSwipeDistance, maxSwipeTime])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    gestureState
  }
}

/**
 * Hook pour gérer le pull-to-refresh
 */
export const usePullToRefresh = (onRefresh, threshold = 80) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isPulling) return

    currentY.current = e.touches[0].clientY
    const distance = Math.max(0, currentY.current - startY.current)
    
    if (distance > 0) {
      e.preventDefault()
      setPullDistance(distance)
    }
  }, [isPulling])

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      onRefresh().finally(() => {
        setIsRefreshing(false)
        setPullDistance(0)
        setIsPulling(false)
      })
    } else {
      setPullDistance(0)
      setIsPulling(false)
    }
  }, [pullDistance, threshold, onRefresh])

  return {
    isRefreshing,
    pullDistance,
    isPulling,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

/**
 * Hook pour gérer les gestes de navigation (swipe pour changer de page)
 */
export const useNavigationGestures = (onPrevious, onNext) => {
  const [swipeStart, setSwipeStart] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)

  const handleTouchStart = useCallback((e) => {
    setSwipeStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    })
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!swipeStart) return

    const deltaX = e.touches[0].clientX - swipeStart.x
    const deltaY = e.touches[0].clientY - swipeStart.y

    // Déterminer la direction du swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left')
    } else {
      setSwipeDirection(deltaY > 0 ? 'down' : 'up')
    }
  }, [swipeStart])

  const handleTouchEnd = useCallback((e) => {
    if (!swipeStart) return

    const deltaX = e.changedTouches[0].clientX - swipeStart.x
    const deltaTime = Date.now() - swipeStart.time

    // Vérifier si c'est un swipe valide
    if (Math.abs(deltaX) > 100 && deltaTime < 300) {
      if (deltaX > 0) {
        onPrevious?.()
      } else {
        onNext?.()
      }
    }

    setSwipeStart(null)
    setSwipeDirection(null)
  }, [swipeStart, onPrevious, onNext])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    swipeDirection
  }
}

/**
 * Hook pour gérer les gestes de zoom et pinch
 */
export const useZoomGestures = (onZoom, onPinch) => {
  const [initialDistance, setInitialDistance] = useState(0)
  const [currentDistance, setCurrentDistance] = useState(0)
  const [isZooming, setIsZooming] = useState(false)

  const getDistance = useCallback((touches) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches)
      setInitialDistance(distance)
      setCurrentDistance(distance)
      setIsZooming(true)
    }
  }, [getDistance])

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && isZooming) {
      const distance = getDistance(e.touches)
      setCurrentDistance(distance)
      
      const scale = distance / initialDistance
      onZoom?.(scale)
    }
  }, [isZooming, initialDistance, getDistance, onZoom])

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) {
      setIsZooming(false)
      onPinch?.(currentDistance / initialDistance)
    }
  }, [currentDistance, initialDistance, onPinch])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isZooming,
    scale: currentDistance / initialDistance
  }
}

/**
 * Composant wrapper pour ajouter des gestes à n'importe quel élément
 */
export const GestureWrapper = ({ 
  children, 
  gestures = {},
  className = "",
  style = {}
}) => {
  const gestureHandlers = useMobileGestures(gestures)

  return (
    <div
      className={className}
      style={style}
      {...gestureHandlers}
    >
      {children}
    </div>
  )
}

export default {
  useMobileGestures,
  usePullToRefresh,
  useNavigationGestures,
  useZoomGestures,
  GestureWrapper
}
