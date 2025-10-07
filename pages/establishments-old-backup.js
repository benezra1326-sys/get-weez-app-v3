import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import EstablishmentList from '../components/establishments/EstablishmentList'
import RestaurantStyleFilter from '../components/establishments/RestaurantStyleFilter'
import CategoryFilter from '../components/establishments/CategoryFilter'
import MobileFilters from '../components/mobile/MobileFilters'
import { EstablishmentSearchBar } from '../components/ui/SearchBar'
import { useToast } from '../components/ui/Toast'
import GliitzLoader from '../components/ui/GliitzLoader'
import { supabase } from '../lib/supabase'
import { establishments as staticEstablishments, restaurantStyles, establishmentStats } from '../data/marbella-data'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Establishments({ user, setUser }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [establishments, setEstablishments] = useState([])
  const [filteredEstablishments, setFilteredEstablishments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()
  const { isDarkMode, isLoaded } = useTheme()

  const loadEstablishments = async () => {
    try {
      setIsLoading(true)
      
      // Utiliser les données statiques directement
      if (staticEstablishments && staticEstablishments.length > 0) {
        setEstablishments(staticEstablishments)
        setFilteredEstablishments(staticEstablishments)
        setIsLoading(false)
      } else {
        // Fallback avec des données de test
        const testEstablishments = [
          {
            id: 1,
            name: "Test Restaurant",
            type: "Restaurant",
            category: "Test",
            description: "Restaurant de test",
            address: "Test Address",
            rating: 4.5,
            sponsored: false,
            zone: "Test Zone",
            ambiance: "Test Ambiance"
          }
        ]
        setEstablishments(testEstablishments)
        setFilteredEstablishments(testEstablishments)
      setIsLoading(false)
      }
      
    } catch (error) {
      // Fallback avec des données statiques
      setEstablishments(staticEstablishments || [])
      setFilteredEstablishments(staticEstablishments || [])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEstablishments()
  }, [])

  // Simplifier temporairement - ne pas attendre le thème
  const isDarkModeSafe = isLoaded ? isDarkMode : false

  // Fonction de recherche et filtrage
  const handleSearch = (query) => {
    setSearchQuery(query)
    filterEstablishments(query, selectedStyle)
  }

  const handleStyleChange = (styleKey) => {
    setSelectedStyle(styleKey)
    filterEstablishments(searchQuery, styleKey)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedStyle(null)
    setSelectedCategory(null)
    setFilteredEstablishments(establishments)
  }

  const filterEstablishments = (query, style) => {
    let filtered = establishments

    // Filtrage par style
    if (style && restaurantStyles[style]) {
      const styleRestaurantIds = restaurantStyles[style].restaurants
      filtered = filtered.filter(establishment =>
        styleRestaurantIds.includes(establishment.id)
      )
    } else if (style === 'luxury') {
      // Filtre spécial pour "luxury" basé sur les tags
      filtered = filtered.filter(establishment =>
        establishment.tags?.includes('luxe') || establishment.price_level >= 4
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
    
    // Scroll vers le chat après la redirection
    setTimeout(() => {
      const chatElement = document.querySelector('.chat-interface, .mobile-chat-container, .chat-area')
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 500)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <style jsx global>{`
        /* Forcer le mode sombre sur toute la page */
        body {
          background-color: ${isDarkModeSafe ? 'var(--gliitz-black)' : 'var(--gliitz-gray-light)'} !important;
        }
      `}</style>
      <style jsx global>{`
        /* Animation pour le gradient */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes sparkle-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-12px) scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
      
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: isDarkModeSafe ? 'var(--gliitz-black)' : 'var(--gliitz-gray-light)',
          overflow: 'visible',
          position: 'relative',
          fontFamily: 'var(--font-family-primary)'
        }}
      >
        {/* Header */}
        <HeaderGliitz 
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
        <main className="container mx-auto px-4 py-6" style={{ overflow: 'visible' }}>
          
          {/* Bannière avec titre et recherche - Améliorée avec sparkles */}
          <div className="mb-6" style={{ position: 'relative', zIndex: 1 }}>
            <div 
              className="relative overflow-hidden rounded-2xl p-6 text-center group card-silver"
                style={{
                  background: 'var(--gradient-silver)',
                  backgroundSize: '400% 400%',
                animation: 'gradientShift 8s ease infinite',
                  boxShadow: 'var(--shadow-glow-strong)'
                }}
              >
                {/* Effet de brillance animé */}
                <div 
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}
                />
                
                {/* Sparkles flottants */}
                <div className="absolute top-4 left-8" style={{ animation: 'sparkle-float 3s ease-in-out infinite' }}>
                  <div className="w-2 h-2 rounded-full bg-yellow-300" style={{ boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)' }} />
                </div>
                <div className="absolute top-8 right-12" style={{ animation: 'sparkle-float 3s ease-in-out infinite 1s' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" style={{ boxShadow: '0 0 6px rgba(250, 204, 21, 0.8)' }} />
                </div>
                <div className="absolute bottom-6 left-16" style={{ animation: 'sparkle-float 3s ease-in-out infinite 2s' }}>
                  <div className="w-1 h-1 rounded-full bg-yellow-200" style={{ boxShadow: '0 0 4px rgba(253, 230, 138, 0.8)' }} />
                </div>
                <div className="absolute bottom-8 right-20" style={{ animation: 'sparkle-float 3s ease-in-out infinite 0.5s' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" style={{ boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)' }} />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <h1 
                  className="text-3xl font-bold mb-3 drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                  style={{ 
                    fontFamily: 'var(--font-family-display)',
                    color: 'var(--gliitz-black)'
                  }}
                >
                    🍽️ Établissements
                  </h1>
                <p 
                  className="text-lg mb-4 drop-shadow-md"
                  style={{ 
                    fontFamily: 'var(--font-family-primary)',
                    color: 'var(--gliitz-black)',
                    opacity: 0.9
                  }}
                >
                    Découvrez les meilleurs endroits de Marbella
                  </p>
                  
                <div className="max-w-2xl mx-auto">
                    <EstablishmentSearchBar 
                      onSearch={handleSearch}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

          {/* Section des filtres - Visible sur tous les écrans */}
          <div className="mb-6 relative" style={{ zIndex: 100000, overflow: 'visible' }}>
            <div 
              className="relative glass rounded-2xl p-6 border transition-all duration-300 hover-glow"
              style={{
                backdropFilter: 'var(--glass-backdrop)',
                borderColor: isDarkModeSafe ? 'var(--glass-border-dark)' : 'var(--glass-border)',
                boxShadow: 'var(--shadow-medium)',
                overflow: 'visible'
              }}
            >
              {/* Effet de grille subtil */}
              <div 
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(192, 192, 192, 0.4) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              
              <h2 
                className="text-xl font-bold mb-4 flex items-center relative z-10" 
                style={{
                  fontFamily: 'var(--font-family-display)',
                  color: isDarkModeSafe ? 'var(--gliitz-silver)' : 'var(--gliitz-black)'
                }}
              >
                <span className="mr-2">🎨</span>
                Filtres par Style
              </h2>
              
              <div className="relative z-10">
                <RestaurantStyleFilter
                  selectedStyle={selectedStyle}
                  onSelectStyle={handleStyleChange}
                />
              </div>
            </div>
          </div>

          {/* Liste des établissements */}
              <EstablishmentList 
                establishments={filteredEstablishments.length > 0 ? filteredEstablishments : establishments} 
                user={user} 
                onReserve={handleReserve}
                onSendMessage={(message) => {
                  router.push(`/?message=${encodeURIComponent(message)}`)
                }}
                isLoading={isLoading}
              />
          
        </main>
      </div>
    </>
  )
}