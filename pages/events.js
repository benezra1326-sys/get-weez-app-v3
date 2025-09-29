import { useState, useEffect } from 'react'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import EventList from '../components/events/EventList'
import EventBannerView from '../components/events/EventBannerView'
import EventCalendarView from '../components/events/EventCalendarView'
import EventDisplayToggle from '../components/events/EventDisplayToggle'
import { EstablishmentSearchBar } from '../components/ui/SearchBar'
import { supabase } from '../lib/supabase'

export default function Events({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [displayMode, setDisplayMode] = useState('banner') // 'banner' ou 'calendar'
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })

      if (error) {
        console.error('Erreur lors du chargement des événements:', error)
        // Fallback avec des données statiques
        const fallbackEvents = [
          {
            "id": 1,
            "name": "Sunset Beach Party",
            "description": "DJ set exclusif, cocktails premium et feu au coucher du soleil. Une soirée inoubliable sur la plage d'Ocean Club Marbella.",
            "date": "2024-10-15T20:00:00Z",
            "establishment_id": 4,
            "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80",
            "location": "Ocean Club Marbella, Puerto Banús",
            "price": 85,
            "capacity": 200,
            "type": "party"
          },
          {
            "id": 2,
            "name": "Mediterranean Wine & Tapas Night",
            "description": "Dégustation de vins méditerranéens et tapas authentiques avec guitare live. Une expérience gastronomique andalouse.",
            "date": "2024-10-20T19:30:00Z",
            "establishment_id": 11,
            "image_url": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80",
            "location": "La Terraza del Mar, Marbella",
            "price": 65,
            "capacity": 80,
            "type": "gastronomy"
          },
          {
            "id": 3,
            "name": "Full Moon Yoga & Brunch",
            "description": "Séance de yoga sur la plage au lever du soleil, suivie d'un brunch healthy avec produits locaux.",
            "date": "2024-10-25T07:00:00Z",
            "establishment_id": 12,
            "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&q=80",
            "location": "Playa Serena Wellness Club, Marbella",
            "price": 45,
            "capacity": 30,
            "type": "wellness"
          },
          {
            "id": 4,
            "name": "Flamenco Nights",
            "description": "Dîner spectacle flamenco avec danseurs professionnels, guitare espagnole et cuisine andalouse traditionnelle.",
            "date": "2024-10-28T21:00:00Z",
            "establishment_id": 13,
            "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80",
            "location": "Tablao Andaluz, Marbella",
            "price": 95,
            "capacity": 60,
            "type": "show"
          },
          {
            "id": 5,
            "name": "Luxury Boat Experience",
            "description": "Sortie en catamaran de luxe avec champagne, DJ et vue panoramique sur la côte de Marbella.",
            "date": "2024-11-02T16:00:00Z",
            "establishment_id": 14,
            "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80",
            "location": "Puerto Banús Marina, Marbella",
            "price": 150,
            "capacity": 50,
            "type": "experience"
          },
          {
            "id": 6,
            "name": "Art & Jazz Evening",
            "description": "Exposition d'art contemporain avec trio de jazz en live. Cocktails créatifs et ambiance sophistiquée.",
            "date": "2024-11-05T20:00:00Z",
            "establishment_id": 15,
            "image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Art Lounge, Marbella",
            "price": 75,
            "capacity": 100,
            "type": "cultural"
          },
          {
            "id": 7,
            "name": "Gourmet Paella Experience",
            "description": "Démonstration et dégustation de paella traditionnelle par un chef espagnol. Vin et ambiance andalouse.",
            "date": "2024-11-08T19:00:00Z",
            "establishment_id": 16,
            "image_url": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80",
            "location": "El Patio Andaluz, Marbella",
            "price": 55,
            "capacity": 40,
            "type": "gastronomy"
          },
          {
            "id": 8,
            "name": "Cocktail Masterclass",
            "description": "Atelier cocktails sur rooftop avec barman professionnel. Apprenez les techniques des grands bars de Marbella.",
            "date": "2024-11-12T18:30:00Z",
            "establishment_id": 17,
            "image_url": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&q=80",
            "location": "SkyBar Marbella, Marbella",
            "price": 70,
            "capacity": 25,
            "type": "workshop"
          },
          {
            "id": 9,
            "name": "Wellness Day Retreat",
            "description": "Journée complète de bien-être : soins spa, méditation, repas detox et activités de relaxation.",
            "date": "2024-11-15T09:00:00Z",
            "establishment_id": 18,
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Wellness Spa, Marbella",
            "price": 120,
            "capacity": 20,
            "type": "wellness"
          },
          {
            "id": 10,
            "name": "VIP Club Night",
            "description": "Soirée VIP avec DJ internationaux et lounge exclusif. Champagne, canapés et ambiance électrisante.",
            "date": "2024-11-18T23:00:00Z",
            "establishment_id": 19,
            "image_url": "https://images.unsplash.com/photo-1571266028243-e68f9520bb97?w=800&h=600&fit=crop&q=80",
            "location": "Pangea Nightclub, Marbella",
            "price": 100,
            "capacity": 150,
            "type": "party"
          }
        ]
        setEvents(fallbackEvents)
        setFilteredEvents(fallbackEvents)
      } else {
        setEvents(data || [])
        setFilteredEvents(data || [])
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de recherche et filtrage
  const handleSearch = (query) => {
    setSearchQuery(query)
    filterEvents(query)
  }

  const filterEvents = (query) => {
    let filtered = events

    // Filtrage par recherche
    if (query && query.trim()) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase()) ||
        event.type.toLowerCase().includes(query.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode)
  }

  const handleBecomeMember = () => {
    console.log('Become member clicked')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      <div 
        style={{ 
          width: '100%', 
          minHeight: '100vh', 
          margin: 0, 
          padding: 0,
          backgroundColor: '#0D0D0D'
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            width: '100%',
            margin: 0,
            padding: 0
          }}
        >
          <Header 
            user={user} 
            setUser={setUser}
            toggleMobileMenu={toggleMobileMenu} 
            isMobileMenuOpen={isMobileMenuOpen} 
          />
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
            user={user} 
          />
          
          <main 
            style={{ 
              flex: 1,
              overflow: 'auto',
              backgroundColor: '#0D0D0D',
              width: '100%',
              minHeight: 'calc(100vh - 8rem)',
              padding: 'var(--spacing-xl)'
            }}
          >
            {/* Header avec recherche */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-3xl p-8 mb-8"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 25%, #06B6D4 50%, #10B981 75%, #F59E0B 100%)',
                  backgroundSize: '400% 400%',
                  animation: 'gradientShift 8s ease infinite'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                <div className="relative z-10">
                  <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    🎉 Événements Premium
                  </h1>
                  <p className="text-white/90 text-xl mb-6 drop-shadow-md">
                    Découvrez les événements exclusifs de Marbella
                  </p>
                  
                  <div className="max-w-2xl">
                    <EstablishmentSearchBar 
                      onSearch={handleSearch}
                      className="max-w-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle d'affichage */}
            <div className="mb-8">
              <EventDisplayToggle
                displayMode={displayMode}
                onModeChange={handleDisplayModeChange}
              />
            </div>

            {/* Contenu selon le mode d'affichage */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                {displayMode === 'banner' ? (
                  <EventBannerView 
                    events={filteredEvents} 
                    user={user} 
                    onBecomeMember={handleBecomeMember}
                  />
                ) : (
                  <EventCalendarView 
                    events={filteredEvents} 
                    user={user} 
                    onBecomeMember={handleBecomeMember}
                  />
                )}
              </>
            )}
            
            {filteredEvents.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Aucun événement trouvé</h3>
                <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}