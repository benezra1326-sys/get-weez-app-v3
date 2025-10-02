import { useState } from 'react'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import { useTheme, ThemeProvider } from '../contexts/ThemeContextSimple'

// Import des composants de réglages
import AppearanceSettings from '../components/settings/AppearanceSettings'
import PermissionsSettings from '../components/settings/PermissionsSettings'
import PerformanceSettings from '../components/settings/PerformanceSettings'
import PrivacySettings from '../components/settings/PrivacySettings'
import SecuritySettings from '../components/settings/SecuritySettings'
import AboutSettings from '../components/settings/AboutSettings'

function SettingsContent({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isDarkMode, isLoaded } = useTheme()

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <div 
      style={{ 
        width: '100%', 
        minHeight: '100vh', 
        margin: 0, 
        padding: 0,
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF'
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
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent mb-2">
                Réglages
              </h1>
              <p className={`text-sm lg:text-base max-w-xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Configuration de l'application
              </p>
            </div>

            {/* Grille des réglages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {/* Apparence */}
              <div className="w-full h-full flex flex-col">
                <AppearanceSettings />
              </div>

              {/* Permissions */}
              <div className="w-full h-full flex flex-col">
                <PermissionsSettings />
              </div>

              {/* Performance */}
              <div className="w-full h-full flex flex-col">
                <PerformanceSettings />
              </div>

              {/* Confidentialité */}
              <div className="w-full h-full flex flex-col lg:col-span-2 xl:col-span-1">
                <PrivacySettings />
              </div>

              {/* Sécurité */}
              <div className="w-full h-full flex flex-col lg:col-span-2 xl:col-span-2">
                <SecuritySettings user={user} />
              </div>

              {/* À propos */}
              <div className="w-full h-full flex flex-col lg:col-span-2 xl:col-span-3">
                <AboutSettings />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function Settings({ user, setUser }) {
  return (
    <ThemeProvider>
      <SettingsContent user={user} setUser={setUser} />
    </ThemeProvider>
  )
}
