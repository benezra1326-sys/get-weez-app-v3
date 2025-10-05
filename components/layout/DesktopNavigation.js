import React, { useState, memo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from '../../contexts/ThemeContextSimple'
import GliitzLogo from '../ui/GliitzLogo'
import ProfileDropdown from './ProfileDropdown'

const DesktopNavigation = memo(({ user, setUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
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
    const baseClasses = "desktop-nav-link"
    
    // Ajouter la classe active si la page est active
    if (isActive(path)) {
      return `${baseClasses} active`
    }
    
    return baseClasses
  }

  return (
    <div>
      <style jsx>{`
        .desktop-nav-link {
          position: relative;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--color-text-secondary);
          text-decoration: none;
          overflow: hidden;
        }
        
        .desktop-nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
          transition: left 0.6s ease;
        }
        
        .desktop-nav-link:hover::before {
          left: 100%;
        }
        
        .desktop-nav-link:hover {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        }
        
        .desktop-nav-link.active {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: white;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }
        
        .desktop-nav-link span {
          position: relative;
          z-index: 2;
        }
      `}</style>
      
      <header 
        className="desktop-header"
        style={{
          minHeight: '4rem',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
          backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDarkMode ? 'rgba(45, 45, 45, 0.2)' : 'rgba(139, 92, 246, 0.2)'
        }}
      >
        {/* Logo et navigation */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo Gliitz */}
          <Link href="/" className="flex items-center group">
            <div 
              className="px-6 py-3 rounded-xl transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                minWidth: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GliitzLogo size="text-4xl" />
            </div>
          </Link>

          {/* Menu de navigation central */}
          <nav className="desktop-nav">
            <Link 
              href="/" 
              className={getLinkClasses('/')}
            >
              <span>Accueil</span>
            </Link>
            
            <Link 
              href="/establishments" 
              className={getLinkClasses('/establishments')}
            >
              <span>Établissements</span>
            </Link>
            
            <Link 
              href="/services" 
              className={getLinkClasses('/services')}
            >
              <span>Services</span>
            </Link>
            
            <Link 
              href="/events" 
              className={getLinkClasses('/events')}
            >
              <span>Événements</span>
            </Link>
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Bouton de thème */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50 desktop-hover-scale"
              style={{ 
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-lg)'
              }}
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* ProfileDropdown avec tous les éléments du profil */}
            <ProfileDropdown user={user} isDarkMode={isDarkMode} />
          </div>
        </div>
      </header>
    </div>
  )
})

DesktopNavigation.displayName = 'DesktopNavigation'

export default DesktopNavigation
