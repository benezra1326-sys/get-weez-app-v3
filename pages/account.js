import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { User, Mail, Phone, MapPin, Calendar, Shield, CreditCard, Bell } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import { useTheme } from '../contexts/ThemeContextSimple'
import { supabase } from '../lib/supabase'

export default function Account({ user, setUser }) {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  })

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', user.id)

      if (!error) {
        setUser({ ...user, ...formData })
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
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
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            Mon Compte
          </h1>
          <p 
            className="text-lg"
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: isDarkMode ? '#E0E0E0' : '#666666'
            }}
          >
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        {/* Profile Card */}
        <div 
          className="rounded-3xl p-8 mb-8"
          style={{
            background: isDarkMode 
              ? 'rgba(26,26,28,0.95)' 
              : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(192,192,192,0.2)',
            boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 
              className="text-2xl font-bold"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
              }}
            >
              Informations Personnelles
            </h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-6 py-2 rounded-xl font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
                color: 'white',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              {isEditing ? 'Sauvegarder' : 'Modifier'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? '#C0C0C0' : '#666666'
                  }}
                >
                  <User size={16} className="inline mr-2" />
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(192,192,192,0.1)',
                    border: '1px solid rgba(192,192,192,0.3)',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? '#C0C0C0' : '#666666'
                  }}
                >
                  <User size={16} className="inline mr-2" />
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(192,192,192,0.1)',
                    border: '1px solid rgba(192,192,192,0.3)',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-semibold mb-2"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? '#C0C0C0' : '#666666'
                }}
              >
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(192,192,192,0.1)',
                  border: '1px solid rgba(192,192,192,0.3)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </div>

            <div>
              <label 
                className="block text-sm font-semibold mb-2"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? '#C0C0C0' : '#666666'
                }}
              >
                <Phone size={16} className="inline mr-2" />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(192,192,192,0.1)',
                  border: '1px solid rgba(192,192,192,0.3)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Shield, label: 'Sécurité', desc: 'Mot de passe et authentification', route: '/settings' },
            { icon: CreditCard, label: 'Paiement', desc: 'Moyens de paiement', route: '/settings' },
            { icon: Bell, label: 'Notifications', desc: 'Préférences de notifications', route: '/settings' },
            { icon: Calendar, label: 'Réservations', desc: 'Historique et réservations', route: '/' }
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <button
                key={idx}
                onClick={() => router.push(item.route)}
                className="text-left p-6 rounded-2xl transition-all"
                style={{
                  background: isDarkMode 
                    ? 'rgba(26,26,28,0.95)' 
                    : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(192,192,192,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(192,192,192,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Icon 
                  size={32} 
                  className="mb-3"
                  style={{ color: '#C0C0C0' }}
                />
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
                    color: isDarkMode ? '#E0E0E0' : '#666666'
                  }}
                >
                  {item.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>
      </div>
    </div>
  )
}
