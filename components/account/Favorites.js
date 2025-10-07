import { useState } from 'react'
import { Heart, Star, MapPin, Clock, Trash2, MessageCircle, Calendar } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function Favorites({ user }) {
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('establishments')

  // Données de favoris simulées
  const favoriteEstablishments = [
    {
      id: 1,
      name: "La Sala Beach",
      type: "Restaurant",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&q=80",
      rating: 4.8,
      zone: "Puerto Banús",
      addedAt: "2024-10-15",
      lastVisited: "2024-10-20",
      category: "Méditerranéen"
    },
    {
      id: 2,
      name: "Nikki Beach Marbella",
      type: "Beach Club",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&q=80",
      rating: 4.9,
      zone: "Elviria",
      addedAt: "2024-10-12",
      lastVisited: null,
      category: "Beach Club"
    },
    {
      id: 3,
      name: "Dani García Restaurant",
      type: "Restaurant",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80",
      rating: 4.7,
      zone: "Marbella Centro",
      addedAt: "2024-10-08",
      lastVisited: "2024-10-18",
      category: "Gastronomique"
    }
  ]

  const favoriteServices = [
    {
      id: 1,
      name: "Massage Spa Luxury",
      type: "Bien-être",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&q=80",
      rating: 4.9,
      zone: "Golden Mile",
      addedAt: "2024-10-14",
      lastUsed: "2024-10-19",
      category: "Spa & Massage"
    },
    {
      id: 2,
      name: "Yacht Charter Premium",
      type: "Transport",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&q=80",
      rating: 4.8,
      zone: "Puerto Banús",
      addedAt: "2024-10-10",
      lastUsed: null,
      category: "Location Yacht"
    }
  ]

  const favoriteEvents = [
    {
      id: 1,
      name: "Soirée Jazz au Sunset",
      type: "Musique",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&q=80",
      date: "2024-11-15",
      location: "Hotel Majestic",
      addedAt: "2024-10-16",
      category: "Concert"
    },
    {
      id: 2,
      name: "Festival Gastronomique",
      type: "Gastronomie",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80",
      date: "2024-11-22",
      location: "Marbella Centro",
      addedAt: "2024-10-13",
      category: "Festival"
    }
  ]

  const tabs = [
    { id: 'establishments', label: 'Établissements', count: favoriteEstablishments.length, icon: <MapPin size={16} /> },
    { id: 'services', label: 'Services', count: favoriteServices.length, icon: <Star size={16} /> },
    { id: 'events', label: 'Événements', count: favoriteEvents.length, icon: <Calendar size={16} /> }
  ]

  const removeFavorite = (type, id) => {
    console.log(`Supprimer ${type} avec ID: ${id}`)
    // TODO: Implémenter la suppression des favoris
  }

  const contactEstablishment = (establishment) => {
    console.log(`Contacter ${establishment.name}`)
    // TODO: Rediriger vers le chat avec message pré-rempli
  }

  const renderEstablishments = () => (
    <div className="space-y-4">
      {favoriteEstablishments.map((establishment) => (
        <div 
          key={establishment.id}
          className="p-4 rounded-xl border transition-all duration-300 hover:scale-105"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex space-x-4">
            <img 
              src={establishment.image} 
              alt={establishment.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                  >
                    {establishment.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                  >
                    {establishment.category} • {establishment.zone}
                  </p>
                </div>
                <button
                  onClick={() => removeFavorite('establishment', establishment.id)}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
                  >
                    {establishment.rating}
                  </span>
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  Ajouté le {new Date(establishment.addedAt).toLocaleDateString('fr-FR')}
                </div>
                {establishment.lastVisited && (
                  <div 
                    className="text-xs"
                    style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  >
                    Dernière visite: {new Date(establishment.lastVisited).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => contactEstablishment(establishment)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(192, 192, 192, 0.3)'
                  }}
                >
                  <MessageCircle size={14} />
                  <span>Contacter</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(192, 192, 192, 0.2)'
                      : 'rgba(192, 192, 192, 0.1)',
                    color: '#C0C0C0',
                    border: '1px solid rgba(192, 192, 192, 0.3)'
                  }}
                >
                  <Calendar size={14} />
                  <span>Réserver</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderServices = () => (
    <div className="space-y-4">
      {favoriteServices.map((service) => (
        <div 
          key={service.id}
          className="p-4 rounded-xl border transition-all duration-300 hover:scale-105"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex space-x-4">
            <img 
              src={service.image} 
              alt={service.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                  >
                    {service.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                  >
                    {service.category} • {service.zone}
                  </p>
                </div>
                <button
                  onClick={() => removeFavorite('service', service.id)}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
                  >
                    {service.rating}
                  </span>
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  Ajouté le {new Date(service.addedAt).toLocaleDateString('fr-FR')}
                </div>
                {service.lastUsed && (
                  <div 
                    className="text-xs"
                    style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                  >
                    Dernière utilisation: {new Date(service.lastUsed).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <MessageCircle size={14} />
                  <span>Demander</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-4">
      {favoriteEvents.map((event) => (
        <div 
          key={event.id}
          className="p-4 rounded-xl border transition-all duration-300 hover:scale-105"
          style={{
            background: isDarkMode 
              ? 'rgba(55, 65, 81, 0.5)'
              : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex space-x-4">
            <img 
              src={event.image} 
              alt={event.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
                  >
                    {event.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                  >
                    {event.category} • {event.location}
                  </p>
                </div>
                <button
                  onClick={() => removeFavorite('event', event.id)}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    background: isDarkMode 
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-gray-500" />
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
                  >
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div 
                  className="text-xs"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                >
                  Ajouté le {new Date(event.addedAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(192, 192, 192, 0.3)'
                  }}
                >
                  <Calendar size={14} />
                  <span>Participer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'establishments':
        return renderEstablishments()
      case 'services':
        return renderServices()
      case 'events':
        return renderEvents()
      default:
        return renderEstablishments()
    }
  }

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
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
          }}
        >
          <Heart size={24} className="text-white" />
        </div>
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}
          >
            Mes Favoris
          </h2>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Gérez vos établissements, services et événements favoris
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id ? 'scale-105' : 'hover:scale-105'
            }`}
            style={{
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                : isDarkMode 
                  ? 'rgba(55, 65, 81, 0.5)'
                  : 'rgba(255, 255, 255, 0.8)',
              color: activeTab === tab.id 
                ? 'white' 
                : isDarkMode ? '#F3F4F6' : '#374151',
              border: `1px solid ${
                activeTab === tab.id 
                  ? 'rgba(192, 192, 192, 0.5)' 
                  : isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)'
              }`,
              boxShadow: activeTab === tab.id 
                ? '0 4px 15px rgba(192, 192, 192, 0.3)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span 
              className="px-2 py-1 rounded-full text-xs"
              style={{
                background: activeTab === tab.id 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.1)',
                color: activeTab === tab.id 
                  ? 'white' 
                  : '#C0C0C0'
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Empty state */}
      {((activeTab === 'establishments' && favoriteEstablishments.length === 0) ||
        (activeTab === 'services' && favoriteServices.length === 0) ||
        (activeTab === 'events' && favoriteEvents.length === 0)) && (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: isDarkMode ? '#F3F4F6' : '#374151' }}
          >
            Aucun favori pour le moment
          </h3>
          <p 
            className="text-sm"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Explorez nos {activeTab} et ajoutez vos préférés !
          </p>
        </div>
      )}
    </div>
  )
}
