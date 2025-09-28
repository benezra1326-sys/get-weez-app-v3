// Système de fallback intelligent et robuste pour Get Weez
import { establishments, events, activities } from '../data/marbella-data.js'

export class ImprovedFallbackSystem {
  constructor() {
    this.responseHistory = new Map()
    this.errorCount = 0
    this.maxErrors = 3
  }

  // Analyse intelligente du message
  analyzeMessage(message) {
    const msg = message.toLowerCase().trim()
    
    // Détection des intentions
    const intentions = {
      greeting: ['bonjour', 'salut', 'hello', 'hi', 'hey', 'coucou'],
      restaurant: ['restaurant', 'manger', 'diner', 'déjeuner', 'cuisine', 'table', 'réservation'],
      beach: ['plage', 'beach', 'transat', 'soleil', 'mer', 'océan'],
      club: ['club', 'sortir', 'soir', 'boire', 'danse', 'musique', 'party'],
      villa: ['villa', 'maison', 'logement', 'hébergement', 'evg', 'enterrement'],
      yacht: ['yacht', 'bateau', 'navigation', 'voile', 'croisière'],
      spa: ['spa', 'massage', 'relaxation', 'détente', 'wellness'],
      activity: ['activité', 'excursion', 'visite', 'découverte', 'aventure'],
      specific: this.detectSpecificEstablishments(msg),
      service: this.detectSpecificServices(msg),
      dish: this.detectSpecificDishes(msg)
    }

    // Trouver l'intention principale
    for (const [intent, keywords] of Object.entries(intentions)) {
      if (keywords && keywords.some(keyword => msg.includes(keyword))) {
        return {
          type: intent,
          confidence: this.calculateConfidence(msg, keywords),
          originalMessage: message
        }
      }
    }

    return { type: 'general', confidence: 0.5, originalMessage: message }
  }

  // Détection des établissements spécifiques
  detectSpecificEstablishments(message) {
    const specificEstablishments = []
    
    establishments.forEach(establishment => {
      const name = establishment.name.toLowerCase()
      const nameWords = name.split(' ')
      
      // Recherche exacte ou partielle
      if (message.includes(name) || nameWords.some(word => 
        message.includes(word) && word.length > 3
      )) {
        specificEstablishments.push(establishment)
      }
    })
    
    return specificEstablishments
  }

  // Détection des services spécifiques
  detectSpecificServices(message) {
    const services = []
    const serviceKeywords = {
      'spa': ['spa', 'massage', 'relaxation', 'détente', 'wellness'],
      'piscine': ['piscine', 'pool', 'swimming', 'bain', 'aqua'],
      'terrasse': ['terrasse', 'terrace', 'extérieur', 'dehors', 'balcon'],
      'vue mer': ['vue mer', 'sea view', 'océan', 'vue sur la mer', 'panoramique'],
      'parking': ['parking', 'garage', 'voiture', 'stationnement'],
      'wifi': ['wifi', 'internet', 'connexion', 'web'],
      'dj': ['dj', 'musique', 'mix', 'son', 'concert', 'live'],
      'bar': ['bar', 'cocktail', 'boisson', 'boire', 'alcool']
    }

    for (const [service, keywords] of Object.entries(serviceKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        services.push(service)
      }
    }

    return services
  }

  // Détection des plats spécifiques
  detectSpecificDishes(message) {
    const dishes = []
    const dishKeywords = {
      'sushi': ['sushi', 'sashimi', 'japonais', 'omakase'],
      'pizza': ['pizza', 'italien', 'pasta', 'risotto'],
      'poisson': ['poisson', 'fish', 'saumon', 'thon', 'cabillaud'],
      'viande': ['viande', 'steak', 'boeuf', 'agneau', 'porc'],
      'végétarien': ['végétarien', 'vegetarian', 'vegan', 'légumes'],
      'dessert': ['dessert', 'gâteau', 'glace', 'tarte', 'chocolat'],
      'cocktail': ['cocktail', 'mojito', 'margarita', 'martini'],
      'champagne': ['champagne', 'prosecco', 'bulles', 'mousseux']
    }

    for (const [dish, keywords] of Object.entries(dishKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        dishes.push(dish)
      }
    }

    return dishes
  }

  // Calcul de confiance
  calculateConfidence(message, keywords) {
    const matches = keywords.filter(keyword => message.includes(keyword)).length
    return Math.min(matches / keywords.length + 0.3, 1.0)
  }

