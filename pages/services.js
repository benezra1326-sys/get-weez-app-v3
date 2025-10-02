import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import ServiceCard from '../components/services/ServiceCard'
import ServiceCategoryFilter from '../components/services/ServiceCategoryFilter'
import { ServiceSearchBar } from '../components/ui/SearchBar'
import { useToast } from '../components/ui/Toast'
import { services as staticServices, serviceCategories } from '../data/services-data'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Services({ user, setUser }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()
  const { isDarkMode, isLoaded } = useTheme()

  const loadServices = async () => {
    try {
      setIsLoading(true)
      // Pour l'instant, on utilise les données statiques
      // Plus tard, on pourra intégrer avec Supabase
      setServices(staticServices)
      setFilteredServices(staticServices)
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error)
      showToast('Erreur lors du chargement des services', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  // Simplifier temporairement - ne pas attendre le thème
  const isDarkModeSafe = isLoaded ? isDarkMode : false

  // Fonction de recherche et filtrage
  const handleSearch = (query) => {
    setSearchQuery(query)
    filterServices(query, selectedCategory)
  }

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey)
    filterServices(searchQuery, categoryKey)
  }

  const filterServices = (query, category) => {
    let filtered = services

    // Filtrage par catégorie
    if (category && serviceCategories[category]) {
      const categoryServiceIds = serviceCategories[category].services
      filtered = filtered.filter(service =>
        categoryServiceIds.includes(service.id)
      )
    }

    // Filtrage par recherche
    if (query && query.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()) ||
        service.category?.toLowerCase().includes(query.toLowerCase()) ||
        service.features?.some(feature =>
          feature.toLowerCase().includes(query.toLowerCase())
        )
      )
    }

    setFilteredServices(filtered)
  }

  const handleServiceRequest = (service) => {
    console.log('Service request clicked for:', service)
    
    // TODO: Afficher détails du service au lieu de rediriger
    showToast(`Service ${service.name} sélectionné`, 'info')
    
    // CORRECTION: Ne plus rediriger automatiquement vers l'accueil
    // Garder l'utilisateur sur la page services
    
    // Si nécessaire, router.push vers page dédiée service :
    // router.push(`/service/${service.id}`)
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
          backgroundColor: isDarkModeSafe ? '#0D0D0D' : '#FFFFFF',
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
                <div className="relative z-10 text-center">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    🛎️ Services
                  </h1>
                  <p className="text-white/90 text-lg lg:text-xl mb-6 drop-shadow-md">
                    Découvrez nos services premium à Marbella
                  </p>
                  
                  <div className="max-w-2xl mx-auto w-full">
                    <ServiceSearchBar 
                      onSearch={handleSearch}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtre par catégorie - AMÉLIORÉ POUR MOBILE */}
            <div 
              className="mb-8 filters-section" 
              style={{ 
                position: 'relative', 
                zIndex: 10,
                backgroundColor: isDarkModeSafe ? 'rgba(31, 41, 55, 0.98) !important' : 'rgba(255, 255, 255, 0.95) !important',
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${isDarkModeSafe ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'}`,
                backdropFilter: 'blur(20px)',
                boxShadow: isDarkModeSafe 
                  ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
            >
              <h2 
                className="text-2xl font-bold mb-4 flex items-center"
                style={{ color: isDarkModeSafe ? '#FFFFFF !important' : '#1F2937 !important' }}
              >
                <span className="mr-3">🏷️</span>
                Filtres par Catégorie
              </h2>
              <div 
                className="backdrop-blur-md rounded-2xl p-6 border"
                style={{ 
                  backgroundColor: isDarkModeSafe ? 'rgba(31, 41, 55, 0.98) !important' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: isDarkModeSafe ? 'rgba(75, 85, 99, 0.5) !important' : 'rgba(139, 92, 246, 0.5)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3) !important',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <ServiceCategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategoryChange}
                />
              </div>
            </div>

            {/* Liste des services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 establishments-list" style={{ position: 'relative', zIndex: 1 }}>
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  user={user}
                  onRequest={handleServiceRequest}
                  onSendMessage={(message) => {
                    // Rediriger vers la page d'accueil avec le message
                    router.push(`/?message=${encodeURIComponent(message)}`)
                  }}
                />
              ))}
            </div>

            {filteredServices.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: isDarkMode ? '#F9FAFB' : '#1F2937' }}
                >
                  Aucun service trouvé
                </h3>
                <p style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
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
    )
}
