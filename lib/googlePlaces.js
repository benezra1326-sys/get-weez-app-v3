// Google Places API Integration for Gliitz
// Récupère les établissements réels via Google Places

/**
 * Rechercher des établissements via Google Places API
 * @param {string} query - Recherche (ex: "restaurant japonais")
 * @param {object} location - Coordonnées {lat, lng}
 * @param {number} radius - Rayon en mètres (défaut: 5000)
 * @returns {Promise<Array>} Liste d'établissements
 */
export async function searchPlaces(query, location = { lat: 36.5103, lng: -4.8836 }, radius = 5000) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  
  if (!apiKey) {
    console.warn('❌ Google Places API key non configurée')
    return []
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
      `query=${encodeURIComponent(query + ' Marbella')}` +
      `&location=${location.lat},${location.lng}` +
      `&radius=${radius}` +
      `&key=${apiKey}` +
      `&language=fr`
    )

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.warn('Google Places status:', data.status)
      return []
    }

    // Transformer les résultats au format Gliitz
    const establishments = data.results.map(place => ({
      name: place.name,
      type: detectType(place.types),
      location: place.vicinity || place.formatted_address,
      rating: place.rating || 0,
      review_count: place.user_ratings_total || 0,
      price_level: '€'.repeat(place.price_level || 2),
      photo_url: place.photos?.[0]?.photo_reference 
        ? getPhotoUrl(place.photos[0].photo_reference, apiKey)
        : null,
      place_id: place.place_id,
      google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
    }))

    console.log(`✅ Google Places: ${establishments.length} résultats pour "${query}"`)
    return establishments

  } catch (error) {
    console.error('Erreur Google Places:', error)
    return []
  }
}

/**
 * Obtenir les détails d'un établissement
 * @param {string} placeId - ID Google Places
 * @returns {Promise<object>} Détails complets
 */
export async function getPlaceDetails(placeId) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  
  if (!apiKey) return null

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}` +
      `&fields=name,rating,formatted_phone_number,opening_hours,website,photos,reviews,price_level,types,vicinity` +
      `&key=${apiKey}` +
      `&language=fr`
    )

    const data = await response.json()

    if (data.status !== 'OK') return null

    const place = data.result

    return {
      name: place.name,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      reviews: place.reviews?.slice(0, 3),
      review_count: place.user_ratings_total,
      opening_hours: place.opening_hours?.weekday_text,
      photos: place.photos?.slice(0, 5).map(photo => 
        getPhotoUrl(photo.photo_reference, apiKey)
      ),
      type: detectType(place.types),
      location: place.vicinity
    }

  } catch (error) {
    console.error('Erreur détails Google Places:', error)
    return null
  }
}

/**
 * Construire l'URL d'une photo Google Places
 * @param {string} photoReference 
 * @param {string} apiKey 
 * @returns {string} URL de la photo
 */
function getPhotoUrl(photoReference, apiKey) {
  return `https://maps.googleapis.com/maps/api/place/photo?` +
         `maxwidth=800` +
         `&photo_reference=${photoReference}` +
         `&key=${apiKey}`
}

/**
 * Détecter le type d'établissement depuis les types Google
 * @param {Array<string>} types 
 * @returns {string}
 */
function detectType(types = []) {
  if (types.includes('restaurant')) return 'Restaurant'
  if (types.includes('bar')) return 'Bar'
  if (types.includes('night_club')) return 'Club'
  if (types.includes('cafe')) return 'Café'
  if (types.includes('spa')) return 'Spa'
  if (types.includes('lodging')) return 'Hôtel'
  return 'Établissement'
}

/**
 * Rechercher des établissements à proximité
 * @param {object} location - {lat, lng}
 * @param {string} type - Type d'établissement
 * @param {number} radius - Rayon en mètres
 * @returns {Promise<Array>}
 */
export async function searchNearby(location, type = 'restaurant', radius = 5000) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  
  if (!apiKey) return []

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${location.lat},${location.lng}` +
      `&radius=${radius}` +
      `&type=${type}` +
      `&key=${apiKey}` +
      `&language=fr`
    )

    const data = await response.json()

    if (data.status !== 'OK') return []

    return data.results.map(place => ({
      name: place.name,
      type: detectType(place.types),
      location: place.vicinity,
      rating: place.rating,
      photo_url: place.photos?.[0]?.photo_reference 
        ? getPhotoUrl(place.photos[0].photo_reference, apiKey)
        : null,
      place_id: place.place_id
    }))

  } catch (error) {
    console.error('Erreur recherche nearby:', error)
    return []
  }
}

export default {
  searchPlaces,
  getPlaceDetails,
  searchNearby
}

