import { useState } from 'react'
import { useRouter } from 'next/router'
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, CreditCard, Bell, 
  Settings, History, Heart, LogOut, ChevronRight, Award, Package,
  HelpCircle, MessageSquare, Star, Sparkles
} from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import PreferencesManager from '../components/preferences/PreferencesManager'
import { useTheme } from '../contexts/ThemeContextSimple'
import { supabase } from '../lib/supabase'

export default function Account({ user, setUser }) {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Données utilisateur par défaut
  const userData = {
    firstName: user?.first_name || 'Utilisateur',
    lastName: user?.last_name || 'Gliitz',
    email: user?.email || 'contact@gliitz.com',
    phone: user?.phone || '+33 6 12 34 56 78',
    memberSince: '2024',
    reservations: 12,
    favorites: 8,
    reviews: 5
  }

  const menuSections = [
    {
      id: 'account',
      title: 'Mon Compte',
      items: [
        {
          icon: User,
          label: 'Informations personnelles',
          description: 'Nom, email, téléphone',
          onClick: () => setActiveTab('profile'),
          active: activeTab === 'profile'
        },
        {
          icon: Shield,
          label: 'Sécurité & Connexion',
          description: 'Mot de passe, authentification 2FA',
          onClick: () => setActiveTab('security'),
          active: activeTab === 'security'
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Préférences email et push',
          onClick: () => setActiveTab('notifications'),
          active: activeTab === 'notifications'
        }
      ]
    },
    {
      id: 'bookings',
      title: 'Réservations & Activité',
      items: [
        {
          icon: Calendar,
          label: 'Mes Réservations',
          description: `${userData.reservations} réservations`,
          badge: userData.reservations,
          onClick: () => setActiveTab('reservations'),
          active: activeTab === 'reservations'
        },
        {
          icon: History,
          label: 'Historique',
          description: 'Toutes vos anciennes réservations',
          onClick: () => setActiveTab('history'),
          active: activeTab === 'history'
        },
        {
          icon: Heart,
          label: 'Favoris',
          description: `${userData.favorites} établissements`,
          badge: userData.favorites,
          onClick: () => setActiveTab('favorites'),
          active: activeTab === 'favorites'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Paiement & Abonnement',
      items: [
        {
          icon: CreditCard,
          label: 'Moyens de paiement',
          description: 'Cartes et méthodes de paiement',
          onClick: () => setActiveTab('payment'),
          active: activeTab === 'payment'
        },
        {
          icon: Package,
          label: 'Mon Abonnement',
          description: 'Plan Premium actif',
          badge: 'Premium',
          onClick: () => setActiveTab('subscription'),
          active: activeTab === 'subscription'
        },
        {
          icon: Award,
          label: 'Programme Fidélité',
          description: 'Points et récompenses',
          onClick: () => setActiveTab('loyalty'),
          active: activeTab === 'loyalty'
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Préférences & Personnalisation',
      items: [
        {
          icon: Sparkles,
          label: 'Configuration des goûts',
          description: 'Goûts, interdictions, peurs, alimentation',
          onClick: () => setActiveTab('preferences'),
          active: activeTab === 'preferences'
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Aide',
      items: [
        {
          icon: MessageSquare,
          label: 'Mes Avis',
          description: `${userData.reviews} avis publiés`,
          onClick: () => setActiveTab('reviews'),
          active: activeTab === 'reviews'
        },
        {
          icon: HelpCircle,
          label: 'Centre d\'aide',
          description: 'FAQ et assistance',
          onClick: () => router.push('/help')
        },
        {
          icon: Settings,
          label: 'Paramètres',
          description: 'Préférences générales',
          onClick: () => setActiveTab('settings'),
          active: activeTab === 'settings'
        }
      ]
    }
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex" style={{
      background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
    }}>
      <V3Sidebar 
        conversations={[]} 
        onNewChat={() => router.push('/')}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header Profile Banner */}
        <div 
          className="relative h-64 flex items-end"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pb-8">
            <div className="flex items-end gap-6">
              {/* Avatar */}
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#FFFFFF'
                }}
              >
                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
              </div>
              
              {/* Info */}
              <div className="flex-1 pb-4">
                <h1 
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {userData.firstName} {userData.lastName}
                </h1>
                <p 
                  className="text-white/80 mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {userData.email}
                </p>
                <div className="flex gap-4 text-sm text-white/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> Membre depuis {userData.memberSince}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} /> {userData.reservations} réservations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 gap-8">
            {menuSections.map((section) => (
              <div key={section.id}>
                <h2 
                  className="text-xl font-bold mb-4 px-4"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {section.title}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={idx}
                        onClick={item.onClick}
                        className="glass-live p-6 rounded-2xl text-left transition-all group relative overflow-hidden"
                        style={{
                          background: item.active 
                            ? (isDarkMode ? 'rgba(167,199,197,0.15)' : 'rgba(167,199,197,0.1)')
                            : (isDarkMode ? 'rgba(26,26,28,0.8)' : 'rgba(255,255,255,0.8)'),
                          border: item.active 
                            ? '1px solid rgba(167,199,197,0.5)'
                            : '1px solid rgba(167,199,197,0.2)'
                        }}
                        onMouseEnter={(e) => {
                          if (!item.active) {
                            e.currentTarget.style.transform = 'translateY(-4px)'
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(167,199,197,0.3)'
                            e.currentTarget.style.borderColor = 'rgba(167,199,197,0.4)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!item.active) {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                            e.currentTarget.style.borderColor = 'rgba(167,199,197,0.2)'
                          }
                        }}
                      >
                        {/* Badge */}
                        {item.badge && (
                          <div 
                            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              background: 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))',
                              color: '#FFFFFF'
                            }}
                          >
                            {item.badge}
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                          <div 
                            className="p-3 rounded-xl"
                            style={{
                              background: item.active
                                ? 'rgba(167,199,197,0.2)'
                                : (isDarkMode ? 'rgba(167,199,197,0.1)' : 'rgba(167,199,197,0.15)')
                            }}
                          >
                            <Icon 
                              size={24} 
                              style={{ color: '#A7C7C5' }}
                            />
                          </div>
                          <ChevronRight 
                            size={20} 
                            className="opacity-50 group-hover:opacity-100 transition-opacity"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}
                          />
                        </div>

                        <h3 
                          className="text-lg font-bold mb-1"
                          style={{
                            fontFamily: 'Playfair Display, serif',
                            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                          }}
                        >
                          {item.label}
                        </h3>
                        
                        <p 
                          className="text-sm"
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                          }}
                        >
                          {item.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all"
              style={{
                background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontFamily: 'Poppins, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'
                e.currentTarget.style.color = '#FFFFFF'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                e.currentTarget.style.color = '#EF4444'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <LogOut size={20} />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'preferences' && (
            <PreferencesManager 
              user={user} 
              onSave={(preferences) => {
                console.log('Préférences sauvegardées:', preferences)
                // TODO: Sauvegarder dans Supabase
              }}
            />
          )}
          
          {activeTab !== 'preferences' && (
            <div className="p-8">
              <div 
                className="text-center py-16 rounded-2xl"
                style={{
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.03)' 
                    : 'rgba(255, 255, 255, 0.6)',
                  border: isDarkMode 
                    ? '1px solid rgba(192, 192, 192, 0.2)' 
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(14px)'
                }}
              >
                <Sparkles 
                  size={64} 
                  style={{ 
                    color: isDarkMode ? 'rgba(192, 192, 192, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                    margin: '0 auto 1rem'
                  }} 
                />
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {activeTab === 'profile' && 'Informations personnelles'}
                  {activeTab === 'security' && 'Sécurité & Connexion'}
                  {activeTab === 'notifications' && 'Notifications'}
                  {activeTab === 'reservations' && 'Mes Réservations'}
                  {activeTab === 'history' && 'Historique'}
                  {activeTab === 'favorites' && 'Favoris'}
                  {activeTab === 'payment' && 'Moyens de paiement'}
                  {activeTab === 'subscription' && 'Mon Abonnement'}
                  {activeTab === 'loyalty' && 'Programme Fidélité'}
                  {activeTab === 'reviews' && 'Mes Avis'}
                  {activeTab === 'settings' && 'Paramètres'}
                </h3>
                <p 
                  className="text-lg"
                  style={{
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Cette section sera bientôt disponible
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
