// 🧠 COMPRÉHENSION AVANCÉE - DÉTECTION DE DEMANDES MULTIPLES
// Objectif : L'IA doit comprendre et répondre à toutes les demandes dans un message

export class AdvancedUnderstanding {
  constructor() {
    this.serviceCategories = {
      dining: ['dîner', 'diner', 'dinner', 'manger', 'restaurant', 'cuisine', 'repas', 'table'],
      yachting: ['yacht', 'bateau', 'boat', 'louer', 'rent', 'mer', 'sea', 'navigation'],
      entertainment: ['dj', 'musique', 'music', 'fête', 'party', 'soirée', 'evening', 'danser', 'dance'],
      transportation: ['voiture', 'car', 'taxi', 'transfert', 'transport', 'aéroport', 'airport'],
      accommodation: ['hôtel', 'hotel', 'chambre', 'room', 'suite', 'villa', 'appartement'],
      events: ['événement', 'event', 'mariage', 'wedding', 'anniversaire', 'birthday', 'célébration']
    }
    
    this.establishments = {
      restaurants: [
        { id: 'la-terraza-del-mar', name: 'La Terraza del Mar', type: 'romantique', capacity: 30 },
        { id: 'ocean-club', name: 'Ocean Club', type: 'festif', capacity: 50 },
        { id: 'casa-tua', name: 'Casa Tua', type: 'élégant', capacity: 40 }
      ],
      yachts: [
        { id: 'yacht-luxury', name: 'Yacht de Luxe', capacity: 12, features: ['DJ', 'Bar', 'Cuisine'] },
        { id: 'yacht-premium', name: 'Yacht Premium', capacity: 8, features: ['DJ', 'Bar', 'Spa'] },
        { id: 'yacht-exclusive', name: 'Yacht Exclusif', capacity: 16, features: ['DJ', 'Bar', 'Cuisine', 'Spa'] }
      ]
    }
  }

  // === ANALYSER UN MESSAGE COMPLEXE ===
  analyzeComplexMessage(message) {
    const msg = message.toLowerCase()
    const detectedServices = []
    const detectedPeople = []
    const detectedTime = []
    const detectedPreferences = []

    // Détecter les services demandés
    for (const [category, keywords] of Object.entries(this.serviceCategories)) {
      const matches = keywords.filter(keyword => msg.includes(keyword))
      if (matches.length > 0) {
        detectedServices.push({
          category,
          keywords: matches,
          confidence: matches.length / keywords.length
        })
      }
    }

    // Détecter les personnes
    const peopleKeywords = ['femme', 'mari', 'copain', 'copine', 'ami', 'amie', 'famille', 'groupe', 'équipe']
    peopleKeywords.forEach(keyword => {
      if (msg.includes(keyword)) {
        detectedPeople.push(keyword)
      }
    })

    // Détecter le temps
    const timeKeywords = ['demain', 'aujourd\'hui', 'ce soir', 'ce matin', 'cet après-midi', 'weekend', 'samedi', 'dimanche']
    timeKeywords.forEach(keyword => {
      if (msg.includes(keyword)) {
        detectedTime.push(keyword)
      }
    })

    // Détecter les préférences
    const preferenceKeywords = ['romantique', 'festif', 'élégant', 'chic', 'calme', 'animé', 'intime', 'exclusif']
    preferenceKeywords.forEach(keyword => {
      if (msg.includes(keyword)) {
        detectedPreferences.push(keyword)
      }
    })

    return {
      services: detectedServices,
      people: detectedPeople,
      time: detectedTime,
      preferences: detectedPreferences,
      isComplex: detectedServices.length > 1
    }
  }

  // === GÉNÉRER UNE RÉPONSE COMPLÈTE ===
  generateCompleteResponse(message, userType = 'guest') {
    const analysis = this.analyzeComplexMessage(message)
    
    if (!analysis.isComplex) {
      return {
        success: false,
        message: "Je n'ai pas détecté de demande complexe. Pouvez-vous être plus spécifique ?"
      }
    }

    let response = "🎉 **PLANNING COMPLET POUR VOTRE DEMANDE**\n\n"
    
    // Traiter chaque service détecté
    for (const service of analysis.services) {
      switch (service.category) {
        case 'dining':
          response += this.generateDiningResponse(analysis)
          break
        case 'yachting':
          response += this.generateYachtingResponse(analysis)
          break
        case 'entertainment':
          response += this.generateEntertainmentResponse(analysis)
          break
        default:
          response += this.generateGenericServiceResponse(service, analysis)
      }
    }

    // Ajouter les informations de contact et réservation
    response += this.generateContactAndReservationInfo(userType)

    return {
      success: true,
      message: response,
      analysis: analysis
    }
  }

