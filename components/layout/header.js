import { Menu, Crown, User, LogIn, UserPlus, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useState, memo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { usePreloader } from '../../lib/preloader'

const Header = memo(({ user, setUser, toggleMobileMenu, isMobileMenuOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const { handleLinkHover } = usePreloader()
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = false
  let toggleTheme = () => {}
  
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
    toggleTheme = theme.toggleTheme
  } catch (error) {
    console.warn('ThemeProvider not available, using default theme')
  }

  // Fonction pour déterminer si un lien est actif
  const isActive = useCallback((path) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(path)
  }, [router.pathname])

  // Fonction pour obtenir les classes CSS d'un lien
  const getLinkClasses = useCallback((path) => {
    const baseClasses = "relative px-4 py-2 rounded-lg transition-all duration-300 font-medium group"
    if (isActive(path)) {
      return `${baseClasses} ${isDarkMode ? 'text-white bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/20' : 'text-gray-900 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 shadow-lg shadow-purple-200/20'}`
    }
    return `${baseClasses} ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:shadow-lg hover:shadow-gray-500/10 hover:scale-105' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:shadow-lg hover:shadow-gray-200/10 hover:scale-105'}`
  }, [isActive, isDarkMode])

  const handleLogout = async () => {
    try {
      const { supabase } = await import('../../lib/supabase')
      await supabase.auth.signOut()
      setUser(null)
      setShowUserMenu(false)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(139, 92, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2);
          }
        }
        
        .menu-link {
          position: relative;
          overflow: hidden;
        }
        
        .menu-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent);
          transition: left 0.6s ease;
          z-index: 1;
        }
        
        .menu-link:hover::before {
          left: 100%;
        }
        
        .menu-link:hover {
          animation: pulse-glow 1.5s infinite;
        }
        
        .menu-link span {
          position: relative;
          z-index: 2;
        }
      `}</style>
      <header
        className="flex items-center justify-between sticky top-0 z-50 backdrop-blur-md border-b px-2 lg:px-6 py-2 lg:py-4 w-full"
        style={{
          minHeight: '3.5rem',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 4px 20px rgba(139, 92, 246, 0.1)',
          backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDarkMode ? '#374151' : 'rgba(139, 92, 246, 0.2)'
        }}
      >
      <div className="flex items-center">
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 mr-2"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.4), rgba(55, 65, 81, 0.6))'
              : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6), rgba(229, 231, 235, 0.8))',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.3)'}`,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Menu 
            size={20} 
            className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          />
        </button>
        <Link href="/" className="flex items-center group animate-hover-lift">
          <div 
            className="px-3 py-2 lg:px-6 lg:py-3 rounded-xl shadow-glow group-hover:shadow-glow-accent transition-all duration-500 group-hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}
          >
            <h1 
              className="text-lg lg:text-2xl font-bold leading-tight tracking-wider whitespace-nowrap text-white"
              style={{ 
                fontFamily: 'Blanka, sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                color: '#FFFFFF'
              }}
            >
              GET WEEZ
            </h1>
          </div>
        </Link>
      </div>

      {/* Menu de navigation */}
      <nav className="hidden lg:flex items-center space-x-2">
        <Link 
          href="/" 
          className={`${getLinkClasses('/')} menu-link`}
          onMouseEnter={() => handleLinkHover('/')}
        >
          <span>Accueil</span>
        </Link>
        
        <Link 
          href="/establishments" 
          className={`${getLinkClasses('/establishments')} menu-link`}
          onMouseEnter={() => handleLinkHover('/establishments')}
        >
          <span>Établissements</span>
        </Link>
        
        <Link 
          href="/services" 
          className={`${getLinkClasses('/services')} menu-link`}
          onMouseEnter={() => handleLinkHover('/services')}
        >
          <span>Services</span>
        </Link>
        
        <Link 
          href="/events" 
          className={getLinkClasses('/events')}
          onMouseEnter={() => handleLinkHover('/events')}
          style={{
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span className="relative z-10">Événements</span>
        </Link>
        
        <Link 
          href="/account" 
          className={getLinkClasses('/account')}
          onMouseEnter={() => handleLinkHover('/account')}
          style={{
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span className="relative z-10">Compte</span>
        </Link>
        
        <Link 
          href="/aide" 
          className={getLinkClasses('/aide')}
          onMouseEnter={() => handleLinkHover('/aide')}
          style={{
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span className="relative z-10">Aide</span>
        </Link>
      </nav>

      <div className="flex items-center space-x-1 lg:space-x-4">
        {/* Bouton de thème */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50"
          aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
          title={isDarkMode ? "Basculer en mode clair" : "Basculer en mode sombre"}
          style={{ 
            color: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        
        <div className="relative">
          {user ? (
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center space-x-3 p-2 rounded-2xl transition-all duration-300 group animate-hover-lift ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 border border-transparent hover:border-purple-200'}`}
            style={{
              background: isDarkMode ? 'transparent' : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(6, 182, 212, 0.05) 100%)',
              border: isDarkMode ? 'none' : '1px solid rgba(139, 92, 246, 0.1)'
            }}
          >
            {/* Indicateur de statut membre */}
            {user.is_member && (
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
            )}
            
            {/* Avatar utilisateur */}
            <div 
              className="rounded-2xl flex items-center justify-center text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
              style={{ 
                width: '32px',
                height: '32px',
                minWidth: '32px',
                minHeight: '32px',
                maxWidth: '32px',
                maxHeight: '32px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
                borderRadius: '12px'
              }}
            >
              <span className="relative z-10">
                {user.first_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              {/* Effet shimmer sur l'avatar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>
            </div>
            
            {/* Nom utilisateur (visible sur desktop) */}
            <div className="hidden lg:block text-left">
              <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user.first_name || 'Utilisateur'}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {user.is_member ? 'Membre Premium' : 'Utilisateur'}
              </div>
            </div>
            
            {/* Icône de menu dropdown */}
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Link 
              href="/login"
              className="btn-secondary flex items-center text-body-small"
            >
              <LogIn size={16} className="mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Connexion</span>
            </Link>
            <Link 
              href="/register"
              className="btn-premium flex items-center animate-hover-lift text-body-small"
            >
              <UserPlus size={16} className="mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Inscription</span>
            </Link>
          </div>
        )}

        {showUserMenu && user && (
          <div 
            className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl py-3 z-50 backdrop-blur-md ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50' : 'bg-white/95 border-gray-300/50'} border`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du menu avec infos utilisateur */}
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-300/50'} mb-2`}>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                  style={{ 
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)'
                  }}
                >
                  {user.first_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user.first_name} {user.last_name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.email}
                  </div>
                  {user.is_member && (
                    <div className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                      ⭐ Membre Premium
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link 
                href="/account" 
                className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 group ${isDarkMode ? 'text-white hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'}`}
                onClick={() => setShowUserMenu(false)}
              >
                <User size={18} className={`group-hover:text-purple-400 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span>Mon Compte</span>
              </Link>
              
              {user.is_member && (
                <Link 
                  href="/subscriptions" 
                  className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 group ${isDarkMode ? 'text-white hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'}`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <Crown size={18} className={`group-hover:text-yellow-400 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span>Abonnement</span>
                </Link>
              )}
              
              <div className={`border-t my-2 ${isDarkMode ? 'border-gray-700/50' : 'border-gray-300/50'}`}></div>
              
              <button 
                onClick={handleLogout}
                className={`flex items-center space-x-3 w-full text-left px-4 py-3 transition-all duration-200 group ${isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-100/50'}`}
              >
                <LogIn size={18} className={`transition-colors ${isDarkMode ? 'group-hover:text-red-300' : 'group-hover:text-red-500'}`} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
    </>
  )
})

Header.displayName = 'Header'

export default Header