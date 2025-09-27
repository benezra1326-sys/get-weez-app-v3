import { useState, useEffect } from 'react'
import { MapPin, Navigation, Target, Users } from 'lucide-react'
import { getUserLocation, formatDistance } from '../../lib/geolocation'

export default function DistanceFilter({ onLocationChange, onDistanceChange, userLocation, maxDistance }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const distanceOptions = [
    { value: 1, label: '1km', icon: '🚶' },
    { value: 3, label: '3km', icon: '🚗' },
    { value: 5, label: '5km', icon: '🏍️' },
    { value: 10, label: '10km', icon: '🚙' },
    { value: 20, label: '20km', icon: '🚌' },
    { value: 50, label: '50km', icon: '✈️' }
  ]

  const handleGetLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const location = await getUserLocation()
      onLocationChange(location)
      setPermissionGranted(true)
    } catch (err) {
      console.error('Erreur de géolocalisation:', err)
      setError('Impossible d\'obtenir votre position. Vérifiez les permissions.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDistanceChange = (distance) => {
    onDistanceChange(distance)
  }

  return (
    <div className="space-y-4">
      {/* Bouton de géolocalisation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <MapPin size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Géolocalisation</h3>
            <p className="text-sm text-text-secondary">
              {userLocation 
                ? `Position détectée (${formatDistance(userLocation.accuracy/1000)} de précision)`
                : 'Activez la géolocalisation pour des recommandations personnalisées'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={handleGetLocation}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isLoading
              ? 'bg-surface text-text-muted cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark animate-hover-lift'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Détection...</span>
            </>
          ) : (
            <>
              <Navigation size={16} />
              <span>Ma position</span>
            </>
          )}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-error/20 border border-error/30 rounded-lg">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Filtres de distance */}
      {userLocation && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Distance maximale</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {distanceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDistanceChange(option.value)}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  maxDistance === option.value
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques de localisation */}
      {userLocation && (
        <div className="p-4 bg-surface rounded-lg border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Users size={16} className="text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">Recommandations personnalisées</h4>
              <p className="text-sm text-text-secondary">
                Basées sur votre position actuelle
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Latitude:</span>
              <span className="text-text-primary font-mono">{userLocation.lat.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Longitude:</span>
              <span className="text-text-primary font-mono">{userLocation.lng.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Précision:</span>
              <span className="text-text-primary">{formatDistance(userLocation.accuracy/1000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Zone:</span>
              <span className="text-text-primary">Marbella</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
