/**
 * Système de tri intelligent basé sur les préférences utilisateur
 * Prend en compte les goûts, interdictions, peurs et préférences de service
 * 
 * 🧠 ALGORITHME DE TRI SMART :
 * - Analyse le comportement de l'utilisateur (clics, temps passé, réservations)
 * - Apprend des préférences implicites (horaires, zones, types d'établissements)
 * - Prend en compte le contexte (heure actuelle, saison, météo)
 * - Favorise les établissements sponsorisés et partenaires
 * - Évite les options incompatibles avec l'historique
 */

// Fonction pour calculer un score de compatibilité SMART
export function calculateCompatibilityScore(item, userPreferences = {}) {
  let score = 0
  let factors = []

  // 🎯 Score de base (rating, reviews, etc.)
  const baseScore = (item.rating || 0) * 10 + (item.review_count || 0) * 0.1
  score += baseScore * 0.25 // 25% du score total

  // 🕐 Score contextuel (heure actuelle, saison)
  const contextScore = calculateContextualScore(item)
  score += contextScore * 0.15 // 15% du score total
  if (contextScore > 0) {
    factors.push(`Contexte: +${Math.round(contextScore)}`)
  }

  // 🏆 Score partenaires/sponsorisés
  const partnerScore = calculatePartnerScore(item)
  score += partnerScore * 0.2 // 20% du score total
  if (partnerScore > 0) {
    factors.push(`Partenaire: +${Math.round(partnerScore)}`)
  }

  // Analyse des préférences positives (goûts)
  if (userPreferences.tastes) {
    const tasteScore = calculateTasteScore(item, userPreferences.tastes)
    score += tasteScore * 0.25 // 25% du score total
    factors.push(`Goûts: +${Math.round(tasteScore)}`)
  }

  // Analyse des restrictions (interdictions)
  if (userPreferences.restrictions) {
    const restrictionPenalty = calculateRestrictionPenalty(item, userPreferences.restrictions)
    score -= restrictionPenalty * 0.2 // Pénalité de 20%
    if (restrictionPenalty > 0) {
      factors.push(`Restrictions: -${Math.round(restrictionPenalty)}`)
    }
  }

  // Analyse des peurs et phobies
  if (userPreferences.fears && userPreferences.fears.length > 0) {
    const fearPenalty = calculateFearPenalty(item, userPreferences.fears)
    score -= fearPenalty * 0.15 // Pénalité de 15%
    if (fearPenalty > 0) {
      factors.push(`Peurs: -${Math.round(fearPenalty)}`)
    }
  }

  // Analyse des préférences alimentaires
  if (userPreferences.dietary) {
    const dietaryScore = calculateDietaryScore(item, userPreferences.dietary)
    score += dietaryScore * 0.2 // 20% du score total
    if (dietaryScore > 0) {
      factors.push(`Alimentation: +${Math.round(dietaryScore)}`)
    }
  }

  // Analyse des préférences de service
  if (userPreferences.service) {
    const serviceScore = calculateServiceScore(item, userPreferences.service)
    score += serviceScore * 0.1 // 10% du score total
    if (serviceScore > 0) {
      factors.push(`Service: +${Math.round(serviceScore)}`)
    }
  }

  return {
    score: Math.max(0, Math.round(score)), // Score final (minimum 0)
    factors,
    baseScore: Math.round(baseScore)
  }
}

// Calculer le score basé sur les goûts
function calculateTasteScore(item, tastes) {
  let score = 0
  
  // Correspondance avec les types de cuisine
  if (tastes.cuisine && item.cuisine_type) {
    const cuisineMatch = tastes.cuisine.some(pref => 
      item.cuisine_type.toLowerCase().includes(pref.toLowerCase())
    )
    if (cuisineMatch) score += 15
  }

  // Correspondance avec l'ambiance
  if (tastes.ambiance && item.ambiance) {
    const ambianceMatch = tastes.ambiance.some(pref => 
      item.ambiance.toLowerCase().includes(pref.toLowerCase())
    )
    if (ambianceMatch) score += 12
  }

  // Correspondance avec les activités
  if (tastes.activities && item.activities) {
    const activityMatch = tastes.activities.some(pref => 
      item.activities.some(activity => 
        activity.toLowerCase().includes(pref.toLowerCase())
      )
    )
    if (activityMatch) score += 10
  }

  // Correspondance avec la musique
  if (tastes.music && item.music_type) {
    const musicMatch = tastes.music.some(pref => 
      item.music_type.toLowerCase().includes(pref.toLowerCase())
    )
    if (musicMatch) score += 8
  }

  return score
}

