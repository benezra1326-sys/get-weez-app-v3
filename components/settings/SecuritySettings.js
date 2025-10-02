import { useState } from 'react'
import { Lock, Smartphone, Key, LogOut } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useTranslation } from 'react-i18next'

export default function SecuritySettings({ user }) {
  const { isDarkMode } = useTheme()
  const { t } = useTranslation()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    // TODO: Implémenter la logique 2FA réelle
  }

  const changePassword = () => {
    // TODO: Rediriger vers le formulaire de changement de mot de passe
    console.log('Change password')
  }

  const manageSessions = () => {
    // TODO: Afficher les sessions actives
    console.log('Manage sessions')
  }

  const logoutAllDevices = () => {
    if (confirm('Se déconnecter de tous les appareils ?')) {
      // TODO: Implémenter la déconnexion globale
      console.log('Logout all devices')
    }
  }

  return (
    <div 
      className="rounded-2xl p-6 border backdrop-blur-md h-full"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex items-center mb-6">
        <div 
          className="p-3 rounded-xl mr-4"
          style={{
            background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
          }}
        >
          <Lock size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {t('settings.security.title')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            {t('settings.security.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 2FA Toggle */}
        <div 
          className="p-4 rounded-xl border"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone size={20} className="text-blue-500" />
              <div>
                <div 
                  className="font-semibold text-sm"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  {t('settings.security.two_factor')}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  Sécurité renforcée avec SMS/App
                </div>
              </div>
            </div>
            <button
              onClick={toggleTwoFactor}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                twoFactorEnabled 
                  ? 'bg-blue-600' 
                  : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions de sécurité */}
        <button
          onClick={changePassword}
          className="w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
          }}
        >
          <div className="flex items-center space-x-3">
            <Key size={20} className="text-green-500" />
            <div className="text-left">
              <div 
                className="font-semibold text-sm"
                style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
              >
                {t('settings.security.change_password')}
              </div>
              <div 
                className="text-xs"
                style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              >
                Modifier votre mot de passe
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={manageSessions}
          className="w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
          }}
        >
          <div className="flex items-center space-x-3">
            <Smartphone size={20} className="text-purple-500" />
            <div className="text-left">
              <div 
                className="font-semibold text-sm"
                style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
              >
                {t('settings.security.sessions')}
              </div>
              <div 
                className="text-xs"
                style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              >
                Voir les appareils connectés
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={logoutAllDevices}
          className="w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105"
          style={{
            background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            borderColor: 'rgba(239, 68, 68, 0.3)'
          }}
        >
          <div className="flex items-center space-x-3">
            <LogOut size={20} className="text-red-500" />
            <div className="text-left">
              <div 
                className="font-semibold text-sm text-red-500"
              >
                Déconnecter tous les appareils
              </div>
              <div 
                className="text-xs"
                style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              >
                Fermer toutes les sessions actives
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
