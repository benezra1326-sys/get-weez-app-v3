import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MessageCircle, Sparkles } from 'lucide-react'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import FiltersBar from '../components/ui/FiltersBar'
import GliitzLoader from '../components/ui/GliitzLoader'
import { services as staticServices } from '../data/services-data'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Services({ user, setUser }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    setServices(staticServices)
    setIsLoading(false)
  }, [])

  const handleRequest = (service) => {
    router.push({
      pathname: '/chat',
      query: { 
        message: `Je souhaite demander le service: ${service.name}`
      }
    })
  }

  if (isLoading) return <GliitzLoader />

  return (
    <div className="min-h-screen" style={{ background: isDarkMode ? '#0B0B0C' : '#F8F8F8' }}>
      <HeaderGliitz user={user} setUser={setUser} toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMobileMenuOpen={isMobileMenuOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} user={user} />

      {/* HERO BANNER */}
      <section 
        className="relative w-full h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1920&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            Services Premium 🌟
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90"
            style={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Conciergerie de luxe à votre service
          </p>
        </div>
      </section>

      {/* FILTRES */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <FiltersBar />
      </div>

      {/* GRILLE DE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group card-gliitz rounded-3xl overflow-hidden hover-lift-refined cursor-pointer"
              onClick={() => router.push(`/service/${service.id}`)}
              style={{
                background: isDarkMode ? 'rgba(26,26,28,0.95)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(192,192,192,0.2)',
                boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image_url || 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600'} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                      boxShadow: '0 4px 12px rgba(192,192,192,0.4)'
                    }}
                  >
                    {service.category || 'Service'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {service.name}
                </h3>
                
                <p 
                  className="text-sm mb-4 line-clamp-2"
                  style={{ 
                    color: isDarkMode ? '#C0C0C0' : '#666666',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {service.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRequest(service)
                  }}
                  className="btn-gliitz-primary w-full flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} />
                  <span>Demander</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