  // === GÉNÉRER RÉPONSE POUR RESTAURATION ===
  generateDiningResponse(analysis) {
    let response = "🍽️ **RESTAURATION**\n\n"
    
    // Déterminer le type de restaurant selon les préférences
    let restaurantType = 'romantique'
    if (analysis.preferences.includes('festif')) {
      restaurantType = 'festif'
    } else if (analysis.preferences.includes('élégant')) {
      restaurantType = 'élégant'
    }

    const restaurant = this.establishments.restaurants.find(r => r.type === restaurantType)
    
    if (restaurant) {
      response += `**${restaurant.name}**\n`
      response += `📍 Type : ${restaurant.type}\n`
      response += `👥 Capacité : ${restaurant.capacity} personnes\n`
      response += `📱 WhatsApp : +34 952 77 11 11\n\n`
    }

    return response
  }

  // === GÉNÉRER RÉPONSE POUR YACHT ===
  generateYachtingResponse(analysis) {
    let response = "⛵ **YACHT AVEC DJ**\n\n"
    
    // Déterminer la taille du yacht selon le nombre de personnes
    let yachtSize = 'yacht-luxury'
    if (analysis.people.includes('groupe') || analysis.people.includes('équipe')) {
      yachtSize = 'yacht-exclusive'
    } else if (analysis.people.includes('famille')) {
      yachtSize = 'yacht-premium'
    }

    const yacht = this.establishments.yachts.find(y => y.id === yachtSize)
    
    if (yacht) {
      response += `**${yacht.name}**\n`
      response += `👥 Capacité : ${yacht.capacity} personnes\n`
      response += `🎵 Équipements : ${yacht.features.join(', ')}\n`
      response += `📱 WhatsApp : +34 952 77 99 99\n\n`
    }

    return response
  }

  // === GÉNÉRER RÉPONSE POUR DIVERTISSEMENT ===
  generateEntertainmentResponse(analysis) {
    let response = "🎵 **DIVERTISSEMENT**\n\n"
    
    if (analysis.preferences.includes('festif') || analysis.services.some(s => s.category === 'yachting')) {
      response += `**DJ inclus dans le yacht**\n`
      response += `🎵 Musique personnalisée\n`
      response += `🎤 Micro pour karaoké\n`
      response += `💃 Piste de danse\n\n`
    }

    return response
  }

  // === GÉNÉRER RÉPONSE GÉNÉRIQUE ===
  generateGenericServiceResponse(service, analysis) {
    return `**${service.category.toUpperCase()}**\n\nService détecté : ${service.keywords.join(', ')}\n\n`
  }

  // === GÉNÉRER INFORMATIONS DE CONTACT ===
  generateContactAndReservationInfo(userType) {
    let response = "📞 **RÉSERVATION ET CONTACT**\n\n"
    
    response += "**Pour réserver :**\n"
    response += "📱 WhatsApp général : +34 952 77 00 00\n"
    response += "📧 Email : info@getweez.com\n"
    response += "🌐 Site : www.getweez.com\n\n"
    
    if (userType === 'member') {
      response += "🎯 **Avantages membre :**\n"
      response += "• Réservation prioritaire\n"
      response += "• Réductions exclusives\n"
      response += "• Service personnalisé\n\n"
    }
    
    response += "**Prochaines étapes :**\n"
    response += "1. Confirmez vos préférences\n"
    response += "2. Choisissez vos créneaux\n"
    response += "3. Je m'occupe de tout !\n\n"
    response += "🍽️✨ Votre expérience parfaite vous attend !"
    
    return response
  }

  // === TESTER LA COMPRÉHENSION ===
  testUnderstanding(message) {
    const analysis = this.analyzeComplexMessage(message)
    const response = this.generateCompleteResponse(message)
    
    return {
      analysis,
      response,
      isUnderstood: analysis.isComplex && response.success
    }
  }
}

// === EXPORT POUR UTILISATION ===
export const advancedUnderstanding = new AdvancedUnderstanding()
