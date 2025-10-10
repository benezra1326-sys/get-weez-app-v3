import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { 
  FiPlus, FiSearch, FiHome, FiCalendar, FiBriefcase, 
  FiMail, FiFileText, FiClock, FiUser, FiSettings,
  FiHelpCircle, FiLogOut, FiSun, FiMoon, FiMenu, FiX,
  FiMessageSquare
} from 'react-icons/fi';

const ChatFirstSidebar = ({ 
  isOpen, 
  onToggle, 
  conversations = [], 
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onLogout
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [theme, setTheme] = useState('dark');
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { label: 'Établissements', icon: FiBuilding, route: '/establishments' },
    { label: 'Événements', icon: FiCalendar, route: '/events' },
    { label: 'Services', icon: FiBriefcase, route: '/services' },
    { label: 'Newsletter', icon: FiMail, route: '/newsletter' },
    { label: 'Presse', icon: FiFileText, route: '/presse' }
  ];

  const profileItems = [
    { label: 'Mon compte', icon: FiUser, action: () => router.push('/account') },
    { 
      label: theme === 'dark' ? 'Mode Clair' : 'Mode Sombre', 
      icon: theme === 'dark' ? FiSun : FiMoon, 
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark')
    },
    { label: 'Paramètres', icon: FiSettings, action: () => router.push('/settings') },
    { label: 'Aide', icon: FiHelpCircle, action: () => router.push('/aide') },
    { label: 'Se déconnecter', icon: FiLogOut, action: onLogout, danger: true }
  ];

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition-all"
        style={{ boxShadow: '0 4px 15px rgba(192,192,192,0.3)' }}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          width: '280px',
          background: 'rgba(11, 11, 12, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Top Section - Logo & New Chat */}
          <div className="p-5 border-b border-white/10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)',
                  boxShadow: '0 4px 15px rgba(192,192,192,0.4)'
                }}
              >
                <FiMessageSquare size={20} className="text-black" />
              </div>
              <h1 
                className="text-2xl font-bold"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  background: 'linear-gradient(135deg, #C0C0C0 0%, #FFFFFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px rgba(192,192,192,0.5)'
                }}
              >
                Gliitz
              </h1>
            </div>

            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group"
              style={{
                background: 'rgba(192, 192, 192, 0.15)',
                border: '1px solid rgba(192, 192, 192, 0.3)',
                color: '#C0C0C0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(192, 192, 192, 0.25)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,192,192,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(192, 192, 192, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FiPlus size={20} />
              <span>Nouveau chat</span>
            </button>

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-full mt-3 flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              <FiSearch size={18} />
              <span className="text-sm">Rechercher...</span>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-4 border-b border-white/10">
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.route;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.route)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Conversations History - Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="flex items-center gap-2 px-4 mb-3 text-white/50 text-xs font-semibold uppercase tracking-wider">
              <FiClock size={14} />
              <span>Historique</span>
            </div>
            <div className="space-y-1">
              {conversations.length === 0 ? (
                <p className="px-4 py-6 text-center text-white/40 text-sm">
                  Aucune conversation
                </p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => onSelectConversation(conv.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl transition-all group
                      ${conv.id === currentConversationId
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {new Date(conv.updatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Profile Section - Bottom */}
          <div className="p-4 border-t border-white/10 relative">
            {/* Profile Dropdown */}
            {profileOpen && (
              <div
                className="absolute bottom-full left-4 right-4 mb-2 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(20, 20, 20, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
                }}
              >
                {profileItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setProfileOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 transition-all text-left
                        ${item.danger 
                          ? 'text-red-400 hover:bg-red-500/10' 
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Profile Button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)',
                  boxShadow: '0 2px 10px rgba(192,192,192,0.3)'
                }}
              >
                <FiUser size={18} className="text-black" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-white">Mon Profil</p>
                <p className="text-xs text-white/50">Voir les options</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block" style={{ width: '280px' }} />
    </>
  );
};

export default ChatFirstSidebar;

