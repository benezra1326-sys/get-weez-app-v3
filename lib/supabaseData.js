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
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Erreur Supabase establishments:', error)
      return []
    }
    
    console.log('✅ Établissements récupérés depuis Supabase:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('Erreur fetch establishments:', error)
    return []
  }
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

