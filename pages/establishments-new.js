import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MessageCircle, MapPin, Star } from 'lucide-react'
import HeaderGliitz from '../components/layout/HeaderGliitz'
import MobileMenu from '../components/layout/MobileMenu'
import FiltersBar from '../components/ui/FiltersBar'
import GliitzLoader from '../components/ui/GliitzLoader'
import { establishments as staticEstablishments } from '../data/marbella-data'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Establishments({ user, setUser }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [establishments, setEstablishments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    setEstablishments(staticEstablishments)
    setIsLoading(false)
  }, [])

  const handleReserve = (establishment) => {
    router.push({
      pathname: '/chat',
      query: { 
        message: `Je souhaite réserver une table chez ${establishment.name}`
      }
    })
  }

  if (isLoading) return <GliitzLoader />

  return (
    <div className="min-h-screen" style={{ background: isDarkMode ? '#0B0B0C' : '#F8F8F8' }}>
      <HeaderGliitz user={user} setUser={setUser} toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isMobileMenuOpen={isMobileMenuOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} user={user} />

      {/* HERO BANNER GLIITZ */}
      <section 
        className="relative w-full h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90)',
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
            Établissements de Prestige ✨
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 mb-8"
            style={{
              fontFamily: 'Poppins, sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Découvrez les meilleurs restaurants et bars de Marbella
          </p>
        </div>
      </section>

      {/* FILTRES */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <FiltersBar />
      </div>

      {/* GRILLE D'ÉTABLISSEMENTS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {establishments.map((establishment) => (
            <div
              key={establishment.id}
              className="group card-gliitz rounded-3xl overflow-hidden hover-lift-refined cursor-pointer"
              onClick={() => router.push(`/establishment/${establishment.id}`)}
              style={{
                background: isDarkMode 
                  ? 'rgba(26,26,28,0.95)' 
                  : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(192,192,192,0.2)',
                boxShadow: '0 8px 32px rgba(192,192,192,0.15)'
              }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={establishment.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'} 
                  alt={establishment.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Badge catégorie */}
                <div className="absolute top-4 left-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                      boxShadow: '0 4px 12px rgba(192,192,192,0.4)'
                    }}
                  >
                    {establishment.type || 'Restaurant'}
                  </span>
                </div>

                {/* Note */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <span className="text-white text-sm font-bold">{establishment.rating || '4.5'}</span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                  }}
                >
                  {establishment.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: isDarkMode ? '#E0E0E0' : '#666666' }}>
                  <MapPin size={16} />
                  <span>{establishment.address || 'Marbella'}</span>
                </div>

                <p 
                  className="text-sm mb-4 line-clamp-2"
                  style={{ 
                    color: isDarkMode ? '#C0C0C0' : '#666666',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {establishment.description || 'Un établissement d\'exception'}
                </p>

                {/* Bouton Réserver */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReserve(establishment)
                  }}
                  className="btn-gliitz-primary w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span>Réserver</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

