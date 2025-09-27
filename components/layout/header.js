import { Menu, Crown, User, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import LanguageSelector from '../LanguageSelector'

export default function Header({ user, setUser, toggleMobileMenu, isMobileMenuOpen }) {
  const [showUserMenu, setShowUserMenu] = useState(false)

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
      className="w-full flex items-center justify-between sticky top-0 z-50 glass"
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)', 
        borderBottom: '1px solid var(--color-border)',
        paddingTop: 'var(--spacing-xl)',
        paddingBottom: 'var(--spacing-xl)',
        paddingLeft: 'var(--spacing-xl)',
        paddingRight: 'var(--spacing-xl)',
        minHeight: '6rem',
        backdropFilter: 'blur(20px)',
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
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-3xl mr-3 shadow-glow group-hover:shadow-glow-accent transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-primary-darker) 100%)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-xl lg:text-2xl font-bold text-gradient leading-tight">
              Get Weez
            </h1>
            <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">
              Conciergerie Premium
            </p>
          </div>
        </Link>
      </div>


      <div className="flex items-center space-x-2 lg:space-x-4">
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