import { Info, Smartphone, Code, Bug } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useTranslation } from 'react-i18next'

export default function AboutSettings() {
  const { isDarkMode } = useTheme()
  const { t } = useTranslation()

  const appInfo = {
    version: '1.2.3',
    build: '2024.10.25.001',
    platform: typeof window !== 'undefined' ? navigator.platform : 'Unknown',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Unknown'
  }

  const sendDebugReport = () => {
    const debugInfo = {
      ...appInfo,
      timestamp: new Date().toISOString(),
      localStorage: Object.keys(localStorage).filter(k => k.startsWith('getweez-')),
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language
    }
    
    console.log('Debug Report:', debugInfo)
    // TODO: Envoyer le rapport au serveur
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
            background: 'linear-gradient(135deg, #6B7280, #4B5563)',
            boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
          }}
        >
          <Info size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {t('settings.about.title')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Informations sur l'application
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Informations de version */}
        <div 
          className="p-4 rounded-xl border"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code size={16} className="text-gray-500" />
                <span 
                  className="text-sm font-medium"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  {t('settings.about.version')}
                </span>
              </div>
              <span 
                className="text-sm font-mono"
                style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
              >
                {appInfo.version}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone size={16} className="text-green-500" />
                <span 
                  className="text-sm font-medium"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  {t('settings.about.build')}
                </span>
              </div>
              <span 
                className="text-sm font-mono"
                style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
              >
                {appInfo.build}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span 
                className="text-sm font-medium"
                style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
              >
                Plateforme
              </span>
              <span 
                className="text-sm"
                style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
              >
                {appInfo.platform}
              </span>
            </div>
          </div>
        </div>

        {/* Actions de debug */}
        <button
          onClick={sendDebugReport}
          className="w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
          }}
        >
          <div className="flex items-center space-x-3">
            <Bug size={20} className="text-orange-500" />
            <div className="text-left">
              <div 
                className="font-semibold text-sm"
                style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
              >
                Envoyer un rapport de debug
              </div>
              <div 
                className="text-xs"
                style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              >
                Aide à résoudre les problèmes
              </div>
            </div>
          </div>
        </button>

        {/* Copyright */}
        <div 
          className="text-center pt-4 border-t"
          style={{ borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)' }}
        >
          <div 
            className="text-xs"
            style={{ color: isDarkMode ? '#6B7280' : '#9CA3AF' }}
          >
            © 2024 Get Weez. Tous droits réservés.
          </div>
          <div 
            className="text-xs mt-1"
            style={{ color: isDarkMode ? '#6B7280' : '#9CA3AF' }}
          >
            Votre concierge IA à Marbella
          </div>
        </div>
      </div>
    </div>
  )
}
