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
    const baseClasses = "relative px-4 py-2 rounded-lg transition-all duration-300 font-medium group"
    if (isActive(path)) {
      return `${baseClasses} text-white bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/20`
    }
    return `${baseClasses} text-gray-300 hover:text-white hover:bg-gray-800/50 hover:shadow-lg hover:shadow-gray-500/10 hover:scale-105`
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
            className="px-6 py-3 rounded-xl shadow-glow group-hover:shadow-glow-accent transition-all duration-500 group-hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}
          >
            <h1 
              className="text-xl lg:text-2xl font-bold text-white leading-tight tracking-wider"
              style={{ 
                fontFamily: 'Blanka, sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.1em'
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
        >
          <span>Accueil</span>
        </Link>
        
        <Link 
          href="/establishments" 
          className={`${getLinkClasses('/establishments')} menu-link`}
        >
          <span>Établissements</span>
        </Link>
        
        <Link 
          href="/services" 
          className={`${getLinkClasses('/services')} menu-link`}
        >
          <span>Services</span>
        </Link>
        
        <Link 
          href="/events" 
          className={getLinkClasses('/events')}
          style={{
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!isActive('/events')) {
              e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
              e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
              e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.2)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/events')) {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'transparent'
              e.target.style.boxShadow = 'none'
            }
          }}
        >
          <span className="relative z-10">Événements</span>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s ease'
            }}
          />
        </Link>
        
        <Link 
          href="/account" 
          className={getLinkClasses('/account')}
          style={{
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!isActive('/account')) {
              e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
              e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
              e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.2)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/account')) {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'transparent'
              e.target.style.boxShadow = 'none'
            }
          }}
        >
          <span className="relative z-10">Compte</span>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s ease'
            }}
          />
        </Link>
        
        <Link 
          href="/aide" 
          className={getLinkClasses('/aide')}
          style={{
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!isActive('/aide')) {
              e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))'
              e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
              e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.2)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/aide')) {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'transparent'
              e.target.style.boxShadow = 'none'
            }
          }}
        >
          <span className="relative z-10">Aide</span>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s ease'
            }}
          />
        </Link>
      </nav>

      <div className="flex items-center space-x-1 lg:space-x-4">
        <LanguageSelector />
        
        <div className="relative">
          {user ? (
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-2xl transition-all duration-300 group animate-hover-lift hover:bg-gray-800/50"
          >
            {/* Indicateur de statut membre */}
            {user.is_member && (
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
            )}
            
            {/* Avatar utilisateur */}
            <div 
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
              style={{ 
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
              <div className="text-white text-sm font-semibold">
                {user.first_name || 'Utilisateur'}
              </div>
              <div className="text-gray-400 text-xs">
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
            className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl py-3 z-50 bg-gray-900/95 backdrop-blur-md border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du menu avec infos utilisateur */}
            <div className="px-4 py-3 border-b border-gray-700/50 mb-2">
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
                  <div className="text-white font-semibold text-sm">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-gray-400 text-xs">
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
                className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-800/50 transition-all duration-200 group"
                onClick={() => setShowUserMenu(false)}
              >
                <User size={18} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span>Mon Compte</span>
              </Link>
              
              {user.is_member && (
                <Link 
                  href="/subscriptions" 
                  className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-800/50 transition-all duration-200 group"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Crown size={18} className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  <span>Abonnement</span>
                </Link>
              )}
              
              <div className="border-t border-gray-700/50 my-2"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 transition-all duration-200 group"
              >
                <LogIn size={18} className="group-hover:text-red-300 transition-colors" />
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
}