  // Génération de réponse intelligente
  generateResponse(analysis) {
    const { type, confidence, originalMessage } = analysis

    // Réponses de base avec personnalité friendly
    const baseResponses = {
      greeting: [
        "Salut ! 😊 Je suis Get Weez, ton concierge personnel dévoué à Marbella ! Je suis là pour te faire vivre des expériences exceptionnelles. Que puis-je organiser pour toi aujourd'hui ?",
        "Bonjour ! 🌟 Get Weez à ton service ! Je suis ton concierge de luxe à Marbella, prêt à t'organiser des moments inoubliables. Que cherches-tu ?",
        "Hey ! 👋 Je suis Get Weez, ton assistant personnel pour Marbella ! Je peux t'aider avec tout ce dont tu as besoin. Dis-moi ce qui te ferait plaisir !"
      ],
      general: [
        "Je suis là pour t'aider ! 😊 Peux-tu me dire ce que tu cherches exactement ? Un restaurant, une plage, un club, une villa, un yacht ? Je vais te trouver le meilleur !",
        "Parfait ! Je suis ton concierge personnel à Marbella. Pour te donner les meilleures recommandations, dis-moi ce qui t'intéresse : gastronomie, détente, fête, ou aventure ?",
        "Excellent ! Get Weez est là pour t'organiser tout ce dont tu rêves à Marbella. Que puis-je faire pour toi aujourd'hui ?"
      ]
    }

    // Si établissement spécifique détecté
    if (type === 'specific' && analysis.specificEstablishments?.length > 0) {
      return this.generateSpecificEstablishmentResponse(analysis.specificEstablishments[0])
    }

    // Si services spécifiques détectés
    if (type === 'service' && analysis.services?.length > 0) {
      return this.generateServiceBasedResponse(analysis.services)
    }

    // Si plats spécifiques détectés
    if (type === 'dish' && analysis.dishes?.length > 0) {
      return this.generateDishBasedResponse(analysis.dishes)
    }

    // Réponses par catégorie
    switch (type) {
      case 'restaurant':
        return this.generateRestaurantResponse()
      case 'beach':
        return this.generateBeachResponse()
      case 'club':
        return this.generateClubResponse()
      case 'villa':
        return this.generateVillaResponse()
      case 'yacht':
        return this.generateYachtResponse()
      case 'spa':
        return this.generateSpaResponse()
      case 'activity':
        return this.generateActivityResponse()
      default:
        return this.getRandomResponse(baseResponses[type] || baseResponses.general)
    }
  }

  // Réponse pour établissement spécifique
  generateSpecificEstablishmentResponse(establishment) {
    const { name, type, category, rating, price_range, ambiance, features, sponsored, services, menu } = establishment
    
    let response = `Parfait ! 😊 **${name}** est un excellent choix ! `
    
    if (type === 'Restaurant') {
      response += `Restaurant ${category.toLowerCase()} avec une note de ${rating}/5. `
      if (price_range) response += `Prix : ${price_range}. `
      if (ambiance) response += `Ambiance : ${ambiance.toLowerCase()}. `
      if (services && services.length > 0) {
        response += `Services : ${services.slice(0, 3).join(', ').toLowerCase()}. `
      }
    }
    
    if (type === 'Plage') {
      response += `Plage ${category.toLowerCase()} avec transats à partir de 25€. `
      if (ambiance) response += `Ambiance : ${ambiance.toLowerCase()}. `
    }
    
    if (type === 'Club') {
      response += `Club ${category.toLowerCase()} avec ambiance ${ambiance.toLowerCase()}. `
      if (features) response += `Équipements : ${features.slice(0, 3).join(', ').toLowerCase()}. `
    }
    
    if (sponsored) {
      response += `💎 C'est l'un de nos partenaires privilégiés ! `
    }
    
    response += `Je peux réserver pour toi ! Dis-moi quand tu veux y aller ! 😊`
    
    return response
  }

