import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/layout/header'
import MobileMenu from '../components/layout/MobileMenu'
import ServiceCard from '../components/services/ServiceCard'
import ServiceCategoryFilter from '../components/services/ServiceCategoryFilter'
import { ServiceSearchBar } from '../components/ui/SearchBar'
import { useToast } from '../components/ui/Toast'
import { services as staticServices, serviceCategories } from '../data/services-data'

export default function Services({ user, setUser }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setIsLoading(true)
      // Pour l'instant, on utilise les données statiques
      // Plus tard, on pourra intégrer avec Supabase
      setServices(staticServices)
      setFilteredServices(staticServices)
    } catch (error) {
      console.error('Erreur:', error)
      setServices(staticServices)
      setFilteredServices(staticServices)
    } finally {
      setIsLoading(false)
    }
  }

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
      filtered = filtered.filter(service =>
        service.category === category
      )
    }

    // Filtrage par recherche
    if (query && query.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()) ||
        service.category.toLowerCase().includes(query.toLowerCase())
      )
    }

    setFilteredServices(filtered)
  }

  const handleReserve = (service) => {
    console.log('Reserve clicked for:', service)
    
    // Créer le message de réservation
    const reservationMessage = `Je souhaite réserver le service "${service.name}" (${service.category}). Pouvez-vous m'aider avec la réservation ?`
    
    // Rediriger vers la page d'accueil avec le message pré-rempli
    router.push({
      pathname: '/',
      query: { 
        message: reservationMessage,
        service: service.name
      }
    })
    
    showToast(`Redirection vers le chat pour ${service.name}`, 'info')
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
                    ⭐ Services Premium
                  </h1>
                  <p className="text-white/90 text-xl mb-6 drop-shadow-md">
                    Découvrez nos services de luxe exclusifs à Marbella
                  </p>
                  
                  <div className="max-w-2xl">
                    <ServiceSearchBar 
                      onSearch={handleSearch}
                      className="max-w-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtre par catégorie */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🎨</span>
                Filtres par Catégorie
              </h2>
              <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
                <ServiceCategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategoryChange}
                />
              </div>
            </div>

            {/* Liste des services */}
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredServices.map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      user={user} 
                      onReserve={handleReserve}
                    />
                  ))}
                </div>
              )}
              
              {filteredServices.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun service trouvé</h3>
                  <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
