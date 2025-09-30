import { useState, useEffect } from 'react'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import EventList from '../components/events/EventList'
import EventBannerView from '../components/events/EventBannerView'
import EventCalendarView from '../components/events/EventCalendarView'
import EventDisplayToggle from '../components/events/EventDisplayToggle'
import { EstablishmentSearchBar } from '../components/ui/SearchBar'
import { supabase } from '../lib/supabase'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Events({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [displayMode, setDisplayMode] = useState('banner') // 'banner' ou 'calendar'
  const [isLoading, setIsLoading] = useState(true)
  const { isDarkMode, isLoaded } = useTheme()

  useEffect(() => {
    loadEvents()
  }, [])

  // Ne pas rendre avant que le thème soit chargé
  if (!isLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Chargement...</p>
        </div>
      </div>
    )
  }

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      console.log('Chargement des événements...')
      
      // Utiliser directement les données statiques avec dates futures
      console.log('Utilisation des données statiques d\'événements')
      const fallbackEvents = [
          {
            "id": 1,
            "name": "Sunset Beach Party",
            "description": "DJ set exclusif, cocktails premium et feu au coucher du soleil. Une soirée inoubliable sur la plage d'Ocean Club Marbella.",
            "date": "2025-03-15T20:00:00Z",
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
            "date": "2025-03-20T19:30:00Z",
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
            "date": "2025-03-25T07:00:00Z",
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
            "date": "2025-03-28T21:00:00Z",
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
            "date": "2025-04-02T16:00:00Z",
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
            "date": "2025-04-05T20:00:00Z",
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
            "date": "2025-04-08T19:00:00Z",
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
            "date": "2025-04-12T18:30:00Z",
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
            "date": "2025-04-15T09:00:00Z",
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
            "date": "2025-04-18T23:00:00Z",
            "establishment_id": 19,
            "image_url": "https://images.unsplash.com/photo-1571266028243-e68f9520bb97?w=800&h=600&fit=crop&q=80",
            "location": "Pangea Nightclub, Marbella",
            "price": 100,
            "capacity": 150,
            "type": "party"
          },
          {
            "id": 11,
            "name": "Golf Tournament Championship",
            "description": "Tournoi de golf professionnel sur le parcours de Marbella. Déjeuner gastronomique et remise de prix.",
            "date": "2025-04-22T08:00:00Z",
            "establishment_id": 20,
            "image_url": "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Golf Club, Marbella",
            "price": 200,
            "capacity": 80,
            "type": "sport"
          },
          {
            "id": 12,
            "name": "Sushi Masterclass",
            "description": "Atelier de cuisine japonaise avec chef sushi professionnel. Apprenez les techniques traditionnelles.",
            "date": "2025-04-25T18:00:00Z",
            "establishment_id": 21,
            "image_url": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80",
            "location": "Nobu Marbella, Marbella",
            "price": 90,
            "capacity": 15,
            "type": "workshop"
          },
          {
            "id": 13,
            "name": "Sunrise Yoga & Meditation",
            "description": "Séance de yoga et méditation au lever du soleil sur la plage. Petit-déjeuner healthy inclus.",
            "date": "2025-04-28T07:00:00Z",
            "establishment_id": 22,
            "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&q=80",
            "location": "Playa de la Fontanilla, Marbella",
            "price": 35,
            "capacity": 25,
            "type": "wellness"
          },
          {
            "id": 14,
            "name": "Wine Tasting Experience",
            "description": "Dégustation de vins espagnols avec sommelier expert. Fromages et charcuteries andalouses.",
            "date": "2025-05-02T19:00:00Z",
            "establishment_id": 23,
            "image_url": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop&q=80",
            "location": "Bodega Marbella, Marbella",
            "price": 60,
            "capacity": 30,
            "type": "gastronomy"
          },
          {
            "id": 15,
            "name": "Fashion Show & Cocktail",
            "description": "Défilé de mode avec créateurs locaux et internationaux. Cocktails créatifs et ambiance glamour.",
            "date": "2025-05-05T20:00:00Z",
            "establishment_id": 24,
            "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Fashion Week, Marbella",
            "price": 80,
            "capacity": 120,
            "type": "fashion"
          },
          {
            "id": 16,
            "name": "Jazz & Blues Night",
            "description": "Concert de jazz et blues avec musiciens internationaux. Ambiance intimiste et cocktails premium.",
            "date": "2025-05-08T21:00:00Z",
            "establishment_id": 25,
            "image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80",
            "location": "Blue Note Marbella, Marbella",
            "price": 55,
            "capacity": 60,
            "type": "music"
          },
          {
            "id": 17,
            "name": "Helicopter Tour & Lunch",
            "description": "Tour en hélicoptère de la côte de Marbella suivi d'un déjeuner gastronomique avec vue panoramique.",
            "date": "2025-05-12T11:00:00Z",
            "establishment_id": 26,
            "image_url": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Heliport, Marbella",
            "price": 300,
            "capacity": 6,
            "type": "experience"
          },
          {
            "id": 18,
            "name": "Art Gallery Opening",
            "description": "Vernissage d'exposition d'art contemporain avec artistes locaux et internationaux. Vin d'honneur.",
            "date": "2025-05-15T18:30:00Z",
            "establishment_id": 27,
            "image_url": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&q=80",
            "location": "Galería de Arte Marbella, Marbella",
            "price": 40,
            "capacity": 80,
            "type": "cultural"
          },
          {
            "id": 19,
            "name": "Tennis Tournament",
            "description": "Tournoi de tennis amateur sur les courts de Marbella. Buffet et remise de prix.",
            "date": "2025-05-18T09:00:00Z",
            "establishment_id": 28,
            "image_url": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Tennis Club, Marbella",
            "price": 50,
            "capacity": 40,
            "type": "sport"
          },
          {
            "id": 20,
            "name": "Christmas Market & Glühwein",
            "description": "Marché de Noël avec produits artisanaux, glühwein et ambiance festive. Musique live.",
            "date": "2025-05-22T16:00:00Z",
            "establishment_id": 29,
            "image_url": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop&q=80",
            "location": "Plaza de los Naranjos, Marbella",
            "price": 25,
            "capacity": 200,
            "type": "festival"
          },
          {
            "id": 21,
            "name": "New Year's Eve Gala",
            "description": "Gala du Nouvel An avec dîner gastronomique, spectacle et feu d'artifice. Tenue de soirée requise.",
            "date": "2025-05-31T20:00:00Z",
            "establishment_id": 30,
            "image_url": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80",
            "location": "Hotel Puente Romano, Marbella",
            "price": 250,
            "capacity": 300,
            "type": "gala"
          },
          {
            "id": 22,
            "name": "Paddle Tennis Championship",
            "description": "Championnat de paddle tennis avec joueurs professionnels. Barbecue et boissons incluses.",
            "date": "2025-06-05T10:00:00Z",
            "establishment_id": 31,
            "image_url": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Paddle Club, Marbella",
            "price": 45,
            "capacity": 50,
            "type": "sport"
          },
          {
            "id": 23,
            "name": "Photography Workshop",
            "description": "Atelier de photographie avec photographe professionnel. Techniques de portrait et paysage.",
            "date": "2025-06-08T14:00:00Z",
            "establishment_id": 32,
            "image_url": "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Photography Studio, Marbella",
            "price": 75,
            "capacity": 12,
            "type": "workshop"
          },
          {
            "id": 24,
            "name": "Spa & Wellness Retreat",
            "description": "Retraite bien-être complète : massages, soins du visage, yoga et méditation. Déjeuner détox inclus.",
            "date": "2025-06-12T09:00:00Z",
            "establishment_id": 33,
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Wellness Resort, Marbella",
            "price": 180,
            "capacity": 15,
            "type": "wellness"
          },
          {
            "id": 25,
            "name": "Tapas & Flamenco Show",
            "description": "Spectacle de flamenco authentique avec tapas andalouses et sangria. Ambiance traditionnelle espagnole.",
            "date": "2025-06-15T20:00:00Z",
            "establishment_id": 34,
            "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80",
            "location": "Tablao Flamenco Marbella, Marbella",
            "price": 70,
            "capacity": 45,
            "type": "show"
          },
          {
            "id": 26,
            "name": "Cooking Masterclass",
            "description": "Cours de cuisine méditerranéenne avec chef étoilé. Apprenez les secrets de la gastronomie andalouse.",
            "date": "2025-06-18T16:00:00Z",
            "establishment_id": 35,
            "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Culinary School, Marbella",
            "price": 95,
            "capacity": 20,
            "type": "workshop"
          },
          {
            "id": 27,
            "name": "Beach Volleyball Tournament",
            "description": "Tournoi de beach volleyball sur la plage. Équipes mixtes, prix et après-party.",
            "date": "2025-06-22T14:00:00Z",
            "establishment_id": 36,
            "image_url": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop&q=80",
            "location": "Playa de la Fontanilla, Marbella",
            "price": 30,
            "capacity": 60,
            "type": "sport"
          },
          {
            "id": 28,
            "name": "Wine & Cheese Pairing",
            "description": "Dégustation de fromages artisanaux avec sélection de vins espagnols. Guide sommelier expert.",
            "date": "2025-06-25T19:30:00Z",
            "establishment_id": 37,
            "image_url": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop&q=80",
            "location": "Fromagerie Marbella, Marbella",
            "price": 50,
            "capacity": 25,
            "type": "gastronomy"
          },
          {
            "id": 29,
            "name": "Sailing Regatta",
            "description": "Régate de voile en équipe avec yacht de luxe. Déjeuner à bord et remise de trophées.",
            "date": "2025-06-28T10:00:00Z",
            "establishment_id": 38,
            "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80",
            "location": "Puerto Banús Marina, Marbella",
            "price": 120,
            "capacity": 24,
            "type": "sport"
          },
          {
            "id": 30,
            "name": "Artisan Market & Live Music",
            "description": "Marché d'artisans locaux avec musique live, produits artisanaux et street food. Entrée libre.",
            "date": "2025-07-01T11:00:00Z",
            "establishment_id": 39,
            "image_url": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop&q=80",
            "location": "Mercado Artesanal Marbella, Marbella",
            "price": 0,
            "capacity": 500,
            "type": "market"
          },
          {
            "id": 31,
            "name": "Poker Tournament",
            "description": "Tournoi de poker Texas Hold'em avec buy-in et prix en espèces. Buffet et boissons incluses.",
            "date": "2025-07-04T19:00:00Z",
            "establishment_id": 40,
            "image_url": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Casino, Marbella",
            "price": 100,
            "capacity": 50,
            "type": "gaming"
          },
          {
            "id": 32,
            "name": "Sunset Yoga & Sound Healing",
            "description": "Séance de yoga au coucher du soleil avec sound healing et méditation. Ambiance relaxante.",
            "date": "2025-07-07T18:00:00Z",
            "establishment_id": 41,
            "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&q=80",
            "location": "Playa de la Fontanilla, Marbella",
            "price": 40,
            "capacity": 30,
            "type": "wellness"
          },
          {
            "id": 33,
            "name": "Cocktail Competition",
            "description": "Compétition de cocktails avec barmans professionnels. Dégustation et vote du public.",
            "date": "2025-07-10T20:00:00Z",
            "establishment_id": 42,
            "image_url": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&q=80",
            "location": "Marbella Bar Association, Marbella",
            "price": 35,
            "capacity": 80,
            "type": "competition"
          },
          {
            "id": 34,
            "name": "Art Exhibition Opening",
            "description": "Vernissage d'exposition d'art contemporain avec artistes émergents. Performance live et networking.",
            "date": "2025-07-13T18:00:00Z",
            "establishment_id": 43,
            "image_url": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&q=80",
            "location": "Galería Contemporánea Marbella, Marbella",
            "price": 25,
            "capacity": 100,
            "type": "cultural"
          },
          {
            "id": 35,
            "name": "Beach Cleanup & BBQ",
            "description": "Nettoyage de plage écologique suivi d'un barbecue communautaire. Sensibilisation environnementale.",
            "date": "2025-07-16T09:00:00Z",
            "establishment_id": 44,
            "image_url": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&q=80",
            "location": "Playa de la Fontanilla, Marbella",
            "price": 15,
            "capacity": 100,
            "type": "environmental"
          }
        ]
        console.log('Événements chargés:', fallbackEvents.length)
        setEvents(fallbackEvents)
        setFilteredEvents(fallbackEvents)
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
    <div 
        style={{ 
          width: '100vw', 
          minHeight: '100vh', 
          margin: 0, 
          padding: 0,
          backgroundColor: isDarkMode ? '#0D0D0D' : '#FFFFFF',
          maxWidth: 'none'
        }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          width: '100vw',
          margin: 0,
          padding: 0,
          backgroundColor: isDarkMode ? '#0D0D0D' : '#FFFFFF',
          position: 'relative',
          maxWidth: 'none'
        }}
      >
        {/* Header */}
        <Header 
          user={user} 
          setUser={setUser}
          toggleMobileMenu={toggleMobileMenu} 
          isMobileMenuOpen={isMobileMenuOpen} 
        />

        {/* Menu mobile */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          user={user} 
        />
        
        {/* Contenu principal */}
        <main 
          style={{ 
            flex: 1,
            overflow: 'auto',
            backgroundColor: isDarkMode ? '#0D0D0D' : '#FFFFFF',
            width: '100vw',
            minHeight: 'calc(100vh - 6rem)',
            padding: '2rem',
            maxWidth: 'none'
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
                {console.log('Rendu - filteredEvents:', filteredEvents?.length || 0)}
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
          
          {/* Footer avec logo Get Weez */}
          <footer 
            style={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
              padding: '1rem 2rem',
              textAlign: 'center',
              color: isDarkMode ? '#ffffff' : '#333333',
              borderTop: isDarkMode ? '1px solid #333333' : '1px solid #e5e7eb',
              marginTop: 'auto',
              position: 'relative',
              zIndex: 1,
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: 0,
              flexShrink: 0
            }}
          >
            {/* Logo Get Weez */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div 
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  display: 'inline-block',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  marginBottom: '0.5rem'
                }}
              >
                <h1 
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                    fontFamily: 'Blanka, sans-serif',
                    letterSpacing: '0.1em'
                  }}
                >
                  GET WEEZ
                </h1>
              </div>
              <p 
                style={{ 
                  fontSize: '0.875rem', 
                  color: isDarkMode ? '#a0a0a0' : '#666666', 
                  margin: '0.125rem 0',
                  fontWeight: '500'
                }}
              >
                YOUR IA CONCIERGE
              </p>
            </div>
            
            {/* Copyright */}
            <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#666666' : '#999999', margin: 0 }}>
              GET WEEZ - ALL RIGHTS RESERVED
            </p>
          </footer>
        </div>
      </div>
    )
}