  // Réponse basée sur les services
  generateServiceBasedResponse(services) {
    const matchingEstablishments = establishments.filter(establishment => 
      establishment.features && establishment.features.some(feature => 
        services.some(service => feature.toLowerCase().includes(service))
      )
    )

    if (matchingEstablishments.length === 0) {
      return `Je vois que tu cherches des services spécifiques ! 😊 Peux-tu me dire plus précisément ce que tu veux ? Je vais te trouver l'endroit parfait !`
    }

    let response = `Parfait ! 😊 Je vois que tu cherches des services spécifiques. Voici mes recommandations :\n\n`
    
    matchingEstablishments.slice(0, 3).forEach(establishment => {
      response += `⭐ **${establishment.name}**\n`
      response += `   • ${establishment.type} ${establishment.category.toLowerCase()} - Note : ${establishment.rating}/5\n`
      if (establishment.price_range) response += `   • Prix : ${establishment.price_range}\n`
      if (establishment.features) {
        const relevantFeatures = establishment.features.filter(f => 
          services.some(service => f.toLowerCase().includes(service))
        )
        if (relevantFeatures.length > 0) {
          response += `   • Services : ${relevantFeatures.slice(0, 3).join(', ').toLowerCase()}\n`
        }
      }
      if (establishment.sponsored) response += `   • 💎 Partenaire privilégié Get Weez !\n`
      response += `\n`
    })
    
    response += `Je peux réserver ces services pour toi ! Dis-moi ce qui t'intéresse le plus. 😊`
    
    return response
  }

  // Réponse basée sur les plats
  generateDishBasedResponse(dishes) {
    const matchingEstablishments = establishments.filter(establishment => 
      establishment.specialties && establishment.specialties.some(specialty => 
        dishes.some(dish => specialty.toLowerCase().includes(dish))
      ) || establishment.dishes && establishment.dishes.some(dishItem => 
        dishes.some(dish => dishItem.toLowerCase().includes(dish))
      )
    )

    if (matchingEstablishments.length === 0) {
      return `Je vois que tu cherches des plats spécifiques ! 😊 Peux-tu me dire plus précisément ce que tu veux manger ? Je vais te trouver le restaurant parfait !`
    }

    let response = `Excellent ! 😊 Je vois que tu cherches des plats spécifiques. Voici mes recommandations :\n\n`
    
    matchingEstablishments.slice(0, 3).forEach(establishment => {
      response += `🍽️ **${establishment.name}**\n`
      response += `   • ${establishment.type} ${establishment.category.toLowerCase()} - Note : ${establishment.rating}/5\n`
      if (establishment.price_range) response += `   • Prix : ${establishment.price_range}\n`
      if (establishment.specialties) {
        const relevantSpecialties = establishment.specialties.filter(s => 
          dishes.some(dish => s.toLowerCase().includes(dish))
        )
        if (relevantSpecialties.length > 0) {
          response += `   • Spécialités : ${relevantSpecialties.slice(0, 3).join(', ')}\n`
        }
      }
      if (establishment.sponsored) response += `   • 💎 Partenaire privilégié Get Weez !\n`
      response += `\n`
    })
    
    response += `Je peux réserver une table et commander ces plats pour toi ! 😊`
    
    return response
  }

  // Réponses par catégorie
  generateRestaurantResponse() {
    const restaurants = establishments.filter(e => e.type === 'Restaurant')
    const topRestaurants = restaurants.slice(0, 3)
    
    let response = `Parfait ! 😊 Pour un restaurant à Marbella, voici mes recommandations :\n\n`
    
    topRestaurants.forEach(restaurant => {
      response += `🍽️ **${restaurant.name}**\n`
      response += `   • Cuisine ${restaurant.category.toLowerCase()} - Note : ${restaurant.rating}/5\n`
      if (restaurant.price_range) response += `   • Prix : ${restaurant.price_range}\n`
      if (restaurant.ambiance) response += `   • Ambiance : ${restaurant.ambiance.toLowerCase()}\n`
      if (restaurant.sponsored) response += `   • 💎 Partenaire privilégié Get Weez !\n`
      response += `\n`
    })
    
    response += `Je peux réserver une table VIP pour toi ! 😊`
    return response
  }

  generateBeachResponse() {
    const beaches = establishments.filter(e => e.type === 'Plage')
    const topBeaches = beaches.slice(0, 3)
    
    let response = `Parfait ! 😊 Pour une plage à Marbella, voici mes recommandations :\n\n`
    
    topBeaches.forEach(beach => {
      response += `🏖️ **${beach.name}**\n`
      response += `   • ${beach.category} - Note : ${beach.rating}/5\n`
      if (beach.price_range) response += `   • Transats à partir de 25€\n`
      if (beach.ambiance) response += `   • Ambiance : ${beach.ambiance.toLowerCase()}\n`
      if (beach.sponsored) response += `   • 💎 Partenaire privilégié Get Weez !\n`
      response += `\n`
    })
    
    response += `Je peux réserver des transats VIP pour toi ! 😊`
    return response
  }

