import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  Home, 
  Search, 
  MessageCircle, 
  User, 
  Menu,
  Building,
  Ticket,
  Settings,
  HelpCircle,
  CreditCard,
  X,
  ChevronRight
} from 'lucide-react'
import useChatTheme from '../../hooks/useChatTheme'
import useMobileDetection from '../../hooks/useMobileDetection'
import { SafeAreaView } from './MobileOptimizations'

/**
 * Navigation mobile avec bottom tab bar
 */
export function MobileBottomNavigation({ user, className = '' }) {
  const router = useRouter()
  const { themeClasses } = useChatTheme()
  const [activeTab, setActiveTab] = useState(router.pathname)

  useEffect(() => {
    setActiveTab(router.pathname)
  }, [router.pathname])

  const tabs = [
    { 
      id: 'home', 
      label: 'Accueil', 
      icon: Home, 
      path: '/',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'establishments', 
      label: 'Lieux', 
      icon: Building, 
      path: '/establishments',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: MessageCircle, 
      path: '/aide',
      color: 'from-purple-500 to-pink-500',
      special: true // Tab central avec design spécial
    },
    { 
      id: 'events', 
      label: 'Événements', 
      icon: Ticket, 
      path: '/events',
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 'account', 
      label: 'Compte', 
      icon: User, 
      path: user ? '/account' : '/login',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  return (
    <SafeAreaView edges={['bottom']} className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
      <div className={`${themeClasses.surface} border-t border-gray-700 backdrop-blur-lg bg-opacity-90`}>
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.path
            
            return (
              <Link key={tab.id} href={tab.path}>
                <div className={`
                  relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
                  ${tab.special ? 'px-4 py-3' : 'px-3 py-2'}
                  ${isActive 
                    ? `bg-gradient-to-r ${tab.color} shadow-lg shadow-blue-500/20` 
                    : 'hover:bg-gray-800'
                  }
                `}>
                  {/* Badge de notification pour le chat */}
                  {tab.id === 'chat' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                  
                  <Icon 
                    size={tab.special ? 20 : 18} 
                    className={`${
                      isActive || tab.special
                        ? 'text-white' 
                        : themeClasses.text.secondary
                    } transition-colors`}
                  />
                  
                  <span className={`
                    text-xs font-medium mt-1 transition-colors
                    ${isActive || tab.special
                      ? 'text-white' 
                      : themeClasses.text.secondary
                    }
                    ${tab.special ? 'font-semibold' : ''}
                  `}>
                    {tab.label}
                  </span>
                  
                  {/* Indicateur actif */}
                  {isActive && !tab.special && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </SafeAreaView>
  )
}

/**
 * Menu burger mobile full-screen
 */
export function MobileFullScreenMenu({ isOpen, onClose, user }) {
  const { themeClasses } = useChatTheme()
  const router = useRouter()

  const menuSections = [
    {
      title: 'Navigation',
      items: [
        { label: 'Accueil', icon: Home, path: '/', description: 'Page principale' },
        { label: 'Établissements', icon: Building, path: '/establishments', description: 'Restaurants & bars' },
        { label: 'Services', icon: Settings, path: '/services', description: 'Services concierge' },
        { label: 'Événements', icon: Ticket, path: '/events', description: 'Sorties & spectacles' },
      ]
    },
    {
      title: 'Compte',
      items: user ? [
        { label: 'Mon Profil', icon: User, path: '/account', description: 'Gérer mon compte' },
        { label: 'Abonnements', icon: CreditCard, path: '/subscriptions', description: 'Plans & facturation' },
        { label: 'Aide', icon: HelpCircle, path: '/aide', description: 'Support & FAQ' },
      ] : [
        { label: 'Se connecter', icon: User, path: '/login', description: 'Accéder à mon compte' },
        { label: 'S\'inscrire', icon: User, path: '/register', description: 'Créer un compte' },
        { label: 'Aide', icon: HelpCircle, path: '/aide', description: 'Support & FAQ' },
      ]
    }
  ]

  // Prévenir le scroll quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleLinkClick = (path) => {
    onClose()
    router.push(path)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute inset-0 overflow-y-auto">
        <SafeAreaView edges={['top', 'bottom']} className={`min-h-full ${themeClasses.main}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${themeClasses.text.primary}`}>Get Weez</h2>
                <p className={`text-sm ${themeClasses.text.secondary}`}>Menu principal</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${themeClasses.button.ghost}`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 p-6">
            {/* User Info */}
            {user && (
              <div className={`p-4 rounded-xl ${themeClasses.surface} mb-6`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${themeClasses.text.primary}`}>
                      {user.name || user.email}
                    </p>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      Membre premium
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Sections */}
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${themeClasses.text.muted} mb-4 px-2`}>
                  {section.title}
                </h3>
                
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    const isActive = router.pathname === item.path
                    
                    return (
                      <button
                        key={itemIndex}
                        onClick={() => handleLinkClick(item.path)}
                        className={`
                          w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' 
                            : `${themeClasses.surface} hover:${themeClasses.surfaceElevated}`
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`
                            p-2 rounded-lg
                            ${isActive 
                              ? 'bg-white/20' 
                              : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                            }
                          `}>
                            <Icon 
                              size={20} 
                              className={isActive ? 'text-white' : 'text-purple-400'}
                            />
                          </div>
                          
                          <div className="text-left">
                            <p className={`font-medium ${
                              isActive ? 'text-white' : themeClasses.text.primary
                            }`}>
                              {item.label}
                            </p>
                            <p className={`text-sm ${
                              isActive ? 'text-white/80' : themeClasses.text.secondary
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        
                        <ChevronRight 
                          size={18} 
                          className={isActive ? 'text-white/60' : themeClasses.text.muted}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className={`mt-8 pt-6 border-t border-gray-700 text-center ${themeClasses.text.muted}`}>
              <p className="text-sm">
                Get Weez v1.0
              </p>
              <p className="text-xs mt-1">
                Votre concierge IA pour Marbella
              </p>
            </div>
          </div>
          
        </SafeAreaView>
      </div>
    </div>
  )
}

/**
 * Header mobile avec menu burger
 */
export function MobileHeader({ title, user, showMenu = true, onMenuToggle, className = '' }) {
  const { themeClasses } = useChatTheme()

  return (
    <SafeAreaView edges={['top']} className={className}>
      <div className={`${themeClasses.surface} border-b border-gray-700 backdrop-blur-lg bg-opacity-90`}>
        <div className="flex items-center justify-between p-4">
          
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <h1 className={`font-bold ${themeClasses.text.primary}`}>
                {title || 'Get Weez'}
              </h1>
            </div>
          </div>

          {/* Menu Button */}
          {showMenu && (
            <button
              onClick={onMenuToggle}
              className={`p-2 rounded-lg ${themeClasses.button.ghost}`}
            >
              <Menu size={20} />
            </button>
          )}
        </div>
      </div>
    </SafeAreaView>
  )
}

export default {
  MobileBottomNavigation,
  MobileFullScreenMenu,
  MobileHeader
}