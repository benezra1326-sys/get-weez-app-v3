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
  const [mounted, setMounted] = useState(false) // Pour éviter le flash hydration
  const router = useRouter()
  
  // Montage côté client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = false
  let toggleTheme = () => {}
  let isLoaded = false
  
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
    toggleTheme = theme.toggleTheme
    isLoaded = theme.isLoaded
  } catch (error) {
    console.warn('Erreur useTheme:', error)
  }
  
  // Ne pas appliquer les styles dynamiques avant le montage
  const shouldApplyTheme = mounted && isLoaded

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
    
    // Styles adaptatifs selon le thème (seulement après montage)
    if (!shouldApplyTheme) {
      return `${baseClasses} text-gray-700` // Style par défaut
    }
    
    if (isDarkMode) {
      return `${baseClasses} hover:scale-105`
    } else {
      return `${baseClasses} hover:scale-105`
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
  // Attendre le montage ET la détection pour éviter le flash
  if (mounted && isDesktop) {
    return <DesktopNavigation user={user} setUser={setUser} />
  }
  
  // Ne pas rendre tant que pas monté pour éviter le flash
  if (!mounted) {
    return null
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
          background: linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.3), transparent);
          transition: left 0.6s ease;
          z-index: 1;
        }
        
        .menu-link:hover::before {
          left: 100%;
        }
        
        .menu-link:hover {
          background: linear-gradient(135deg, #E0E0E0, #C0C0C0) !important;
          color: #0B0B0C !important;
          border-radius: 12px;
          padding: 8px 16px;
          transform: scale(1.05);
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(192,192,192,0.5) !important;
        }
        
        /* Mode sombre par défaut */
        body.dark .menu-link.active,
        .menu-link.active {
          background: linear-gradient(135deg, #E0E0E0, #C0C0C0) !important;
          color: #0B0B0C !important;
          border-radius: 12px;
          padding: 8px 16px;
          box-shadow: 0 0 15px rgba(192,192,192,0.6) !important;
          font-weight: 500;
        }
        
        body.dark .menu-link:hover {
          background: linear-gradient(135deg, #E0E0E0, #C0C0C0) !important;
          color: #0B0B0C !important;
        }
        
        /* Mode clair */
        body.light .menu-link:hover {
          background: linear-gradient(135deg, #E0E0E0, #C0C0C0) !important;
          color: #0B0B0C !important;
        }
        
        body.light .menu-link.active {
          background: linear-gradient(135deg, #E0E0E0, #C0C0C0) !important;
          color: #0B0B0C !important;
          border-radius: 12px;
          padding: 8px 16px;
          box-shadow: 0 0 15px rgba(192,192,192,0.6) !important;
          font-weight: 500;
        }
        
        body.light .menu-link.active span {
          color: #0B0B0C !important;
        }
        
        .menu-link span {
          position: relative;
          z-index: 2;
        }
      `}</style>
    <header 
        className="flex items-center justify-between sticky top-0 z-50 glass border-b px-2 lg:px-6 py-2 lg:py-4 w-full"
      style={{
          minHeight: '4rem',
        boxShadow: isDarkMode 
          ? '0 4px 20px rgba(192, 192, 192, 0.1)' 
          : '0 4px 20px rgba(192, 192, 192, 0.2)',
        backgroundColor: isDarkMode 
          ? 'rgba(11, 11, 12, 0.85)' 
          : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderColor: isDarkMode 
          ? 'rgba(192, 192, 192, 0.1)' 
          : 'rgba(192, 192, 192, 0.2)',
        maxWidth: '100vw',
        overflow: 'visible',
        fontFamily: 'var(--font-family-primary)'
      }}
    >
      {/* Logo et menu mobile */}
      <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
        {/* Menu mobile */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 glass halo rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-soft)',
            minWidth: '36px',
            minHeight: '36px',
            flexShrink: 0,
            color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
          }}
        >
          <Menu size={18} />
        </button>
        
        {/* Logo Gliitz - Fond blanc élégant */}
        <Link href="/" className="flex items-center group" style={{ flexShrink: 0 }}>
          <GliitzLogo forHeader={true} />
        </Link>
      </div>

      {/* Menu de navigation - Toujours visible sur desktop */}
      <nav className="hidden lg:flex items-center justify-center space-x-4 flex-1 max-w-4xl mx-8">
        <Link 
          href="/" 
          className={`${getLinkClasses('/')} menu-link`}
          style={isActive('/') ? {
            background: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
            color: '#0B0B0C',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '0 0 15px rgba(192,192,192,0.6)',
            fontWeight: '500'
          } : {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            color: '#C0C0C0'
          }}
        >
          <span style={isActive('/') ? { color: 'white', fontWeight: '600' } : {}}>
            Accueil
          </span>
        </Link>
        
        <Link 
          href="/establishments" 
          className={`${getLinkClasses('/establishments')} menu-link`}
          style={isActive('/establishments') ? {
            background: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
            color: '#0B0B0C',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '0 0 15px rgba(192,192,192,0.6)',
            fontWeight: '500'
          } : {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            color: '#C0C0C0'
          }}
        >
          <span style={isActive('/establishments') ? { color: 'white', fontWeight: '600' } : {}}>
            Établissements
          </span>
        </Link>
        
        <Link 
          href="/services" 
          className={`${getLinkClasses('/services')} menu-link`}
          style={isActive('/services') ? {
            background: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
            color: '#0B0B0C',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '0 0 15px rgba(192,192,192,0.6)',
            fontWeight: '500'
          } : {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            color: '#C0C0C0'
          }}
        >
          <span style={isActive('/services') ? { color: 'white', fontWeight: '600' } : {}}>
            Services
          </span>
        </Link>
        
        <Link 
          href="/events" 
          className={`${getLinkClasses('/events')} menu-link`}
          style={isActive('/events') ? {
            background: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
            color: '#0B0B0C',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '0 0 15px rgba(192,192,192,0.6)',
            fontWeight: '500'
          } : {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            color: '#C0C0C0'
          }}
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
          className="p-2 glass halo rounded-xl transition-all duration-300 hover:scale-110"
          style={{ 
            color: isDarkMode ? 'var(--gliitz-silver)' : 'var(--gliitz-black)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-soft)'
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
