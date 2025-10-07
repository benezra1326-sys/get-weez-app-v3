import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  User, 
  Settings, 
  HelpCircle, 
  CreditCard, 
  Bell, 
  Heart, 
  Gift, 
  Users, 
  ChevronDown,
  Sparkles,
  Crown,
  Shield,
  History
} from 'lucide-react'

const ProfileDropdown = ({ user, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [canCloseOverlay, setCanCloseOverlay] = useState(false)
  const router = useRouter()

  // Fermer le dropdown au clic extérieur
  React.useEffect(() => {
    if (!isOpen) return // Ne rien faire si le dropdown est fermé

    // Petit délai pour éviter que le clic d'ouverture ne le referme immédiatement
    const timeoutId = setTimeout(() => {
      const handleClickOutside = (event) => {
        // Vérifier si le clic est sur le bouton, l'overlay, ou le menu
        const isClickOnButton = event.target.closest('.profile-dropdown-container')
        const isClickOnOverlay = event.target.classList.contains('profile-overlay')
        const isClickOnMenu = event.target.closest('.mobile-profile-dropdown')
        
        if (!isClickOnButton && !isClickOnMenu && !isClickOnOverlay) {
          console.log('🔴 Fermeture dropdown - clic extérieur')
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      
      // Cleanup
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, 100) // Délai de 100ms

    return () => clearTimeout(timeoutId)
  }, [isOpen])

  // Debug : Log à chaque changement d'état
  React.useEffect(() => {
    console.log('🟢 ProfileDropdown isOpen:', isOpen)
  }, [isOpen])

  const handleLinkClick = (href) => {
    setIsOpen(false)
    
    if (href.includes('#')) {
      const [path, anchor] = href.split('#')
      
      if (router.pathname === '/account') {
        // Si on est déjà sur la page account, scroll vers la section
        setTimeout(() => {
          const element = document.getElementById(anchor)
          if (element) {
            // Scroll avec offset pour compenser le header
            const offset = 100
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }
        }, 100)
      } else {
        // Sinon, naviguer vers la page puis scroll
        router.push(href).then(() => {
          setTimeout(() => {
            const element = document.getElementById(anchor)
            if (element) {
              const offset = 100
              const elementPosition = element.getBoundingClientRect().top
              const offsetPosition = elementPosition + window.pageYOffset - offset
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              })
            }
          }, 500)
        })
      }
    } else {
      router.push(href)
    }
  }

  const profileItems = [
    {
      title: "Mon Profil",
      icon: User,
      href: "/account#profile",
      description: "Informations personnelles",
      color: "text-gray-500"
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/account#notifications",
      description: "Gérer vos alertes",
      color: "text-green-500"
    },
    {
      title: "Favoris",
      icon: Heart,
      href: "/account#favorites",
      description: "Vos endroits préférés",
      color: "text-red-500"
    },
    {
      title: "Historique Chat",
      icon: History,
      href: "/account#chat-history",
      description: "Vos conversations"
    },
    {
      title: "Langue",
      icon: Settings,
      href: "/account#language",
      description: "Préférences linguistiques"
    },
    {
      title: "Paramètres",
      icon: Settings,
      href: "/account#settings",
      description: "Configuration générale"
    },
    {
      title: "Promotions",
      icon: Gift,
      href: "/account#promotions",
      description: "Offres spéciales"
    },
    {
      title: "Parrainage",
      icon: Users,
      href: "/account#referral",
      description: "Inviter des amis"
    }
  ]

          const helpItems = [
            {
              title: "Centre d'aide",
              icon: HelpCircle,
              href: "/aide#help-center",
              description: "FAQ et support"
            },
            {
              title: "Nous contacter",
              icon: Gift,
              href: "/aide#contact",
              description: "Support client"
            }
          ]

  return (
    <div className="relative profile-dropdown-container">
      {/* Bouton profil - Compact mobile */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('🔵 Bouton profil cliqué, état actuel:', isOpen, 'nouveau:', !isOpen)
          const newState = !isOpen
          setIsOpen(newState)
          
          // Si on ouvre, désactiver temporairement le clic sur l'overlay
          if (newState) {
            setCanCloseOverlay(false)
            setTimeout(() => {
              setCanCloseOverlay(true)
              console.log('✅ Overlay maintenant cliquable')
            }, 200) // 200ms de protection
          }
        }}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 group hover:scale-105"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          flexShrink: 0,
          minWidth: 'fit-content',
          color: '#0B0B0C',
          cursor: 'pointer'
        }}
      >
        {/* Indicateur de statut avec sparkle - Hidden on small mobile */}
        <div className="relative hidden sm:block">
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
          <span className="absolute -top-1 -right-1 text-xs animate-sparkle-float">✨</span>
        </div>
        
        {/* Avatar */}
        <div 
          className="rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
          style={{
            width: '28px',
            height: '28px',
            minWidth: '28px',
            minHeight: '28px',
            maxWidth: '28px',
            maxHeight: '28px',
            background: '#C0C0C0',
            borderRadius: '8px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span className="relative z-10" style={{ 
            lineHeight: '28px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            textAlign: 'center'
          }}>D</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>
        </div>
        
        {/* Info utilisateur - Hidden on mobile */}
        <div className="hidden lg:block text-left">
          <div className="text-sm font-semibold" style={{ color: '#0B0B0C' }}>
            {user?.first_name || 'Utilisateur'}
          </div>
        </div>
        
        {/* Flèche */}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ flexShrink: 0, color: '#0B0B0C' }} />
      </button>

      {/* Menu déroulant - Rendu via Portal dans le body */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <>
        {/* Overlay DERRIÈRE le dropdown - rendu EN PREMIER */}
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm profile-overlay" 
          onClick={() => {
            if (canCloseOverlay) {
              console.log('🟡 Clic sur overlay - fermeture autorisée')
              setIsOpen(false)
            } else {
              console.log('⏸️ Clic sur overlay ignoré (protection active)')
            }
          }}
          style={{ 
            zIndex: 99998,
            position: 'fixed',
            inset: 0
          }}
        />
        
        {/* Dropdown AU-DESSUS de l'overlay */}
        <div 
          className="mobile-profile-dropdown rounded-2xl shadow-xl overflow-y-auto" 
          style={{ 
            position: 'fixed',
            right: '20px',
            top: '80px',
            zIndex: 99999, 
            maxHeight: '80vh',
            width: '320px',
            maxWidth: 'calc(100vw - 40px)',
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'}`
          }}
        >
          {/* Header du menu */}
          <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Mon Espace Gliitz</h3>
                <p className="text-sm text-white/80">{user?.first_name || 'Utilisateur'}</p>
              </div>
              <Sparkles className="w-4 h-4 animate-sparkle" />
            </div>
          </div>

          {/* Section Profil */}
          <div className="p-4">
            <h4 className={`text-sm font-semibold mb-3 flex items-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <User className="w-4 h-4 mr-2" />
              Mon Profil
            </h4>
            <div className="space-y-1">
              {profileItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 group text-left"
                  style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className={`text-sm font-medium leading-tight mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</div>
                    <div className={`text-xs leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section Aide */}
          <div className="p-4 border-t" style={{ borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)' }}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Support & Aide
            </h4>
            <div className="space-y-1">
              {helpItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 group text-left"
                  style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className={`text-sm font-medium leading-tight mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</div>
                    <div className={`text-xs leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer avec sparkles */}
          <div 
            className="p-3 border-t"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(243, 232, 255, 0.8) 0%, rgba(219, 234, 254, 0.8) 100%)',
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)'
            }}
          >
            <div className={`text-xs text-center flex items-center justify-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <Sparkles className="w-3 h-3 mr-1 animate-sparkle" />
              Gliitz - Votre concierge magique
              <Sparkles className="w-3 h-3 ml-1 animate-sparkle-delayed" />
            </div>
          </div>
        </div>
        </>,
        document.body
      )}
      
      {/* Styles globaux */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .mobile-profile-dropdown {
            position: absolute !important;
            right: 0 !important;
            top: 100% !important;
            margin-top: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ProfileDropdown
