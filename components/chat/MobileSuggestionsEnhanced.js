import React, { useState } from 'react'
import { LayoutGrid, RectangleVertical, Search, MapPin, Star, DollarSign, ChevronDown, SlidersHorizontal, Calendar } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'
import { useRouter } from 'next/router'
import { establishments as allEstablishments, events as allEvents } from '../../data/marbella-data'
import { services as allServices } from '../../data/services-data'

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
  const [displayLimit, setDisplayLimit] = useState(10) // Afficher 10 items (5 lignes en 2 colonnes) par défaut
  const [isShowingAll, setIsShowingAll] = useState(false)

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
    { key: 'distance', label: 'Proximité', icon: '📍' },
    { key: 'rating', label: 'Note', icon: '⭐' },
    { key: 'price_asc', label: 'Prix croissant', icon: '💰' },
    { key: 'price_desc', label: 'Prix décroissant', icon: '💎' },
  ]
  
  // État de géolocalisation
  const [userLocation, setUserLocation] = React.useState(null)
  const [locationPermission, setLocationPermission] = React.useState('pending')
  
  // Demander la géolocalisation au montage
  React.useEffect(() => {
    if (sortBy === 'distance' && !userLocation) {
      requestUserLocation()
    }
  }, [sortBy])

  // Réinitialiser l'affichage quand on change de filtre
  React.useEffect(() => {
    setIsShowingAll(false)
  }, [activeTab, searchQuery, selectedStyle, sortBy])
  
  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setLocationPermission('granted')
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error)
          setLocationPermission('denied')
        }
      )
    } else {
      setLocationPermission('unsupported')
    }
  }
  
  // Calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distance en km
  }

  // Fonction pour obtenir le badge d'un item - Varie selon le type et catégorie
  const getItemBadge = (item) => {
    // Pour les établissements
    if (item.type === 'establishment') {
      // VIP en priorité pour les sponsorisés seulement
      if (item.sponsored) return { text: 'VIP', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }
      // Ensuite les autres badges
      if (item.tags?.includes('luxe') || item.price_level >= 4) return { text: 'LUXE', color: 'linear-gradient(135deg, #a855f7, #6366f1)' }
      if (item.tags?.includes('romantic')) return { text: 'ROMANTIQUE', color: 'linear-gradient(135deg, #f43f5e, #e11d48)' }
      if (item.rating >= 4.7) return { text: 'TOP NOTÉ', color: 'linear-gradient(135deg, #f59e0b, #d97706)' }
      if (item.category === 'Japonais') return { text: 'SUSHI', color: 'linear-gradient(135deg, #ef4444, #dc2626)' }
      if (item.category === 'Italien') return { text: 'ITALIEN', color: 'linear-gradient(135deg, #22c55e, #16a34a)' }
      if (item.category === 'Méditerranéen') return { text: 'MED', color: 'linear-gradient(135deg, #06b6d4, #0891b2)' }
      return null
    }
    
    // Pour les événements
    if (item.type === 'event') {
      // VIP en priorité pour les sponsorisés
      if (item.sponsored) return { text: 'VIP', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }
      // Ensuite les autres badges
      if (item.tags?.includes('luxe')) return { text: 'EXCLUSIF', color: 'linear-gradient(135deg, #ec4899, #f43f5e)' }
      if (item.tags?.includes('romantic')) return { text: 'ROMANTIQUE', color: 'linear-gradient(135deg, #f43f5e, #e11d48)' }
      if (item.price >= 60) return { text: 'PREMIUM', color: 'linear-gradient(135deg, #a855f7, #6366f1)' }
      if (item.tags?.includes('latino')) return { text: 'LATINO', color: 'linear-gradient(135deg, #ef4444, #dc2626)' }
      if (item.tags?.includes('chill')) return { text: 'CHILL', color: 'linear-gradient(135deg, #10b981, #059669)' }
      return { text: 'NOUVEAU', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' }
    }
    
    // Pour les services
    if (item.type === 'service') {
      // VIP en priorité pour les sponsorisés
      if (item.sponsored) return { text: 'VIP', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }
      // Ensuite les autres badges
      if (item.tags?.includes('luxe')) return { text: 'LUXE', color: 'linear-gradient(135deg, #a855f7, #6366f1)' }
      if (item.category === 'transport') return { text: 'TRANSPORT', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' }
      if (item.category === 'bien_etre') return { text: 'WELLNESS', color: 'linear-gradient(135deg, #10b981, #059669)' }
      if (item.category === 'gastronomie') return { text: 'FOOD', color: 'linear-gradient(135deg, #ef4444, #dc2626)' }
      return { text: 'SERVICE', color: 'linear-gradient(135deg, #6b7280, #4b5563)' }
    }
    
    return null
  }

  const getData = () => {
    let data = []
    
    switch(activeTab) {
      case 'all': 
        // Afficher TOUS les éléments comme sur desktop
        data = [
          // Tous les établissements (prioriser les sponsorisés)
          ...allEstablishments
            .sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))
            .map(e => ({...e, type: 'establishment'})),
          // Tous les services
          ...allServices.map(s => ({...s, type: 'service'})),
          // Tous les événements
          ...allEvents.map(ev => ({...ev, type: 'event'}))
        ]
        break
      case 'establishments':
        // Tous les établissements
        data = allEstablishments
          .sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))
          .map(e => ({...e, type: 'establishment'}))
        break
      case 'services':
        // Tous les services
        data = allServices.map(s => ({...s, type: 'service'}))
        break
      case 'events':
        // Tous les événements
        data = allEvents.map(ev => ({...ev, type: 'event'}))
        break
      case 'luxe':
        data = [
          ...allEstablishments.filter(e => e.tags?.includes('luxe') || e.price_level >= 4).map(e => ({...e, type: 'establishment'})),
          ...allServices.filter(s => s.tags?.includes('luxe') || s.price_level >= 4).map(s => ({...s, type: 'service'})),
          ...allEvents.filter(ev => ev.tags?.includes('luxe') || ev.price >= 100).map(ev => ({...ev, type: 'event'}))
        ]
        break
      default:
        data = allEstablishments
          .sort((a, b) => (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0))
          .map(e => ({...e, type: 'establishment'}))
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
    } else if (sortBy === 'distance' && userLocation) {
      // Trier par distance si la géolocalisation est disponible
      data = data.map(item => {
        if (item.coordinates) {
          const distance = calculateDistance(
            userLocation.lat, 
            userLocation.lng,
            item.coordinates.lat,
            item.coordinates.lng
          )
          return { ...item, distance }
        }
        return { ...item, distance: 999 } // Mettre les items sans coordonnées à la fin
      })
      data.sort((a, b) => (a.distance || 999) - (b.distance || 999))
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

  const allData = getData()
  const data = isShowingAll ? allData : allData.slice(0, displayLimit)
  const hasMore = allData.length > displayLimit && !isShowingAll

  const handleShowMore = () => {
    setIsShowingAll(true)
  }

  const handleShowLess = () => {
    setIsShowingAll(false)
    // Scroll vers le haut des suggestions
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="w-full pb-6" style={{ maxWidth: '100vw', overflow: 'hidden' }}>
      {/* Barre de recherche TRÈS visible */}
      <div className="px-4 mb-4 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500" size={20} />
          <input
            type="text"
            placeholder="Rechercher établissements, événements, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm font-medium shadow-lg text-left"
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
      <div className="px-4 mb-3 flex gap-2" style={{ position: 'relative', zIndex: 100 }}>
        {/* Dropdown Tri */}
        <div className="relative flex-1" style={{ zIndex: showSortMenu ? 9999 : 1 }}>
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
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden"
              style={{
                background: isDarkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                zIndex: 99999
              }}
            >
              {sortOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => {
                    setSortBy(option.key)
                    setShowSortMenu(false)
                  }}
                  className="w-full flex items-center justify-start gap-2 px-3 py-2.5 text-xs font-medium text-left transition-colors"
                  style={{
                    background: sortBy === option.key ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: isDarkMode ? '#fff' : '#1f2937'
                  }}
                  onMouseEnter={(e) => {
                    if (sortBy !== option.key) {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (sortBy !== option.key) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span className="flex-shrink-0">{option.icon}</span>
                  <span className="flex-1 text-left">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown Style */}
        <div className="relative flex-1" style={{ zIndex: showStyleMenu ? 9999 : 1 }}>
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
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden"
              style={{
                background: isDarkMode ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                zIndex: 99999
              }}
            >
              <button
                onClick={() => {
                  setSelectedStyle(null)
                  setShowStyleMenu(false)
                }}
                className="w-full flex items-center justify-start gap-2 px-3 py-2.5 text-xs font-medium text-left"
                style={{
                  background: !selectedStyle ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  color: isDarkMode ? '#fff' : '#1f2937'
                }}
                onMouseEnter={(e) => {
                  if (selectedStyle) {
                    e.currentTarget.style.background = isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStyle) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span className="flex-shrink-0">✨</span>
                <span className="flex-1 text-left">Tous les styles</span>
              </button>
              {styles.map(style => (
                <button
                  key={style.key}
                  onClick={() => {
                    setSelectedStyle(style.key)
                    setShowStyleMenu(false)
                  }}
                  className="w-full flex items-center justify-start gap-2 px-3 py-2.5 text-xs font-medium text-left transition-colors"
                  style={{
                    background: selectedStyle === style.key ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: isDarkMode ? '#fff' : '#1f2937'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedStyle !== style.key) {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(75, 85, 99, 0.4)' : 'rgba(243, 244, 246, 0.8)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedStyle !== style.key) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span className="flex-shrink-0">{style.emoji}</span>
                  <span className="flex-1 text-left">{style.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs pour les catégories - Avec noms */}
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
          <div className="flex flex-col items-center gap-0.5">
            <span>✨</span>
            <span className="text-[9px]">Tout</span>
          </div>
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
          <div className="flex flex-col items-center gap-0.5">
            <span>🏨</span>
            <span className="text-[9px]">Établis.</span>
          </div>
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
          <div className="flex flex-col items-center gap-0.5">
            <span>🛍️</span>
            <span className="text-[9px]">Services</span>
          </div>
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
          <div className="flex flex-col items-center gap-0.5">
            <span>🎉</span>
            <span className="text-[9px]">Événem.</span>
          </div>
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
          <div className="flex flex-col items-center gap-0.5">
            <span>👑</span>
            <span className="text-[9px]">Luxe</span>
          </div>
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

      {/* Grille de bannières - IMAGE PLEIN ÉCRAN */}
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
                border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
              {/* Image en arrière-plan - TOUTE LA BANNIÈRE */}
            <img 
              src={item.image_url || `https://images.unsplash.com/photo-1414235077-531286732f1a?w=600&h=400&fit=crop&q=80`}
              alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay gradient pour lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
              
              {/* Badge en haut à droite */}
              {badge && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg z-10"
                  style={{
                    background: badge.color,
                    color: badge.text === 'VIP' ? '#000' : '#fff'
                  }}
                >
                  {badge.text}
                </div>
              )}

              {/* Contenu par-dessus l'image */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between z-10">
                {/* Espace vide en haut pour le badge */}
                <div></div>

                {/* Contenu en bas */}
                <div className="flex flex-col gap-2">
                  {/* Titre */}
                  <h3 className="font-bold text-left text-white drop-shadow-lg" style={{
                  fontSize: columns === 1 ? '17px' : '15px',
                    lineHeight: '1.2',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
                }}>
                  {item.name}
                </h3>
                
                  {/* Description */}
                  <p className="text-left text-xs text-white/95 drop-shadow-md" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
                  }}>
                    {item.description}
                  </p>

                  {/* Quartier et Distance */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.zone && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-white/90 drop-shadow-md" />
                        <span className="text-xs text-white/90 drop-shadow-md" style={{
                          textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)'
                        }}>
                          {item.zone}
                        </span>
                      </div>
                    )}
                    {sortBy === 'distance' && item.distance && item.distance < 999 && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{
                        background: 'rgba(59, 130, 246, 0.8)',
                        backdropFilter: 'blur(8px)'
                      }}>
                        <span className="text-[10px] font-bold text-white">
                          📍 {item.distance.toFixed(1)} km
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Note et Prix */}
                  <div className="flex items-center justify-between">
                    {item.rating && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px)'
                      }}>
                        <Star size={13} className="text-yellow-400" fill="currentColor" />
                        <span className="text-sm font-bold text-white">
                          {item.rating}
                        </span>
                      </div>
                    )}
                    {item.price_level && (
                      <span className="text-sm font-bold text-green-400 px-2 py-1 rounded-lg" style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px)',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)'
                      }}>
                        {'€'.repeat(item.price_level)}
                      </span>
                    )}
                  </div>
                  
                  {/* Bouton Réserver */}
                  <button
                    onClick={(e) => handleReserve(e, item)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.5)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    📅 Réserver
                  </button>
              </div>
            </div>
          </button>
          )
        })}
      </div>

      {/* Bouton Afficher plus / Afficher moins */}
      {hasMore && (
        <div className="px-4 mt-6 mb-4">
          <button
            onClick={handleShowMore}
            className="w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            ✨ Afficher plus
          </button>
        </div>
      )}

      {isShowingAll && allData.length > displayLimit && (
        <div className="px-4 mt-4 mb-4">
          <button
            onClick={handleShowLess}
            className="w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: isDarkMode ? 'rgba(55, 65, 81, 0.6)' : 'rgba(243, 244, 246, 0.8)',
              color: isDarkMode ? 'white' : '#374151',
              border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`
            }}
          >
            ⬆️ Afficher moins
          </button>
        </div>
      )}

      {/* Message si aucun résultat */}
      {allData.length === 0 && (
        <div className="text-center py-12 px-4">
          <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm">
            Aucun résultat trouvé
          </p>
        </div>
      )}
    </div>
  )
}
