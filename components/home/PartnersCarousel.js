import React, { useState, useEffect } from 'react'

const PartnersCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const partners = [
    {
      name: "GUILT!",
      logo: "GUILT!",
      description: "Restaurant & Bar"
    },
    {
      name: "GRUPO MOSH",
      logo: "GRUPO MOSH",
      description: "Groupe Premium"
    },
    {
      name: "CIPRIANI MARBELLA",
      logo: "CIPRIANI",
      description: "Restaurant Italien"
    },
    {
      name: "MAMZEL at Finca Besaya",
      logo: "MAMZEL",
      description: "Restaurant Gastronomique"
    },
    {
      name: "NOBU MARBELLA",
      logo: "NOBU",
      description: "Japonais Premium"
    },
    {
      name: "MIRAGE",
      logo: "MIRAGE",
      description: "Beach Club"
    },
    {
      name: "NOTA Blu",
      logo: "NOTA Blu",
      description: "Nouvelle Brasserie"
    }
  ]

  // Auto-play du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [partners.length])

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .partners-carousel {
          animation: slideIn 0.6s ease-out;
        }
        
        .partner-logo {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 3s infinite;
        }
        
        .partner-card {
          transition: all 0.3s ease;
        }
        
        .partner-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      <div className="partners-carousel bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-8 lg:py-12 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Titre de la section */}
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              Nos <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Partenaires</span>
            </h2>
            <p className="text-gray-400 text-sm lg:text-base max-w-2xl mx-auto">
              Découvrez les établissements premium qui font la réputation de Marbella
            </p>
          </div>

          {/* Carousel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <div key={index} className="flex-shrink-0 w-1/3 lg:w-1/4 px-3">
                  <div className="partner-card bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/30 hover:border-purple-500/50 transition-all duration-300 h-32 lg:h-40 flex flex-col justify-center items-center text-center group">
                    {/* Logo */}
                    <div className="partner-logo mb-2 lg:mb-3">
                      <div className="text-white font-bold text-sm lg:text-lg group-hover:text-purple-300 transition-colors duration-300">
                        {partner.logo}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="text-gray-400 text-xs lg:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {partner.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicateurs de pagination */}
            <div className="flex justify-center space-x-2 mt-6">
              {partners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-purple-500 w-8' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation manuelle */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentIndex((prevIndex) => 
                prevIndex === 0 ? partners.length - 1 : prevIndex - 1
              )}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-300 border border-gray-700/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length)}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-300 border border-gray-700/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PartnersCarousel
