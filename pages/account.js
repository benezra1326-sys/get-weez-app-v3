import { useState } from 'react'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import AccountInfo from '../components/account/AccountInfo'
import ChatHistory from '../components/account/ChatHistory'
import { useTheme, ThemeProvider } from '../contexts/ThemeContextSimple'

function AccountContent({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isDarkMode, isLoaded } = useTheme()


  // Ne pas rendre avant que le thème soit chargé
  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chargement...</p>
        </div>
      </div>
    )
  }

  const handleBecomeMember = () => {
    console.log('Become member clicked')
    // TODO: intégrer logique Supabase (update users.is_member = true)
  }

  const handleReserve = () => {
    console.log('Reserve clicked')
    // TODO: intégrer logique réservation avec Supabase
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <div 
      style={{ 
        width: '100%', 
        minHeight: '100vh', 
        margin: 0, 
        padding: 0
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          width: '100%',
          margin: 0,
          padding: 0
        }}
      >
        <Header 
          user={user} 
          setUser={setUser}
          toggleMobileMenu={toggleMobileMenu} 
          isMobileMenuOpen={isMobileMenuOpen} 
        />
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          user={user} 
        />
        
        <main 
          style={{ 
            flex: 1,
            overflow: 'auto',
            backgroundColor: isDarkMode ? '#0D0D0D' : '#F9FAFB',
            width: '100%',
            minHeight: 'calc(100vh - 8rem)',
            padding: '1.5rem'
          }}
        >
          <div className="container mx-auto px-4 py-6">
            {/* Header simplifié */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent mb-2">
                Mon Compte
              </h1>
              <p className={`max-w-xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Profil et conversations
              </p>
            </div>

            {/* Sections principales - layout plus aéré */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Informations du compte */}
              <div className="lg:col-span-1">
                <AccountInfo 
                  user={user} 
                  onBecomeMember={handleBecomeMember}
                  onReserve={handleReserve}
                />
              </div>

              {/* Historique des Conversations */}
              <div className="lg:col-span-1">
                <ChatHistory user={user} />
              </div>
            </div>


          </div>
          </main>
      </div>
    </div>
  )
}

export default function Account({ user, setUser }) {
  return (
    <ThemeProvider>
      <AccountContent user={user} setUser={setUser} />
    </ThemeProvider>
  )
}
