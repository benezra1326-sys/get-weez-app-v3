// 🧠 COMPRÉHENSION CONTEXTUELLE AVANCÉE
// Objectif : L'IA doit comprendre les demandes spécifiques et y répondre précisément

export class ContextualUnderstanding {
  constructor() {
    this.contextPatterns = {
      // Détection de demandes spécifiques
      specificRequests: {
        yachtOnly: /(?:juste|seulement|sans.*restaurant|sans.*manger|diner.*sur.*yacht|yacht.*avec.*dj|yacht.*seulement)/i,
        restaurantOnly: /(?:juste|seulement|sans.*yacht).*(?:manger|dîner|restaurant)/i,
        capacity: /(\d+)\s*(?:personnes?|gens?|invités?)/i,
        time: /(?:demain|ce soir|aujourd'hui|ce weekend)/i,
        romantic: /(?:romantique|avec.*femme|avec.*mari|en couple)/i,
        simpleYacht: /(?:yacht|bateau)/i,
        simpleRestaurant: /(?:manger|dîner|restaurant)/i
      },
      
      // Réponses contextuelles
      contextualResponses: {
        yachtOnly: [
          "Parfait ! Pour un yacht avec DJ, je te recommande le Yacht de Luxe - 12 personnes, DJ, Bar, Cuisine. Contact : +34 952 77 99 99",
          "Excellent ! Pour un yacht avec DJ, le Yacht Premium est parfait - 8 personnes, DJ, Bar, Spa. Contact : +34 952 77 99 99",
          "Super ! Pour un yacht avec DJ, le Yacht Exclusif est idéal - 16 personnes, DJ, Bar, Cuisine, Spa. Contact : +34 952 77 99 99"
        ],
        restaurantOnly: [
          "Parfait ! Pour un dîner, je te recommande La Terraza del Mar - vue imprenable sur la mer et ambiance intime. Contact : +34 952 77 11 11",
          "Excellent ! Pour un dîner, Casa Tua est parfait - cuisine italienne authentique dans un cadre élégant. Contact : +34 952 77 22 22",
          "Super ! Pour un dîner, le Marbella Club Hotel Restaurant est idéal - expérience gastronomique raffinée. Contact : +34 952 77 44 44"
        ]
      }
    }
  }

  // === ANALYSER LE CONTEXTE ===
  analyzeContext(message, conversationHistory = []) {
    const msg = message.toLowerCase()
    const context = {
      isYachtOnly: false,
      isRestaurantOnly: false,
      capacity: null,
      time: null,
      romantic: false,
      specificRequest: false
    }

    // Détecter yacht seulement
    if (this.contextPatterns.specificRequests.yachtOnly.test(msg)) {
      context.isYachtOnly = true
      context.specificRequest = true
    }

    // Détecter restaurant seulement
    if (this.contextPatterns.specificRequests.restaurantOnly.test(msg)) {
      context.isRestaurantOnly = true
      context.specificRequest = true
    }

    // Détecter yacht simple (fallback)
    if (!context.specificRequest && this.contextPatterns.specificRequests.simpleYacht.test(msg)) {
      context.isYachtOnly = true
      context.specificRequest = true
    }

    // Détecter restaurant simple (fallback)
    if (!context.specificRequest && this.contextPatterns.specificRequests.simpleRestaurant.test(msg)) {
      context.isRestaurantOnly = true
      context.specificRequest = true
    }

    // Détecter capacité
    const capacityMatch = msg.match(this.contextPatterns.specificRequests.capacity)
    if (capacityMatch) {
      context.capacity = parseInt(capacityMatch[1])
    }

    // Détecter temps
    if (this.contextPatterns.specificRequests.time.test(msg)) {
      context.time = this.extractTime(msg)
    }

    // Détecter romantique
    if (this.contextPatterns.specificRequests.romantic.test(msg)) {
      context.romantic = true
    }

    return context
  }

  // === GÉNÉRER RÉPONSE CONTEXTUELLE ===
  generateContextualResponse(message, conversationHistory = []) {
    const context = this.analyzeContext(message, conversationHistory)
    
    if (context.specificRequest) {
      return this.generateSpecificResponse(context)
    }
    
    return null
  }

  // === GÉNÉRER RÉPONSE SPÉCIFIQUE ===
  generateSpecificResponse(context) {
    let response = ""

    if (context.isYachtOnly) {
      // Adapter selon la capacité
      if (context.capacity) {
        if (context.capacity <= 8) {
          response = "Parfait ! Pour un yacht avec DJ, le Yacht Premium est idéal - 8 personnes, DJ, Bar, Spa. Contact : +34 952 77 99 99"
        } else if (context.capacity <= 12) {
          response = "Parfait ! Pour un yacht avec DJ, le Yacht de Luxe est parfait - 12 personnes, DJ, Bar, Cuisine. Contact : +34 952 77 99 99"
        } else {
          response = "Parfait ! Pour un yacht avec DJ, le Yacht Exclusif est idéal - 16 personnes, DJ, Bar, Cuisine, Spa. Contact : +34 952 77 99 99"
        }
      } else {
        const yachtResponses = this.contextPatterns.contextualResponses.yachtOnly
        response = yachtResponses[Math.floor(Math.random() * yachtResponses.length)]
      }
    }

    if (context.isRestaurantOnly) {
      // Adapter selon le contexte romantique
      if (context.romantic) {
        response = "Parfait ! Pour un dîner romantique, je te recommande La Terraza del Mar - vue imprenable sur la mer et ambiance intime. Contact : +34 952 77 11 11"
      } else {
        const restaurantResponses = this.contextPatterns.contextualResponses.restaurantOnly
        response = restaurantResponses[Math.floor(Math.random() * restaurantResponses.length)]
      }
    }

    return response
  }

  // === EXTRAIRE LE TEMPS ===
  extractTime(message) {
    if (message.includes('demain')) return 'demain'
    if (message.includes('ce soir')) return 'ce soir'
    if (message.includes('aujourd\'hui')) return 'aujourd\'hui'
    if (message.includes('ce weekend')) return 'ce weekend'
    return null
  }

  // === DÉTECTER DEMANDE SPÉCIFIQUE ===
  isSpecificRequest(message) {
    const context = this.analyzeContext(message)
    return context.specificRequest
  }
}

// === EXPORT POUR UTILISATION ===
export const contextualUnderstanding = new ContextualUnderstanding()