  generateClubResponse() {
    const clubs = establishments.filter(e => e.type === 'Club')
    const topClubs = clubs.slice(0, 3)
    
    let response = `Super ! 😊 Pour sortir à Marbella, voici mes recommandations :\n\n`
    
    topClubs.forEach(club => {
      response += `🎉 **${club.name}**\n`
      response += `   • ${club.category} - Note : ${club.rating}/5\n`
      if (club.ambiance) response += `   • Ambiance : ${club.ambiance.toLowerCase()}\n`
      if (club.features) response += `   • Équipements : ${club.features.slice(0, 3).join(', ').toLowerCase()}\n`
      if (club.sponsored) response += `   • 💎 Partenaire privilégié Get Weez !\n`
      response += `\n`
    })
    
    response += `Je peux réserver des tables VIP pour toi ! 😊`
    return response
  }

  generateVillaResponse() {
    const villas = establishments.filter(e => e.type === 'Villa')
    const topVillas = villas.slice(0, 3)
    
    let response = `Parfait ! 😊 Pour une villa à Marbella, voici mes recommandations :\n\n`
    
    topVillas.forEach(villa => {
      response += `🏡 **${villa.name}**\n`
      response += `   • ${villa.category} - Note : ${villa.rating}/5\n`
      if (villa.capacity) response += `   • Capacité : ${villa.capacity} personnes\n`
      if (villa.features) response += `   • Équipements : ${villa.features.slice(0, 3).join(', ').toLowerCase()}\n`
      if (villa.sponsored) response += `   • 💎 Partenaire privilégié Get Weez !\n`
      response += `\n`
    })
    
    response += `Je peux organiser la réservation pour toi ! 😊`
    return response
  }

  generateYachtResponse() {
    return `Parfait ! 😊 Pour un yacht à Marbella, je te recommande :

⛵ **Yacht Princess 50** - yacht de luxe avec 4 cabines, salon spacieux et équipement complet (€8000-12000/semaine)

⛵ **Yacht Sunseeker 60** - encore plus exclusif avec jacuzzi, bar et équipement de plongée (€12000-18000/semaine)

Je m'occupe de tout : capitaine, équipage, escales, réservations ! Dis-moi quand tu veux partir ! 😊`
  }

  generateSpaResponse() {
    const spaEstablishments = establishments.filter(e => 
      e.features && e.features.some(f => f.toLowerCase().includes('spa'))
    )
    
    if (spaEstablishments.length === 0) {
      return `Je vois que tu cherches un spa ! 😊 Pour des soins de luxe à Marbella, je peux t'organiser des massages privés, des soins spa, et des expériences wellness. Dis-moi ce que tu préfères !`
    }
    
    let response = `Parfait ! 😊 Pour un spa à Marbella, voici mes recommandations :\n\n`
    
    spaEstablishments.slice(0, 3).forEach(establishment => {
      response += `🧘 **${establishment.name}**\n`
      response += `   • ${establishment.type} ${establishment.category.toLowerCase()} - Note : ${establishment.rating}/5\n`
      if (establishment.sponsored) response += `   • 💎 Partenaire privilégié Get Weez !\n`
      response += `\n`
    })
    
    response += `Je peux réserver tes soins VIP ! 😊`
    return response
  }

  generateActivityResponse() {
    return `Parfait ! 😊 Pour des activités à Marbella, je peux t'organiser :

🏌️ **Golf VIP** - parcours exclusifs avec vue sur la mer
⛵ **Yacht privé** - croisières personnalisées
🏖️ **Excursions plages** - découverte des plus belles plages
🎯 **Activités nautiques** - jet-ski, paddle, plongée
🍽️ **Dégustations** - vins et spécialités locales

Dis-moi ce qui te tente le plus ! 😊`
  }

  // Obtenir une réponse aléatoire
  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Gestion des erreurs
  handleError(error, originalMessage) {
    this.errorCount++
    console.error('❌ Erreur dans le système de fallback:', error)
    
    if (this.errorCount >= this.maxErrors) {
      return "Désolé, je rencontre quelques difficultés techniques. 😅 Peux-tu reformuler ta demande ? Je suis là pour t'aider !"
    }
    
    // Essayer une réponse de base
    return this.generateResponse({ type: 'general', confidence: 0.5, originalMessage })
  }

  // Réinitialiser le compteur d'erreurs
  resetErrorCount() {
    this.errorCount = 0
  }
}

// Instance singleton
export const improvedFallback = new ImprovedFallbackSystem()
