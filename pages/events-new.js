import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MessageCircle, Calendar, MapPin } from 'lucide-react'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import FiltersBar from '../components/ui/FiltersBar'
import GliitzLoader from '../components/ui/GliitzLoader'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Events({ user, setUser }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    // Données d'événements statiques
    const fallbackEvents = [
      {
        id: 1,
        name: "Sunset Beach Party",
        description: "DJ set exclusif, cocktails premium",
        date: "2024-12-15T20:00:00Z",
        image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        location: "Ocean Club Marbella",
        price: 85
      },
      {
        id: 2,
        name: "Mediterranean Wine & Tapas",
        description: "Dégustation vins et tapas",
        date: "2024-12-20T19:30:00Z",
        image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
        location: "La Terraza del Mar",
        price: 65
      }
    ]
    setEvents(fallbackEvents)
    setIsLoading(false)
  }, [])

  const handleReserve = (event) => {
    router.push({
      pathname: '/chat',
      query: { 
        message: `Je souhaite réserver pour l'événement ${event.name}`
      }
    })
  }

  if (isLoading) return <GliitzLoader />

  return (
    <div className="min-h-screen" style={{ background: isDarkMode ? '#0B0B0C' : '#F8F8F8' }}>
      <HeaderGliitz user={user} setUser={setUser} toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMobileMenuOpen={isMobileMenuOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} user={user} />

      {/* HERO BANNER */}
      <section 
        className="relative w-full h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            Événements Exclusifs 🎉
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90"
            style={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Découvrez les événements les plus prisés de Marbella
          </p>
        </div>
      </section>

      {/* FILTRES */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <FiltersBar />
      </div>

      {/* GRILLE D'ÉVÉNEMENTS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group card-gliitz rounded-3xl overflow-hidden hover-lift-refined cursor-pointer"
              onClick={() => router.push(`/event/${event.id}`)}
              style={{
                background: isDarkMode ? 'rgba(26,26,28,0.95)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(192,192,192,0.2)',
                boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={event.image_url} 
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                      boxShadow: '0 4px 12px rgba(192,192,192,0.4)'
                    }}
                  >
                    {event.price}€
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {event.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: isDarkMode ? '#E0E0E0' : '#666666' }}>
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: isDarkMode ? '#E0E0E0' : '#666666' }}>
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReserve(event)
                  }}
                  className="btn-gliitz-primary w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span>Réserver</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

