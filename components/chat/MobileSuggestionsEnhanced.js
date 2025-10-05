import React, { useState } from 'react'
import { Grid3x3, LayoutGrid, RectangleVertical, Search, MapPin, Calendar, Utensils, TrendingUp, DollarSign, Star, Heart, Sparkles, Wine, Waves, Moon, Sun, Music } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useRouter } from 'next/router'
import { luxuryEstablishments, luxuryServices, luxuryEvents } from '../../data/marbella-data'

/**
 * Suggestions améliorées pour mobile avec recherche, tri et filtres
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
  const [sortBy, setSortBy] = useState('relevance') // 'relevance', 'price', 'rating', 'distance'
  const [selectedStyle, setSelectedStyle] = useState(null)

  const getGridCols = () => {
    if (columns === 1) return 'grid-cols-1'
    if (columns === 2) return 'grid-cols-2'
    return 'grid-cols-2'
  }

  // Styles/ambiances avec icônes
  const styles = [
    { key: 'romantic', label: 'Romantique', icon: <Heart size={14} />, emoji: '💕' },
    { key: 'luxury', label: 'Luxe', icon: <Sparkles size={14} />, emoji: '✨' },
    { key: 'beachside', label: 'Bord de mer', icon: <Waves size={14} />, emoji: '🌊' },
    { key: 'nightlife', label: 'Soirée', icon: <Moon size={14} />, emoji: '🌙' },
    { key: 'gastronomic', label: 'Gastronomique', icon: <Wine size={14} />, emoji: '🍷' },
    { key: 'chill', label: 'Ambiance chill', icon: <Music size={14} />, emoji: '🎵' },
  ]

  // Fonction pour obtenir l'icône de style d'un item
  const getItemStyleIcon = (item) => {
    if (item.tags?.includes('luxe') || item.tags?.includes('luxury')) return '✨'
    if (item.tags?.includes('romantic') || item.name?.toLowerCase().includes('romantique')) return '💕'
    if (item.zone?.toLowerCase().includes('beach') || item.tags?.includes('beachside')) return '🌊'
    if (item.type === 'VIP' || item.tags?.includes('nightlife')) return '🌙'
    if (item.tags?.includes('gastronomic') || item.specialties?.some(s => s.toLowerCase().includes('gastronomique'))) return '🍷'
    return null
  }

  // Sélectionner les données à afficher selon l'onglet actif
  const getData = () => {
    let data = []
    
    switch(activeTab) {
      case 'all': 
        data = [
          ...establishments.slice(0, 3).map(e => ({...e, type: 'establishment'})),
          ...services.slice(0, 2).map(s => ({...s, type: 'service'})),
          ...events.slice(0, 2).map(ev => ({...ev, type: 'event'}))
        ].slice(0, 8)
        break
      case 'establishments':
        // Afficher TOUS les établissements, sponsorisés en premier
        data = establishments
          .map(e => ({...e, type: 'establishment'}))
          .sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))
        break
      case 'services':
        // Afficher TOUS les services, sponsorisés en premier
        data = services
          .map(s => ({...s, type: 'service'}))
          .sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))
        break
      case 'events':
        // Afficher TOUS les événements, sponsorisés en premier
        data = events
          .map(ev => ({...ev, type: 'event'}))
          .sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))
        break
      case 'luxe':
        data = [
          ...luxuryEstablishments.map(e => ({...e, type: 'establishment'})),
          ...luxuryServices.map(s => ({...s, type: 'service'})),
          ...luxuryEvents.map(ev => ({...ev, type: 'event'})),
          ...establishments.filter(e => 
            e.tags?.includes('luxe') || e.price_level >= 4
          ).map(e => ({...e, type: 'establishment'}))
        ].sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))
        break
      default:
        data = establishments.slice(0, 8).map(e => ({...e, type: 'establishment'}))
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      data = data.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.zone?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtrer par style
    if (selectedStyle) {
      data = data.filter(item => {
        if (selectedStyle === 'romantic') return item.tags?.includes('romantic') || item.name?.toLowerCase().includes('romantique')
        if (selectedStyle === 'luxury') return item.tags?.includes('luxe') || item.price_level >= 4
        if (selectedStyle === 'beachside') return item.zone?.toLowerCase().includes('beach') || item.tags?.includes('beachside')
        if (selectedStyle === 'nightlife') return item.type === 'VIP' || item.tags?.includes('nightlife')
        if (selectedStyle === 'gastronomic') return item.tags?.includes('gastronomic') || item.specialties?.some(s => s.toLowerCase().includes('gastronomique'))
        return true
      })
    }

    // Trier
    if (sortBy === 'rating') {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'price') {
      data.sort((a, b) => (a.price_level || 0) - (b.price_level || 0))
    }

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

  const data = getData()

  return (
    <div className="w-full pb-6" style={{ maxWidth: '100vw', overflow: 'hidden' }}>
      {/* Barre de recherche */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            style={{
              background: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.95)',
              border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'}`,
              color: isDarkMode ? '#fff' : '#1f2937'
            }}
          />
        </div>
      </div>

      {/* Options de tri */}
      <div className="px-4 mb-3 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSortBy('relevance')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${sortBy === 'relevance' ? 'bg-purple-600 text-white' : ''}`}
          style={{
            background: sortBy === 'relevance' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: sortBy === 'relevance' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563')
          }}
        >
          <TrendingUp size={12} /> Pertinence
        </button>
        <button
          onClick={() => setSortBy('rating')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap`}
          style={{
            background: sortBy === 'rating' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: sortBy === 'rating' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563')
          }}
        >
          <Star size={12} /> Note
        </button>
        <button
          onClick={() => setSortBy('price')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap`}
          style={{
            background: sortBy === 'price' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: sortBy === 'price' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563')
          }}
        >
          <DollarSign size={12} /> Prix
        </button>
      </div>

      {/* Filtres de style avec icônes */}
      <div className="px-4 mb-3 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {styles.map(style => (
          <button
            key={style.key}
            onClick={() => setSelectedStyle(selectedStyle === style.key ? null : style.key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all`}
            style={{
              background: selectedStyle === style.key ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
              color: selectedStyle === style.key ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563')
            }}
          >
            <span>{style.emoji}</span> {style.label}
          </button>
        ))}
      </div>

      {/* Tabs pour choisir la catégorie */}
      <div className="grid grid-cols-3 gap-2 mb-4 px-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === 'all' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'all' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'all' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'all' ? '0 4px 12px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          ✨ Tous
        </button>

        <button
          onClick={() => setActiveTab('establishments')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === 'establishments' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'establishments' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'establishments' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'establishments' ? '0 4px 12px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          🏨 Établis.
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === 'services' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'services' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'services' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'services' ? '0 4px 12px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          🛍️ Services
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === 'events' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'events' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'events' ? '#fff' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'events' ? '0 4px 12px rgba(168, 85, 247, 0.5)' : 'none'
          }}
        >
          🎉 Événem.
        </button>

        <button
          onClick={() => setActiveTab('luxe')}
          className={`px-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === 'luxe' ? 'scale-105' : ''}`}
          style={{
            background: activeTab === 'luxe' ? 'linear-gradient(135deg, #facc15, #f59e0b)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            color: activeTab === 'luxe' ? '#000' : (isDarkMode ? '#d1d5db' : '#4b5563'),
            boxShadow: activeTab === 'luxe' ? '0 4px 12px rgba(250, 204, 21, 0.5)' : 'none'
          }}
        >
          👑 Luxe
        </button>
      </div>

      {/* Toggle colonnes */}
      <div className="flex justify-end gap-2 mb-3 px-4">
        <button
          onClick={() => setColumns(1)}
          className={`p-2 rounded-lg transition-all duration-300 ${columns === 1 ? 'scale-105' : ''}`}
          style={{
            background: columns === 1 ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            boxShadow: columns === 1 ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none'
          }}
        >
          <RectangleVertical size={16} className={columns === 1 ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
        </button>
        <button
          onClick={() => setColumns(2)}
          className={`p-2 rounded-lg transition-all duration-300 ${columns === 2 ? 'scale-105' : ''}`}
          style={{
            background: columns === 2 ? 'linear-gradient(135deg, #a855f7, #6366f1)' : (isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'),
            boxShadow: columns === 2 ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none'
          }}
        >
          <LayoutGrid size={16} className={columns === 2 ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
        </button>
      </div>

      {/* Grille de bannières améliorée */}
      <div className={`grid ${getGridCols()} gap-3 px-4`}>
        {data.map((item) => {
          const styleIcon = getItemStyleIcon(item)
          return (
            <button
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="uniform-banner group relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                height: columns === 1 ? '220px' : '200px',
                cursor: 'pointer',
                borderRadius: '16px'
              }}
            >
              {/* Image de fond */}
              <img 
                src={item.image_url || `https://images.unsplash.com/photo-1414235077-531286732f1a?w=600&h=400&fit=crop&q=80`}
                alt={item.name}
                className="banner-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
              
              {/* Overlay */}
              <div className="banner-overlay" style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%)'
              }} />
              
              {/* Contenu */}
              <div className="banner-content" style={{
                position: 'absolute',
                inset: 0,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: 10
              }}>
                {/* Header avec badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {/* Icône de style */}
                  {styleIcon && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      {styleIcon}
                    </div>
                  )}
                  
                  {/* Badge VIP */}
                  {item.sponsored && (
                    <div style={{
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: '#000',
                      boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)'
                    }}>
                      ⭐ VIP
                    </div>
                  )}
                </div>
                
                {/* Contenu principal */}
                <div>
                  <h3 style={{ 
                    fontSize: columns === 1 ? '16px' : '14px',
                    fontWeight: '700',
                    color: '#fff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    marginBottom: '4px',
                    lineHeight: '1.2'
                  }}>
                    {item.name}
                  </h3>
                  
                  {/* Description visible */}
                  {item.description && (
                    <p style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                      marginBottom: '6px',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: columns === 1 ? 2 : 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.description}
                    </p>
                  )}
                  
                  {/* Note et prix */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {item.rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={12} className="text-yellow-400" fill="currentColor" />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{item.rating}</span>
                      </div>
                    )}
                    {item.price_level && (
                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#10b981' }}>
                        {'€'.repeat(item.price_level)}
                      </span>
                    )}
                  </div>
                  
                  {/* Localisation */}
                  {item.zone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
                      <MapPin size={10} className="text-white" />
                      <span style={{ fontSize: '10px', color: '#fff' }}>{item.zone}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Message si aucun résultat */}
      {data.length === 0 && (
        <div className="text-center py-12 px-4">
          <p className="text-gray-500 text-sm">Aucun résultat trouvé</p>
        </div>
      )}
    </div>
  )
}
