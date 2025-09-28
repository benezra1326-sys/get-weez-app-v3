// 🎭 RÉPONSES DYNAMIQUES - ÉVITER LA RÉPÉTITION
// Objectif : L'IA doit être naturelle et variée, pas robotique

export class DynamicResponses {
  constructor() {
    this.responseHistory = new Map()
    this.responseTemplates = {
      greetings: [
        "Salut ! Qu'est-ce qui te ferait plaisir ?",
        "Hello ! Comment puis-je t'aider ?",
        "Bonjour ! Qu'est-ce qui te tente ?",
        "Salut ! De quoi as-tu envie ?",
        "Hey ! Qu'est-ce qui te tente ?",
        "Coucou ! Qu'est-ce qui te ferait plaisir ?",
        "Salut ! Tu cherches quoi ?",
        "Hello ! Qu'est-ce qui te ferait plaisir ?"
      ],
      food: [
        "Parfait ! Pour manger, j'ai plusieurs excellentes options. Qu'est-ce qui te tente ?",
        "Super ! J'ai de super adresses pour toi. Tu veux quoi ?",
        "Excellent ! Pour manger, j'ai du choix. Qu'est-ce qui te plaît ?",
        "Parfait ! J'ai plusieurs bonnes adresses. Qu'est-ce qui te ferait plaisir ?",
        "Super ! Pour manger, j'ai plusieurs options. Qu'est-ce qui te tente ?",
        "Excellent ! J'ai de super endroits. Qu'est-ce qui te tente ?",
        "Parfait ! Pour manger, j'ai du choix. Qu'est-ce qui te plaît ?",
        "Super ! J'ai plusieurs bonnes adresses. Qu'est-ce qui te ferait plaisir ?"
      ],
      romantic: [
        "Parfait ! Pour un moment romantique, je te recommande La Terraza del Mar - vue imprenable sur la mer et ambiance intime.",
        "Excellent ! Pour un dîner romantique, La Terraza del Mar est parfait - vue sur la mer et ambiance intime.",
        "Super ! Pour un moment romantique, La Terraza del Mar est idéal - vue imprenable et ambiance intime.",
        "Parfait ! Pour un dîner romantique, je te conseille La Terraza del Mar - vue sur la mer et ambiance intime.",
        "Excellent ! Pour un moment romantique, La Terraza del Mar est parfait - vue imprenable et ambiance intime.",
        "Super ! Pour un dîner romantique, La Terraza del Mar est idéal - vue sur la mer et ambiance intime.",
        "Parfait ! Pour un moment romantique, je te recommande La Terraza del Mar - vue imprenable et ambiance intime.",
        "Excellent ! Pour un dîner romantique, La Terraza del Mar est parfait - vue sur la mer et ambiance intime."
      ],
      festive: [
        "Parfait ! Pour faire la fête, Ocean Club est l'endroit idéal - ambiance moderne avec DJ et terrasse avec vue.",
        "Super ! Pour une soirée festive, Ocean Club est parfait - ambiance moderne, DJ et terrasse avec vue.",
        "Excellent ! Pour faire la fête, Ocean Club est l'endroit idéal - ambiance moderne avec DJ et terrasse.",
        "Parfait ! Pour une soirée festive, Ocean Club est parfait - ambiance moderne, DJ et terrasse avec vue.",
        "Super ! Pour faire la fête, Ocean Club est l'endroit idéal - ambiance moderne avec DJ et terrasse.",
        "Excellent ! Pour une soirée festive, Ocean Club est parfait - ambiance moderne, DJ et terrasse avec vue.",
        "Parfait ! Pour faire la fête, Ocean Club est l'endroit idéal - ambiance moderne avec DJ et terrasse.",
        "Super ! Pour une soirée festive, Ocean Club est parfait - ambiance moderne, DJ et terrasse avec vue."
      ]
    }
    
    this.establishments = {
      romantic: [
        {
          name: "La Terraza del Mar",
          description: "vue imprenable sur la mer et ambiance intime",
          contact: "+34 952 77 11 11"
        },
        {
          name: "Casa Tua",
          description: "cuisine italienne authentique dans un cadre élégant",
          contact: "+34 952 77 22 22"
        },
        {
          name: "Marbella Club Hotel Restaurant",
          description: "expérience gastronomique raffinée avec vue sur la mer",
          contact: "+34 952 77 44 44"
        }
      ],
      festive: [
        {
          name: "Ocean Club",
          description: "ambiance moderne avec DJ et terrasse avec vue",
          contact: "+34 952 77 00 00"
        },
        {
          name: "Nikki Beach Marbella",
          description: "beach club emblématique avec fêtes exclusives",
          contact: "+34 952 77 55 55"
        },
        {
          name: "Breathe Marbella",
          description: "rooftop éco-chic avec cocktails premium",
          contact: "+34 952 77 66 66"
        }
      ]
    }
  }

