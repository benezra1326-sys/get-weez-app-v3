// Utilitaires de géolocalisation pour Get Weez

// Coordonnées GPS de Marbella (centre-ville)
export const MARBELLA_CENTER = {
  lat: 36.5101,
  lng: -4.8828
}

// Zones de Marbella avec leurs coordonnées
export const MARBELLA_ZONES = {
  'Centre-ville': { lat: 36.5101, lng: -4.8828 },
  'Puerto Banús': { lat: 36.4847, lng: -4.9514 },
  'Golden Mile': { lat: 36.5101, lng: -4.8828 },
  'Nueva Andalucía': { lat: 36.4847, lng: -4.9514 },
  'Elviria': { lat: 36.4847, lng: -4.9514 },
  'Sierra Blanca': { lat: 36.5201, lng: -4.8728 },
  'Santa Petronila': { lat: 36.4847, lng: -4.9514 }
}

// Calculer la distance entre deux points GPS (formule de Haversine)
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return distance
}

// Obtenir la position de l'utilisateur
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Géolocalisation non supportée'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Trier les établissements par distance
export function sortByDistance(establishments, userLat, userLng) {
  return establishments
    .map(establishment => ({
      ...establishment,
      distance: calculateDistance(
        userLat, 
        userLng, 
        establishment.coordinates.lat, 
        establishment.coordinates.lng
      )
    }))
    .sort((a, b) => a.distance - b.distance)
}

// Filtrer par distance maximale
export function filterByMaxDistance(establishments, userLat, userLng, maxDistanceKm) {
  return establishments.filter(establishment => {
    const distance = calculateDistance(
      userLat, 
      userLng, 
      establishment.coordinates.lat, 
      establishment.coordinates.lng
    )
    return distance <= maxDistanceKm
  })
}

// Obtenir les établissements les plus proches
export function getNearestEstablishments(establishments, userLat, userLng, limit = 5) {
  return sortByDistance(establishments, userLat, userLng).slice(0, limit)
}

// Formater la distance pour l'affichage
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`
  } else {
    return `${Math.round(distanceKm)}km`
  }
}

// Obtenir la direction approximative
export function getDirection(userLat, userLng, targetLat, targetLng) {
  const dLng = targetLng - userLng
  const dLat = targetLat - userLat
  
  const angle = Math.atan2(dLng, dLat) * 180 / Math.PI
  
  if (angle >= -22.5 && angle < 22.5) return 'Nord'
  if (angle >= 22.5 && angle < 67.5) return 'Nord-Est'
  if (angle >= 67.5 && angle < 112.5) return 'Est'
  if (angle >= 112.5 && angle < 157.5) return 'Sud-Est'
  if (angle >= 157.5 || angle < -157.5) return 'Sud'
  if (angle >= -157.5 && angle < -112.5) return 'Sud-Ouest'
  if (angle >= -112.5 && angle < -67.5) return 'Ouest'
  if (angle >= -67.5 && angle < -22.5) return 'Nord-Ouest'
  
  return 'Nord'
}
