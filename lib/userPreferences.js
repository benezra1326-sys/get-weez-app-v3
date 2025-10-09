// User Preferences Management for Gliitz AI
// Gère les préférences utilisateur pour personnaliser l'expérience IA

const PREFERENCES_KEY = 'gliitz_user_preferences'

export const defaultPreferences = {
  // Langue
  language: 'fr',
  
  // Voix préférée
  voice: 'feminine', // 'feminine' ou 'masculine'
  voiceSpeed: 1.0,
  
  // Style de réponse
  responseStyle: 'elegant', // 'elegant', 'casual', 'expert', 'concise'
  
  // Centres d'intérêt
  interests: {
    gastronomy: true,
    nightlife: true,
    wellness: false,
    shopping: false,
    culture: false,
    sports: false,
    beach: true,
    events: true
  },
  
  // Préférences culinaires
  culinary: {
    cuisines: [], // ['japanese', 'italian', 'french', 'mediterranean', 'fusion']
    dietary: [], // ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher']
    priceRange: [1, 4], // 1-4 (€ à €€€€)
    atmosphere: 'chic' // 'romantic', 'casual', 'chic', 'family', 'trendy'
  },
  
  // Préférences d'établissements
  establishments: {
    preferredZones: [], // ['Puerto Banus', 'Marbella Centro', 'Golden Mile']
    preferredTypes: [], // ['restaurant', 'bar', 'club', 'beach-club']
    minRating: 4.0
  },
  
  // Préférences de chat
  chat: {
    autoVoice: false, // Lecture vocale automatique
    voiceInput: false, // Dictée vocale par défaut
    suggestions: true, // Afficher les suggestions
    notifications: true
  },
  
  // Mode d'affichage
  theme: 'dark', // 'dark' ou 'light'
  
  // Géolocalisation
  location: {
    enabled: false,
    city: 'Marbella',
    country: 'Spain'
  }
}

export class UserPreferencesManager {
  constructor() {
    this.preferences = this.load()
  }