  // === GÉNÉRER UNE RÉPONSE DYNAMIQUE ===
  generateDynamicResponse(message, userType = 'guest', conversationHistory = []) {
    const msg = message.toLowerCase()
    
    // Détecter le type de demande
    const requestType = this.detectRequestType(msg)
    
    // Éviter la répétition
    const usedResponses = this.getUsedResponses(conversationHistory, requestType)
    
    // Générer une réponse variée
    const response = this.generateVariedResponse(requestType, usedResponses, userType)
    
    // Enregistrer la réponse utilisée
    this.recordResponse(response, requestType)
    
    return response
  }

  // === DÉTECTER LE TYPE DE DEMANDE ===
  detectRequestType(message) {
    if (message.includes('manger') || message.includes('dîner') || message.includes('restaurant')) {
      return 'food'
    }
    
    if (message.includes('romantique') || message.includes('couple') || message.includes('intime')) {
      return 'romantic'
    }
    
    if (message.includes('fête') || message.includes('festif') || message.includes('danser') || message.includes('dj')) {
      return 'festive'
    }
    
    if (message.includes('yacht') || message.includes('bateau') || message.includes('louer')) {
      return 'yacht'
    }
    
    return 'general'
  }

  // === OBTENIR LES RÉPONSES UTILISÉES ===
  getUsedResponses(conversationHistory, requestType) {
    const usedResponses = []
    
    for (const msg of conversationHistory) {
      if (msg.sender === 'ai') {
        const responseType = this.detectRequestType(msg.text)
        if (responseType === requestType) {
          usedResponses.push(msg.text)
        }
      }
    }
    
    return usedResponses
  }

  // === GÉNÉRER UNE RÉPONSE VARIÉE ===
  generateVariedResponse(requestType, usedResponses, userType) {
    let response = ""
    
    switch (requestType) {
      case 'food':
        response = this.generateFoodResponse(usedResponses, userType)
        break
      case 'romantic':
        response = this.generateRomanticResponse(usedResponses, userType)
        break
      case 'festive':
        response = this.generateFestiveResponse(usedResponses, userType)
        break
      case 'yacht':
        response = this.generateYachtResponse(usedResponses, userType)
        break
      default:
        response = this.generateGeneralResponse(usedResponses, userType)
    }
    
    return response
  }

  // === GÉNÉRER RÉPONSE POUR NOURRITURE ===
  generateFoodResponse(usedResponses, userType) {
    const templates = this.responseTemplates.food
    const availableTemplates = templates.filter(template => !usedResponses.includes(template))
    
    if (availableTemplates.length === 0) {
      // Si toutes les réponses ont été utilisées, en générer une nouvelle
      return this.generateNewFoodResponse(userType)
    }
    
    const selectedTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
    return selectedTemplate
  }

