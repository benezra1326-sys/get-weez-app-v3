import React, { useState } from 'react'
import { LayoutGrid, RectangleVertical, Search, MapPin, Star, DollarSign, ChevronDown, SlidersHorizontal, Calendar } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useRouter } from 'next/router'
import { luxuryEstablishments, luxuryServices, luxuryEvents } from '../../data/marbella-data'

/**
 * Suggestions améliorées pour mobile - Version finale optimisée
 */
export default function MobileSuggestionsEnhanced({ 
  establishments = [], 
  services = [], 
  events = [],
  onSuggestionClick 
}) {
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const [columns, setColumns] = useState(2)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showStyleMenu, setShowStyleMenu] = useState(false)

  // Styles/ambiances
  const styles = [
    { key: 'romantic', label: 'Romantique', emoji: '💕' },
    { key: 'luxury', label: 'Luxe', emoji: '✨' },
    { key: 'beachside', label: 'Bord de mer', emoji: '🌊' },
    { key: 'nightlife', label: 'Soirée', emoji: '🌙' },
    { key: 'gastronomic', label: 'Gastronomique', emoji: '🍷' },
    { key: 'chill', label: 'Ambiance chill', emoji: '🎵' },
  ]

  const sortOptions = [
    { key: 'relevance', label: 'Pertinence', icon: '🎯' },
    { key: 'rating', label: 'Note', icon: '⭐' },
    { key: 'price_asc', label: 'Prix croissant', icon: '💰' },
    { key: 'price_desc', label: 'Prix décroissant', icon: '💎' },
  ]

  // Fonction pour obtenir le badge d'un item
  const getItemBadge = (item) => {
    if (item.sponsored) return { text: 'VIP', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }
    if (item.tags?.includes('luxe')) return { text: 'LUXE', color: 'linear-gradient(135deg, #a855f7, #6366f1)' }
    if (item.price_level >= 4) return { text: 'PREMIUM', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }
    return null
  }

  const getData = () => {
    let data = []
    
    switch(activeTab) {
      case 'all': 
        data = [
          ...establishments.slice(0, 3).map(e => ({...e, type: 'establishment'})),
          ...services.slice(0, 2).map(s => ({...s, type: 'service'})),
          ...events.slice(0, 2).map(ev => ({...ev, type: 'event'}))
        ]
        break
      case 'establishments':
        data = establishments.map(e => ({...e, type: 'establishment'}))
        break
      case 'services':
        data = services.map(s => ({...s, type: 'service'}))
        break
      case 'events':
        data = events.map(ev => ({...ev, type: 'event'}))
        break
      case 'luxe':
        data = [
          ...luxuryEstablishments.map(e => ({...e, type: 'establishment'})),
          ...luxuryServices.map(s => ({...s, type: 'service'})),
          ...luxuryEvents.map(ev => ({...ev, type: 'event'})),
          ...establishments.filter(e => e.tags?.includes('luxe') || e.price_level >= 4).map(e => ({...e, type: 'establishment'}))
        ]
        break
      default:
        data = establishments.map(e => ({...e, type: 'establishment'}))
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      data = data.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.zone?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      )
    }

    // Filtrer par style
    if (selectedStyle) {
      data = data.filter(item => {
        if (selectedStyle === 'romantic') return item.tags?.includes('romantic') || item.name?.toLowerCase().includes('romantique')
        if (selectedStyle === 'luxury') return item.tags?.includes('luxe') || item.price_level >= 4
        if (selectedStyle === 'beachside') return item.zone?.toLowerCase().includes('beach') || item.tags?.includes('beachside')
        if (selectedStyle === 'nightlife') return item.type === 'VIP' || item.tags?.includes('nightlife')
        if (selectedStyle === 'gastronomic') return item.tags?.includes('gastronomic')
        return true
      })
    }

    // Trier
    if (sortBy === 'rating') {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'price_asc') {
      data.sort((a, b) => (a.price_level || 0) - (b.price_level || 0))
    } else if (sortBy === 'price_desc') {
      data.sort((a, b) => (b.price_level || 0) - (a.price_level || 0))
    }

    // Sponsorisés en premier
    data.sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))

    return data
  }

  const handleCardClick = (item) => {
    const path = item.type === 'establishment'
      ? `/establishment/${item.id}`
      : item.type === 'service'
        ? `/service/${item.id}`
        : `/event/${item.id}`
    router.push(path)
  }

  const handleReserve = (e, item) => {
    e.stopPropagation()
    const message = `Je souhaite réserver ${item.name}`
    router.push({
      pathname: '/',
      query: { message }
    })
  }

  const data = getData()

  return (
    <div className="w-full pb-6" style={{ maxWidth: '100vw', overflow: 'hidden' }}>
      {/* Barre de recherche TRÈS visible */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500" size={20} />
          <input
            type="text"
            placeholder="Rechercher établissements, événements, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm font-medium shadow-lg"
            style={{
              background: isDarkMode ? 'rgba(55, 65, 81, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              border: `2px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
              color: isDarkMode ? '#fff' : '#1f2937',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)'
            }}
          />
        </div>
      </div>

      {/* Options de tri et style - Dropdowns */}
      <div className="px-4 mb-3 flex gap-2">
        {/* Dropdown Tri */}
        <div className="relative flex-1">
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu)
              setShowStyleMenu(false)
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold"
            style={{
              background: isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(243, 244, 246, 0.9)',
              border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
              color: isDarkMode ? '#d1d5db' : '#4b5563'
            }}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} />
              <span>{sortOptions.find(o => o.key === sortBy)?.label || 'Trier'}</span>
            </div>
            <ChevronDown size={14} className={showSortMenu ? 'rotate-180' : ''} />
          </button>
          
          {showSortMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{
                background: isDarkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
                backdropFilter: 'blur(20px)'
              }}
            >
              {sortOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => {
                    setSortBy(option.key)
                    setShowSortMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors"
                  style={{
                    background: sortBy === option.key ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: isDarkMode ? '#fff' : '#1f2937'
                  }}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown Style */}
        <div className="relative flex-1">
          <button
            onClick={() => {
              setShowStyleMenu(!showStyleMenu)
              setShowSortMenu(false)
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold"
            style={{
              background: selectedStyle ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.6)' : 'rgba(243, 244, 246, 0.9)'),
              border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
              color: selectedStyle ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563')
            }}
          >
            <div className="flex items-center gap-2">
              <span>{selectedStyle ? styles.find(s => s.key === selectedStyle)?.emoji : '🎨'}</span>
              <span>{selectedStyle ? styles.find(s => s.key === selectedStyle)?.label : 'Style'}</span>
            </div>
            <ChevronDown size={14} className={showStyleMenu ? 'rotate-180' : ''} />
          </button>
          
          {showStyleMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{
                background: isDarkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
                backdropFilter: 'blur(20px)'
              }}
            >
              <button
                onClick={() => {
                  setSelectedStyle(null)
                  setShowStyleMenu(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium"
                style={{
                  background: !selectedStyle ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  color: isDarkMode ? '#fff' : '#1f2937'
                }}
              >
                <span>✨</span>
                <span>Tous les styles</span>
              </button>
              {styles.map(style => (
                <button
                  key={style.key}
                  onClick={() => {
                    setSelectedStyle(style.key)
                    setShowStyleMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors"
                  style={{
                    background: selectedStyle === style.key ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: isDarkMode ? '#fff' : '#1f2937'
                  }}
                >
                  <span>{style.emoji}</span>
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs pour les catégories - Simplifiés */}
      <div className="grid grid-cols-5 gap-2 mb-4 px-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'all' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'all' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'all' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'all' ? '0 4px 12px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          ✨
        </button>

        <button
          onClick={() => setActiveTab('establishments')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'establishments' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'establishments' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'establishments' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'establishments' ? '0 4px 12px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          🏨
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'services' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'services' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'services' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'services' ? '0 4px 12px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          🛍️
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'events' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'events' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'events' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'events' ? '0 4px 12px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          🎉
        </button>

        <button
          onClick={() => setActiveTab('luxe')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'luxe' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'luxe' ? 'linear-gradient(135deg, #facc15, #f59e0b)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'luxe' ? '#000' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'luxe' ? '0 4px 12px rgba(250, 204, 21, 0.5)' : 'none'
          }}
        >
          👑
        </button>
      </div>

      {/* Toggle colonnes - CENTRÉ */}
      <div className="flex justify-center gap-2 mb-4 px-4">
        <button
          onClick={() => setColumns(1)}
          className={`p-2.5 rounded-xl transition-all ${columns === 1 ? 'scale-110' : ''}`}
          style={{
            background: columns === 1 ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            boxShadow: columns === 1 ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none'
          }}
        >
          <RectangleVertical size={18} className={columns === 1 ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
        </button>
        <button
          onClick={() => setColumns(2)}
          className={`p-2.5 rounded-xl transition-all ${columns === 2 ? 'scale-110' : ''}`}
          style={{
            background: columns === 2 ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            boxShadow: columns === 2 ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none'
          }}
        >
          <LayoutGrid size={18} className={columns === 2 ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
        </button>
      </div>

      {/* Grille de bannières - CONTENU RÉORGANISÉ */}
      <div className={`grid ${columns === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3 px-4`}>
        {data.map((item) => {
          const badge = getItemBadge(item)
          return (
            <button
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 rounded-2xl"
              style={{
                height: columns === 1 ? '280px' : '260px',
                background: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              {/* Image en haut */}
              <div className="relative w-full h-32 overflow-hidden">
                <img 
                  src={item.image_url || `https://images.unsplash.com/photo-1414235077-531286732f1a?w=600&h=400&fit=crop&q=80`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                
                {/* Badge en haut à droite */}
                {badge && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
                    style={{
                      background: badge.color,
                      color: badge.text === 'VIP' ? '#000' : '#fff'
                    }}
                  >
                    {badge.text}
                  </div>
                )}
              </div>

              {/* Contenu en bas */}
              <div className="p-3 flex flex-col justify-between" style={{ height: 'calc(100% - 128px)' }}>
                {/* Titre */}
                <h3 className="font-bold text-left mb-1" style={{
                  fontSize: columns === 1 ? '16px' : '14px',
                  color: isDarkMode ? '#fff' : '#1f2937',
                  lineHeight: '1.2'
                }}>
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-left text-xs mb-2" style={{
                  color: isDarkMode ? '#d1d5db' : '#6b7280',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.4'
                }}>
                  {item.description}
                </p>

                {/* Quartier */}
                {item.zone && (
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin size={12} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                    <span className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                      {item.zone}
                    </span>
                  </div>
                )}

                {/* Note et Prix */}
                <div className="flex items-center justify-between mb-2">
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400" fill="currentColor" />
                      <span className="text-sm font-bold" style={{ color: isDarkMode ? '#fff' : '#1f2937' }}>
                        {item.rating}
                      </span>
                    </div>
                  )}
                  {item.price_level && (
                    <span className="text-sm font-bold text-green-500">
                      {'€'.repeat(item.price_level)}
                    </span>
                  )}
                </div>

                {/* Bouton Réserver */}
                <button
                  onClick={(e) => handleReserve(e, item)}
                  className="w-full py-2 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  📅 Réserver
                </button>
              </div>
            </button>
          )
        })}
      </div>

      {/* Message si aucun résultat */}
      {data.length === 0 && (
        <div className="text-center py-12 px-4">
          <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm">
            Aucun résultat trouvé
          </p>
        </div>
      )}
    </div>
  )
}
