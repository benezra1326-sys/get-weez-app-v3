import { useState, useEffect } from 'react'
import { Settings, DollarSign, Clock, Utensils, Activity } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useTranslation } from 'react-i18next'

export default function UserPreferences() {
  const { isDarkMode } = useTheme()
  const { t } = useTranslation()
  
  const [preferences, setPreferences] = useState({
    priorityServices: ['restaurant', 'transport'],
    budget: 'medium',
    schedule: 'evening',
    cuisineTypes: ['mediterranean', 'international'],
    activityLevel: 'moderate'
  })

  useEffect(() => {
    const saved = localStorage.getItem('getweez-preferences')
    if (saved) {
      setPreferences(JSON.parse(saved))
    }
  }, [])

  const updatePreferences = (key, value) => {
    const updated = { ...preferences, [key]: value }
    setPreferences(updated)
    localStorage.setItem('getweez-preferences', JSON.stringify(updated))
  }

  const toggleArrayItem = (key, item) => {
    const current = preferences[key]
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    updatePreferences(key, updated)
  }

  const serviceTypes = [
    { key: 'restaurant', label: 'Restaurants', icon: '🍽️' },
    { key: 'transport', label: 'Transport', icon: '🚗' },
    { key: 'wellness', label: 'Bien-être', icon: '💆' },
    { key: 'entertainment', label: 'Divertissement', icon: '🎭' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️' },
    { key: 'culture', label: 'Culture', icon: '🎨' }
  ]

  const budgetOptions = [
    { key: 'low', label: 'Économique', range: '< 50€', color: '#10B981' },
    { key: 'medium', label: 'Modéré', range: '50-150€', color: '#F59E0B' },
    { key: 'high', label: 'Premium', range: '150-300€', color: '#8B5CF6' },
    { key: 'luxury', label: 'Luxe', range: '> 300€', color: '#EF4444' }
  ]

  const scheduleOptions = [
    { key: 'morning', label: 'Matinal', time: '6h-12h', icon: '🌅' },
    { key: 'afternoon', label: 'Après-midi', time: '12h-18h', icon: '☀️' },
    { key: 'evening', label: 'Soirée', time: '18h-24h', icon: '🌆' },
    { key: 'night', label: 'Nuit', time: '24h-6h', icon: '🌙' }
  ]

  const cuisineOptions = [
    { key: 'mediterranean', label: 'Méditerranéenne', flag: '🇪🇸' },
    { key: 'international', label: 'Internationale', flag: '🌍' },
    { key: 'asian', label: 'Asiatique', flag: '🇯🇵' },
    { key: 'italian', label: 'Italienne', flag: '🇮🇹' },
    { key: 'french', label: 'Française', flag: '🇫🇷' },
    { key: 'seafood', label: 'Fruits de mer', flag: '🦐' }
  ]

  const activityOptions = [
    { key: 'low', label: 'Tranquille', description: 'Activités relaxantes', icon: '😌' },
    { key: 'moderate', label: 'Modéré', description: 'Équilibre détente/activité', icon: '😊' },
    { key: 'high', label: 'Actif', description: 'Beaucoup d\'activités', icon: '🤩' },
    { key: 'extreme', label: 'Intense', description: 'Non-stop aventure', icon: '🚀' }
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
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}
        >
          <Settings size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            {t('account.preferences.title')}
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            {t('account.preferences.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Services prioritaires */}
        <div>
          <h3 
            className="text-lg font-semibold mb-3 flex items-center"
            style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
          >
            <Activity size={18} className="mr-2 text-blue-500" />
            {t('account.preferences.priority_services')}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {serviceTypes.map((service) => (
              <button
                key={service.key}
                onClick={() => toggleArrayItem('priorityServices', service.key)}
                className={`p-3 rounded-xl border transition-all duration-200 hover:scale-105 ${
                  preferences.priorityServices.includes(service.key) ? 'scale-105' : ''
                }`}
                style={{
                  background: preferences.priorityServices.includes(service.key)
                    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                    : isDarkMode 
                      ? 'rgba(55, 65, 81, 0.5)'
                      : 'rgba(255, 255, 255, 0.8)',
                  borderColor: preferences.priorityServices.includes(service.key)
                    ? 'rgba(139, 92, 246, 0.5)'
                    : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
                  color: preferences.priorityServices.includes(service.key)
                    ? 'white'
                    : isDarkMode ? '#FFFFFF' : '#1F2937',
                  boxShadow: preferences.priorityServices.includes(service.key)
                    ? '0 4px 15px rgba(139, 92, 246, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="text-lg mb-1">{service.icon}</div>
                <div className="text-sm font-medium">{service.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Budget préféré */}
        <div>
          <h3 
            className="text-lg font-semibold mb-3 flex items-center"
            style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
          >
            <DollarSign size={18} className="mr-2 text-green-500" />
            {t('account.preferences.budget')}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {budgetOptions.map((budget) => (
              <button
                key={budget.key}
                onClick={() => updatePreferences('budget', budget.key)}
                className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
                  preferences.budget === budget.key ? 'scale-105' : ''
                }`}
                style={{
                  background: preferences.budget === budget.key
                    ? `linear-gradient(135deg, ${budget.color}, ${budget.color}dd)`
                    : isDarkMode 
                      ? 'rgba(55, 65, 81, 0.5)'
                      : 'rgba(255, 255, 255, 0.8)',
                  borderColor: preferences.budget === budget.key
                    ? `${budget.color}80`
                    : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
                  color: preferences.budget === budget.key
                    ? 'white'
                    : isDarkMode ? '#FFFFFF' : '#1F2937',
                  boxShadow: preferences.budget === budget.key
                    ? `0 4px 15px ${budget.color}40`
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="font-semibold text-sm mb-1">{budget.label}</div>
                <div className="text-xs opacity-90">{budget.range}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Horaires préférés */}
        <div>
          <h3 
            className="text-lg font-semibold mb-3 flex items-center"
            style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
          >
            <Clock size={18} className="mr-2 text-orange-500" />
            {t('account.preferences.schedule')}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {scheduleOptions.map((schedule) => (
              <button
                key={schedule.key}
                onClick={() => updatePreferences('schedule', schedule.key)}
                className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
                  preferences.schedule === schedule.key ? 'scale-105' : ''
                }`}
                style={{
                  background: preferences.schedule === schedule.key
                    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                    : isDarkMode 
                      ? 'rgba(55, 65, 81, 0.5)'
                      : 'rgba(255, 255, 255, 0.8)',
                  borderColor: preferences.schedule === schedule.key
                    ? 'rgba(245, 158, 11, 0.5)'
                    : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
                  color: preferences.schedule === schedule.key
                    ? 'white'
                    : isDarkMode ? '#FFFFFF' : '#1F2937',
                  boxShadow: preferences.schedule === schedule.key
                    ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="text-lg mb-1">{schedule.icon}</div>
                <div className="font-semibold text-sm mb-1">{schedule.label}</div>
                <div className="text-xs opacity-90">{schedule.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Types de cuisine */}
        <div>
          <h3 
            className="text-lg font-semibold mb-3 flex items-center"
            style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
          >
            <Utensils size={18} className="mr-2 text-red-500" />
            {t('account.preferences.cuisine_types')}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {cuisineOptions.map((cuisine) => (
              <button
                key={cuisine.key}
                onClick={() => toggleArrayItem('cuisineTypes', cuisine.key)}
                className={`p-3 rounded-xl border transition-all duration-200 hover:scale-105 ${
                  preferences.cuisineTypes.includes(cuisine.key) ? 'scale-105' : ''
                }`}
                style={{
                  background: preferences.cuisineTypes.includes(cuisine.key)
                    ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                    : isDarkMode 
                      ? 'rgba(55, 65, 81, 0.5)'
                      : 'rgba(255, 255, 255, 0.8)',
                  borderColor: preferences.cuisineTypes.includes(cuisine.key)
                    ? 'rgba(239, 68, 68, 0.5)'
                    : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
                  color: preferences.cuisineTypes.includes(cuisine.key)
                    ? 'white'
                    : isDarkMode ? '#FFFFFF' : '#1F2937',
                  boxShadow: preferences.cuisineTypes.includes(cuisine.key)
                    ? '0 4px 15px rgba(239, 68, 68, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="text-lg mb-1">{cuisine.flag}</div>
                <div className="text-sm font-medium">{cuisine.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Niveau d'activité */}
        <div>
          <h3 
            className="text-lg font-semibold mb-3 flex items-center"
            style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
          >
            <Activity size={18} className="mr-2 text-purple-500" />
            {t('account.preferences.activity_level')}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {activityOptions.map((activity) => (
              <button
                key={activity.key}
                onClick={() => updatePreferences('activityLevel', activity.key)}
                className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
                  preferences.activityLevel === activity.key ? 'scale-105' : ''
                }`}
                style={{
                  background: preferences.activityLevel === activity.key
                    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                    : isDarkMode 
                      ? 'rgba(55, 65, 81, 0.5)'
                      : 'rgba(255, 255, 255, 0.8)',
                  borderColor: preferences.activityLevel === activity.key
                    ? 'rgba(139, 92, 246, 0.5)'
                    : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
                  color: preferences.activityLevel === activity.key
                    ? 'white'
                    : isDarkMode ? '#FFFFFF' : '#1F2937',
                  boxShadow: preferences.activityLevel === activity.key
                    ? '0 4px 15px rgba(139, 92, 246, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="text-lg mb-1">{activity.icon}</div>
                <div className="font-semibold text-sm mb-1">{activity.label}</div>
                <div className="text-xs opacity-90">{activity.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
