import { useState, useEffect, useCallback, memo } from 'react'
import { useMobileAnimations } from './MobileOptimizations'

/**
 * Hook pour gérer les animations optimisées mobile
 */
export const useMobileAnimationController = () => {
  const { prefersReducedMotion, isLowEndDevice, getAnimationClass } = useMobileAnimations()
  const [isAnimating, setIsAnimating] = useState(false)

  const triggerAnimation = useCallback((callback, duration = 300) => {
    if (prefersReducedMotion || isLowEndDevice) {
      callback()
      return
    }

    setIsAnimating(true)
    callback()
    
    setTimeout(() => {
      setIsAnimating(false)
    }, duration)
  }, [prefersReducedMotion, isLowEndDevice])

  return {
    prefersReducedMotion,
    isLowEndDevice,
    isAnimating,
    triggerAnimation,
    getAnimationClass
  }
}

/**
 * Composant d'animation de transition de page
 */
export const MobilePageTransition = memo(({ 
  children, 
  isVisible = true,
  direction = 'slide',
  duration = 300,
  className = ""
}) => {
  const { prefersReducedMotion, isLowEndDevice } = useMobileAnimations()
  const [shouldRender, setShouldRender] = useState(isVisible)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  if (!shouldRender) return null

  const getTransitionClass = () => {
    if (prefersReducedMotion || isLowEndDevice) {
      return 'mobile-transition-none'
    }

    switch (direction) {
      case 'slide':
        return isVisible ? 'mobile-slide-in' : 'mobile-slide-out'
      case 'fade':
        return isVisible ? 'mobile-fade-in' : 'mobile-fade-out'
      case 'scale':
        return isVisible ? 'mobile-scale-in' : 'mobile-scale-out'
      default:
        return 'mobile-fade-in'
    }
  }

  return (
    <>
      <style jsx>{`
        .mobile-transition-none {
          opacity: 1;
          transform: none;
        }
        
        .mobile-slide-in {
          animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-slide-out {
          animation: slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .mobile-fade-out {
          animation: fadeOut 0.3s ease-in;
        }
        
        .mobile-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-scale-out {
          animation: scaleOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100%);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `}</style>
      
      <div className={`${getTransitionClass()} ${className}`}>
        {children}
      </div>
    </>
  )
})

MobilePageTransition.displayName = 'MobilePageTransition'

/**
 * Composant d'animation de liste optimisée mobile
 */
export const MobileListAnimation = memo(({ 
  children, 
  staggerDelay = 50,
  className = ""
}) => {
  const { prefersReducedMotion, isLowEndDevice } = useMobileAnimations()
  const [visibleItems, setVisibleItems] = useState(new Set())

  useEffect(() => {
    if (prefersReducedMotion || isLowEndDevice) {
      setVisibleItems(new Set(Array.from({ length: children.length }, (_, i) => i)))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setVisibleItems(prev => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-list-item]')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [children.length, prefersReducedMotion, isLowEndDevice])

  return (
    <>
      <style jsx>{`
        .mobile-list-item {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-list-item.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .mobile-list-item.stagger-0 { transition-delay: 0ms; }
        .mobile-list-item.stagger-1 { transition-delay: 50ms; }
        .mobile-list-item.stagger-2 { transition-delay: 100ms; }
        .mobile-list-item.stagger-3 { transition-delay: 150ms; }
        .mobile-list-item.stagger-4 { transition-delay: 200ms; }
        .mobile-list-item.stagger-5 { transition-delay: 250ms; }
      `}</style>
      
      <div className={className}>
        {children.map((child, index) => (
          <div
            key={index}
            data-list-item
            data-index={index}
            className={`mobile-list-item ${
              visibleItems.has(index) ? 'visible' : ''
            } stagger-${Math.min(index, 5)}`}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  )
})

MobileListAnimation.displayName = 'MobileListAnimation'

/**
 * Composant d'animation de bouton mobile
 */
export const MobileButtonAnimation = memo(({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const { prefersReducedMotion, isLowEndDevice } = useMobileAnimations()
  const [isPressed, setIsPressed] = useState(false)
  const [ripple, setRipple] = useState(null)

  const handleClick = useCallback((e) => {
    if (disabled || loading) return

    // Effet ripple
    if (!prefersReducedMotion && !isLowEndDevice) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setRipple({ x, y })
      setTimeout(() => setRipple(null), 600)
    }

    onClick?.(e)
  }, [disabled, loading, onClick, prefersReducedMotion, isLowEndDevice])

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
      case 'secondary':
        return 'bg-gray-100 text-gray-900 border border-gray-300'
      case 'ghost':
        return 'bg-transparent text-gray-600 border border-purple-200'
      default:
        return 'bg-gray-100 text-gray-900'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'lg':
        return 'px-6 py-4 text-lg'
      default:
        return 'px-4 py-3 text-base'
    }
  }

  return (
    <>
      <style jsx>{`
        .mobile-button {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        .mobile-button:active {
          transform: scale(0.98);
        }
        
        .mobile-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .mobile-button.ripple {
          position: relative;
          overflow: hidden;
        }
        
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .mobile-button.loading {
          position: relative;
        }
        
        .mobile-button.loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <button
        className={`mobile-button ${getVariantClasses()} ${getSizeClasses()} ${
          isPressed ? 'pressed' : ''
        } ${loading ? 'loading' : ''} ${className}`}
        onClick={handleClick}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        disabled={disabled || loading}
        {...props}
      >
        {!loading && children}
        {loading && <span className="opacity-0">{children}</span>}
        
        {ripple && (
          <div
            className="ripple-effect"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10
            }}
          />
        )}
      </button>
    </>
  )
})

MobileButtonAnimation.displayName = 'MobileButtonAnimation'

/**
 * Composant d'animation de modal mobile
 */
export const MobileModalAnimation = memo(({ 
  isOpen, 
  onClose, 
  children,
  className = ""
}) => {
  const { prefersReducedMotion, isLowEndDevice } = useMobileAnimations()
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <>
      <style jsx>{`
        .mobile-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          z-index: 50;
          animation: ${prefersReducedMotion || isLowEndDevice ? 'none' : 'fadeIn 0.3s ease-out'};
        }
        
        .mobile-modal-content {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 20px 20px 0 0;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 51;
          animation: ${prefersReducedMotion || isLowEndDevice ? 'none' : 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'};
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <div className="mobile-modal-overlay" onClick={onClose}>
        <div 
          className={`mobile-modal-content ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  )
})

MobileModalAnimation.displayName = 'MobileModalAnimation'

export default {
  useMobileAnimationController,
  MobilePageTransition,
  MobileListAnimation,
  MobileButtonAnimation,
  MobileModalAnimation
}
