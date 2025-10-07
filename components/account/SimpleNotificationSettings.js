import { useState, useEffect } from 'react'
import { Bell, Mail, MessageSquare, Clock, Gift, Smartphone } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function SimpleNotificationSettings() {
  const { isDarkMode } = useTheme()
  
  const [notifications, setNotifications] = useState({
    push: {
      requests: true,
      suggestions: true,
      reminders: true,
      marketing: false
    },
    email: {
      requests: true,
      suggestions: false,
      reminders: true,
      marketing: false
    },
    sms: {
      requests: false,
      suggestions: false,
      reminders: true,
      marketing: false
    }
  })

  useEffect(() => {
    const saved = localStorage.getItem('getweez-notifications')
    if (saved) {
      setNotifications(JSON.parse(saved))
    }
  }, [])

  const updateNotification = (type, category, value) => {
    const updated = {
      ...notifications,
      [type]: {
        ...notifications[type],
        [category]: value
      }
    }
    setNotifications(updated)
    localStorage.setItem('getweez-notifications', JSON.stringify(updated))
  }

  const notificationTypes = [
    {
      key: 'push',
      title: 'Notifications Push',
      icon: <Smartphone size={20} className="text-gray-500" />,
      description: 'Notifications sur votre appareil'
    },
    {
      key: 'email',
      title: 'Notifications Email',
      icon: <Mail size={20} className="text-green-500" />,
      description: 'Notifications par email'
    },
    {
      key: 'sms',
      title: 'Notifications SMS',
      icon: <MessageSquare size={20} className="text-gray-500" />,
      description: 'Notifications par SMS'
    }
  ]

  const notificationCategories = [
    {
      key: 'requests',
      title: 'Demandes',
      icon: <Bell size={16} />,
      description: 'Réponses à vos demandes'
    },
    {
      key: 'suggestions',
      title: 'Suggestions',
      icon: <Gift size={16} />,
      description: 'Nouvelles recommandations'
    },
    {
      key: 'reminders',
      title: 'Rappels',
      icon: <Clock size={16} />,
      description: 'Rappels de réservations'
    },
    {
      key: 'marketing',
      title: 'Marketing',
      icon: <Gift size={16} />,
      description: 'Offres promotionnelles'
    }
  ]

  return (
    <div 
      className="rounded-2xl p-6 border backdrop-blur-md"
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
      {/* Header */}
      <div className="flex items-center mb-6">
        <div 
          className="p-3 rounded-xl mr-4"
          style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Bell size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Notifications
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Gérer vos notifications
          </p>
        </div>
      </div>

      {/* Types de notifications */}
      <div className="space-y-6">
        {notificationTypes.map((type) => (
          <div 
            key={type.key}
            className="p-4 rounded-xl border"
            style={{
              background: isDarkMode 
                ? 'rgba(55, 65, 81, 0.5)'
                : 'rgba(255, 255, 255, 0.8)',
              borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
            }}
          >
            <div className="flex items-center mb-4">
              {type.icon}
              <div className="ml-3">
                <h3 
                  className="font-semibold text-lg"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                >
                  {type.title}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                >
                  {type.description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {notificationCategories.map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{
                        background: isDarkMode 
                          ? 'rgba(75, 85, 99, 0.5)'
                          : 'rgba(243, 244, 246, 0.8)'
                      }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <div 
                        className="font-medium text-sm"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                      >
                        {category.title}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                      >
                        {category.description}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => updateNotification(type.key, category.key, !notifications[type.key][category.key])}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-all duration-300 ${
                      notifications[type.key][category.key]
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                    style={{
                      minWidth: '48px',
                      minHeight: '28px',
                      touchAction: 'manipulation',
                      boxShadow: notifications[type.key][category.key] 
                        ? '0 2px 8px rgba(192, 192, 192, 0.4)' 
                        : '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-md ${
                        notifications[type.key][category.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      style={{
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Résumé */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{
          background: isDarkMode 
            ? 'rgba(192, 192, 192, 0.1)'
            : 'rgba(192, 192, 192, 0.05)',
          border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.2)'}`
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Bell size={16} className="text-gray-500" />
          <span 
            className="font-semibold text-sm"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Résumé des notifications
          </span>
        </div>
        <div 
          className="text-xs space-y-1"
          style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
        >
          <div>Push: {Object.values(notifications.push).filter(Boolean).length}/4 activées</div>
          <div>Email: {Object.values(notifications.email).filter(Boolean).length}/4 activées</div>
          <div>SMS: {Object.values(notifications.sms).filter(Boolean).length}/4 activées</div>
        </div>
      </div>
    </div>
  )
}