  // === GÉNÉRER NOUVELLE RÉPONSE NOURRITURE ===
  generateNewFoodResponse(userType) {
    const variations = [
      "Parfait ! Pour manger, j'ai plusieurs excellentes options. Qu'est-ce qui te tente ?",
      "Super ! J'ai de super adresses pour toi. Tu veux quoi ?",
      "Excellent ! Pour manger, j'ai du choix. Qu'est-ce qui te plaît ?",
      "Parfait ! J'ai plusieurs bonnes adresses. Qu'est-ce qui te ferait plaisir ?",
      "Super ! Pour manger, j'ai plusieurs options. Qu'est-ce qui te tente ?",
      "Excellent ! J'ai de super endroits. Qu'est-ce qui te branche ?",
      "Parfait ! Pour manger, j'ai du choix. Qu'est-ce qui te plaît ?",
      "Super ! J'ai plusieurs bonnes adresses. Qu'est-ce qui te ferait plaisir ?"
    ]
    
    return variations[Math.floor(Math.random() * variations.length)]
  }

  // === GÉNÉRER RÉPONSE ROMANTIQUE ===
  generateRomanticResponse(usedResponses, userType) {
    const establishments = this.establishments.romantic
    const selectedEstablishment = establishments[Math.floor(Math.random() * establishments.length)]
    
    const templates = [
      `Parfait ! Pour un moment romantique, je te recommande ${selectedEstablishment.name} - ${selectedEstablishment.description}.`,
      `Excellent ! Pour un dîner romantique, ${selectedEstablishment.name} est parfait - ${selectedEstablishment.description}.`,
      `Super ! Pour un moment romantique, ${selectedEstablishment.name} est idéal - ${selectedEstablishment.description}.`,
      `Parfait ! Pour un dîner romantique, je te conseille ${selectedEstablishment.name} - ${selectedEstablishment.description}.`
    ]
    
    const availableTemplates = templates.filter(template => !usedResponses.includes(template))
    
    if (availableTemplates.length === 0) {
      return this.generateNewRomanticResponse(selectedEstablishment)
    }
    
    return availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
  }

  // === GÉNÉRER NOUVELLE RÉPONSE ROMANTIQUE ===
  generateNewRomanticResponse(establishment) {
    const variations = [
      `Parfait ! Pour un moment romantique, je te recommande ${establishment.name} - ${establishment.description}.`,
      `Excellent ! Pour un dîner romantique, ${establishment.name} est parfait - ${establishment.description}.`,
      `Super ! Pour un moment romantique, ${establishment.name} est idéal - ${establishment.description}.`,
      `Parfait ! Pour un dîner romantique, je te conseille ${establishment.name} - ${establishment.description}.`
    ]
    
    return variations[Math.floor(Math.random() * variations.length)]
  }

  // === GÉNÉRER RÉPONSE FESTIVE ===
  generateFestiveResponse(usedResponses, userType) {
    const establishments = this.establishments.festive
    const selectedEstablishment = establishments[Math.floor(Math.random() * establishments.length)]
    
    const templates = [
      `Parfait ! Pour faire la fête, ${selectedEstablishment.name} est l'endroit idéal - ${selectedEstablishment.description}.`,
      `Super ! Pour une soirée festive, ${selectedEstablishment.name} est parfait - ${selectedEstablishment.description}.`,
      `Excellent ! Pour faire la fête, ${selectedEstablishment.name} est l'endroit idéal - ${selectedEstablishment.description}.`,
      `Parfait ! Pour une soirée festive, ${selectedEstablishment.name} est parfait - ${selectedEstablishment.description}.`
    ]
    
    const availableTemplates = templates.filter(template => !usedResponses.includes(template))
    
    if (availableTemplates.length === 0) {
      return this.generateNewFestiveResponse(selectedEstablishment)
    }
    
    return availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
  }

