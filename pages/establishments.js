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
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Establishments({ user, setUser }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [establishments, setEstablishments] = useState([])
  const [filteredEstablishments, setFilteredEstablishments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(null)
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
      }
      setIsLoading(false)
      
      // Essayer Supabase en arrière-plan (optionnel)
      try {
        const { data, error } = await supabase
          .from('establishments')
          .select('*')
          .order('sponsored', { ascending: false })

        if (!error && data && data.length > 0) {
          setEstablishments(data)
          setFilteredEstablishments(data)
        }
      } catch (supabaseError) {
        // Supabase non disponible, utilisation des données statiques
      }
      
    } catch (error) {
      // Fallback avec des données statiques
      setEstablishments(staticEstablishments)
      setFilteredEstablishments(staticEstablishments)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEstablishments()
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
      <style jsx global>{`
        /* Ensure grid display */
        .grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          gap: 1rem !important;
        }
        
        /* Ensure cards are visible - Mobile optimized */
        .establishment-card {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 100% !important;
          min-height: 250px !important; /* Réduit pour mobile */
        }
        
        /* Mobile grid optimizations */
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
            gap: 0.75rem !important;
          }
        }
        
        /* Force visibility of all elements */
        div {
          visibility: visible !important;
        }
      `}</style>
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
            maxWidth: 'none',
            color: isDarkMode ? '#F9FAFB' : '#1F2937',
            position: 'relative',
            zIndex: 1
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
                <div className="relative z-10 text-center">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    🍽️ Établissements
                  </h1>
                  <p className="text-white/90 text-lg lg:text-xl mb-6 drop-shadow-md">
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
              <h2 
                className="text-2xl font-bold mb-4 flex items-center"
                style={{ color: isDarkMode ? '#F9FAFB' : '#1F2937' }}
              >
                <span className="mr-3">🎨</span>
                Filtres par Style
              </h2>
              <div 
                className="backdrop-blur-md rounded-2xl p-6 border"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)',
                  boxShadow: isDarkMode ? '0 8px 32px rgba(139, 92, 246, 0.3)' : '0 8px 32px rgba(139, 92, 246, 0.1)'
                }}
              >
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
              onSendMessage={(message) => {
                // Rediriger vers la page d'accueil avec le message
                router.push(`/?message=${encodeURIComponent(message)}`)
              }}
              isLoading={isLoading}
            />
          </main>
          
          {/* Footer avec logo Get Weez */}
          <footer 
            style={{ 
              backgroundColor: isDarkMode ? '#1F2937' : '#f8f9fa',
              padding: '1rem 2rem',
              textAlign: 'center',
              color: isDarkMode ? '#F9FAFB' : '#333333',
              borderTop: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
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
                  color: isDarkMode ? '#9CA3AF' : '#666666', 
                  margin: '0.125rem 0',
                  fontWeight: '500'
                }}
              >
                YOUR IA CONCIERGE
              </p>
            </div>
            
            {/* Copyright */}
            <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#6B7280' : '#999999', margin: 0 }}>
              GET WEEZ - ALL RIGHTS RESERVED
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}