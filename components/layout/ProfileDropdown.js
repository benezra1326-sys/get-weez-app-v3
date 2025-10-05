import React, { useState } from 'react'
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
  Shield
} from 'lucide-react'

const ProfileDropdown = ({ user, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

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
      description: "Informations personnelles"
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/account#notifications",
      description: "Gérer vos alertes"
    },
    {
      title: "Favoris",
      icon: Heart,
      href: "/account#favorites",
      description: "Vos endroits préférés"
    },
    {
      title: "Historique Chat",
      icon: Users,
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
    <div className="relative">
      {/* Bouton profil - Compact mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 lg:gap-2 p-1.5 lg:p-2 rounded-xl transition-all duration-300 group animate-hover-lift text-white"
        style={{
          background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
          boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          flexShrink: 0,
          minWidth: 'fit-content'
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
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
            borderRadius: '8px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span className="relative z-10" style={{ lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>D</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>
        </div>
        
        {/* Info utilisateur - Hidden on mobile */}
        <div className="hidden lg:block text-left">
          <div className="text-sm font-semibold text-white">
            {user?.first_name || 'Utilisateur'}
          </div>
        </div>
        
        {/* Flèche - Smaller on mobile */}
        <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ flexShrink: 0 }} />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden" style={{ zIndex: 99999 }}>
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
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Mon Profil
            </h4>
            <div className="space-y-1">
              {profileItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group text-left"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section Aide */}
          <div className="p-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" />
              Support & Aide
            </h4>
            <div className="space-y-1">
              {helpItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group text-left"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer avec sparkles */}
          <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-100">
            <div className="text-xs text-gray-600 text-center flex items-center justify-center">
              <Sparkles className="w-3 h-3 mr-1 animate-sparkle" />
              Gliitz - Votre concierge magique
              <Sparkles className="w-3 h-3 ml-1 animate-sparkle-delayed" />
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ProfileDropdown
