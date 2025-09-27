import { useState, useEffect } from 'react'
import Header from '../components/layout/header'
import Sidebar from '../components/layout/sidebar'
import MobileMenu from '../components/layout/MobileMenu'
import EventList from '../components/events/EventList'
import { supabase } from '../lib/supabase'

export default function Events({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [events, setEvents] = useState([])

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })

      if (error) {
        console.error('Erreur lors du chargement des événements:', error)
        // Fallback avec des données statiques
        setEvents([
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
        ])
        return
      }

      setEvents(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    }
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
        height: '100vh', 
        margin: 0, 
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          width: '100vw',
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
        
        <div 
          style={{ 
            display: 'flex', 
            flex: 1, 
            overflow: 'hidden', 
            width: '100vw',
            height: 'calc(100vh - 8rem)'
          }}
        >
          <div className="hidden lg:block">
            <Sidebar user={user} />
          </div>
          
          <main 
            style={{ 
              flex: 1,
              overflowY: 'auto',
              backgroundColor: 'var(--color-bg-primary)',
              width: 'calc(100vw - 320px)',
              height: '100%',
              marginLeft: '320px',
              padding: 'var(--spacing-xl)'
            }}
          >
            <EventList 
              events={events} 
              user={user} 
              onBecomeMember={handleBecomeMember}
            />
          </main>
        </div>
      </div>
    </div>
  )
}