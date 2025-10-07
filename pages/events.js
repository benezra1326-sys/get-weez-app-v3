import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Calendar, MapPin, Clock, Euro, ArrowRight } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import FiltersBar from '../components/ui/FiltersBar'
import GliitzLoader from '../components/ui/GliitzLoader'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Events({ user, setUser }) {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    // Données d'événements statiques
    const fallbackEvents = [
      {
        id: 1,
        name: "Sunset Beach Party",
        description: "DJ set exclusif avec vue sur mer, cocktails premium et ambiance lounge",
        date: "2024-12-15T20:00:00Z",
        image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        location: "Ocean Club Marbella",
        price: 85,
        category: "Beach Club"
      },
      {
        id: 2,
        name: "Mediterranean Wine & Tapas",
        description: "Dégustation de vins méditerranéens accompagnée de tapas gastronomiques",
        date: "2024-12-20T19:30:00Z",
        image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
        location: "La Terraza del Mar",
        price: 65,
        category: "Gastronomie"
      },
      {
        id: 3,
        name: "Yacht VIP Night",
        description: "Soirée exclusive sur yacht privé avec DJ et champagne",
        date: "2024-12-22T21:00:00Z",
        image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        location: "Puerto Banús",
        price: 150,
        category: "VIP"
      },
      {
        id: 4,
        name: "Rooftop DJ Session",
        description: "Session DJ sur rooftop avec vue panoramique sur Marbella",
        date: "2024-12-25T22:00:00Z",
        image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        location: "Sky Lounge",
        price: 45,
        category: "Nightlife"
      },
      {
        id: 5,
        name: "Private Chef Experience",
        description: "Dîner privé préparé par un chef étoilé Michelin",
        date: "2024-12-28T20:00:00Z",
        image_url: "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=800",
        location: "Villa Privée",
        price: 200,
        category: "Premium"
      },
      {
        id: 6,
        name: "New Year's Eve Gala",
        description: "Célébrez le Nouvel An avec style dans le club le plus exclusif",
        date: "2024-12-31T21:00:00Z",
        image_url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800",
        location: "Le Club Premium",
        price: 250,
        category: "Spécial"
      }
    ]
    setEvents(fallbackEvents)
    setIsLoading(false)
  }, [])

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
        className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden"
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

      {/* FILTRES */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
        <FiltersBar />
      </div>

      {/* GRILLE D'ÉVÉNEMENTS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="mb-8">
          <p className="text-lg" style={{ 
            fontFamily: 'Poppins, sans-serif',
            color: isDarkMode ? '#E0E0E0' : '#666666'
          }}>
            {events.length} événements à venir
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => router.push(`/event/${event.id}`)}
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
              <div className="p-6">
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,192,192,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span>Réserver</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  )
}
