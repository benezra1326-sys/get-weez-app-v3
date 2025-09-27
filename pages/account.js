import { useState } from 'react'
import Header from '../components/layout/header'
import Sidebar from '../components/layout/sidebar'
import MobileMenu from '../components/layout/MobileMenu'
import AccountInfo from '../components/account/AccountInfo'
import SupportSection from '../components/account/SupportSection'
import { HelpCircle, MessageCircle, FileText, Phone, Mail } from 'lucide-react'

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
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          width: '100vw',
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
        
        <div 
          style={{ 
            display: 'flex', 
            flex: 1, 
            overflow: 'hidden', 
            width: '100vw',
            height: 'calc(100vh - 8rem)'
          }}
        >
          <div className="hidden lg:block">
            <Sidebar user={user} />
          </div>
          
          <main 
            style={{ 
              flex: 1,
              overflowY: 'auto',
              backgroundColor: 'var(--color-bg-primary)',
              width: 'calc(100vw - 320px)',
              height: '100%',
              marginLeft: '320px',
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

            {/* Section Support */}
            <div className="max-w-4xl mx-auto mb-12">
              <SupportSection user={user} />
            </div>

            {/* Section Aide */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Centre d'Aide</h2>
                
                {/* Liens rapides d'aide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="/aide" 
                    className="group bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <HelpCircle size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 text-center">FAQ & Centre d'aide</h3>
                    <p className="text-gray-400 text-sm text-center">Trouvez des réponses à vos questions</p>
                  </a>
                  
                  <a 
                    href="mailto:support@getweez.com" 
                    className="group bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Mail size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 text-center">Contacter le support</h3>
                    <p className="text-gray-400 text-sm text-center">Écrivez-nous directement</p>
                  </a>
                  
                  <a 
                    href="/aide#cgv" 
                    className="group bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileText size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 text-center">Conditions générales</h3>
                    <p className="text-gray-400 text-sm text-center">CGV et mentions légales</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          </main>
        </div>
      </div>
    </div>
  )
}
