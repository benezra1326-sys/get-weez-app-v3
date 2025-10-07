import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Building, Briefcase, Star, MapPin, ArrowRight } from 'lucide-react'
import V3Sidebar from '../components/layout/V3Sidebar'
import { establishments as staticEstablishments } from '../data/marbella-data'
import { services as staticServices } from '../data/services-data'
import { useTheme } from '../contexts/ThemeContextSimple'

export default function Partenaires() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [establishments] = useState(staticEstablishments || [])
  const [services] = useState(staticServices || [])
  const [activeTab, setActiveTab] = useState('all') // all, establishments, services

  const filteredItems = () => {
    if (activeTab === 'establishments') return establishments.map(e => ({ ...e, type: 'establishment' }))
    if (activeTab === 'services') return services.map(s => ({ ...s, type: 'service' }))
    return [
      ...establishments.map(e => ({ ...e, type: 'establishment' })),
      ...services.map(s => ({ ...s, type: 'service' }))
    ]
  }

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
            backgroundImage: 'url(https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=90)',
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
              Nos Partenaires Premium
            </h1>
            <p 
              className="text-xl md:text-2xl text-white/90"
              style={{
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              Découvrez tous nos établissements et services exclusifs
            </p>
          </div>
        </section>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex gap-4 mb-8 justify-center">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'establishments', label: 'Établissements' },
              { id: 'services', label: 'Services' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: activeTab === tab.id
                    ? (isDarkMode ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 0, 0, 0.08)')
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                  color: activeTab === tab.id
                    ? (isDarkMode ? '#D4AF37' : '#0B0B0C')
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'),
                  border: `1px solid ${activeTab === tab.id 
                    ? (isDarkMode ? 'rgba(212, 175, 55, 0.3)' : 'rgba(0, 0, 0, 0.15)')
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)')
                  }`,
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-lg mb-8" style={{ 
            fontFamily: 'Poppins, sans-serif',
            color: isDarkMode ? '#E0E0E0' : '#666666'
          }}>
            {filteredItems().length} partenaire{filteredItems().length > 1 ? 's' : ''}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems().map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
                onClick={() => {
                  if (item.type === 'establishment') {
                    router.push(`/establishment/${item.id}`)
                  } else {
                    router.push(`/service/${item.id}`)
                  }
                }}
                style={{
                  background: isDarkMode 
                    ? 'rgba(26,26,28,0.95)' 
                    : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  border: isDarkMode ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = isDarkMode 
                    ? '0 12px 40px rgba(212, 175, 55, 0.2)' 
                    : '0 12px 40px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = isDarkMode 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
              >
                {/* Type Badge */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold" style={{
                  background: item.type === 'establishment' 
                    ? 'rgba(212, 175, 55, 0.2)' 
                    : 'rgba(100, 100, 255, 0.2)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  border: `1px solid ${item.type === 'establishment' ? 'rgba(212, 175, 55, 0.4)' : 'rgba(100, 100, 255, 0.4)'}`
                }}>
                  {item.type === 'establishment' ? <Building size={12} className="inline mr-1" /> : <Briefcase size={12} className="inline mr-1" />}
                  {item.type === 'establishment' ? 'Établissement' : 'Service'}
                </div>

                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
                      {item.name}
                    </h3>
                    {item.rating && (
                      <div className="flex items-center gap-1 ml-2">
                        <Star size={18} style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                        <span 
                          className="font-semibold"
                          style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            color: '#D4AF37'
                          }}
                        >
                          {item.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {item.location && (
                    <div className="flex items-center gap-2 mb-4 text-sm" style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#666666'
                    }}>
                      <MapPin size={16} />
                      <span>{item.location || 'Marbella'}</span>
                    </div>
                  )}

                  <p 
                    className="text-sm mb-4 line-clamp-2"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: isDarkMode ? '#E0E0E0' : '#666666'
                    }}
                  >
                    {item.description || item.specialties?.[0] || 'Expérience premium'}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/?msg=${encodeURIComponent(`Je souhaite ${item.type === 'establishment' ? 'réserver une table chez' : 'demander le service'} ${item.name}`)}`)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #1a1a1a, #2c2c2c)'
                        : 'linear-gradient(135deg, #0B0B0C, #1a1a1a)',
                      color: 'white',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <span>{item.type === 'establishment' ? 'Réserver' : 'Demander'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

