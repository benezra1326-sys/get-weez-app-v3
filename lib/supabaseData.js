// Supabase Data Fetching - Real data from database
import { supabase } from './supabase'

/**
 * Récupérer tous les établissements depuis Supabase
 */
export async function fetchEstablishments() {
  try {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .order('rating', { ascending: false })
    
    if (error) {
      console.error('Erreur Supabase establishments:', error)
      console.log('⚠️ Utilisation des données de fallback')
      return getStaticEstablishments()
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ Aucun établissement dans Supabase, utilisation des données de fallback')
      return getStaticEstablishments()
    }
    
    console.log('✅ Établissements récupérés depuis Supabase:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('Erreur fetch establishments:', error)
    return getStaticEstablishments()
  }
}

/**
 * Données d'établissements statiques (fallback)
 */
function getStaticEstablishments() {
  return [
    {
      id: 1,
      name: "Nikki Beach Marbella",
      type: "plage",
      description: "Beach club emblématique connu pour ses fêtes exclusives en bord de mer.",
      location: "Elviria, Marbella",
      rating: 4.8,
      price_level: 4,
      image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      lat: 36.4941,
      lng: -4.7856
    },
    {
      id: 2,
      name: "Puente Romano Beach Resort",
      type: "hôtel",
      description: "Resort de luxe avec restaurants étoilés, spa et accès direct à la plage.",
      location: "Golden Mile, Marbella",
      rating: 4.9,
      price_level: 5,
      image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      lat: 36.4928,
      lng: -4.9167
    },
    {
      id: 3,
      name: "La Sala by the Sea",
      type: "plage",
      description: "Ambiance chic et décontractée avec DJ sets et cocktails exotiques.",
      location: "Puerto Banús, Marbella",
      rating: 4.6,
      price_level: 3,
      image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      lat: 36.4879,
      lng: -4.9522
    },
    {
      id: 4,
      name: "Ocean Club Marbella",
      type: "club",
      description: "Club de plage exclusif avec DJ internationaux et événements VIP.",
      location: "Playa de Marbella",
      rating: 4.7,
      price_level: 4,
      image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
      lat: 36.5101,
      lng: -4.8824
    },
    {
      id: 5,
      name: "Dani García Restaurant",
      type: "restaurant",
      description: "Cuisine gastronomique d'exception du chef étoilé Dani García.",
      location: "Puerto Banús",
      rating: 4.9,
      price_level: 5,
      image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      lat: 36.4879,
      lng: -4.9522
    }
  ]
}

/**
 * Récupérer tous les événements depuis Supabase (UNIQUEMENT FUTURS)
 */
export async function fetchEvents() {
  try {
    const today = new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today) // Seulement les événements >= aujourd'hui
      .order('date', { ascending: true })
    
    if (error) {
      console.error('Erreur Supabase events:', error)
      return []
    }
    
    console.log('✅ Événements futurs récupérés depuis Supabase:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('Erreur fetch events:', error)
    return []
  }
}

/**
 * Récupérer tous les services depuis Supabase
 */
export async function fetchServices() {
  try {
    // Si pas de table services, utiliser les données statiques
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true })
    
    if (error) {
      console.error('Erreur Supabase services:', error)
      // Fallback vers données statiques
      return getStaticServices()
    }
    
    console.log('✅ Services récupérés depuis Supabase:', data?.length || 0)
    return data || getStaticServices()
  } catch (error) {
    console.error('Erreur fetch services:', error)
    return getStaticServices()
  }
}

/**
 * Services statiques (fallback)
 */
function getStaticServices() {
  return [
    {
      id: 'transport-vip',
      name: 'Transport VIP',
      category: 'Transport',
      description: 'Voiture avec chauffeur, yacht privé, hélicoptère',
      icon: '🚗'
    },
    {
      id: 'concierge',
      name: 'Conciergerie Premium',
      category: 'Services',
      description: 'Réservations, organisation d\'événements, assistance 24/7',
      icon: '✨'
    },
    {
      id: 'yacht',
      name: 'Location Yacht',
      category: 'Transport',
      description: 'Yachts de luxe avec équipage professionnel',
      icon: '⛵'
    },
    {
      id: 'villa',
      name: 'Villas de Luxe',
      category: 'Hébergement',
      description: 'Villas privées avec services premium',
      icon: '🏡'
    }
  ]
}

