import { useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, Shield, Volume2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Settings({ user }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [sound, setSound] = useState(true)
  const [language, setLanguage] = useState('fr')

  return (
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
            Paramètres
          </h1>
          <p 
            className="text-lg"
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: isDarkMode ? '#E0E0E0' : '#666666'
            }}
          >
            Personnalisez votre expérience Gliitz
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Theme Toggle */}
          <div 
            className="rounded-3xl p-6"
            style={{
              background: isDarkMode 
                ? 'rgba(26,26,28,0.95)' 
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(192,192,192,0.2)',
              boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isDarkMode ? (
                  <Moon size={24} style={{ color: '#C0C0C0' }} />
                ) : (
                  <Sun size={24} style={{ color: '#C0C0C0' }} />
                )}
                <div>
                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    Thème
                  </h3>
                  <p 
                    className="text-sm"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    {isDarkMode ? 'Mode Sombre' : 'Mode Clair'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-6 py-2 rounded-xl font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Changer
              </button>
            </div>
          </div>

          {/* Language */}
          <div 
            className="rounded-3xl p-6"
            style={{
              background: isDarkMode 
                ? 'rgba(26,26,28,0.95)' 
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(192,192,192,0.2)',
              boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Globe size={24} style={{ color: '#C0C0C0' }} />
                <div>
                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    Langue
                  </h3>
                  <p 
                    className="text-sm"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    Français
                  </p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 rounded-xl font-semibold"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(192,192,192,0.2)',
                  border: '1px solid rgba(192,192,192,0.3)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div 
            className="rounded-3xl p-6"
            style={{
              background: isDarkMode 
                ? 'rgba(26,26,28,0.95)' 
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(192,192,192,0.2)',
              boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell size={24} style={{ color: '#C0C0C0' }} />
                <div>
                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    Notifications
                  </h3>
                  <p 
                    className="text-sm"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    {notifications ? 'Activées' : 'Désactivées'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full transition-all relative ${
                  notifications ? 'bg-gradient-to-r from-silver-400 to-silver-500' : 'bg-gray-400'
                }`}
                style={{
                  background: notifications 
                    ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' 
                    : 'rgba(128,128,128,0.5)'
                }}
              >
                <div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all"
                  style={{
                    left: notifications ? 'calc(100% - 28px)' : '4px'
                  }}
                />
              </button>
            </div>
          </div>

          {/* Sound */}
          <div 
            className="rounded-3xl p-6"
            style={{
              background: isDarkMode 
                ? 'rgba(26,26,28,0.95)' 
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(192,192,192,0.2)',
              boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Volume2 size={24} style={{ color: '#C0C0C0' }} />
                <div>
                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    Son
                  </h3>
                  <p 
                    className="text-sm"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    {sound ? 'Activé' : 'Désactivé'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSound(!sound)}
                className={`w-14 h-8 rounded-full transition-all relative`}
                style={{
                  background: sound 
                    ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' 
                    : 'rgba(128,128,128,0.5)'
                }}
              >
                <div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all"
                  style={{
                    left: sound ? 'calc(100% - 28px)' : '4px'
                  }}
                />
              </button>
            </div>
          </div>

          {/* Security */}
          <div 
            className="rounded-3xl p-6"
            style={{
              background: isDarkMode 
                ? 'rgba(26,26,28,0.95)' 
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(192,192,192,0.2)',
              boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield size={24} style={{ color: '#C0C0C0' }} />
                <div>
                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    Sécurité et Confidentialité
                  </h3>
                  <p 
                    className="text-sm"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    Gérer mot de passe et confidentialité
                  </p>
                </div>
              </div>
              <button
                className="px-6 py-2 rounded-xl font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Gérer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
