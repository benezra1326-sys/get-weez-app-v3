import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Briefcase, ArrowRight, Sparkles } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import FiltersBar from '../components/ui/FiltersBar'
import GliitzLoader from '../components/ui/GliitzLoader'
import { services as staticServices } from '../data/services-data'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Services({ user, setUser }) {
  const router = useRouter()
  const [services, setServices] = useState([])
  const [displayedServices, setDisplayedServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentSort, setCurrentSort] = useState('rating')
  const { isDarkMode } = useTheme()

  useEffect(() => {
    setServices(staticServices)
    setDisplayedServices(staticServices)
    setIsLoading(false)
  }, [])

  const handleFilterChange = (filter) => {
    setCurrentSort(filter.value)
    let sorted = [...services]
    
    switch(filter.value) {
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'reviews':
        sorted.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
        break
      case 'price-asc':
        sorted.sort((a, b) => {
          const priceA = parseInt(a.price_range?.replace(/[^0-9]/g, '') || '0')
          const priceB = parseInt(b.price_range?.replace(/[^0-9]/g, '') || '0')
          return priceA - priceB
        })
        break
      case 'price-desc':
        sorted.sort((a, b) => {
          const priceA = parseInt(a.price_range?.replace(/[^0-9]/g, '') || '0')
          const priceB = parseInt(b.price_range?.replace(/[^0-9]/g, '') || '0')
          return priceB - priceA
        })
        break
      case 'location':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      default:
        break
    }
    
    setDisplayedServices(sorted)
  }

  const handleRequest = (service) => {
    router.push(`/?msg=${encodeURIComponent(`Je souhaite demander le service ${service.name}`)}`)
  }

  if (isLoading) return <GliitzLoader />

  return (
    <div className="min-h-screen flex" style={{
      background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
    }}>
      <V3Sidebar 
        conversations={[]} 
        onNewChat={() => router.push('/')}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      
      <div className="flex-1 overflow-y-auto">
      {/* HERO BANNER */}
      <section 
        className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={40} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            Services Premium
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90"
            style={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Découvrez nos services de conciergerie haut de gamme
          </p>
        </div>
      </section>

      {/* FILTRES SEULEMENT - PAS DE MAP POUR LES SERVICES */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20 mb-8">
        <div 
          className="p-6 rounded-3xl glass-live"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex-1">
              <FiltersBar onFilterChange={handleFilterChange} currentSort={currentSort} />
            </div>
          </div>
        </div>
      </div>

      {/* GRILLE DES SERVICES - PAS DE MAP */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => router.push(`/product/service/${service.id}`)}
              style={{
                background: isDarkMode 
                  ? 'rgba(26,26,28,0.95)' 
                  : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(192,192,192,0.2)',
                boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(192,192,192,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(192,192,192,0.15)'
              }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {service.is_premium && (
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    style={{
                      background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)',
                      color: '#0B0B0C'
                    }}
                  >
                    <Sparkles size={12} />
                    Premium
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col" style={{ minHeight: '360px' }}>
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {service.name}
                </h3>

                <p 
                  className="text-sm mb-4 line-clamp-3"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? '#E0E0E0' : '#666666'
                  }}
                >
                  {service.description || 'Service de luxe pour une expérience exceptionnelle'}
                </p>

                {service.features && (
                  <div className="mb-4 space-y-2">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          color: isDarkMode ? '#C0C0C0' : '#666666'
                        }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: '#C0C0C0' }}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {service.price_range && (
                  <p 
                    className="text-sm font-semibold mb-4"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      color: '#C0C0C0' 
                    }}
                  >
                    À partir de {service.price_range}
                  </p>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRequest(service)
                  }}
                  className="w-full mt-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.25))' 
                      : 'linear-gradient(135deg, rgba(192, 192, 192, 0.8), rgba(192, 192, 192, 0.95))',
                    color: isDarkMode ? '#C0C0C0' : '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.3)' : 'rgba(192, 192, 192, 0.5)'}`,
                    boxShadow: isDarkMode 
                      ? '0 4px 15px rgba(192, 192, 192, 0.1)' 
                      : '0 4px 15px rgba(192, 192, 192, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 8px 25px rgba(192, 192, 192, 0.2)' 
                      : '0 8px 25px rgba(192, 192, 192, 0.5)'
                    e.currentTarget.style.background = isDarkMode 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.25), rgba(192, 192, 192, 0.35))' 
                      : 'linear-gradient(135deg, rgba(192, 192, 192, 0.9), rgba(192, 192, 192, 1))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = isDarkMode 
                      ? '0 4px 15px rgba(192, 192, 192, 0.1)' 
                      : '0 4px 15px rgba(192, 192, 192, 0.3)'
                    e.currentTarget.style.background = isDarkMode 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.25))' 
                      : 'linear-gradient(135deg, rgba(192, 192, 192, 0.8), rgba(192, 192, 192, 0.95))'
                  }}
                >
                  <span>Demander</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  )
}
