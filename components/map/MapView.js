import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MapPin, Navigation, X, ExternalLink } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function MapView({ items = [], type = 'establishments', onClose }) {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [selectedItem, setSelectedItem] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    // Récupérer la position de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }
  }, [])

  // Calculer la distance entre deux points (formule de Haversine simplifiée)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return (R * c).toFixed(1)
  }

  // Ajouter la distance aux items si la géolocalisation est disponible
  const itemsWithDistance = items.map(item => ({
    ...item,
    distance: userLocation && item.coordinates 
      ? calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          item.coordinates.lat, 
          item.coordinates.lng
        )
      : null
  })).sort((a, b) => (a.distance || 999) - (b.distance || 999))

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
      {/* Map Background (Placeholder - In production, use Google Maps API or Mapbox) */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1a1a1c 0%, #2c2c2e 100%)'
            : 'linear-gradient(135deg, #e5e5e5 0%, #f5f5f5 100%)',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a7c7c5\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-3 rounded-xl transition-all"
        style={{
          background: isDarkMode ? 'rgba(11,11,12,0.9)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(167,199,197,0.3)',
          color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.9)'
          e.currentTarget.style.color = '#FFFFFF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isDarkMode ? 'rgba(11,11,12,0.9)' : 'rgba(255,255,255,0.9)'
          e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#0B0B0C'
        }}
      >
        <X size={20} />
      </button>

      {/* Vraie carte intégrée */}
      <div className="absolute inset-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102665.12236566136!2d-4.8853444!3d36.5100712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72d809904dabdf%3A0xe6c9a9072945a067!2sMarbella%2C%20Malaga%2C%20Espagne!5e0!3m2!1sfr!2sfr!4v1699123456789!5m2!1sfr!2sfr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Markers sur la carte Google Maps avec coordonnées réelles */}
      {itemsWithDistance.map((item, index) => {
        if (!item.lat || !item.lng) return null
        
        // Convertir les coordonnées en position sur la carte
        // Marbella centre: 36.5101, -4.8824
        const mapCenter = { lat: 36.5101, lng: -4.8824 }
        const mapBounds = {
          north: 36.5600,
          south: 36.4600,
          east: -4.8000,
          west: -4.9800
        }
        
        // Calculer la position relative sur la carte
        const xPercent = ((item.lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100
        const yPercent = ((mapBounds.north - item.lat) / (mapBounds.north - mapBounds.south)) * 100
        
        return (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
            style={{
              top: `${yPercent}%`,
              left: `${xPercent}%`
            }}
          >
            <div
              className="relative p-3 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: selectedItem?.id === item.id
                  ? 'rgba(167,199,197,0.95)'
                  : 'rgba(167,199,197,0.8)',
                boxShadow: selectedItem?.id === item.id 
                  ? '0 0 25px rgba(167,199,197,0.9)' 
                  : '0 4px 15px rgba(167,199,197,0.5)',
                border: '3px solid #FFFFFF'
              }}
            >
              <MapPin size={20} color="#FFFFFF" />
              
              {/* Distance badge */}
              {item.distance && (
                <div
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: '#FF6B6B',
                    color: '#FFFFFF',
                    fontSize: '10px'
                  }}
                >
                  {item.distance}km
                </div>
              )}
              
              {/* Tooltip au survol */}
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: isDarkMode ? 'rgba(11,11,12,0.9)' : 'rgba(255,255,255,0.9)',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
              >
                {item.name || item.title}
              </div>
            </div>
          </button>
        )
      })}

      {/* User Location Indicator */}
      {userLocation && (
        <div 
          className="absolute bottom-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            background: isDarkMode ? 'rgba(11,11,12,0.9)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(167,199,197,0.3)',
            color: '#A7C7C5',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          <Navigation size={16} />
          <span className="text-sm font-medium">Votre position</span>
        </div>
      )}

      {/* Item Details Panel */}
      {selectedItem && (
        <div 
          className="absolute bottom-0 left-0 right-0 p-6 rounded-t-3xl"
          style={{
            background: isDarkMode ? 'rgba(11,11,12,0.95)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(167,199,197,0.3)',
            maxHeight: '40%',
            overflowY: 'auto'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
                }}
              >
                {selectedItem.name}
              </h3>
              {selectedItem.address && (
                <p 
                  className="text-sm flex items-center gap-2 mb-2"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                  }}
                >
                  <MapPin size={14} />
                  {selectedItem.address}
                </p>
              )}
              {selectedItem.distance && (
                <p 
                  className="text-sm font-semibold"
                  style={{
                    color: '#A7C7C5',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  À {selectedItem.distance} km de vous
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="p-2 rounded-lg transition-all"
              style={{
                background: 'rgba(167,199,197,0.1)',
                color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {selectedItem.description && (
            <p 
              className="text-sm mb-4"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
              }}
            >
              {selectedItem.description}
            </p>
          )}

          <button
            onClick={() => {
              const itemType = type === 'establishments' ? 'establishment' : type === 'events' ? 'event' : 'service'
              router.push(`/product/${itemType}/${selectedItem.id}`)
            }}
            className="w-full py-3 rounded-xl font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167,199,197,1), rgba(157,180,192,1))'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167,199,197,0.8), rgba(157,180,192,0.8))'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Voir les détails
          </button>
        </div>
      )}
    </div>
  )
}

