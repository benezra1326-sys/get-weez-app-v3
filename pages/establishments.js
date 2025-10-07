import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MapPin, Star, ArrowRight, Utensils } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import FiltersBar from '../components/ui/FiltersBar'
import GliitzLoader from '../components/ui/GliitzLoader'
import { establishments as staticEstablishments } from '../data/marbella-data'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Establishments({ user, setUser }) {
  const router = useRouter()
  const [establishments, setEstablishments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    setEstablishments(staticEstablishments)
    setIsLoading(false)
  }, [])

  const handleReserve = (establishment) => {
    router.push(`/?msg=${encodeURIComponent(`Je souhaite réserver une table chez ${establishment.name}`)}`)
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
          backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Utensils size={40} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            Établissements de Prestige
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90"
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
        <FiltersBar />
      </div>

      {/* GRILLE D'ÉTABLISSEMENTS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="mb-8">
          <p className="text-lg" style={{ 
            fontFamily: 'Poppins, sans-serif',
            color: isDarkMode ? '#E0E0E0' : '#666666'
          }}>
            {establishments.length} établissements trouvés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {establishments.map((establishment) => (
            <div
              key={establishment.id}
              className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => router.push(`/establishment/${establishment.id}`)}
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
                  src={establishment.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'} 
                  alt={establishment.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {establishment.is_vip && (
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)',
                      color: '#0B0B0C'
                    }}
                  >
                    VIP
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 
                    className="text-2xl font-bold flex-1"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                    }}
                  >
                    {establishment.name}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Star size={18} style={{ color: '#C0C0C0', fill: '#C0C0C0' }} />
                    <span 
                      className="font-semibold"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        color: '#C0C0C0'
                      }}
                    >
                      {establishment.rating || '4.8'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm" style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? '#C0C0C0' : '#666666'
                }}>
                  <MapPin size={16} />
                  <span>{establishment.location || 'Marbella'}</span>
                </div>

                <p 
                  className="text-sm mb-4 line-clamp-2"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? '#E0E0E0' : '#666666'
                  }}
                >
                  {establishment.description || establishment.specialties?.[0] || 'Expérience gastronomique unique'}
                </p>

                <div className="flex gap-2 mb-4 flex-wrap">
                  {establishment.specialties?.slice(0, 2).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: isDarkMode ? 'rgba(192,192,192,0.15)' : 'rgba(192,192,192,0.2)',
                        color: isDarkMode ? '#C0C0C0' : '#666666'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReserve(establishment)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,192,192,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span>Réserver</span>
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