  // === GÉNÉRER NOUVELLE RÉPONSE FESTIVE ===
  generateNewFestiveResponse(establishment) {
    const variations = [
      `Parfait ! Pour faire la fête, ${establishment.name} est l'endroit idéal - ${establishment.description}.`,
      `Super ! Pour une soirée festive, ${establishment.name} est parfait - ${establishment.description}.`,
      `Excellent ! Pour faire la fête, ${establishment.name} est l'endroit idéal - ${establishment.description}.`,
      `Parfait ! Pour une soirée festive, ${establishment.name} est parfait - ${establishment.description}.`
    ]
    
    return variations[Math.floor(Math.random() * variations.length)]
  }

  // === GÉNÉRER RÉPONSE YACHT ===
  generateYachtResponse(usedResponses, userType) {
    const yachtOptions = [
      {
        name: "Yacht de Luxe",
        capacity: "12 personnes",
        features: "DJ, Bar, Cuisine",
        contact: "+34 952 77 99 99"
      },
      {
        name: "Yacht Premium",
        capacity: "8 personnes",
        features: "DJ, Bar, Spa",
        contact: "+34 952 77 99 99"
      },
      {
        name: "Yacht Exclusif",
        capacity: "16 personnes",
        features: "DJ, Bar, Cuisine, Spa",
        contact: "+34 952 77 99 99"
      }
    ]
    
    const selectedYacht = yachtOptions[Math.floor(Math.random() * yachtOptions.length)]
    
    const templates = [
      `Parfait ! Pour un yacht avec DJ, je te recommande ${selectedYacht.name} - ${selectedYacht.capacity}, ${selectedYacht.features}.`,
      `Excellent ! Pour un yacht avec DJ, ${selectedYacht.name} est parfait - ${selectedYacht.capacity}, ${selectedYacht.features}.`,
      `Super ! Pour un yacht avec DJ, ${selectedYacht.name} est idéal - ${selectedYacht.capacity}, ${selectedYacht.features}.`,
      `Parfait ! Pour un yacht avec DJ, je te conseille ${selectedYacht.name} - ${selectedYacht.capacity}, ${selectedYacht.features}.`
    ]
    
    const availableTemplates = templates.filter(template => !usedResponses.includes(template))
    
    if (availableTemplates.length === 0) {
      return this.generateNewYachtResponse(selectedYacht)
    }
    
    return availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
  }

  // === GÉNÉRER NOUVELLE RÉPONSE YACHT ===
  generateNewYachtResponse(yacht) {
    const variations = [
      `Parfait ! Pour un yacht avec DJ, je te recommande ${yacht.name} - ${yacht.capacity}, ${yacht.features}.`,
      `Excellent ! Pour un yacht avec DJ, ${yacht.name} est parfait - ${yacht.capacity}, ${yacht.features}.`,
      `Super ! Pour un yacht avec DJ, ${yacht.name} est idéal - ${yacht.capacity}, ${yacht.features}.`,
      `Parfait ! Pour un yacht avec DJ, je te conseille ${yacht.name} - ${yacht.capacity}, ${yacht.features}.`
    ]
    
    return variations[Math.floor(Math.random() * variations.length)]
  }

  // === GÉNÉRER RÉPONSE GÉNÉRALE ===
  generateGeneralResponse(usedResponses, userType) {
    const templates = this.responseTemplates.greetings
    const availableTemplates = templates.filter(template => !usedResponses.includes(template))
    
    if (availableTemplates.length === 0) {
      return "Salut ! Qu'est-ce qui te ferait plaisir ?"
    }
    
    return availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
  }

  // === ENREGISTRER UNE RÉPONSE ===
  recordResponse(response, requestType) {
    if (!this.responseHistory.has(requestType)) {
      this.responseHistory.set(requestType, [])
    }
    
    const history = this.responseHistory.get(requestType)
    history.push(response)
    
    // Garder seulement les 10 dernières réponses
    if (history.length > 10) {
      history.shift()
    }
  }

  // === RÉINITIALISER L'HISTORIQUE ===
  resetHistory() {
    this.responseHistory.clear()
  }
}

// === EXPORT POUR UTILISATION ===
export const dynamicResponses = new DynamicResponses()
