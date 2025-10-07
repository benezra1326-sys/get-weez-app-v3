import { useState } from 'react'
import { useRouter } from 'next/router'
import { Search, Moon, Sun, Building, Calendar, Briefcase, Users, FileText, Mail, Clock, Menu, X, User } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function V3Sidebar({ conversations = [], onNewChat, isOpen, onToggle }) {
  const router = useRouter()
  const { isDarkMode, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Use external state if provided, otherwise use internal
  const open = isOpen !== undefined ? isOpen : sidebarOpen
  const toggle = onToggle !== undefined ? onToggle : setSidebarOpen

  const navItems = [
    { label: 'Établissements', icon: Building, route: '/establishments' },
    { label: 'Services', icon: Briefcase, route: '/services' },
    { label: 'Événements', icon: Calendar, route: '/events' },
    { label: 'Partenaires', icon: Users, route: '/partenaires' },
    { label: 'Presse', icon: FileText, route: '/presse' },
    { label: 'Newsletter', icon: Mail, route: '/newsletter' }
  ]

  const handleNavigation = (route) => {
    router.push(route)
    toggle(false) // Fermer la sidebar après navigation
  }

  const handleLogoClick = () => {
    if (onNewChat) onNewChat()
    router.push('/')
    toggle(false)
  }

  return (
    <>
      {/* Toggle Button (mobile uniquement) */}
      <button
        onClick={() => toggle(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl transition-all"
        style={{
          background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
        }}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay (mobile uniquement) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
          onClick={() => toggle(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          width: '280px',
          background: isDarkMode ? '#0B0B0C' : '#FFFFFF',
          borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          overflowY: 'auto'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header avec Logo et Toggle Theme */}
          <div className="p-5 border-b" style={{ 
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
          }}>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleLogoClick}
                className="hover:opacity-80 transition-opacity"
              >
                <h1 className="text-3xl font-bold" style={{
                  fontFamily: 'Playfair Display, serif',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}>
                  Gliitz
                </h1>
              </button>
              
              {/* Toggle Theme Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
                title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
              />
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 border-b" style={{ 
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
          }}>
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = router.pathname === item.route
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.route)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all mb-1"
                  style={{
                    color: isActive 
                      ? (isDarkMode ? '#D4AF37' : '#1a1a1a')
                      : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
                    background: isActive 
                      ? (isDarkMode ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.03)')
                      : 'transparent',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: isActive ? 500 : 400
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                      e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                    }
                  }}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Conversation History */}
          <div className="flex-1 px-3 py-4" style={{ overflowY: 'auto' }}>
            <div className="flex items-center gap-2 px-4 mb-3" style={{ 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' 
            }}>
              <Clock size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">Conversations</span>
            </div>
            
            {conversations.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm" style={{ 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' 
              }}>
                Aucune conversation
              </p>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      toggle(false)
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl transition-all"
                    style={{
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <p className="text-sm font-medium truncate mb-0.5">{conv.title}</p>
                    <p className="text-xs truncate" style={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' 
                    }}>
                      {conv.preview}
                    </p>
                    <p className="text-xs mt-0.5" style={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' 
                    }}>
                      {conv.date}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Button at Bottom */}
          <div className="p-4 border-t" style={{ 
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
          }}>
            <button
              onClick={() => {
                router.push('/account')
                toggle(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                background: isDarkMode ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                fontFamily: 'Poppins, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 0, 0, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.03)'
              }}
            >
              <User size={20} />
              <span className="font-medium">Mon profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for sidebar on desktop */}
      <div className="hidden md:block" style={{ width: '280px' }} />
    </>
  )
}

