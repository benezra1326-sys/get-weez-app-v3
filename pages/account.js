import { useState } from 'react'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import AccountInfo from '../components/account/AccountInfo'
import ChatHistory from '../components/account/ChatHistory'
import Promotions from '../components/account/Promotions'
import Referral from '../components/account/Referral'
import Favorites from '../components/account/Favorites'
import LanguageSettings from '../components/account/LanguageSettings'
import SimpleNotificationSettings from '../components/account/SimpleNotificationSettings'
import SimpleSettings from '../components/settings/SimpleSettings'
import { useTheme, ThemeProvider } from '../contexts/ThemeContextSimple'
import { User, Bell, Heart, Users, Settings, Gift } from 'lucide-react'
import ChatFloatingButton from '../components/ui/ChatFloatingButton'

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
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#0a0a0f' : '#f9fafb' }}>
        <HeaderGliitz 
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
        
        {/* Bouton chat flottant */}
        <ChatFloatingButton />
        
        <main className="container mx-auto px-4 py-6">
            {/* Header simplifié - PARFAITEMENT centré */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent mb-3">
                Mon Compte
              </h1>
              <p className="text-lg" style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                Profil et préférences
              </p>
            </div>

            {/* Sections principales - Layout vertical une par ligne */}
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Espace pour le scroll vers les sections */}
              <div className="absolute -top-20" id="scroll-anchor"></div>
              
              {/* Section 1: Mon Profil */}
              <section id="profile" className="rounded-2xl p-6 shadow-lg border" style={{
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'
              }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>Mon Profil</h2>
                </div>
                <AccountInfo 
                  user={user} 
                  onBecomeMember={handleBecomeMember}
                  onReserve={handleReserve}
                />
              </section>

              {/* Section 2: Notifications */}
              <section id="notifications" className="rounded-2xl p-6 shadow-lg border" style={{
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'
              }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>Notifications</h2>
                </div>
                <SimpleNotificationSettings />
              </section>

              {/* Section 3: Favoris */}
              <section id="favorites" className="rounded-2xl p-6 shadow-lg border" style={{
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'
              }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>Favoris</h2>
                </div>
                <Favorites user={user} />
              </section>

              {/* Section 4: Historique Chat */}
              <section id="chat-history" className="rounded-2xl p-6 shadow-lg border" style={{
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'
              }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>Historique Chat</h2>
                </div>
                <ChatHistory user={user} />
              </section>

              {/* Section 5: Langue */}
              <section id="language" className="rounded-2xl p-6 shadow-lg border" style={{
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'
              }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>Langue</h2>
                </div>
                <LanguageSettings />
              </section>

              {/* Section 6: Paramètres */}
              <section id="settings" className="rounded-2xl p-6 shadow-lg border" style={{
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'
              }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>Paramètres</h2>
                </div>
                <SimpleSettings />
              </section>

              {/* Section 7: Promotions */}
              <section id="promotions" className="rounded-2xl p-6 shadow-lg border" style={{
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'
              }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>Promotions</h2>
                </div>
                <Promotions user={user} />
              </section>

              {/* Section 8: Parrainage */}
              <section id="referral" className="rounded-2xl p-6 shadow-lg border" style={{
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#e5e7eb'
              }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>Parrainage</h2>
                </div>
                <Referral user={user} />
              </section>
            </div>


          </main>
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
