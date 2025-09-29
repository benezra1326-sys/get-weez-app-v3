import { useState } from 'react'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import AccountInfo from '../components/account/AccountInfo'
import ChatHistory from '../components/account/ChatHistory'

export default function Account({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            backgroundColor: 'var(--color-bg-primary)',
            width: '100%',
            minHeight: 'calc(100vh - 8rem)',
            padding: 'var(--spacing-xl)'
          }}
        >
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent mb-4">
                Mon Compte Get Weez
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Gérez votre profil, vos abonnements et accédez à tous nos services
              </p>
            </div>

            {/* Sections principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
              {/* Informations du compte */}
              <div className="lg:col-span-1">
                <AccountInfo 
                  user={user} 
                  onBecomeMember={handleBecomeMember}
                  onReserve={handleReserve}
                />
              </div>

              {/* Section Abonnements - Intégrée dans AccountInfo */}
              <div className="lg:col-span-1">
                <div className="card-premium p-6">
                  <h3 className="text-heading-3 mb-4" style={{ color: 'var(--color-text-primary)' }}>
                    Gestion des Abonnements
                  </h3>
                  <p className="text-body-small mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    Gérez votre abonnement Get Weez directement depuis votre compte.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                      <span className="text-body-small" style={{ color: 'var(--color-text-primary)' }}>
                        Statut actuel
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.is_member ? 'bg-success text-white' : 'bg-text-muted text-white'
                      }`}>
                        {user?.is_member ? 'Membre Premium' : 'Invité'}
                      </span>
                    </div>
                    <button 
                      onClick={handleBecomeMember}
                      className="btn-premium w-full"
                    >
                      {user?.is_member ? 'Gérer mon abonnement' : 'Devenir membre'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Historique des Conversations */}
            <div className="max-w-4xl mx-auto mb-12">
              <ChatHistory user={user} />
            </div>

          </div>
          </main>
      </div>
    </div>
  )
}
