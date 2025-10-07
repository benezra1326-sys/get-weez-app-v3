import { Menu, Crown, User, LogIn, UserPlus, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useState, memo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { usePreloader } from '../../lib/preloader'
import GliitzLogo from '../ui/GliitzLogo'
import ProfileDropdown from './ProfileDropdown'

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
    const baseClasses = "relative px-4 py-2 rounded-lg transition-all duration-300 font-medium group menu-link"
    if (isActive(path)) {
      return `${baseClasses} active`
    }
    return baseClasses
  }, [isActive])

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
    <div>
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
            box-shadow: 0 0 5px rgba(192, 192, 192, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(192, 192, 192, 0.6);
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
          background: linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.3), transparent);
          transition: left 0.6s ease;
          z-index: 1;
        }
        
        .menu-link:hover::before {
          left: 100%;
        }
        
        .menu-link:hover {
          background: rgba(192, 192, 192, 0.1) !important;
          color: var(--color-text-primary) !important;
          border-radius: 8px;
          padding: 8px 16px;
          transform: translateY(-2px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(192, 192, 192, 0.15) !important;
          border: 1px solid rgba(192, 192, 192, 0.3) !important;
        }
        
        .menu-link.active {
          background: linear-gradient(135deg, #E5E5E5, #C0C0C0) !important;
          color: white !important;
          border-radius: 8px;
          padding: 8px 16px;
          box-shadow: 0 4px 15px rgba(192, 192, 192, 0.4) !important;
        }
        
        .menu-link span {
          position: relative;
          z-index: 2;
        }
      `}</style>
      <header
        className="flex items-center justify-between sticky top-0 z-50 backdrop-blur-md border-b px-6 lg:px-12 py-4 lg:py-6 w-full"
        style={{
          minHeight: '5rem',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 4px 20px rgba(192, 192, 192, 0.1)',
          backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDarkMode ? '#374151' : 'rgba(192, 192, 192, 0.2)'
        }}
      >
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.3), rgba(99, 102, 241, 0.3))'
                : 'linear-gradient(135deg, rgba(243, 244, 246, 0.6), rgba(229, 231, 235, 0.8))',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.4)' : 'rgba(209, 213, 219, 0.3)'}`,
              borderRadius: '12px',
              boxShadow: isDarkMode 
                ? '0 4px 12px rgba(192, 192, 192, 0.3), 0 0 20px rgba(192, 192, 192, 0.2)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Menu 
              size={20} 
              className={isDarkMode ? 'text-gray-400' : 'text-gray-700'}
              style={{ filter: isDarkMode ? 'drop-shadow(0 0 4px rgba(192, 192, 192, 0.5))' : 'none' }}
            />
          </button>
          <Link href="/" className="flex items-center group">
            <div 
              className="transition-all duration-300 group-hover:scale-102"
              style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                padding: '2px 8px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(192, 192, 192, 0.3)'
              }}
            >
              <GliitzLogo size="text-lg lg:text-3xl" compact={true} />
            </div>
          </Link>
        </div>


        {/* Menu de navigation - Déplacé à droite */}
        <nav className="hidden lg:flex items-center space-x-6">
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
        </nav>

        <div className="flex items-center space-x-3 lg:space-x-6">
          {/* Bouton de thème */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50"
            style={{ 
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-lg)'
            }}
            title={isDarkMode ? "Mode clair" : "Mode sombre"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* ProfileDropdown avec tous les éléments du profil */}
          <ProfileDropdown user={user} isDarkMode={isDarkMode} />
        </div>
      </header>
    </div>
  )
})

Header.displayName = 'Header'

export default Header
