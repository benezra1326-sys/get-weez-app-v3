import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import EstablishmentList from '../components/establishments/EstablishmentList'
import RestaurantStyleFilter from '../components/establishments/RestaurantStyleFilter'
import { EstablishmentSearchBar } from '../components/ui/SearchBar'
import { useToast } from '../components/ui/Toast'
import { supabase } from '../lib/supabase'
import { establishments as staticEstablishments, restaurantStyles, establishmentStats } from '../data/marbella-data'

export default function Establishments({ user, setUser }) {
  const router = useRouter()
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

  const handleReserve = (establishment) => {
    console.log('Reserve clicked for:', establishment)
    
    // Créer le message de réservation
    const reservationMessage = `Je souhaite réserver une table pour ${establishment.name} (${establishment.type}) situé ${establishment.zone}. Pouvez-vous m'aider avec la réservation ?`
    
    // Rediriger vers la page d'accueil avec le message pré-rempli
    router.push({
      pathname: '/',
      query: { 
        message: reservationMessage,
        establishment: establishment.name
      }
    })
    
    showToast(`Redirection vers le chat pour ${establishment.name}`, 'info')
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
          padding: 0
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
            backgroundColor: 'var(--color-bg-primary)',
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
                    🍽️ Établissements
                  </h1>
                  <p className="text-white/90 text-xl mb-6 drop-shadow-md">
                    Découvrez les meilleurs endroits de Marbella
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

            {/* Filtre par style */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🎨</span>
                Filtres par Style
              </h2>
              <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
                <RestaurantStyleFilter
                  selectedStyle={selectedStyle}
                  onSelectStyle={handleStyleChange}
                />
              </div>
            </div>

            <EstablishmentList 
              establishments={filteredEstablishments.length > 0 ? filteredEstablishments : establishments} 
              user={user} 
              onReserve={handleReserve}
              isLoading={isLoading}
            />
          </main>
      </div>
    </div>
    </>
  )
}