  // Charger les préférences
  load() {
    if (typeof window === 'undefined') return defaultPreferences
    
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge avec les préférences par défaut pour gérer les nouvelles options
        return { ...defaultPreferences, ...parsed }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error)
    }
    
    return defaultPreferences
  }

  // Sauvegarder les préférences
  save(preferences = this.preferences) {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
      this.preferences = preferences
      
      // Émettre un événement pour notifier les composants
      window.dispatchEvent(new CustomEvent('preferencesUpdated', { 
        detail: preferences 
      }))
      
      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error)
      return false
    }
  }

  // Obtenir toutes les préférences
  getAll() {
    return this.preferences
  }

  // Obtenir une préférence spécifique
  get(key) {
    const keys = key.split('.')
    let value = this.preferences
    
    for (const k of keys) {
      value = value[k]
      if (value === undefined) return null
    }
    
    return value
  }

  // Mettre à jour une préférence
  set(key, value) {
    const keys = key.split('.')
    const newPreferences = { ...this.preferences }
    let current = newPreferences
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    return this.save(newPreferences)
  }

  // Mettre à jour plusieurs préférences
  update(updates) {
    const newPreferences = { ...this.preferences, ...updates }
    return this.save(newPreferences)
  }

  // Réinitialiser les préférences
  reset() {
    return this.save(defaultPreferences)
  }

  // Générer un prompt système personnalisé pour l'IA
  generateSystemPrompt() {
    const { language, responseStyle, interests, culinary, establishments } = this.preferences
    
    let prompt = `Tu es Gliitz, un concierge IA de luxe à Marbella. `
    
    // Style de réponse
    const styles = {
      elegant: "Réponds avec élégance et raffinement, en utilisant un vocabulaire sophistiqué.",
      casual: "Réponds de manière décontractée et amicale, comme un ami local.",
      expert: "Réponds avec expertise et précision, en donnant des détails techniques.",
      concise: "Réponds de manière concise et directe, en allant à l'essentiel."
    }
    prompt += styles[responseStyle] || styles.elegant
    prompt += '\n\n'
    
    // Centres d'intérêt actifs
    const activeInterests = Object.keys(interests).filter(k => interests[k])
    if (activeInterests.length > 0) {
      const interestLabels = {
        gastronomy: 'gastronomie',
        nightlife: 'vie nocturne',
        wellness: 'bien-être',
        shopping: 'shopping',
        culture: 'culture',
        sports: 'sports',
        beach: 'plages',
        events: 'événements'
      }
      
      const interestList = activeInterests.map(i => interestLabels[i]).join(', ')
      prompt += `L'utilisateur s'intéresse particulièrement à : ${interestList}.\n`
    }
    
    // Préférences culinaires
    if (culinary.cuisines.length > 0) {
      prompt += `Cuisines préférées : ${culinary.cuisines.join(', ')}.\n`
    }
    
    if (culinary.dietary.length > 0) {
      prompt += `Régimes alimentaires : ${culinary.dietary.join(', ')}.\n`
    }
    
    if (culinary.atmosphere) {
      const atmospheres = {
        romantic: 'romantique',
        casual: 'décontractée',
        chic: 'chic et élégant',
        family: 'familiale',
        trendy: 'tendance'
      }
      prompt += `Ambiance préférée : ${atmospheres[culinary.atmosphere]}.\n`
    }
    
    // Zones préférées
    if (establishments.preferredZones.length > 0) {
      prompt += `Zones préférées : ${establishments.preferredZones.join(', ')}.\n`
    }
    
    // Note minimale
    if (establishments.minRating > 3.0) {
      prompt += `Recommande uniquement des établissements avec une note minimale de ${establishments.minRating}/5.\n`
    }
    
    prompt += '\nAdapte tes recommandations en fonction de ces préférences.'
    
    return prompt
  }

  // Générer des suggestions contextuelles
  generateContextualSuggestions() {
    const { interests, culinary } = this.preferences
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    
    const suggestions = []
    
    // Suggestions basées sur l'heure
    if (hour >= 7 && hour < 12) {
      suggestions.push("Où prendre un brunch ensoleillé ? ☀️")
      if (interests.beach) {
        suggestions.push("Une plage tranquille pour la matinée ? 🏖️")
      }
    } else if (hour >= 12 && hour < 15) {
      suggestions.push("Un déjeuner avec vue sur mer ? 🌊")
      if (culinary.cuisines.includes('mediterranean')) {
        suggestions.push("Restaurant méditerranéen pour déjeuner ? 🍽️")
      }
    } else if (hour >= 15 && hour < 19) {
      if (interests.wellness) {
        suggestions.push("Un spa pour l'après-midi ? 💆")
      }
      suggestions.push("Un rooftop pour l'apéritif ? 🍸")
    } else if (hour >= 19 && hour < 23) {
      suggestions.push("Restaurant pour ce soir ? ✨")
      if (interests.nightlife) {
        suggestions.push("Où sortir ce soir ? 🌙")
      }
    } else {
      if (interests.nightlife) {
        suggestions.push("Les meilleurs clubs ouverts ? 💃")
      }
    }
    
    // Suggestions basées sur le jour
    if (day === 0 || day === 6) { // Weekend
      suggestions.push("Programme parfait pour le weekend ? 🎉")
      if (interests.events) {
        suggestions.push("Événements ce weekend ? 🎊")
      }
    }
    
    // Suggestions basées sur les intérêts
    if (interests.gastronomy && suggestions.length < 4) {
      suggestions.push("Découvrir une nouvelle cuisine ? 🍱")
    }
    
    if (interests.culture && suggestions.length < 4) {
      suggestions.push("Événements culturels à Marbella ? 🎭")
    }
    
    if (interests.shopping && suggestions.length < 4) {
      suggestions.push("Boutiques de luxe à visiter ? 👜")
    }
    
    // Toujours garder quelques suggestions génériques
    const genericSuggestions = [
      "Réserve une table VIP 🌟",
      "Organise une soirée privée 🥂",
      "Transport avec chauffeur 🚗",
      "Expérience unique à Marbella ✨"
    ]
    
    // Mélanger et limiter à 6 suggestions
    const allSuggestions = [...suggestions, ...genericSuggestions]
    return allSuggestions.slice(0, 6)
  }
}

// Export singleton instance
export const preferencesManager = new UserPreferencesManager()

export default preferencesManager