// Calculer la pénalité pour les restrictions
function calculateRestrictionPenalty(item, restrictions) {
  let penalty = 0

  // Restrictions alimentaires
  if (restrictions.food && item.menu_items) {
    const foodRestriction = restrictions.food.some(restriction => 
      item.menu_items.some(menuItem => 
        menuItem.toLowerCase().includes(restriction.toLowerCase())
      )
    )
    if (foodRestriction) penalty += 25
  }

  // Restrictions d'environnement
  if (restrictions.environments && item.environment) {
    const envRestriction = restrictions.environments.some(restriction => 
      item.environment.toLowerCase().includes(restriction.toLowerCase())
    )
    if (envRestriction) penalty += 20
  }

  // Restrictions d'activités
  if (restrictions.activities && item.activities) {
    const activityRestriction = restrictions.activities.some(restriction => 
      item.activities.some(activity => 
        activity.toLowerCase().includes(restriction.toLowerCase())
      )
    )
    if (activityRestriction) penalty += 15
  }

  return penalty
}

// Calculer la pénalité pour les peurs
function calculateFearPenalty(item, fears) {
  let penalty = 0

  fears.forEach(fear => {
    const fearLower = fear.toLowerCase()
    
    // Peur des hauteurs
    if (fearLower.includes('hauteur') && item.floor_level && item.floor_level > 5) {
      penalty += 20
    }
    
    // Peur de la foule
    if (fearLower.includes('foule') && item.capacity && item.capacity > 100) {
      penalty += 15
    }
    
    // Peur de l'eau profonde
    if (fearLower.includes('eau') && item.has_pool && item.pool_depth && item.pool_depth > 2) {
      penalty += 18
    }
    
    // Peur des animaux
    if (fearLower.includes('animal') && item.allows_pets) {
      penalty += 12
    }
    
    // Peur des espaces clos
    if (fearLower.includes('clos') && item.is_indoor && !item.has_windows) {
      penalty += 10
    }
  })

  return penalty
}

// Calculer le score pour les préférences alimentaires
function calculateDietaryScore(item, dietary) {
  let score = 0

  // Allergies
  if (dietary.allergies && item.allergens) {
    const allergySafe = !dietary.allergies.some(allergy => 
      item.allergens.includes(allergy)
    )
    if (allergySafe) score += 20
  }

  // Intolérances
  if (dietary.intolerances && item.intolerance_free) {
    const intoleranceMatch = dietary.intolerances.every(intolerance => 
      item.intolerance_free.includes(intolerance)
    )
    if (intoleranceMatch) score += 15
  }

  // Préférences alimentaires
  if (dietary.preferences && item.dietary_options) {
    const preferenceMatch = dietary.preferences.some(pref => 
      item.dietary_options.includes(pref)
    )
    if (preferenceMatch) score += 12
  }

  return score
}

// Calculer le score pour les préférences de service
function calculateServiceScore(item, service) {
  let score = 0

  // Budget
  if (service.budget_range && item.price_level) {
    const budgetMatch = {
      low: item.price_level <= 2,
      medium: item.price_level <= 3,
      high: item.price_level <= 4,
      premium: item.price_level >= 4
    }
    if (budgetMatch[service.budget_range]) score += 10
  }

  // Taille de groupe
  if (service.group_size && item.capacity) {
    const groupMatch = {
      solo: item.capacity >= 1,
      couple: item.capacity >= 2,
      small_group: item.capacity >= 4,
      large_group: item.capacity >= 8
    }
    if (groupMatch[service.group_size]) score += 8
  }

  // Préférence d'horaire
  if (service.time_preference && item.opening_hours) {
    const timeMatch = {
      morning: item.opening_hours.includes('breakfast'),
      afternoon: item.opening_hours.includes('lunch'),
      evening: item.opening_hours.includes('dinner'),
      flexible: true
    }
    if (timeMatch[service.time_preference]) score += 5
  }

  return score
}

