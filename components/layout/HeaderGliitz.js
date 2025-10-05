import { Menu, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useState, memo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '../../contexts/ThemeContextSimple'
import GliitzLogo from '../ui/GliitzLogo'
import ProfileDropdown from './ProfileDropdown'
import DesktopNavigation from './DesktopNavigation'

const HeaderGliitz = memo(({ user, setUser, toggleMobileMenu, isMobileMenuOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true) // Initialisation cohérente pour SSR
  const router = useRouter()
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = false
  let toggleTheme = () => {}
  
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
    toggleTheme = theme.toggleTheme
  } catch (error) {
    console.warn('Erreur useTheme:', error)
  }

  // Fonction pour déterminer si un lien est actif
  const isActive = useCallback((path) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(path)
  }, [router.pathname])

  const getLinkClasses = (path) => {
    const baseClasses = "relative px-4 py-2 rounded-lg transition-all duration-300 font-medium group menu-link"
    
    // Ajouter la classe active si la page est active
    if (isActive(path)) {
      return `${baseClasses} active`
    }
    
    // Styles adaptatifs selon le thème
    if (isDarkMode) {
      return `${baseClasses} text-gray-300 hover:text-white hover:bg-gray-700/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105`
    } else {
      return `${baseClasses} text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 hover:shadow-lg hover:shadow-purple-200/20 hover:scale-105`
    }
  }

  // Détection desktop pour éviter les erreurs d'hydratation
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Utiliser DesktopNavigation pour les écrans desktop
  if (isDesktop) {
    return <DesktopNavigation user={user} setUser={setUser} />
  }

  return (
    <div>
      <style jsx>{`
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
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
          transition: left 0.6s ease;
          z-index: 1;
        }
        
        .menu-link:hover::before {
          left: 100%;
        }
        
        .menu-link:hover {
          background: linear-gradient(135deg, #8B5CF6, #3B82F6) !important;
          color: white !important;
          border-radius: 8px;
          padding: 8px 16px;
          transform: scale(1.05);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3) !important;
        }
        
        /* Mode sombre par défaut */
        body.dark .menu-link.active,
        .menu-link.active {
          background: linear-gradient(135deg, #8B5CF6, #3B82F6) !important;
          color: white !important;
          border-radius: 8px;
          padding: 8px 16px;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4) !important;
        }
        
        /* Mode clair - PRIORITÉ ABSOLUE */
        body.light .menu-link:hover {
          background: linear-gradient(135deg, #8B5CF6, #3B82F6) !important;
          color: white !important;
        }
        
        body.light .menu-link.active {
          background: linear-gradient(135deg, #F59E0B, #FCD34D) !important;
          color: #1F2937 !important;
          border-radius: 8px;
          padding: 8px 16px;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4) !important;
        }
        
        body.light .menu-link.active span {
          color: #1F2937 !important;
        }
        
        .menu-link span {
          position: relative;
          z-index: 2;
        }
      `}</style>
    <header 
        className="flex items-center justify-between sticky top-0 z-50 backdrop-blur-md border-b px-2 lg:px-6 py-2 lg:py-4 w-full"
      style={{
          minHeight: '4rem',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
        backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDarkMode ? 'rgba(45, 45, 45, 0.2)' : 'rgba(139, 92, 246, 0.2)',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      {/* Logo et menu mobile */}
      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        {/* Menu mobile */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(243, 244, 246, 0.6), rgba(229, 231, 235, 0.8))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(209, 213, 219, 0.3)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '36px',
            minHeight: '36px',
            flexShrink: 0
          }}
        >
          <Menu size={18} className="text-gray-700" />
        </button>
        
        {/* Logo Gliitz - Compact */}
        <Link href="/" className="flex items-center group" style={{ flexShrink: 0 }}>
          <div 
            className="px-2 py-1.5 lg:px-8 lg:py-4 rounded-lg transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              maxWidth: 'fit-content'
            }}
          >
            <GliitzLogo size="text-xl lg:text-5xl" />
          </div>
        </Link>
      </div>

      {/* Menu de navigation - Toujours visible sur desktop */}
      <nav className="hidden lg:flex items-center justify-center space-x-4 flex-1 max-w-4xl mx-8">
        <Link 
          href="/" 
          className={`${getLinkClasses('/')} menu-link`}
          style={isActive('/') ? {
            background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            fontWeight: '600'
          } : {}}
        >
          <span style={isActive('/') ? { color: 'white', fontWeight: '600' } : {}}>
            Accueil
          </span>
        </Link>
        
        <Link 
          href="/establishments" 
          className={`${getLinkClasses('/establishments')} menu-link`}
          style={isActive('/establishments') ? {
            background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            fontWeight: '600'
          } : {}}
        >
          <span style={isActive('/establishments') ? { color: 'white', fontWeight: '600' } : {}}>
            Établissements
          </span>
        </Link>
        
        <Link 
          href="/services" 
          className={`${getLinkClasses('/services')} menu-link`}
          style={isActive('/services') ? {
            background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            fontWeight: '600'
          } : {}}
        >
          <span style={isActive('/services') ? { color: 'white', fontWeight: '600' } : {}}>
            Services
          </span>
        </Link>
        
        <Link 
          href="/events" 
          className={`${getLinkClasses('/events')} menu-link`}
          style={isActive('/events') ? {
            background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            fontWeight: '600'
          } : {}}
        >
          <span style={isActive('/events') ? { color: 'white', fontWeight: '600' } : {}}>
            Événements
          </span>
        </Link>
      </nav>

      {/* Actions utilisateur */}
      <div className="flex items-center space-x-1 lg:space-x-4">
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

HeaderGliitz.displayName = 'HeaderGliitz'

export default HeaderGliitz
