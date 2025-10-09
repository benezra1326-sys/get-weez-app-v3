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
      .order('created_at', { ascending: false })
    
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
 * Récupérer tous les événements depuis Supabase
 */
export async function fetchEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) {
      console.error('Erreur Supabase events:', error)
      return []
    }
    
    console.log('✅ Événements récupérés depuis Supabase:', data?.length || 0)
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
    // Nettoyer le nom (enlever emojis, **bold**, etc.)
    const cleanName = name
      .replace(/\*\*/g, '')
      .replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗]/g, '')
      .trim()

    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .ilike('name', `%${cleanName}%`)
      .limit(1)
    
    if (error) {
      console.error('Erreur recherche establishment:', error)
      return null
    }
    
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
    // Nettoyer le nom
    const cleanName = name
      .replace(/\*\*/g, '')
      .replace(/[✨🌊🍽️🏖️☀️💆🍸🌙💃🎉🎊🍱🎭👜🌟🥂🚗]/g, '')
      .trim()

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or(`name.ilike.%${cleanName}%,title.ilike.%${cleanName}%`)
      .limit(1)
    
    if (error) {
      console.error('Erreur recherche event:', error)
      return null
    }
    
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

export default {
  fetchEstablishments,
  fetchEvents,
  fetchServices,
  searchEstablishment,
  searchEvent,
  fetchAllDataForAI
}

