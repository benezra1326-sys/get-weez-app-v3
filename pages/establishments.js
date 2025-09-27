import { useState, useEffect } from 'react'
import Header from '../components/layout/header'
import Sidebar from '../components/layout/sidebar'
import MobileMenu from '../components/layout/MobileMenu'
import EstablishmentList from '../components/establishments/EstablishmentList'
import RestaurantStyleFilter from '../components/establishments/RestaurantStyleFilter'
import { EstablishmentSearchBar } from '../components/ui/SearchBar'
import { useToast } from '../components/ui/Toast'
import { supabase } from '../lib/supabase'
import { establishments as staticEstablishments, restaurantStyles, establishmentStats } from '../data/marbella-data'

export default function Establishments({ user, setUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [establishments, setEstablishments] = useState([])
  const [filteredEstablishments, setFilteredEstablishments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadEstablishments()
  }, [])

  const loadEstablishments = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .order('sponsored', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des établissements:', error)
        showToast('Erreur lors du chargement des établissements', 'error')
        // Fallback avec des données statiques enrichies
        setEstablishments(staticEstablishments)
        setFilteredEstablishments(staticEstablishments)
        setIsLoading(false)
        return
      }

      setEstablishments(data || [])
      setFilteredEstablishments(data || [])
    } catch (error) {
      console.error('Erreur:', error)
      // Fallback avec des données statiques
      setEstablishments(staticEstablishments)
      setFilteredEstablishments(staticEstablishments)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de recherche et filtrage
  const handleSearch = (query) => {
    setSearchQuery(query)
    filterEstablishments(query, selectedStyle)
  }

  const handleStyleChange = (styleKey) => {
    setSelectedStyle(styleKey)
    filterEstablishments(searchQuery, styleKey)
  }

  const filterEstablishments = (query, style) => {
    let filtered = establishments

    // Filtrage par style
    if (style && restaurantStyles[style]) {
      const styleRestaurantIds = restaurantStyles[style].restaurants
      filtered = filtered.filter(establishment => 
        styleRestaurantIds.includes(establishment.id)
      )
    }

    // Filtrage par recherche
    if (query && query.trim()) {
      filtered = filtered.filter(establishment =>
        establishment.name.toLowerCase().includes(query.toLowerCase()) ||
        establishment.description.toLowerCase().includes(query.toLowerCase()) ||
        establishment.address?.toLowerCase().includes(query.toLowerCase()) ||
        establishment.category?.toLowerCase().includes(query.toLowerCase()) ||
        establishment.specialties?.some(specialty => 
          specialty.toLowerCase().includes(query.toLowerCase())
        )
      )
    }

    setFilteredEstablishments(filtered)
  }

  // Fonction de recherche
  const handleSearchOld = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredEstablishments(establishments)
      return
    }

    const filtered = establishments.filter(establishment =>
      establishment.name.toLowerCase().includes(query.toLowerCase()) ||
      establishment.description.toLowerCase().includes(query.toLowerCase()) ||
      establishment.location.toLowerCase().includes(query.toLowerCase()) ||
      establishment.type.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredEstablishments(filtered)
  }
          {
            "id": 1,
            "name": "Nikki Beach Marbella",
            "type": "plage",
            "description": "Beach club emblématique connu pour ses fêtes exclusives en bord de mer.",
            "location": "Elviria, Marbella",
            "instagram_url": "https://instagram.com/nikkibeachmarbella",
            "website_url": "https://www.nikkibeach.com/marbella",
            "sponsored": true,
            "rating": 4.8,
            "zone": "Elviria",
            "ambiance": "Exclusif",
            "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
          },
          {
            "id": 2,
            "name": "Puente Romano Beach Resort",
            "type": "hôtel",
            "description": "Resort de luxe avec restaurants étoilés, spa et accès direct à la plage.",
            "location": "Golden Mile, Marbella",
            "instagram_url": "https://instagram.com/puenteromanoresort",
            "website_url": "https://www.puenteromano.com",
            "sponsored": true,
            "rating": 4.9,
            "zone": "Golden Mile",
            "ambiance": "Luxe",
            "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
          },
          {
            "id": 3,
            "name": "La Sala by the Sea",
            "type": "plage",
            "description": "Ambiance chic et décontractée avec DJ sets et cocktails exotiques.",
            "location": "Puerto Banús, Marbella",
            "instagram_url": "https://instagram.com/lasalabythesea",
            "website_url": "https://www.lasalabythesea.com",
            "sponsored": false,
            "rating": 4.6,
            "zone": "Puerto Banús",
            "ambiance": "Chic",
            "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
          },
          {
            "id": 4,
            "name": "Ocean Club Marbella",
            "type": "club",
            "description": "Célèbre pour ses piscines XXL, ses DJs et ses soirées champagne.",
            "location": "Puerto Banús, Marbella",
            "instagram_url": "https://instagram.com/oceanclubmarbella",
            "website_url": "https://www.oceanclub.es",
            "sponsored": true,
            "rating": 4.7,
            "zone": "Puerto Banús",
            "ambiance": "Festif",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
          },
          {
            "id": 5,
            "name": "Breathe Marbella",
            "type": "restaurant",
            "description": "Concept éco-chic avec rooftop, gastronomie méditerranéenne et cocktails.",
            "location": "Puerto Banús, Marbella",
            "instagram_url": "https://instagram.com/breathemarbella",
            "website_url": "https://www.breathemarbella.com",
            "sponsored": false,
            "rating": 4.5,
            "zone": "Puerto Banús",
            "ambiance": "Éco-chic",
            "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
          },
          {
            "id": 6,
            "name": "Mamzel Marbella",
            "type": "restaurant",
            "description": "Dîner-spectacle glamour avec ambiance festive et gastronomie internationale.",
            "location": "Sierra Blanca, Marbella",
            "instagram_url": "https://instagram.com/mamzelmarbella",
            "website_url": "https://www.mamzelmarbella.com",
            "sponsored": true,
            "rating": 4.8,
            "zone": "Sierra Blanca",
            "ambiance": "Glamour",
            "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
          },
          {
            "id": 7,
            "name": "El Chiringuito Marbella",
            "type": "restaurant",
            "description": "Cuisine méditerranéenne raffinée les pieds dans le sable.",
            "location": "Puente Romano Beach Resort",
            "instagram_url": "https://instagram.com/elchiringuitomarbella",
            "website_url": "https://www.elchiringuitomarbella.com",
            "sponsored": false,
            "rating": 4.4,
            "zone": "Golden Mile",
            "ambiance": "Décontracté",
            "image_url": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop"
          },
          {
            "id": 8,
            "name": "Olivia Valere",
            "type": "club",
            "description": "Discothèque mythique de Marbella, fréquentée par célébrités et jet-set.",
            "location": "Golden Mile, Marbella",
            "instagram_url": "https://instagram.com/oliviavalereclub",
            "website_url": "https://www.oliviavalere.com",
            "sponsored": true,
            "rating": 4.9,
            "zone": "Golden Mile",
            "ambiance": "Exclusif",
            "image_url": "https://images.unsplash.com/photo-1571266028243-e68f9520bb97?w=800&h=600&fit=crop"
          },
          {
            "id": 9,
            "name": "Ambrosía Gourmet Market",
            "type": "restaurant",
            "description": "Marché gastronomique chic avec une sélection de cuisines du monde.",
            "location": "Nueva Andalucía, Marbella",
            "instagram_url": "https://instagram.com/ambrosiamarket",
            "website_url": "https://www.ambrosiamarketmarbella.com",
            "sponsored": false,
            "rating": 4.3,
            "zone": "Nueva Andalucía",
            "ambiance": "Gourmet",
            "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
          },
          {
            "id": 10,
            "name": "Trocadero Playa",
            "type": "plage",
            "description": "Beach club élégant avec service haut de gamme et ambiance cosy.",
            "location": "Playa de Santa Petronila, Marbella",
            "instagram_url": "https://instagram.com/trocaderoplaya",
            "website_url": "https://www.trocaderoplaya.com",
            "sponsored": false,
            "rating": 4.6,
            "zone": "Santa Petronila",
            "ambiance": "Élégant",
            "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
          }
        ])
        return
      }

      setEstablishments(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Fonction de recherche
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredEstablishments(establishments)
      return
    }

    const filtered = establishments.filter(establishment =>
      establishment.name.toLowerCase().includes(query.toLowerCase()) ||
      establishment.description.toLowerCase().includes(query.toLowerCase()) ||
      establishment.location.toLowerCase().includes(query.toLowerCase()) ||
      establishment.type.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredEstablishments(filtered)
  }

  const handleReserve = (establishment) => {
    console.log('Reserve clicked for:', establishment)
    showToast(`Réservation pour ${establishment.name}`, 'success')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
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
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            {/* Header avec recherche */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gradient mb-4">Établissements</h1>
              <p className="text-gray-400 mb-6">Découvrez les meilleurs endroits de Marbella</p>
              
              <EstablishmentSearchBar 
                onSearch={handleSearch}
                className="max-w-2xl"
              />
            </div>

            <EstablishmentList 
              establishments={filteredEstablishments.length > 0 ? filteredEstablishments : establishments} 
              user={user} 
              onReserve={handleReserve}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  )
}