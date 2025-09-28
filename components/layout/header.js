import { Menu, Crown, User, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import LanguageSelector from '../LanguageSelector'

export default function Header({ user, setUser, toggleMobileMenu, isMobileMenuOpen }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(path)
  }

  // Fonction pour obtenir les classes CSS d'un lien
  const getLinkClasses = (path) => {
    const baseClasses = "transition-colors"
    if (isActive(path)) {
      return `${baseClasses} text-purple-400 font-medium`
    }
    return `${baseClasses} text-gray-300 hover:text-white`
  }

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
        <header
          className="flex items-center justify-between sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 px-4 lg:px-6 py-3 lg:py-4 w-full"
          style={{
            minHeight: '4rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
      <div className="flex items-center">
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50 mr-2"
          style={{ 
            color: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="flex items-center group animate-hover-lift">
          <div 
            className="px-6 py-3 rounded-lg shadow-glow group-hover:shadow-glow-accent transition-all duration-500 group-hover:scale-105"
            style={{ 
              background: '#8B5CF6',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}
          >
            <h1 
              className="text-xl lg:text-2xl font-bold text-white leading-tight tracking-wider"
              style={{ 
                fontFamily: 'Blanka, sans-serif',
                fontWeight: 'bold'
              }}
            >
              GET WEEZ
            </h1>
          </div>
        </Link>
      </div>

      {/* Menu de navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        <Link href="/" className={getLinkClasses('/')}>
          Accueil
        </Link>
        <Link href="/establishments" className={getLinkClasses('/establishments')}>
          Établissements
        </Link>
        <Link href="/events" className={getLinkClasses('/events')}>
          Événements
        </Link>
        <Link href="/account" className={getLinkClasses('/account')}>
          Compte
        </Link>
        <Link href="/aide" className={getLinkClasses('/aide')}>
          Aide
        </Link>
      </nav>

      <div className="flex items-center space-x-1 lg:space-x-4">
        <LanguageSelector />
        
        <div className="relative">
          {user ? (
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-2xl transition-all duration-300 group animate-hover-lift"
            style={{ 
              backgroundColor: 'transparent',
              color: 'var(--color-text-primary)',
              borderRadius: 'var(--radius-lg)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-surface-hover)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <div 
              className={`w-2.5 h-2.5 rounded-full animate-pulse-slow ${
                user.is_member ? 'shadow-glow-accent' : ''
              }`}
              style={{
                backgroundColor: user.is_member ? 'var(--color-accent)' : 'var(--color-text-muted)'
              }}
            ></div>
            <div 
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center text-white text-sm font-semibold shadow-glow group-hover:shadow-glow-accent transition-all duration-300 group-hover:scale-105"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-primary-darker) 100%)',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              {user.first_name?.charAt(0) || 'U'}
            </div>
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
            className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl py-3 z-50 animate-slide-up glass-strong"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Link 
              href="/account" 
              className="block px-4 py-3 transition-colors duration-300 font-medium text-body"
              style={{ 
                color: 'var(--color-text-primary)',
                borderRadius: 'var(--radius-md)',
                margin: '0 var(--spacing-sm)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              Mon Compte
            </Link>
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 transition-colors duration-300 font-medium text-body"
              style={{ 
                color: 'var(--color-text-primary)',
                borderRadius: 'var(--radius-md)',
                margin: '0 var(--spacing-sm)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              Déconnexion
            </button>
          </div>
        )}
        </div>
      </div>
    </header>
  )
}