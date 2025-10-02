import { useState } from 'react'
import { Zap, Trash2, HardDrive, Wifi } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useTranslation } from 'react-i18next'

export default function PerformanceSettings() {
  const { isDarkMode } = useTheme()
  const { t } = useTranslation()
  const [isClearing, setIsClearing] = useState(false)
  const [storageInfo, setStorageInfo] = useState({
    used: '2.3 MB',
    cache: '1.1 MB',
    images: '0.8 MB',
    data: '0.4 MB'
  })

  const clearCache = async () => {
    setIsClearing(true)
    
    // Simuler le nettoyage
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Vider le cache réel
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    }
    
    // Nettoyer localStorage partiellement
    const keysToKeep = ['getweez-language', 'getweez-theme-mode', 'getweez-preferences']
    const allKeys = Object.keys(localStorage)
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key) && key.startsWith('getweez-')) {
        localStorage.removeItem(key)
      }
    })
    
    setStorageInfo(prev => ({ ...prev, cache: '0 MB' }))
    setIsClearing(false)
  }

  const performanceActions = [
    {
      title: t('settings.performance.clear_cache'),
      description: 'Libérer de l\'espace de stockage',
      icon: <Trash2 size={20} className="text-red-500" />,
      action: clearCache,
      loading: isClearing
    },
    {
      title: t('settings.performance.manage_storage'),
      description: 'Voir l\'utilisation du stockage',
      icon: <HardDrive size={20} className="text-blue-500" />,
      action: () => console.log('Manage storage'),
      loading: false
    },
    {
      title: t('settings.performance.offline_mode'),
      description: 'Activer le mode hors ligne',
      icon: <Wifi size={20} className="text-green-500" />,
      action: () => console.log('Toggle offline mode'),
      loading: false
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
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
          }}
        >
          <Zap size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {t('settings.performance.title')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            {t('settings.performance.subtitle')}
          </p>
        </div>
      </div>

      {/* Informations de stockage */}
      <div 
        className="p-4 rounded-xl mb-6 border"
        style={{
          background: isDarkMode 
            ? 'rgba(55, 65, 81, 0.5)'
            : 'rgba(255, 255, 255, 0.8)',
          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
        }}
      >
        <h3 
          className="font-semibold text-sm mb-3"
          style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
        >
          Utilisation du stockage
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}>Total utilisé</span>
            <span style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>{storageInfo.used}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}>Cache</span>
            <span style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>{storageInfo.cache}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}>Images</span>
            <span style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>{storageInfo.images}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}>Données</span>
            <span style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>{storageInfo.data}</span>
          </div>
        </div>
      </div>

      {/* Actions de performance */}
      <div className="space-y-3">
        {performanceActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            disabled={action.loading}
            className="w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isDarkMode 
                ? 'rgba(55, 65, 81, 0.5)'
                : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
            }}
          >
            <div className="flex items-center space-x-3">
              {action.loading ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                action.icon
              )}
              <div className="text-left">
                <div 
                  className="font-semibold text-sm"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
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
      </div>
    </div>
  )
}
