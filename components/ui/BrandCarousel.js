import { memo, useRef, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const BrandCarousel = memo(() => {
  const { isDarkMode } = useTheme()

  const brands = [
    { name: 'Nikki Beach', logo: '🏖️' },
    { name: 'Puente Romano', logo: '🎾' },
    { name: 'Nobu Marbella', logo: '🍽️' },
    { name: 'La Sala', logo: '🍴' },
    { name: 'Buddha Beach', logo: '🌅' },
    { name: 'Mosh Beach', logo: '🎉' },
    { name: 'Ocean Club', logo: '⛵' },
    { name: 'Finca Cortesin', logo: '⛳' },
    { name: 'Villa Tiberio', logo: '🍷' },
    { name: 'Marbella Club', logo: '🏨' },
    { name: 'El Lago', logo: '🦢' },
    { name: 'Takara Spa', logo: '💆' }
  ]

  return (
    <div className="w-full py-8 lg:py-16" style={{ backgroundColor: isDarkMode ? '#0D0D0D' : '#FFFFFF' }}>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
          will-change: transform;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        .animate-scroll:active {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="w-full px-0">
        {/* En-tête */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              fontWeight: 600,
              color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
            }}
          >
            Ils nous font confiance 🤝
          </h2>
          <p 
            className="text-lg"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              color: isDarkMode ? '#E0E0E0' : '#666666'
            }}
          >
            Plus de 500+ partenaires premium nous font confiance
          </p>
        </div>
        
        {/* Grille fixe pour mobile, carrousel pour desktop */}
        <div className="lg:hidden grid grid-cols-3 gap-4">
          {brands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <span className="text-3xl mb-1">{brand.logo}</span>
              <span className={`text-xs font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* Carrousel animé pour desktop - PLEINE LARGEUR */}
        <div className="hidden lg:block relative overflow-hidden w-full">
          <div className="flex gap-6 lg:gap-12 animate-scroll">
            {[...brands, ...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 flex flex-col items-center justify-center p-4 lg:p-6 rounded-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                style={{
                  minWidth: '140px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <span className="text-4xl lg:text-5xl mb-2">{brand.logo}</span>
                <span className={`text-xs lg:text-sm font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

BrandCarousel.displayName = 'BrandCarousel'

// Composant Destinations
export const DestinationsSection = memo(() => {
  const { isDarkMode } = useTheme()
  
  // Import Sparkles pour les animations
  const Sparkles = ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  )
  
  const destinations = [
    {
      id: 1,
      name: 'Marbella',
      status: 'active',
      tagline: 'Disponible maintenant',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
      gradient: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
    },
    {
      id: 2,
      name: 'Mykonos',
      status: 'coming-soon',
      tagline: 'Bientôt disponible',
      image: 'https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=800',
      gradient: 'linear-gradient(135deg, #D0D0D0, #A0A0A0)'
    },
    {
      id: 3,
      name: 'Ibiza',
      status: 'coming-soon',
      tagline: 'Bientôt disponible',
      image: 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=800',
      gradient: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)'
    },
    {
      id: 4,
      name: 'Saint-Tropez',
      status: 'coming-soon',
      tagline: 'Bientôt disponible',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      gradient: 'linear-gradient(135deg, #D5D5D5, #B0B0B0)'
    },
    {
      id: 5,
      name: 'Marrakech',
      status: 'coming-soon',
      tagline: 'Bientôt disponible',
      image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
      gradient: 'linear-gradient(135deg, #E8E8E8, #C8C8C8)'
    }
  ]

  return (
    <div className="w-full py-16 relative overflow-hidden" style={{ 
      background: isDarkMode 
        ? 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)'
        : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #FFFFFF 100%)'
    }}>
      {/* Effet de particules en arrière-plan argenté */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl animate-pulse" style={{ background: '#C0C0C0', animationDuration: '4s' }} />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ background: '#E0E0E0', animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full blur-2xl animate-pulse" style={{ background: '#A0A0A0', animationDuration: '6s', animationDelay: '2s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles 
              className="h-8 w-8 animate-pulse" 
              style={{ 
                color: '#C0C0C0',
                filter: 'drop-shadow(0 0 8px rgba(192, 192, 192, 0.6))',
                background: 'transparent'
              }}
            />
            <h2 
              className="text-4xl font-bold"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: 600,
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
              }}
            >
              Gliitz, Anytime, Everywhere 🌍
            </h2>
            <Sparkles 
              className="h-8 w-8 animate-pulse" 
              style={{ 
                color: '#C0C0C0',
                animationDelay: '0.5s',
                filter: 'drop-shadow(0 0 8px rgba(192, 192, 192, 0.6))',
                background: 'transparent'
              }}
            />
          </div>
          <p 
            className="text-xl"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              color: isDarkMode ? '#E0E0E0' : '#666666'
            }}
          >
            Votre conciergerie IA de luxe s'étend dans le monde entier
          </p>
        </div>

        {/* Mobile : Grille de toutes les destinations en petit */}
        <div className="lg:hidden px-4">
          <div className="grid grid-cols-2 gap-3">
            {destinations.map((dest, idx) => (
              <div
                key={dest.id}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer transition-all duration-700 ${
                  dest.status === 'coming-soon' ? 'grayscale-[60%] hover:grayscale-0' : ''
                }`}
                style={{
                  height: '200px',
                  boxShadow: dest.status === 'active' 
                    ? '0 8px 32px rgba(192, 192, 192, 0.4), 0 0 40px rgba(192, 192, 192, 0.2)'
                    : '0 4px 16px rgba(0, 0, 0, 0.2)'
                }}
              >
                {/* Image de fond */}
                <div 
                  className="absolute inset-0 group-hover:scale-110 transition-all duration-700"
                  style={{
                    backgroundImage: `url(${dest.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/${dest.status === 'coming-soon' ? '70' : '40'} to-transparent`} />
                
                {/* Badge status */}
                {dest.status === 'active' && (
                  <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 rounded-full text-xs font-bold text-white animate-pulse"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
                      }}
                    >
                      ✨
                    </div>
                  </div>
                )}
                
                {/* Contenu adapté pour mobile */}
                <div className="absolute inset-0 flex flex-col items-center justify-between p-3">
                  {/* Icône et titre */}
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="mb-2">
                      <span className="text-2xl" style={{
                        filter: dest.status === 'active' 
                          ? 'drop-shadow(0 0 15px rgba(192, 192, 192, 0.8))'
                          : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))'
                      }}>
                        {dest.status === 'active' ? '✨' : '🌍'}
                      </span>
                    </div>
                    
                    <h3 className={`text-lg font-black text-white mb-1 tracking-wider text-center ${dest.status === 'active' ? 'animate-pulse' : ''}`}
                      style={{
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
                        fontFamily: '"Proxima Soft Black", Montserrat, sans-serif',
                        animationDuration: '3s'
                      }}
                    >
                      {dest.name}
                    </h3>
                    
                    <p className={`text-xs font-semibold ${dest.status === 'active' ? 'text-gray-200' : 'text-gray-300'} text-center`}>
                      {dest.tagline}
                    </p>
                  </div>
                  
                  {/* Badge status en bas */}
                  <div className="w-full flex justify-center">
                    {dest.status === 'coming-soon' ? (
                      <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                        <p className="text-xs font-bold text-gray-300">🔜 Bientôt</p>
                      </div>
                    ) : (
                      <div className="px-2 py-1 rounded-full animate-pulse" style={{
                        background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.4), rgba(99, 102, 241, 0.4))',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 0 15px rgba(192, 192, 192, 0.5)',
                        animationDuration: '2s'
                      }}>
                        <p className="text-xs font-bold text-white">✅ Actif</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop : Grille fixe */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {destinations.map((dest, idx) => (
            <div
              key={dest.id}
              className={`relative h-80 rounded-3xl overflow-hidden group cursor-pointer transition-all duration-700 transform ${
                dest.status === 'coming-soon' ? 'grayscale-[60%] hover:grayscale-0' : ''
              }`}
              style={{
                boxShadow: dest.status === 'active' 
                  ? '0 12px 48px rgba(192, 192, 192, 0.5), 0 0 80px rgba(192, 192, 192, 0.2)'
                  : '0 8px 24px rgba(0, 0, 0, 0.3)',
                animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s backwards`
              }}
              onMouseEnter={(e) => {
                if (dest.status === 'active') {
                  e.currentTarget.style.transform = 'scale(1.08) translateY(-8px)'
                } else {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)'
              }}
            >
              {/* Image de fond */}
              <div 
                className="absolute inset-0 group-hover:scale-110 transition-all duration-700"
                style={{
                  backgroundImage: `url(${dest.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Overlay */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/${dest.status === 'coming-soon' ? '70' : '40'} to-transparent`}
              />
              
              {/* Badge status en haut */}
              {dest.status === 'active' && (
                <div className="absolute top-4 right-4">
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white animate-pulse"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
                    }}
                  >
                    ✨ ACTIF
                  </div>
                </div>
              )}
              
              {/* Contenu */}
              <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
                {/* Partie haute */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  {/* Icône de destination - Sans rectangle, transparent */}
                  <div className="mb-4">
                    <div 
                      className={`w-16 h-16 flex items-center justify-center ${
                        dest.status === 'active' ? 'animate-bounce' : ''
                      }`}
                      style={{
                        background: 'transparent',
                        backdropFilter: 'none',
                        border: 'none',
                        animationDuration: '2s'
                      }}
                    >
                      <span 
                        className="text-5xl"
                        style={{
                          filter: dest.status === 'active' 
                            ? 'drop-shadow(0 0 20px rgba(192, 192, 192, 0.8)) drop-shadow(0 0 40px rgba(192, 192, 192, 0.6))'
                            : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))'
                        }}
                      >
                        {dest.status === 'active' ? '✨' : '🌍'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 
                    className={`text-2xl md:text-3xl font-black text-white mb-3 tracking-wider text-center ${
                      dest.status === 'active' ? 'animate-pulse' : ''
                    }`}
                    style={{
                      textShadow: dest.status === 'active' 
                        ? '0 0 40px rgba(192, 192, 192, 1), 0 0 80px rgba(192, 192, 192, 0.6), 0 4px 12px rgba(0, 0, 0, 0.9)'
                        : '0 4px 16px rgba(0, 0, 0, 0.9)',
                      fontFamily: '"Proxima Soft Black", Montserrat, sans-serif',
                      animationDuration: '3s'
                    }}
                  >
                    {dest.name}
                  </h3>
                  
                  <p className={`text-sm font-semibold ${
                    dest.status === 'active' ? 'text-gray-200' : 'text-gray-300'
                  }`}>
                    {dest.tagline}
                  </p>
                </div>
                
                {/* Badge status en bas - Toujours à la même position */}
                <div className="w-full flex justify-center">
                  {dest.status === 'coming-soon' ? (
                    <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                      <p className="text-xs font-bold text-gray-300">🔜 Bientôt disponible</p>
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-full animate-pulse" style={{
                      background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.4), rgba(99, 102, 241, 0.4))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 0 20px rgba(192, 192, 192, 0.5)',
                      animationDuration: '2s'
                    }}>
                      <p className="text-xs font-bold text-white">✅ Disponible maintenant</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Effet de brillance animé pour Marbella */}
              {dest.status === 'active' && (
                <>
                  <div 
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, transparent 0%, rgba(192, 192, 192, 0.4) 50%, transparent 100%)`,
                      animation: 'shimmer 3s ease-in-out infinite'
                    }}
                  />
                  {/* Sparkles flottants */}
                  <div className="absolute top-8 left-8">
                    <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" style={{ animationDuration: '2s' }} />
                  </div>
                  <div className="absolute top-12 right-12">
                    <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                  </div>
                  <div className="absolute bottom-8 left-12">
                    <Sparkles className="h-4 w-4 text-yellow-200 animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

DestinationsSection.displayName = 'DestinationsSection'

// Composant Presse - On parle de nous
export const PressSection = memo(() => {
  const { isDarkMode } = useTheme()
  
  const pressLogos = [
    { 
      name: 'VOGUE', 
      quote: '"Le concierge IA le plus sophistiqué d\'Europe"',
      date: 'Septembre 2024',
      logo: '👗',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      name: 'FORBES', 
      quote: '"Révolutionne le luxe à Marbella"',
      date: 'Août 2024',
      logo: '💼',
      color: 'from-blue-600 to-indigo-600'
    },
    { 
      name: 'GQ', 
      quote: '"L\'assistant indispensable des gentlemen"',
      date: 'Juillet 2024',
      logo: '🎩',
      color: 'from-gray-700 to-gray-900'
    },
    { 
      name: 'CONDÉ NAST', 
      quote: '"L\'excellence du service personnalisé"',
      date: 'Juin 2024',
      logo: '✨',
      color: 'from-purple-600 to-pink-600'
    },
    { 
      name: 'TATLER', 
      quote: '"Le must-have des voyageurs de luxe"',
      date: 'Mai 2024',
      logo: '👑',
      color: 'from-amber-500 to-yellow-600'
    },
    { 
      name: 'VANITY FAIR', 
      quote: '"Innovation et élégance réunis"',
      date: 'Avril 2024',
      logo: '💎',
      color: 'from-red-600 to-pink-600'
    }
  ]

  return (
    <div className="w-full py-20 relative overflow-hidden" style={{
      background: isDarkMode
        ? 'radial-gradient(ellipse at center, #1A1A2E 0%, #0A0A0F 100%)'
        : 'radial-gradient(ellipse at center, #F8FAFC 0%, #FFFFFF 100%)'
    }}>
      {/* Effet de grille subtil en arrière-plan */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(192, 192, 192, 0.3) 25%, rgba(192, 192, 192, 0.3) 26%, transparent 27%, transparent 74%, rgba(192, 192, 192, 0.3) 75%, rgba(192, 192, 192, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(192, 192, 192, 0.3) 25%, rgba(192, 192, 192, 0.3) 26%, transparent 27%, transparent 74%, rgba(192, 192, 192, 0.3) 75%, rgba(192, 192, 192, 0.3) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Titre avec effet premium */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div 
              className="px-6 py-2 rounded-full text-sm font-bold tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(192, 192, 192, 0.4)'
              }}
            >
              🎯 MÉDIAS & PRESSE
            </div>
          </div>
          
          <h2 
            className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            style={{ 
              fontFamily: '"Proxima Soft Black", Montserrat, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Ils parlent de nous
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            La presse internationale reconnaît l'excellence de Gliitz
          </p>
        </div>

        {/* Grille de logos médias - Mobile : Grille compacte / Desktop : Grille */}
        <div className="lg:hidden mb-16 px-4">
          <div className="grid grid-cols-2 gap-3">
            {pressLogos.map((press, idx) => (
              <div
                key={press.name}
                className="group relative"
                style={{ 
                  height: '180px'
                }}
              >
                <div 
                  className="relative p-4 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer flex flex-col justify-between h-full"
                  style={{
                    background: isDarkMode
                      ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9))'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.95))',
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.15)'}`,
                    boxShadow: isDarkMode
                      ? '0 8px 24px rgba(0, 0, 0, 0.3)'
                      : '0 8px 24px rgba(192, 192, 192, 0.1)'
                  }}
                >
                  {/* Logo et nom */}
                  <div className="flex flex-col items-center mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${press.color} shadow-xl mb-2`}>
                      <span className="text-xl">{press.logo}</span>
                    </div>
                    
                    <h3 className={`text-sm font-black text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontFamily: '"Proxima Soft Black", Montserrat, sans-serif', letterSpacing: '0.05em' }}
                    >
                      {press.name}
                    </h3>
                  </div>
                  
                  {/* Citation compacte */}
                  <div className="flex-1 flex items-center justify-center mb-2">
                    <p className={`text-xs italic text-center leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {press.quote}
                    </p>
                  </div>
                  
                  {/* Date */}
                  <div className="text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {press.date}
                    </span>
                  </div>
                  
                  {/* Badge "Featured" */}
                  <div className="absolute top-2 right-2">
                    <div 
                      className="px-1.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                        boxShadow: '0 0 10px rgba(192, 192, 192, 0.4)'
                      }}
                    >
                      ⭐
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop : Grille */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pressLogos.map((press, idx) => (
            <div
              key={press.name}
              className="group relative"
              style={{
                animation: `fadeInUp 0.8s ease-out ${idx * 0.15}s backwards`
              }}
            >
              <div 
                className="relative p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9))'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.95))',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${isDarkMode ? 'rgba(192, 192, 192, 0.2)' : 'rgba(192, 192, 192, 0.15)'}`,
                  boxShadow: isDarkMode
                    ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                    : '0 12px 40px rgba(192, 192, 192, 0.15)'
                }}
              >
                {/* Effet de brillance au hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, transparent 0%, rgba(192, 192, 192, 0.1) 50%, transparent 100%)`,
                    transform: 'translateX(-100%)',
                    animation: 'shimmer 2s ease-in-out infinite'
                  }}
                />
                
                {/* Logo emoji avec gradient */}
                <div className="flex items-center justify-center mb-6">
                  <div 
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${press.color} shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <span className="text-4xl">{press.logo}</span>
                  </div>
                </div>
                
                {/* Nom du média */}
                <h3 
                  className={`text-2xl font-black text-center mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:scale-105 transition-transform duration-300`}
                  style={{ 
                    fontFamily: '"Proxima Soft Black", Montserrat, sans-serif',
                    letterSpacing: '0.1em'
                  }}
                >
                  {press.name}
                </h3>
                
                {/* Citation */}
                <div className="relative mb-4">
                  <div className="absolute -left-2 -top-2 text-4xl opacity-20" style={{ color: '#C0C0C0' }}>"</div>
                  <p 
                    className={`text-sm italic text-center leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                  >
                    {press.quote}
                  </p>
                  <div className="absolute -right-2 -bottom-2 text-4xl opacity-20" style={{ color: '#C0C0C0' }}>"</div>
                </div>
                
                {/* Date */}
                <div className="text-center">
                  <span 
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isDarkMode ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {press.date}
                  </span>
                </div>
                
                {/* Badge "Featured" animé */}
                <div className="absolute top-4 right-4">
                  <div 
                    className="px-2 py-1 rounded-full text-[10px] font-bold text-white animate-pulse"
                    style={{
                      background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                      boxShadow: '0 0 15px rgba(192, 192, 192, 0.5)'
                    }}
                  >
                    ⭐
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Statistiques en bas */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div 
              className={`text-5xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              style={{
                background: 'linear-gradient(135deg, #E5E5E5, #C0C0C0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              50+
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Publications
            </p>
          </div>
          <div className="text-center">
            <div 
              className={`text-5xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              12
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Prix remportés
            </p>
          </div>
          <div className="text-center">
            <div 
              className={`text-5xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              4.9
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Note moyenne
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

PressSection.displayName = 'PressSection'

export default BrandCarousel
