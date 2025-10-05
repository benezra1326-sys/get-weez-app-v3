import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import ServiceCard from '../components/services/ServiceCard'
import ServiceCategoryFilter from '../components/services/ServiceCategoryFilter'
import { ServiceSearchBar } from '../components/ui/SearchBar'
import { useToast } from '../components/ui/Toast'
import GliitzLoader from '../components/ui/GliitzLoader'
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
        service.specialties?.some(specialty =>
          specialty.toLowerCase().includes(query.toLowerCase())
        )
      )
    }

    setFilteredServices(filtered)
  }

  const handleBook = (service) => {
    console.log('Book clicked for:', service)
    
    // Créer le message de réservation
    const bookingMessage = `Je souhaite réserver le service ${service.name} (${service.category}). Pouvez-vous m'aider avec la réservation ?`
    
    // Rediriger vers la page d'accueil avec le message pré-rempli
    router.push({
      pathname: '/',
      query: { 
        message: bookingMessage,
        service: service.name
      }
    })
    
    showToast(`Redirection vers le chat pour ${service.name}`, 'info')
    
    // Scroll vers le chat après la redirection
    setTimeout(() => {
      const chatElement = document.querySelector('.chat-interface, .mobile-chat-container, .chat-area')
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 500)
  }

  const handleSendMessage = (message) => {
    // Rediriger vers l'accueil avec le message
    router.push({
      pathname: '/',
      query: { message: encodeURIComponent(message) }
    })
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <style jsx global>{`
        /* Forcer le mode sombre sur toute la page */
        body {
          background-color: ${isDarkModeSafe ? '#0a0a0f' : '#f9fafb'} !important;
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
          backgroundColor: isDarkModeSafe ? '#0a0a0f' : '#f9fafb'
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
        <main className="container mx-auto px-4 py-6">
          
          {/* Bannière avec titre et recherche - Améliorée avec sparkles */}
          <div className="mb-6">
            <div 
              className="relative overflow-hidden rounded-2xl p-6 text-center group"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 8s ease infinite',
                boxShadow: '0 12px 48px rgba(168, 85, 247, 0.4)'
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
                <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
                  🛍️ Services
                </h1>
                <p className="text-white/90 text-lg mb-4 drop-shadow-md">
                  Découvrez nos services premium à Marbella
                </p>
                
                <div className="max-w-2xl mx-auto">
                  <ServiceSearchBar 
                    onSearch={handleSearch}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section des filtres - Améliorée */}
          <div className="mb-6 relative z-50">
            <div 
              className="relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl"
              style={{
                background: isDarkModeSafe 
                  ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderColor: isDarkModeSafe ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.2)',
                boxShadow: isDarkModeSafe 
                  ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
                  : '0 8px 32px rgba(168, 85, 247, 0.15)'
              }}
            >
              {/* Effet de grille subtil */}
              <div 
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              
              <h2 className="text-xl font-bold mb-4 flex items-center relative z-10" style={{
                color: isDarkModeSafe ? '#ffffff' : '#1f2937'
              }}>
              <span className="mr-2">🏷️</span>
              Filtres par Catégorie
            </h2>
              
              <div className="relative z-10">
              <ServiceCategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />
              </div>
            </div>
          </div>

          {/* Liste des services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredServices.length > 0 ? (
              filteredServices.map(service => (
                <ServiceCard 
                  key={service.id}
                  service={service} 
                  user={user} 
                  onReserve={handleBook}
                  onSendMessage={handleSendMessage}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-lg text-gray-600">Aucun service trouvé</p>
                  <p className="text-sm mt-2 text-gray-500">Veuillez réessayer plus tard</p>
                </div>
              </div>
            )}
          </div>
          
        </main>
      </div>
    </>
  )
}