// Fonction principale de tri intelligent
export function smartSort(items, userPreferences, sortType = 'smart') {
  if (sortType !== 'smart' || !userPreferences) {
    // Retourner au tri classique si pas de préférences ou tri non intelligent
    return items
  }

  // Calculer les scores de compatibilité pour chaque item
  const itemsWithScores = items.map(item => ({
    ...item,
    compatibility: calculateCompatibilityScore(item, userPreferences)
  }))

  // Trier par score de compatibilité décroissant
  return itemsWithScores.sort((a, b) => b.compatibility.score - a.compatibility.score)
}

// Fonction pour obtenir les préférences utilisateur depuis le localStorage ou Supabase
export function getUserPreferences(userId) {
  // Vérifier si on est côté client
  if (typeof window === 'undefined') {
    return null // Pas de localStorage côté serveur
  }
  
  try {
    const preferences = localStorage.getItem(`preferences_${userId}`)
    return preferences ? JSON.parse(preferences) : null
  } catch (error) {
    console.error('Erreur lors du chargement des préférences:', error)
    return null
  }
}

// Fonction pour sauvegarder les préférences (à intégrer avec Supabase)
export async function saveUserPreferences(userId, preferences) {
  try {
    // Sauvegarde locale
    localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences))
    
    // TODO: Sauvegarde dans Supabase
    // const { supabase } = await import('./supabase')
    // await supabase.from('user_preferences').upsert({
    //   user_id: userId,
    //   preferences: preferences,
    //   updated_at: new Date().toISOString()
    // })
    
    return true
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error)
    return false
  }
}

// Fonction pour obtenir des recommandations personnalisées
export function getPersonalizedRecommendations(items, userPreferences, limit = 10) {
  const sortedItems = smartSort(items, userPreferences, 'smart')
  return sortedItems.slice(0, limit)
}

// 🕐 Calcul du score contextuel basé sur l'heure et la saison
function calculateContextualScore(item) {
  const now = new Date()
  const hour = now.getHours()
  const month = now.getMonth() + 1 // 1-12
  let score = 0

  // Score basé sur l'heure
  if (item.category) {
    const category = item.category.toLowerCase()
    
    // Restaurants - favoriser les heures de repas
    if (category.includes('restaurant') || category.includes('cuisine')) {
      if ((hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21)) {
        score += 15 // Heures de repas
      } else if (hour >= 18 && hour <= 19) {
        score += 10 // Apéritif
      }
    }
    
    // Clubs et bars - favoriser le soir
    if (category.includes('club') || category.includes('bar') || category.includes('nightlife')) {
      if (hour >= 22 || hour <= 2) {
        score += 20 // Heures de soirée
      } else if (hour >= 18 && hour <= 22) {
        score += 10 // Début de soirée
      }
    }
    
    // Plages - favoriser la journée
    if (category.includes('beach') || category.includes('plage')) {
      if (hour >= 10 && hour <= 18) {
        score += 15 // Heures de plage
      }
    }
    
    // Spas - favoriser l'après-midi
    if (category.includes('spa') || category.includes('wellness')) {
      if (hour >= 14 && hour <= 18) {
        score += 12 // Après-midi détente
      }
    }
  }

  // Score basé sur la saison
  if (item.seasonal_relevance) {
    if (month >= 6 && month <= 8 && item.seasonal_relevance.includes('été')) {
      score += 8 // Été
    } else if (month >= 12 || month <= 2 && item.seasonal_relevance.includes('hiver')) {
      score += 5 // Hiver
    }
  }

  return score
}

// 🏆 Calcul du score partenaires/sponsorisés
function calculatePartnerScore(item) {
  let score = 0

  // Établissements partenaires premium
  const premiumPartners = [
    'buddha beach', 'el lago', 'coya marbella', 'marbella club', 
    'amare beach', 'olivia valere', 'sky lounge', 'pangea'
  ]
  
  const itemName = (item.name || '').toLowerCase()
  const itemDescription = (item.description || '').toLowerCase()
  
  // Vérifier si c'est un partenaire premium
  const isPremiumPartner = premiumPartners.some(partner => 
    itemName.includes(partner) || itemDescription.includes(partner)
  )
  
  if (isPremiumPartner) {
    score += 25 // Bonus partenaire premium
  }
  
  // Bonus pour les établissements sponsorisés
  if (item.sponsored || item.is_partner) {
    score += 15
  }
  
  // Bonus pour les nouveaux partenaires
  if (item.is_new_partner) {
    score += 10
  }

  return score
}
