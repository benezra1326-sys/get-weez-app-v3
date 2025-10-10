import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MapPin, CheckCircle, Clock } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const CITIES = [
  {
    id: 'marbella',
    name: 'Marbella',
    country: 'Espagne',
    coordinates: { lat: 36.5098, lng: -4.8826 },
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    available: true
  },
  {
    id: 'mykonos',
    name: 'Mykonos',
    country: 'Grèce',
    coordinates: { lat: 37.4467, lng: 25.3289 },
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop',
    available: false
  },
  {
    id: 'saint-tropez',
    name: 'Saint-Tropez',
    country: 'France',
    coordinates: { lat: 43.2677, lng: 6.6407 },
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    available: false
  },
  {
    id: 'ibiza',
    name: 'Ibiza',
    country: 'Espagne',
    coordinates: { lat: 38.9067, lng: 1.4206 },
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop',
    available: false
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    country: 'Maroc',
    coordinates: { lat: 31.6295, lng: -7.9811 },
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600',
    available: false
  }
]

export default function CitySelector({ onCitySelect, initialCity = 'marbella' }) {
  const { isDarkMode } = useTheme()
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [geolocationStatus, setGeolocationStatus] = useState('checking') // checking, granted, denied

  useEffect(() => {
    // Vérifier la géolocalisation au montage
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setGeolocationStatus(result.state)
        
        if (result.state === 'granted') {
          // Essayer de détecter la ville la plus proche
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              // Trouver la ville la plus proche (calcul simplifié)
              const nearest = CITIES.filter(c => c.available).reduce((prev, curr) => {
                const prevDist = Math.sqrt(
                  Math.pow(prev.coordinates.lat - latitude, 2) + 
                  Math.pow(prev.coordinates.lng - longitude, 2)
                )
                const currDist = Math.sqrt(
                  Math.pow(curr.coordinates.lat - latitude, 2) + 
                  Math.pow(curr.coordinates.lng - longitude, 2)
                )
                return currDist < prevDist ? curr : prev
              })
              
              setSelectedCity(nearest.id)
              if (onCitySelect) onCitySelect(nearest)
            },
            (error) => {
              console.log('Geolocation error:', error)
              setGeolocationStatus('denied')
            }
          )
        } else if (result.state === 'prompt') {
          // Demander la permission
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setGeolocationStatus('granted')
            },
            () => {
              setGeolocationStatus('denied')
            }
          )
        }
      })
    }
  }, [onCitySelect])

  const handleCityChange = (city) => {
    if (!city.available) return
    
    setSelectedCity(city.id)
    setIsModalOpen(false)
    
    if (onCitySelect) {
      onCitySelect(city)
    }
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('gliitz_selected_city', city.id)
  }

  const currentCity = CITIES.find(c => c.id === selectedCity)

  return (
    <>
      {/* City Selector Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
        style={{
          background: isDarkMode 
            ? 'rgba(167,199,197,0.1)' 
            : 'rgba(167,199,197,0.15)',
          border: '1px solid rgba(167,199,197,0.3)',
          backdropFilter: 'blur(10px)',
          color: isDarkMode ? '#A7C7C5' : '#5A8B89',
          fontFamily: 'Poppins, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDarkMode 
            ? 'rgba(167,199,197,0.15)' 
            : 'rgba(167,199,197,0.25)'
          e.currentTarget.style.borderColor = 'rgba(167,199,197,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isDarkMode 
            ? 'rgba(167,199,197,0.1)' 
            : 'rgba(167,199,197,0.15)'
          e.currentTarget.style.borderColor = 'rgba(167,199,197,0.3)'
        }}
      >
        <MapPin size={18} />
        <span className="text-sm font-medium">{currentCity.name}</span>
      </button>

      {/* Modal */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ 
            background: 'rgba(0, 0, 0, 0.6)', 
            backdropFilter: 'blur(8px)',
            zIndex: 9999
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full md:max-w-4xl rounded-3xl overflow-hidden md:mx-auto flex flex-col"
            style={{
              background: isDarkMode ? '#0B0B0C' : '#FFFFFF',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxHeight: '75vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className="p-4 md:p-6 border-b relative"
              style={{
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            >
              {/* Close button */}
              <button
                onClick={() => {
                  console.log('Bouton fermer cliqué')
                  setIsModalOpen(false)
                }}
                className="absolute top-4 right-4 p-2 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  zIndex: 10000
                }}
              >
                ✕
              </button>
              
              <h2 
                className="text-xl md:text-2xl font-bold mb-2 pr-12 md:pr-0"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
              >
                Choisissez votre destination
              </h2>
              <p 
                className="text-sm"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                }}
              >
                Sélectionnez la ville où vous souhaitez explorer nos services premium
              </p>
            </div>

            {/* Cities Grid */}
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 overflow-y-auto flex-1">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCityChange(city)}
                  disabled={!city.available}
                  className="relative rounded-2xl overflow-hidden transition-all duration-300 group"
                  style={{
                    background: isDarkMode ? 'rgba(26,26,28,0.8)' : 'rgba(248,248,248,0.8)',
                    border: selectedCity === city.id 
                      ? '2px solid rgba(167,199,197,0.8)' 
                      : '1px solid rgba(167,199,197,0.2)',
                    opacity: city.available ? 1 : 0.6,
                    cursor: city.available ? 'pointer' : 'not-allowed'
                  }}
                  onMouseEnter={(e) => {
                    if (city.available) {
                      e.currentTarget.style.transform = 'scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(167,199,197,0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Image */}
                  <div className="relative h-32 md:h-40 overflow-hidden">
                    <img 
                      src={city.image} 
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: city.available 
                          ? 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                          : 'rgba(0,0,0,0.5)'
                      }}
                    />
                    
                    {/* Selected Badge */}
                    {selectedCity === city.id && city.available && (
                      <div 
                        className="absolute top-3 right-3 p-2 rounded-full"
                        style={{ background: 'rgba(167,199,197,0.9)' }}
                      >
                        <CheckCircle size={20} color="#FFFFFF" />
                      </div>
                    )}

                    {/* Coming Soon Badge */}
                    {!city.available && (
                      <div 
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          color: '#0B0B0C'
                        }}
                      >
                        <Clock size={12} />
                        <span>Bientôt disponible</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-4">
                    <h3 
                      className="text-base md:text-lg font-bold mb-1"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                      }}
                    >
                      {city.name}
                    </h3>
                    <p 
                      className="text-xs md:text-sm"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                      }}
                    >
                      {city.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer - Desktop only */}
            <div 
              className="hidden md:flex p-4 md:p-6 border-t justify-end gap-3"
              style={{
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-medium transition-all"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

