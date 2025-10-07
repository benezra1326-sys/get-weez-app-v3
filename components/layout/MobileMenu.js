import { X, LogIn, UserPlus, Sparkles, ChevronRight, MessageCircle, Building, Ticket, User, CreditCard, Settings } from 'lucide-react'
import Link from 'next/link'
import { useEffect, memo, useCallback, useState } from 'react'
import { usePreloader } from '../../lib/preloader'
import { useTheme } from '../../contexts/ThemeContextSimple'
import GliitzLogo from '../ui/GliitzLogo'
import { 
  useMobileOptimizations, 
  useTouchOptimizations, 
  MobilePerformanceOptimizer,
  MobilePageTransition,
  MobileButtonAnimation
} from '../mobile'

const navItems = [
  { href: '/', label: 'Accueil', icon: MessageCircle, emoji: '🏠' },
  { href: '/establishments', label: 'Établissements', icon: Building, emoji: '🏨' },
  { href: '/services', label: 'Services', icon: Settings, emoji: '🛍️' },
  { href: '/events', label: 'Événements', icon: Ticket, emoji: '🎉' },
  { href: '/account', label: 'Compte', icon: User, emoji: '👤' },
]

const MobileMenu = memo(({ isOpen, onClose, user }) => {
  const { handleLinkHover } = usePreloader()
  const { isTouchDevice, isSlowConnection } = useMobileOptimizations()
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchOptimizations()
  const [activeItem, setActiveItem] = useState(null)
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = false
  
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
  } catch (error) {
    console.warn('ThemeProvider not available, using default theme')
  }

  // Fermer le menu avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Optimisation: précharger les pages au survol
  const handleItemHover = useCallback((href) => {
    handleLinkHover(href)
  }, [handleLinkHover])

  if (!isOpen) return null

  return (
    <MobilePerformanceOptimizer enableOptimizations={true}>
      <div className="md:hidden fixed inset-0 z-50">
        {/* Overlay avec effet glassmorphism */}
        <div 
          className="absolute inset-0 transition-all duration-500 ease-out"
          style={{
            background: isDarkMode 
              ? 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 25%, rgba(0, 0, 0, 0.4) 100%)'
              : 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 25%, rgba(255, 255, 255, 0.3) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
          }}
          onClick={onClose}
        />

        {/* Sidebar avec glassmorphism ultra moderne */}
        <MobilePageTransition isVisible={isOpen} direction="slide" duration={200}>
          <div 
            className="h-screen w-80 max-w-[85vw] relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDarkMode
                ? `
                  linear-gradient(135deg, 
                    rgba(17, 24, 39, 0.85) 0%, 
                    rgba(31, 41, 55, 0.80) 35%,
                    rgba(55, 65, 81, 0.85) 70%,
                    rgba(17, 24, 39, 0.90) 100%
                  )
                `
                : `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.90) 0%, 
                    rgba(248, 250, 252, 0.85) 35%,
                    rgba(241, 245, 249, 0.90) 70%,
                    rgba(255, 255, 255, 0.95) 100%
                  )
                `,
              backdropFilter: 'blur(40px) saturate(180%)',
              borderRight: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.4)'}`,
              borderTopRightRadius: '24px',
              borderBottomRightRadius: '24px',
              boxShadow: isDarkMode 
                ? `
                  8px 0 40px rgba(0, 0, 0, 0.5),
                  0 0 80px rgba(139, 92, 246, 0.08),
                  inset 1px 0 0 rgba(255, 255, 255, 0.05)
                `
                : `
                  8px 0 40px rgba(0, 0, 0, 0.12),
                  0 0 80px rgba(139, 92, 246, 0.05),
                  inset 1px 0 0 rgba(255, 255, 255, 0.6)
                `,
              transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Header avec effet glassmorphism */}
            <div 
              className="px-6 py-5 border-b relative overflow-hidden"
              style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.4) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 250, 252, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)'}`,
              }}
            >
              {/* Effet lumineux subtil */}
              <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent)'
                }}
              />
              
              <div className="flex justify-between items-center">
                {/* Logo moderne */}
                <Link href="/" onClick={onClose} className="group">
                  <div 
                    className="relative px-4 py-2 transition-all duration-500 group-hover:scale-105 group-active:scale-95"
                    style={{ 
                      background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <h1 
                      className="text-xl font-bold text-white leading-tight tracking-wider relative z-10"
                style={{ 
                  fontFamily: 'Blanka, sans-serif',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                <GliitzLogo size="text-xl" />
              </h1>
            </div>
          </Link>
          
                {/* Bouton fermer moderne */}
          <button 
            onClick={onClose} 
                  className="relative p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group"
            style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.4) 0%, rgba(55, 65, 81, 0.6) 100%)'
                      : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6) 0%, rgba(229, 231, 235, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
                    boxShadow: isDarkMode 
                      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <X 
                    size={20} 
                    className={`transition-all duration-300 group-hover:rotate-90 ${
                      isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
                    }`}
                  />
          </button>
              </div>
        </div>

            {/* Navigation moderne */}
            <nav className="px-4 py-6 pb-6 space-y-2 flex-1 overflow-y-auto">
              {navItems.map((item, index) => {
            const Icon = item.icon
                const isActive = activeItem === item.href
                
            return (
              <Link
                key={item.href}
                href={item.href}
                    onClick={() => {
                      setActiveItem(item.href)
                      setTimeout(onClose, 150)
                    }}
                    onMouseEnter={() => {
                      handleItemHover(item.href)
                      setActiveItem(item.href)
                    }}
                    onMouseLeave={() => setActiveItem(null)}
                    className="block relative group"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isOpen ? 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
                }}
              >
                <div 
                      className="flex items-center px-4 py-4 rounded-2xl transition-all duration-400 relative overflow-hidden"
                      style={{
                        background: isActive 
                          ? isDarkMode 
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.10) 100%)'
                            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)'
                          : 'transparent',
                        backdropFilter: isActive ? 'blur(10px)' : 'none',
                        border: `1px solid ${
                          isActive 
                            ? isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'
                            : 'transparent'
                        }`,
                        transform: isActive ? 'translateX(8px)' : 'translateX(0)',
                        zIndex: 100,
                        boxShadow: isActive 
                          ? isDarkMode
                            ? '0 8px 32px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                            : '0 8px 32px rgba(139, 92, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                          : 'none',
                      }}
                    >
                      {/* Effet de glow */}
                      <div 
                        className={`absolute inset-0 rounded-2xl transition-opacity duration-400 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                  style={{
                          background: isDarkMode 
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))'
                            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.03), rgba(59, 130, 246, 0.03))',
                        }}
                      />
                      
                      {/* Icône avec emoji */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl mr-4 relative">
                        <div 
                          className={`absolute inset-0 rounded-xl transition-all duration-400 ${
                            isActive ? 'scale-110' : 'scale-100'
                          }`}
                  style={{
                            background: isActive 
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))'
                              : isDarkMode 
                                ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.3), rgba(55, 65, 81, 0.3))'
                                : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6), rgba(229, 231, 235, 0.6))',
                            backdropFilter: 'blur(10px)',
                          }}
                        />
                        <span className="text-lg relative z-10">{item.emoji}</span>
                        <Icon 
                          size={16} 
                          className={`absolute inset-0 m-auto transition-all duration-400 ${
                            isActive ? 'scale-90 opacity-20' : 'scale-0 opacity-0'
                          } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        />
                      </div>
                      
                      {/* Label */}
                      <div className="flex-1">
                        <span className={`font-medium text-base transition-all duration-300 ${
                          isActive 
                            ? isDarkMode ? 'text-white font-semibold' : 'text-gray-900 font-semibold'
                            : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      
                      {/* Flèche */}
                      <ChevronRight 
                        size={16} 
                        className={`transition-all duration-400 ${
                          isActive 
                            ? 'translate-x-0 opacity-100' 
                            : '-translate-x-2 opacity-0'
                        } ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
                      />
                    </div>
              </Link>
            )
          })}
        </nav>

          </div>
        </MobilePageTransition>

        {/* Animations CSS */}
        <style jsx>{`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
        </div>
    </MobilePerformanceOptimizer>
  )
})

MobileMenu.displayName = 'MobileMenu'

export default MobileMenu