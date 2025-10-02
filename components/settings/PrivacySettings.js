import { useState } from 'react'
import { Shield, Trash2, RotateCcw, FileText, Eye } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useTranslation } from 'react-i18next'

export default function PrivacySettings() {
  const { isDarkMode } = useTheme()
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteHistory = async () => {
    setIsDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Supprimer l'historique des conversations
    const keys = Object.keys(localStorage).filter(key => key.startsWith('getweez-chat-'))
    keys.forEach(key => localStorage.removeItem(key))
    
    setIsDeleting(false)
  }

  const resetApp = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser l\'application ?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const privacyActions = [
    {
      title: t('settings.privacy.delete_history'),
      description: 'Supprimer toutes les conversations',
      icon: <Trash2 size={20} className="text-red-500" />,
      action: deleteHistory,
      loading: isDeleting,
      danger: true
    },
    {
      title: t('settings.privacy.reset_app'),
      description: 'Remettre à zéro toutes les données',
      icon: <RotateCcw size={20} className="text-orange-500" />,
      action: resetApp,
      loading: false,
      danger: true
    }
  ]

  const privacyLinks = [
    {
      title: t('settings.privacy.terms'),
      description: 'Consulter nos conditions',
      icon: <FileText size={20} className="text-blue-500" />,
      url: '/terms'
    },
    {
      title: t('settings.privacy.privacy_policy'),
      description: 'Notre politique de confidentialité',
      icon: <Eye size={20} className="text-green-500" />,
      url: '/privacy'
    }
  ]

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
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
          }}
        >
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {t('settings.privacy.title')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            {t('settings.privacy.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Actions dangereuses */}
        {privacyActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            disabled={action.loading}
            className="w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{
              background: action.danger 
                ? isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                : isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: action.danger 
                ? 'rgba(239, 68, 68, 0.3)'
                : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
            }}
          >
            <div className="flex items-center space-x-3">
              {action.loading ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                action.icon
              )}
              <div className="text-left">
                <div 
                  className="font-semibold text-sm"
                  style={{ color: action.danger ? '#EF4444' : isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  {action.title}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  {action.description}
                </div>
              </div>
            </div>
          </button>
        ))}

        {/* Liens légaux */}
        {privacyLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="block w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105"
            style={{
              background: isDarkMode 
                ? 'rgba(55, 65, 81, 0.5)'
                : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
            }}
          >
            <div className="flex items-center space-x-3">
              {link.icon}
              <div className="text-left">
                <div 
                  className="font-semibold text-sm"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  {link.title}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  {link.description}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
