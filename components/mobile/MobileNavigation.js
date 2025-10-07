import { useState, useEffect, useCallback, memo } from 'react'
import { useRouter } from 'next/router'
import { Menu, X, Home, Building, Settings, Calendar, User, HelpCircle, ChevronRight } from 'lucide-react'
import { useMobileGestures, useNavigationGestures } from './MobileGestures'
import { MobilePageTransition } from './MobileAnimations'

/**
 * Composant de navigation mobile optimisée
 */
export const MobileNavigation = memo(({ 
  isOpen, 
  onClose, 
  user,
  className = ""
}) => {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState(null)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  // Navigation items avec sous-menus
  const navigationItems = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      href: '/',
      subItems: []
    },
    {
      id: 'establishments',
      label: 'Établissements',
      icon: Building,
      href: '/establishments',
      subItems: [
        { label: 'Restaurants', href: '/establishments?type=restaurant' },
        { label: 'Hôtels', href: '/establishments?type=hotel' },
        { label: 'Bars & Clubs', href: '/establishments?type=bar' }
      ]
    },
    {
      id: 'services',
      label: 'Services',
      icon: Settings,
      href: '/services',
      subItems: [
        { label: 'Transport', href: '/services?category=transport' },
        { label: 'Concierge', href: '/services?category=concierge' },
        { label: 'Spa & Bien-être', href: '/services?category=spa' }
      ]
    },
    {
      id: 'events',
      label: 'Événements',
      icon: Calendar,
      href: '/events',
      subItems: [
        { label: 'Aujourd\'hui', href: '/events?filter=today' },
        { label: 'Cette semaine', href: '/events?filter=week' },
        { label: 'Ce mois', href: '/events?filter=month' }
      ]
    },
    {
      id: 'account',
      label: 'Compte',
      icon: User,
      href: '/account',
      subItems: user ? [
        { label: 'Profil', href: '/account' },
        { label: 'Historique', href: '/account/history' },
        ...(user.is_member ? [{ label: 'Abonnement', href: '/subscriptions' }] : [])
      ] : []
    },
    {
      id: 'help',
      label: 'Aide',
      icon: HelpCircle,
      href: '/aide',
      subItems: [
        { label: 'FAQ', href: '/aide#faq' },
        { label: 'Contact', href: '/aide#contact' },
        { label: 'Support', href: '/aide#support' }
      ]
    }
  ]

  // Gestion des gestes de navigation
  const { onTouchStart, onTouchMove, onTouchEnd } = useNavigationGestures(
    () => {
      // Swipe gauche pour fermer
      onClose()
    },
    () => {
      // Swipe droite pour ouvrir (pas applicable ici)
    }
  )

  const handleItemClick = useCallback((item) => {
    if (item.subItems && item.subItems.length > 0) {
      setActiveSection(activeSection === item.id ? null : item.id)
      setIsSubMenuOpen(activeSection !== item.id)
    } else {
      router.push(item.href)
      onClose()
    }
  }, [activeSection, router, onClose])

  const handleSubItemClick = useCallback((href) => {
    router.push(href)
    onClose()
  }, [router, onClose])

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <>
      <style jsx>{`
        .mobile-nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          z-index: 50;
          animation: fadeIn 0.3s ease-out;
        }
        
        .mobile-nav-panel {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          height: 100vh;
          height: 100dvh;
          min-height: 100vh;
          width: 320px;
          max-width: 85vw;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 51;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          border-top-right-radius: 0;
          border-bottom-right-radius: 24px;
        }
        
        .mobile-nav-panel.open {
          transform: translateX(0);
        }
        
        .mobile-nav-header {
          padding: 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #E5E5E5, #C0C0C0);
          color: white;
        }
        
        .mobile-nav-item {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }
        
        .mobile-nav-item:hover {
          background: rgba(192, 192, 192, 0.1);
        }
        
        .mobile-nav-item.active {
          background: rgba(192, 192, 192, 0.15);
          border-left: 4px solid #C0C0C0;
        }
        
        .mobile-nav-item-icon {
          margin-right: 16px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mobile-nav-item-label {
          flex: 1;
          font-weight: 500;
          color: #374151;
        }
        
        .mobile-nav-item-arrow {
          transition: transform 0.2s ease;
        }
        
        .mobile-nav-item-arrow.open {
          transform: rotate(90deg);
        }
        
        .mobile-submenu {
          background: rgba(249, 250, 251, 0.8);
          border-left: 4px solid rgba(192, 192, 192, 0.3);
        }
        
        .mobile-submenu-item {
          padding: 12px 20px 12px 60px;
          color: #6B7280;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .mobile-submenu-item:hover {
          background: rgba(192, 192, 192, 0.05);
          color: #C0C0C0;
        }
        
        .mobile-nav-footer {
          padding: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(249, 250, 251, 0.8);
        }
        
        .mobile-user-info {
          display: flex;
          align-items: center;
          padding: 12px;
          background: rgba(192, 192, 192, 0.1);
          border-radius: 12px;
          margin-bottom: 16px;
        }
        
        .mobile-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background: linear-gradient(135deg, #E5E5E5, #C0C0C0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          margin-right: 12px;
        }
        
        .mobile-user-details h3 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }
        
        .mobile-user-details p {
          font-size: 14px;
          color: #6B7280;
          margin: 0;
        }
        
        .mobile-user-status {
          display: inline-block;
          padding: 2px 8px;
          background: linear-gradient(135deg, #F59E0B, #F97316);
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 4px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

      {isOpen && (
        <div 
          className="mobile-nav-overlay" 
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className={`mobile-nav-panel open ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mobile-nav-header">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Get Weez</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {user && (
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {user.first_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="mobile-user-details">
                    <h3>{user.first_name} {user.last_name}</h3>
                    <p>{user.email}</p>
                    {user.is_member && (
                      <span className="mobile-user-status">⭐ Membre Premium</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Items */}
            <nav>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = router.pathname === item.href || 
                  (item.href !== '/' && router.pathname.startsWith(item.href))
                const hasSubItems = item.subItems && item.subItems.length > 0
                const isSubMenuOpen = activeSection === item.id

                return (
                  <div key={item.id}>
                    <div
                      className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="mobile-nav-item-icon">
                        <Icon size={20} />
                      </div>
                      <div className="mobile-nav-item-label">
                        {item.label}
                      </div>
                      {hasSubItems && (
                        <ChevronRight 
                          size={16} 
                          className={`mobile-nav-item-arrow ${isSubMenuOpen ? 'open' : ''}`}
                        />
                      )}
                    </div>

                    {hasSubItems && isSubMenuOpen && (
                      <div className="mobile-submenu">
                        {item.subItems.map((subItem, index) => (
                          <div
                            key={index}
                            className="mobile-submenu-item"
                            onClick={() => handleSubItemClick(subItem.href)}
                          >
                            {subItem.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="mobile-nav-footer">
              <div className="text-center text-sm text-gray-500">
                <p>Version 1.0.0</p>
                <p>© 2024 Get Weez</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

MobileNavigation.displayName = 'MobileNavigation'

/**
 * Composant de navigation par onglets mobile
 */
export const MobileTabNavigation = memo(({ 
  tabs = [],
  activeTab,
  onTabChange,
  className = ""
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({})

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab)
    if (activeIndex >= 0) {
      const tabWidth = 100 / tabs.length
      setIndicatorStyle({
        left: `${activeIndex * tabWidth}%`,
        width: `${tabWidth}%`
      })
    }
  }, [activeTab, tabs])

  return (
    <>
      <style jsx>{`
        .mobile-tab-nav {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 4px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-tab-nav-container {
          display: flex;
          position: relative;
        }
        
        .mobile-tab-indicator {
          position: absolute;
          top: 4px;
          height: calc(100% - 8px);
          background: linear-gradient(135deg, #E5E5E5, #C0C0C0);
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
        }
        
        .mobile-tab-item {
          flex: 1;
          padding: 12px 16px;
          text-align: center;
          font-weight: 500;
          color: #6B7280;
          transition: color 0.2s ease;
          cursor: pointer;
          border-radius: 12px;
          position: relative;
          z-index: 1;
        }
        
        .mobile-tab-item.active {
          color: white;
        }
        
        .mobile-tab-item:not(.active):hover {
          color: #C0C0C0;
        }
      `}</style>
      
      <div className={`mobile-tab-nav ${className}`}>
        <div className="mobile-tab-nav-container">
          <div 
            className="mobile-tab-indicator"
            style={indicatorStyle}
          />
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`mobile-tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>
    </>
  )
})

MobileTabNavigation.displayName = 'MobileTabNavigation'

export default {
  MobileNavigation,
  MobileTabNavigation
}
