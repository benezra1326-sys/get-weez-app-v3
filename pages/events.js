import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Calendar, MapPin, Clock, Euro, ArrowRight, Map } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import FiltersBar from '../components/ui/FiltersBar'
import GliitzLoader from '../components/ui/GliitzLoader'
import MapView from '../components/map/MapView'
import EventsCalendar from '../components/ui/EventsCalendar'
import { useTheme } from '../contexts/ThemeContextSimple'
import { smartSort, getUserPreferences } from '../lib/smartSorting'

export default function Events({ user, setUser }) {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [displayedEvents, setDisplayedEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentSort, setCurrentSort] = useState('rating')
  const [showMap, setShowMap] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    // Données d'événements statiques avec coordonnées
    const fallbackEvents = [
      {
        id: 1,
        name: "Sunset Beach Party",
        description: "DJ set exclusif avec vue sur mer, cocktails premium et ambiance lounge",
        date: "2024-12-15T20:00:00Z",
        image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        location: "Ocean Club Marbella",
        address: "Playa de Marbella, Puerto Banús",
        price: 85,
        category: "Beach Club",
        coordinates: { lat: 36.4877, lng: -4.9528 }
      },
      {
        id: 2,
        name: "Mediterranean Wine & Tapas",
        description: "Dégustation de vins méditerranéens accompagnée de tapas gastronomiques",
        date: "2024-12-20T19:30:00Z",
        image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
        location: "La Terraza del Mar",
        address: "Paseo Marítimo, Marbella Centro",
        price: 65,
        category: "Gastronomie",
        coordinates: { lat: 36.5098, lng: -4.8826 }
      },
      {
        id: 3,
        name: "Yacht VIP Night",
        description: "Soirée exclusive sur yacht privé avec DJ et champagne",
        date: "2024-12-22T21:00:00Z",
        image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        location: "Puerto Banús",
        address: "Puerto José Banús, Marbella",
        price: 150,
        category: "VIP",
        coordinates: { lat: 36.4843, lng: -4.9530 }
      },
      {
        id: 4,
        name: "Rooftop DJ Session",
        description: "Session DJ sur rooftop avec vue panoramique sur Marbella",
        date: "2024-12-25T22:00:00Z",
        image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        location: "Sky Lounge",
        address: "Av. Ricardo Soriano, Marbella",
        price: 45,
        category: "Nightlife",
        coordinates: { lat: 36.5125, lng: -4.8850 }
      },
      {
        id: 5,
        name: "Private Chef Experience",
        description: "Dîner privé préparé par un chef étoilé Michelin",
        date: "2024-12-28T20:00:00Z",
        image_url: "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=800",
        location: "Villa Privée",
        address: "Sierra Blanca, Marbella",
        price: 200,
        category: "Premium",
        coordinates: { lat: 36.5150, lng: -4.8900 }
      },
      {
        id: 6,
        name: "New Year's Eve Gala",
        description: "Célébrez le Nouvel An avec style dans le club le plus exclusif",
        date: "2024-12-31T21:00:00Z",
        image_url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800",
        location: "Le Club Premium",
        address: "Golden Mile, Marbella",
        price: 250,
        category: "Spécial",
        coordinates: { lat: 36.5070, lng: -4.9050 }
      }
    ]
    setEvents(fallbackEvents)
    setDisplayedEvents(fallbackEvents)
    setIsLoading(false)
  }, [])

  const handleFilterChange = (filter) => {
    setCurrentSort(filter.value)
    let sorted = [...events]
    
    // Si c'est le tri intelligent, utiliser les préférences utilisateur
    if (filter.value === 'smart' && filter.userPreferences && user?.id) {
      sorted = smartSort(events, filter.userPreferences, 'smart')
    } else {
      // Tri classique
      switch(filter.value) {
        case 'rating':
          sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
          break
        case 'reviews':
          sorted.sort((a, b) => (b.attendees || 0) - (a.attendees || 0))
          break
        case 'price-asc':
          sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
          break
        case 'price-desc':
          sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
          break
        case 'location':
          sorted.sort((a, b) => (a.location || '').localeCompare(b.location || ''))
          break
        default:
          break
      }
    }
    
    setDisplayedEvents(sorted)
  }

  const handleReserve = (event) => {
    router.push(`/?msg=${encodeURIComponent(`Je souhaite réserver pour l'événement ${event.name} le ${new Date(event.date).toLocaleDateString('fr-FR')}`)}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  if (isLoading) return <GliitzLoader />

  return (
    <div className="min-h-screen flex" style={{
      background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
    }}>
      <V3Sidebar 
        conversations={[]} 
        onNewChat={() => router.push('/')}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      
      <div className="flex-1 overflow-y-auto">
      {/* HERO BANNER */}
      <section 
        className="banner-mirror-effect relative w-full h-[50vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar size={40} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            Événements Exclusifs
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90"
            style={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Découvrez les soirées et événements les plus prisés de Marbella
          </p>
        </div>
      </section>

      {/* FILTRES & VIEW TOGGLE */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20 mb-8">
        <div 
          className="p-6 rounded-3xl glass-live"
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            gap: '1rem',
            alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex-1">
            <FiltersBar onFilterChange={handleFilterChange} currentSort={currentSort} user={user} />
          </div>
          
          {/* Toggle Calendar View */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap mr-3"
            style={{
              background: showCalendar 
                ? 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))'
                : isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${showCalendar ? 'rgba(167,199,197,0.5)' : 'rgba(167,199,197,0.3)'}`,
              color: showCalendar ? '#FFFFFF' : (isDarkMode ? '#A7C7C5' : '#5A8B89'),
              backdropFilter: 'blur(10px)',
              fontFamily: 'Poppins, sans-serif',
              minWidth: '180px'
            }}
            onMouseEnter={(e) => {
              if (!showCalendar) {
                e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = 'rgba(167,199,197,0.5)'
              }
            }}
            onMouseLeave={(e) => {
              if (!showCalendar) {
                e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
                e.currentTarget.style.borderColor = 'rgba(167,199,197,0.3)'
              }
            }}
          >
            <Calendar size={20} />
            <span>{showCalendar ? 'Voir la liste' : 'Calendrier'}</span>
          </button>

          {/* Toggle Map/Grid View */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap"
            style={{
              background: showMap 
                ? 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))'
                : isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${showMap ? 'rgba(167,199,197,0.5)' : 'rgba(167,199,197,0.3)'}`,
              color: showMap ? '#FFFFFF' : (isDarkMode ? '#A7C7C5' : '#5A8B89'),
              backdropFilter: 'blur(10px)',
              fontFamily: 'Poppins, sans-serif',
              minWidth: '180px'
            }}
            onMouseEnter={(e) => {
              if (!showMap) {
                e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = 'rgba(167,199,197,0.5)'
              }
            }}
            onMouseLeave={(e) => {
              if (!showMap) {
                e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
                e.currentTarget.style.borderColor = 'rgba(167,199,197,0.3)'
              }
            }}
          >
            <Map size={20} />
            <span>{showMap ? 'Voir la liste' : 'Voir la carte'}</span>
          </button>
        </div>
      </div>

      {/* VUE CALENDRIER */}
      {showCalendar && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EventsCalendar 
                events={events} 
                onEventClick={(event) => {
                  // Rediriger vers la page de l'événement
                  router.push(`/event/${event.id}`)
                }}
                isDarkMode={isDarkMode}
              />
            </div>
            
            <div className="lg:col-span-1">
              <div 
                className="rounded-2xl p-6 sticky top-8"
                style={{
                  background: isDarkMode 
                    ? 'rgba(192, 192, 192, 0.08)' 
                    : 'rgba(192, 192, 192, 0.12)',
                  border: isDarkMode 
                    ? '1px solid rgba(192, 192, 192, 0.2)' 
                    : '1px solid rgba(192, 192, 192, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 
                  className="text-lg font-bold mb-4"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  Événements à venir
                </h3>
                
                <div className="space-y-3">
                  {events
                    .filter(event => new Date(event.date) > new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5)
                    .map(event => (
                      <div 
                        key={event.id}
                        className="p-3 rounded-lg cursor-pointer transition-all hover:scale-105"
                        style={{
                          background: isDarkMode 
                            ? 'rgba(192, 192, 192, 0.05)' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: isDarkMode 
                            ? '1px solid rgba(192, 192, 192, 0.1)' 
                            : '1px solid rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={() => router.push(`/event/${event.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: '#A7C7C5' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p 
                              className="font-semibold text-sm truncate"
                              style={{
                                color: isDarkMode ? '#C0C0C0' : '#0B0B0C'
                              }}
                            >
                              {event.name}
                            </p>
                            <p 
                              className="text-xs opacity-70"
                              style={{
                                color: isDarkMode ? '#C0C0C0' : '#666666'
                              }}
                            >
                              {new Date(event.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VUE CARTE OU GRILLE */}
      {!showCalendar && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {showMap ? (
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
              }}
            >
              Événements près de vous
            </h2>
            <MapView 
              items={displayedEvents}
              type="events"
              onClose={() => setShowMap(false)}
            />
          </div>
        ) : (
          <>

            {/* GRILLE D'ÉVÉNEMENTS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => router.push(`/product/event/${event.id}`)}
              style={{
                background: isDarkMode 
                  ? 'rgba(26,26,28,0.95)' 
                  : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(192,192,192,0.2)',
                boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(192,192,192,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(192,192,192,0.15)'
              }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'} 
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {event.category && (
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)',
                      color: '#0B0B0C'
                    }}
                  >
                    {event.category}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col" style={{ minHeight: '360px' }}>
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {event.name}
                </h3>

                <div className="space-y-2 mb-4" style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? '#C0C0C0' : '#666666'
                }}>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} />
                    <span>{formatTime(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#C0C0C0' }}>
                    <Euro size={16} />
                    <span>{event.price}€</span>
                  </div>
                </div>

                <p 
                  className="text-sm mb-4 line-clamp-2"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? '#E0E0E0' : '#666666'
                  }}
                >
                  {event.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReserve(event)
                  }}
                  className="w-full mt-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.25))' 
                      : 'linear-gradient(135deg, rgba(192, 192, 192, 0.8), rgba(192, 192, 192, 0.95))',
                    color: isDarkMode ? '#C0C0C0' : '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.5)'}`,
                    boxShadow: isDarkMode 
                      ? '0 4px 15px rgba(192, 192, 192, 0.1)' 
                      : '0 4px 15px rgba(192, 192, 192, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 8px 25px rgba(192, 192, 192, 0.2)' 
                      : '0 8px 25px rgba(192, 192, 192, 0.5)'
                    e.currentTarget.style.background = isDarkMode 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.25), rgba(192, 192, 192, 0.35))' 
                      : 'linear-gradient(135deg, rgba(192, 192, 192, 0.9), rgba(192, 192, 192, 1))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 4px 15px rgba(192, 192, 192, 0.1)' 
                      : '0 4px 15px rgba(192, 192, 192, 0.3)'
                    e.currentTarget.style.background = isDarkMode 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.25))' 
                      : 'linear-gradient(135deg, rgba(192, 192, 192, 0.8), rgba(192, 192, 192, 0.95))'
                  }}
                >
                  <span>Réserver</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
          </>
        )}
      </section>
      </div>
    </div>
  )
}