/**
 * Rechercher un établissement par nom
 */
export async function searchEstablishment(name) {
  try {
    // Nettoyer le nom - SUPPRIMER tout ce qui suit ":" ou description
    let cleanName = name
      .replace(/\*\*/g, '')
      .replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗]/g, '')
      .trim()
    
    // Si le texte contient ":" prendre seulement ce qui est avant
    if (cleanName.includes(':')) {
      cleanName = cleanName.split(':')[0].trim()
    }
    
    // Si le texte contient "-" prendre seulement ce qui est avant  
    if (cleanName.includes(' - ')) {
      cleanName = cleanName.split(' - ')[0].trim()
    }
    
    // Prendre seulement les 4 premiers mots maximum
    const words = cleanName.split(' ')
    if (words.length > 4) {
      cleanName = words.slice(0, 4).join(' ')
    }

    console.log('🔍 Recherche establishment avec nom nettoyé:', cleanName)

    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .ilike('name', `%${cleanName}%`)
      .limit(1)
    
    if (error) {
      console.error('Erreur recherche establishment:', error)
      return null
    }
    
    console.log('📊 Establishment trouvé:', data?.[0] ? data[0].name : 'AUCUN')
    // Retourner le premier résultat ou null
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Erreur search establishment:', error)
    return null
  }
}

/**
 * Récupérer un événement par nom
 */
export async function searchEvent(name) {
  try {
    // Nettoyer le nom - SUPPRIMER tout ce qui suit ":" ou description
    let cleanName = name
      .replace(/\*\*/g, '')
      .replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗]/g, '')
      .trim()
    
    // Si le texte contient ":" prendre seulement ce qui est avant
    if (cleanName.includes(':')) {
      cleanName = cleanName.split(':')[0].trim()
    }
    
    // Si le texte contient "-" prendre seulement ce qui est avant
    if (cleanName.includes(' - ')) {
      cleanName = cleanName.split(' - ')[0].trim()
    }

    console.log('🔍 Recherche event avec nom nettoyé:', cleanName)

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .ilike('title', `%${cleanName}%`)
      .limit(1)
    
    if (error) {
      console.error('Erreur recherche event:', error)
      return null
    }
    
    console.log('📊 Event trouvé:', data?.[0] ? data[0].title : 'AUCUN')
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Erreur search event:', error)
    return null
  }
}

/**
 * Récupérer toutes les données pour l'IA
 */
export async function fetchAllDataForAI() {
  const [establishments, events, services] = await Promise.all([
    fetchEstablishments(),
    fetchEvents(),
    fetchServices()
  ])
  
  return {
    establishments,
    events,
    services
  }
}

/**
 * Rechercher un service par nom
 */
export async function searchService(name) {
  try {
    // Nettoyer le nom - SUPPRIMER tout ce qui suit ":" ou description
    let cleanName = name
      .replace(/\*\*/g, '')
      .replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗]/g, '')
      .trim()
    
    // Si le texte contient ":" prendre seulement ce qui est avant
    if (cleanName.includes(':')) {
      cleanName = cleanName.split(':')[0].trim()
    }
    
    // Si le texte contient "-" prendre seulement ce qui est avant
    if (cleanName.includes(' - ')) {
      cleanName = cleanName.split(' - ')[0].trim()
    }
    
    // Prendre seulement les 4 premiers mots maximum
    const words = cleanName.split(' ')
    if (words.length > 4) {
      cleanName = words.slice(0, 4).join(' ')
    }

    console.log('🔍 Recherche service avec nom nettoyé:', cleanName)

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .ilike('name', `%${cleanName}%`)
      .limit(1)
    
    if (error) {
      console.error('Erreur recherche service:', error)
      return null
    }
    
    console.log('📊 Service trouvé:', data?.[0] ? data[0].name : 'AUCUN')
    return data?.[0] ? { ...data[0], category: data[0].category || data[0].type } : null
  } catch (error) {
    console.error('Erreur search service:', error)
    return null
  }
}

export default {
  fetchEstablishments,
  fetchEvents,
  fetchServices,
  searchEstablishment,
  searchEvent,
  searchService,
  fetchAllDataForAI
}

