import React, { useState, useEffect } from 'react'
import { 
  Heart, 
  X, 
  AlertTriangle, 
  Utensils, 
  Star, 
  MapPin, 
  Clock, 
  Users,
  Save,
  Trash2,
  Plus,
  Check
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const PreferencesManager = ({ user, onSave }) => {
  const { isDarkMode } = useTheme()
  const [preferences, setPreferences] = useState({
    // Goûts et préférences
    tastes: {
      cuisine: [],
      ambiance: [],
      activities: [],
      music: [],
      atmosphere: []
    },
    // Interdictions
    restrictions: {
      food: [],
      activities: [],
      environments: [],
      services: []
    },
    // Peurs et phobies
    fears: [],
    // Préférences alimentaires
    dietary: {
      allergies: [],
      intolerances: [],
      preferences: [],
      restrictions: []
    },
    // Préférences de service
    service: {
      communication: 'french', // french, english, spanish
      contact_preference: 'chat', // chat, email, phone
      response_time: 'normal', // immediate, fast, normal, flexible
      budget_range: 'medium', // low, medium, high, premium
      group_size: 'couple', // solo, couple, small_group, large_group
      time_preference: 'evening' // morning, afternoon, evening, flexible
    }
  })

  const [activeTab, setActiveTab] = useState('tastes')
  const [isEditing, setIsEditing] = useState(false)

  // Options disponibles
  const availableOptions = {
    cuisine: [
      'Française', 'Italienne', 'Japonaise', 'Méditerranéenne', 'Asiatique', 
      'Mexicaine', 'Indienne', 'Fusion', 'Gastronomique', 'Street Food'
    ],
    ambiance: [
      'Intimiste', 'Romantique', 'Famille', 'Business', 'Décontracté',
      'Luxe', 'Traditionnel', 'Moderne', 'Vintage', 'Cosy'
    ],
    activities: [
      'Plage', 'Sport', 'Culture', 'Shopping', 'Gastronomie',
      'Nuit', 'Famille', 'Romantique', 'Business', 'Aventure'
    ],
    music: [
      'Jazz', 'Classique', 'Électronique', 'Pop', 'Rock',
      'Ambient', 'Live Music', 'Silence', 'World Music', 'House'
    ],
    atmosphere: [
      'Calme', 'Animé', 'Exclusif', 'Populaire', 'Privé',
      'Vue sur mer', 'Centre-ville', 'Nature', 'Historique', 'Design'
    ],
    food_restrictions: [
      'Végétarien', 'Végan', 'Sans gluten', 'Halal', 'Casher',
      'Sans lactose', 'Paleo', 'Keto', 'Régime méditerranéen'
    ],
    allergies: [
      'Arachides', 'Fruits à coque', 'Gluten', 'Lactose', 'Œufs',
      'Poisson', 'Crustacés', 'Soja', 'Sésame', 'Sulfites'
    ],
    fears: [
      'Hauteurs', 'Foule', 'Eau profonde', 'Animaux', 'Obscurité',
      'Espaces clos', 'Vol', 'Sécurité', 'Isolation', 'Nouveauté'
    ],
    environments: [
      'Foule', 'Bruit', 'Espaces clos', 'Hauteur', 'Eau',
      'Animaux', 'Obscurité', 'Isolation', 'Nouveauté'
    ]
  }

  useEffect(() => {
    // Charger les préférences depuis Supabase ou localStorage
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      // TODO: Charger depuis Supabase
      const saved = localStorage.getItem(`preferences_${user?.id}`)
      if (saved) {
        setPreferences(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error)
    }
  }

  const savePreferences = async () => {
    try {
      // TODO: Sauvegarder dans Supabase
      localStorage.setItem(`preferences_${user?.id}`, JSON.stringify(preferences))
      setIsEditing(false)
      if (onSave) onSave(preferences)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const addItem = (category, item) => {
    setPreferences(prev => ({
      ...prev,
      [category]: [...prev[category], item]
    }))
    setIsEditing(true)
  }

  const removeItem = (category, index) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }))
    setIsEditing(true)
  }

  const updateServicePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      service: {
        ...prev.service,
        [key]: value
      }
    }))
    setIsEditing(true)
  }

  const tabs = [
    { id: 'tastes', label: 'Goûts & Préférences', icon: Heart },
    { id: 'restrictions', label: 'Interdictions', icon: X },
    { id: 'fears', label: 'Peurs & Phobies', icon: AlertTriangle },
    { id: 'dietary', label: 'Alimentation', icon: Utensils },
    { id: 'service', label: 'Service', icon: Star }
  ]

  const renderTasteSection = () => (
    <div className="space-y-6">
      {Object.entries(preferences.tastes).map(([key, items]) => (
        <div key={key}>
          <h3 className="text-lg font-semibold mb-3 capitalize" style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
            {key.replace('_', ' ')}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {items.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                style={{
                  background: isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(0, 0, 0, 0.08)',
                  color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
                  border: isDarkMode ? '1px solid rgba(192, 192, 192, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                {item}
                <button
                  onClick={() => removeItem(`tastes.${key}`, index)}
                  className="hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addItem(`tastes.${key}`, e.target.value)
                e.target.value = ''
              }
            }}
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            <option value="">Ajouter une préférence...</option>
            {availableOptions[key]?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )

  const renderRestrictionsSection = () => (
    <div className="space-y-6">
      {Object.entries(preferences.restrictions).map(([key, items]) => (
        <div key={key}>
          <h3 className="text-lg font-semibold mb-3 capitalize" style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
            {key.replace('_', ' ')}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {items.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                style={{
                  background: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                {item}
                <button
                  onClick={() => removeItem(`restrictions.${key}`, index)}
                  className="hover:bg-red-600 hover:text-white rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addItem(`restrictions.${key}`, e.target.value)
                e.target.value = ''
              }
            }}
            className="px-3 py-2 rounded-lg text-sm"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            <option value="">Ajouter une interdiction...</option>
            {availableOptions[`${key}_restrictions`]?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )

  const renderServiceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3" style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
          Langue de communication
        </h3>
        <select
          value={preferences.service.communication}
          onChange={(e) => updateServicePreference('communication', e.target.value)}
          className="px-3 py-2 rounded-lg"
          style={{
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          <option value="french">Français</option>
          <option value="english">English</option>
          <option value="spanish">Español</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3" style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
          Préférence de contact
        </h3>
        <select
          value={preferences.service.contact_preference}
          onChange={(e) => updateServicePreference('contact_preference', e.target.value)}
          className="px-3 py-2 rounded-lg"
          style={{
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          <option value="chat">Chat</option>
          <option value="email">Email</option>
          <option value="phone">Téléphone</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3" style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
          Budget préféré
        </h3>
        <select
          value={preferences.service.budget_range}
          onChange={(e) => updateServicePreference('budget_range', e.target.value)}
          className="px-3 py-2 rounded-lg"
          style={{
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          <option value="low">Économique</option>
          <option value="medium">Standard</option>
          <option value="high">Premium</option>
          <option value="luxury">Luxe</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          Configuration des Préférences
        </h2>
        <p 
          className="text-lg"
          style={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Personnalisez votre expérience Gliitz selon vos goûts et besoins
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
                activeTab === tab.id ? 'border-b-2' : ''
              }`}
              style={{
                color: activeTab === tab.id 
                  ? (isDarkMode ? '#C0C0C0' : '#0B0B0C')
                  : (isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'),
                borderBottomColor: activeTab === tab.id 
                  ? (isDarkMode ? '#C0C0C0' : '#0B0B0C') 
                  : 'transparent',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: activeTab === tab.id ? 600 : 500
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div 
        className="p-6 rounded-2xl"
        style={{
          background: isDarkMode 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(255, 255, 255, 0.6)',
          border: isDarkMode 
            ? '1px solid rgba(192, 192, 192, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(14px)',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        {activeTab === 'tastes' && renderTasteSection()}
        {activeTab === 'restrictions' && renderRestrictionsSection()}
        {activeTab === 'fears' && (
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
              Peurs et Phobies
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {preferences.fears.map((fear, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  style={{
                    background: isDarkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.1)',
                    color: '#F97316',
                    border: '1px solid rgba(251, 146, 60, 0.3)'
                  }}
                >
                  {fear}
                  <button
                    onClick={() => removeItem('fears', index)}
                    className="hover:bg-orange-600 hover:text-white rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addItem('fears', e.target.value)
                  e.target.value = ''
                }
              }}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
              }}
            >
              <option value="">Ajouter une peur ou phobie...</option>
              {availableOptions.fears.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
        {activeTab === 'dietary' && (
          <div className="space-y-6">
            {Object.entries(preferences.dietary).map(([key, items]) => (
              <div key={key}>
                <h3 className="text-lg font-semibold mb-3 capitalize" style={{ color: isDarkMode ? '#FFFFFF' : '#0B0B0C' }}>
                  {key.replace('_', ' ')}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {items.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      style={{
                        background: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                        color: '#22C55E',
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                      }}
                    >
                      {item}
                      <button
                        onClick={() => removeItem(`dietary.${key}`, index)}
                        className="hover:bg-green-600 hover:text-white rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addItem(`dietary.${key}`, e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  <option value="">Ajouter...</option>
                  {availableOptions[key]?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'service' && renderServiceSection()}
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-lg transition-all"
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Annuler
          </button>
          <button
            onClick={savePreferences}
            className="px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
            style={{
              background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(192, 192, 192, 0.3)'
            }}
          >
            <Save size={16} />
            Sauvegarder
          </button>
        </div>
      )}
    </div>
  )
}

export default PreferencesManager
