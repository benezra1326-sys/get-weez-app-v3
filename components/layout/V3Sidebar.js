import { useState } from 'react'
import { useRouter } from 'next/router'
import { Search, Moon, Sun, Building, Calendar, Briefcase, Users, FileText, Mail, Clock, Menu, X, User, Sparkles, BookOpen, Newspaper } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useConversationsContext } from '../../contexts/ConversationsContext'
import EnrichedHistory from '../chat/EnrichedHistory'

export default function V3Sidebar({ 
  onNewChat, 
  isOpen, 
  onToggle 
}) {
  // Utiliser le contexte global pour les conversations
  const conversationsCtx = useConversationsContext()
  const conversations = conversationsCtx?.conversations || []
  const currentConversationId = conversationsCtx?.currentConversationId
  const selectConversation = conversationsCtx?.selectConversation
  const deleteConversation = conversationsCtx?.deleteConversation
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
    { label: 'The Gliitz Way', icon: BookOpen, route: '/manifeste' },
    { label: 'Devenir Partenaire', icon: Users, route: '/partenaires' },
    { label: 'Presse', icon: Newspaper, route: '/presse' },
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
      {/* Toggle Button (mobile uniquement) - seulement quand fermé */}
      {!open && (
        <button
          onClick={() => toggle(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl transition-all flex items-center justify-center"
          style={{
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
            width: '48px',
            height: '48px'
          }}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay (mobile uniquement) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
          onClick={() => toggle(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen z-40 transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          width: '280px',
          background: isDarkMode ? '#0B0B0C' : '#FFFFFF',
          borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
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
                className="hover:opacity-80 transition-opacity flex items-center gap-2"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center logo-glow"
                  style={{
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #1a1a1a, #2c2c2c)'
                      : 'linear-gradient(135deg, #E8E8E8, #C0C0C0)',
                    border: '1px solid rgba(192,192,192,0.4)',
                    boxShadow: isDarkMode 
                      ? '0 4px 15px rgba(0, 0, 0, 0.5)'
                      : '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Sparkles size={18} style={{ color: '#FFFFFF' }} />
                </div>
                <h1 className="text-3xl font-bold" style={{
                  fontFamily: 'Playfair Display, serif',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}>
                  Gliitz
                </h1>
              </button>
              
              <div className="flex items-center gap-2">
                {/* Toggle Theme Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg transition-all flex items-center justify-center"
                  style={{
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                    width: '40px',
                    height: '40px'
                  }}
                  title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Close button (mobile only when open) */}
                <button
                  onClick={() => toggle(false)}
                  className="md:hidden p-2 rounded-lg transition-all flex items-center justify-center"
                  style={{
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                    width: '40px',
                    height: '40px'
                  }}
                  title="Fermer le menu"
                >
                  <X size={20} />
                </button>
              </div>
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
            
            {/* Nouveau Chat Button */}
            <button
              onClick={() => {
                if (onNewChat) onNewChat()
                router.push('/')
                toggle(false)
              }}
              className="w-full mt-3 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #A7C7C5, #9DB4C0)',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(167, 199, 197, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #9DB4C0, #8CA0A8)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(167, 199, 197, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #A7C7C5, #9DB4C0)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(167, 199, 197, 0.3)'
              }}
            >
              <Sparkles size={18} />
              <span>Nouveau chat</span>
            </button>
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
                      ? (isDarkMode ? '#C0C0C0' : '#1a1a1a')
                      : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
                    background: isActive 
                      ? (isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(0, 0, 0, 0.03)')
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

          {/* Conversation History - Enriched */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="flex items-center gap-2 px-4 mb-3" style={{ 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' 
            }}>
              <Clock size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">Conversations</span>
            </div>
            
            <EnrichedHistory
              conversations={conversations}
              currentId={currentConversationId}
              onSelect={(id) => {
                if (selectConversation) {
                  // CORRECTION BUG: S'assurer que la conversation est sélectionnée d'abord
                  selectConversation(id)
                  
                  // Puis rediriger vers le chat après un court délai
                  setTimeout(() => {
                    router.push('/').then(() => {
                      console.log('✅ Conversation chargée:', id)
                    })
                  }, 50)
                }
                toggle(false)
              }}
              onDelete={deleteConversation}
            />
          </div>

          {/* Profile Button at Bottom - Always visible */}
          <div className="p-4 border-t flex-shrink-0" style={{ 
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

      {/* Spacer for sidebar on desktop only */}
      <div className="hidden md:block flex-shrink-0" style={{ width: '280px' }} />
    </>
  )
}

