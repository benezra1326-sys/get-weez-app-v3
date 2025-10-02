import { useState, useEffect } from 'react'
import { Shield, Mic, MapPin, Bell, Camera } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useTranslation } from 'react-i18next'

export default function PermissionsSettings() {
  const { isDarkMode } = useTheme()
  const { t } = useTranslation()
  
  const [permissions, setPermissions] = useState({
    microphone: false,
    location: true,
    notifications: true,
    camera: false
  })

  useEffect(() => {
    const saved = localStorage.getItem('getweez-permissions')
    if (saved) {
      setPermissions(JSON.parse(saved))
    }
    
    // Vérifier les permissions réelles
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    if ('permissions' in navigator) {
      try {
        const results = await Promise.all([
          navigator.permissions.query({ name: 'microphone' }),
          navigator.permissions.query({ name: 'geolocation' }),
          navigator.permissions.query({ name: 'notifications' }),
          navigator.permissions.query({ name: 'camera' })
        ])
        
        setPermissions(prev => ({
          ...prev,
          microphone: results[0].state === 'granted',
          location: results[1].state === 'granted',
          notifications: results[2].state === 'granted',
          camera: results[3].state === 'granted'
        }))
      } catch (error) {
        console.warn('Erreur lors de la vérification des permissions:', error)
      }
    }
  }

  const requestPermission = async (type) => {
    try {
      let result
      switch (type) {
        case 'microphone':
          result = await navigator.mediaDevices.getUserMedia({ audio: true })
          if (result) result.getTracks().forEach(track => track.stop())
          break
        case 'location':
          result = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          break
        case 'notifications':
          result = await Notification.requestPermission()
          break
        case 'camera':
          result = await navigator.mediaDevices.getUserMedia({ video: true })
          if (result) result.getTracks().forEach(track => track.stop())
          break
      }
      
      // Mettre à jour l'état
      setPermissions(prev => ({ ...prev, [type]: true }))
      localStorage.setItem('getweez-permissions', JSON.stringify({ ...permissions, [type]: true }))
    } catch (error) {
      console.warn(`Erreur lors de la demande de permission ${type}:`, error)
    }
  }

  const permissionItems = [
    {
      key: 'microphone',
      title: t('settings.permissions.microphone'),
      icon: <Mic size={20} className="text-red-500" />,
      description: 'Pour les commandes vocales'
    },
    {
      key: 'location',
      title: t('settings.permissions.location'),
      icon: <MapPin size={20} className="text-blue-500" />,
      description: 'Pour les recommandations locales'
    },
    {
      key: 'notifications',
      title: t('settings.permissions.notifications'),
      icon: <Bell size={20} className="text-green-500" />,
      description: 'Pour les alertes importantes'
    },
    {
      key: 'camera',
      title: t('settings.permissions.camera'),
      icon: <Camera size={20} className="text-purple-500" />,
      description: 'Pour partager des photos'
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
            background: 'linear-gradient(135deg, #10B981, #059669)',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {t('settings.permissions.title')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            {t('settings.permissions.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {permissionItems.map((item) => (
          <div 
            key={item.key}
            className="flex items-center justify-between p-4 rounded-xl border"
            style={{
              background: isDarkMode 
                ? 'rgba(55, 65, 81, 0.5)'
                : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
            }}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <div>
                <div 
                  className="font-semibold text-sm"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  {item.title}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  {item.description}
                </div>
              </div>
            </div>
            
            {permissions[item.key] ? (
              <div 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: 'white'
                }}
              >
                Autorisé
              </div>
            ) : (
              <button
                onClick={() => requestPermission(item.key)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: 'white'
                }}
              >
                Autoriser
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
