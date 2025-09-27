// 🧠 SYSTÈME DE RECOMMANDATIONS INTELLIGENTES
// Objectif : L'IA peut répondre à des questions spécifiques sur les plats et établissements

export class IntelligentRecommendations {
  constructor() {
    this.dishDatabase = new Map()
    this.establishmentDatabase = new Map()
    this.initializeDishDatabase()
  }

  // === BASE DE DONNÉES DES PLATS ===
  initializeDishDatabase() {
    const dishes = [
      {
        name: 'paella',
        variations: ['paella de mariscos', 'paella valenciana', 'paella mixta', 'paella de pollo'],
        bestEstablishments: [
          {
            id: 'ocean-club',
            name: 'Ocean Club',
            dish: 'Paella de mariscos',
            price: '32€',
            description: 'Paella aux fruits de mer, safran, riz bomba',
            rating: 4.8,
            why: 'Fruits de mer frais, safran authentique, riz bomba de qualité'
          },
          {
            id: 'la-terraza-del-mar',
            name: 'La Terraza del Mar',
            dish: 'Paella de mariscos',
            price: '28€',
            description: 'Paella aux fruits de mer, vue sur la mer',
            rating: 4.7,
            why: 'Vue imprenable, fruits de mer du jour, ambiance romantique'
          }
        ],
        keywords: ['paella', 'riz', 'fruits de mer', 'safran', 'espagnol', 'méditerranéen']
      },
      {
        name: 'sushi',
        variations: ['sashimi', 'maki', 'nigiri', 'temaki', 'uramaki'],
        bestEstablishments: [
          {
            id: 'sake-bar-marbella',
            name: 'Sake Bar Marbella',
            dish: 'Sashimi de thon rouge',
            price: '25€',
            description: 'Sashimi de thon rouge frais, wasabi, gingembre',
            rating: 4.9,
            why: 'Poisson frais du jour, maître sushi japonais, ambiance zen'
          }
        ],
        keywords: ['sushi', 'sashimi', 'japonais', 'poisson cru', 'wasabi', 'gingembre']
      },
      {
        name: 'pasta',
        variations: ['spaghetti', 'penne', 'risotto', 'lasagne', 'ravioli'],
        bestEstablishments: [
          {
            id: 'casa-tua',
            name: 'Casa Tua',
            dish: 'Spaghetti alle vongole',
            price: '22€',
            description: 'Spaghetti aux palourdes, ail, persil',
            rating: 4.8,
            why: 'Pâtes fraîches, palourdes fraîches, recette authentique'
          }
        ],
        keywords: ['pasta', 'spaghetti', 'italien', 'pâtes', 'risotto', 'lasagne']
      },
      {
        name: 'steak',
        variations: ['côte de bœuf', 'filet', 'entrecôte', 'ribeye', 'wagyu'],
        bestEstablishments: [
          {
            id: 'ocean-club',
            name: 'Ocean Club',
            dish: 'Solomillo de ternera',
            price: '35€',
            description: 'Filet de bœuf, pommes de terre, sauce au poivre',
            rating: 4.7,
            why: 'Viande de qualité, cuisson parfaite, sauce au poivre maison'
          }
        ],
        keywords: ['steak', 'bœuf', 'viande', 'grillé', 'entrecôte', 'filet']
      }
    ]

    // Initialiser la base de données
    dishes.forEach(dish => {
      this.dishDatabase.set(dish.name, dish)
    })
  }

  // === RECHERCHE INTELLIGENTE ===
  findBestDish(dishQuery) {
    const query = dishQuery.toLowerCase()
    const results = []

    // Rechercher dans la base de données
    for (const [dishName, dishData] of this.dishDatabase) {
      let score = 0

      // Score basé sur les mots-clés
      dishData.keywords.forEach(keyword => {
        if (query.includes(keyword)) {
          score += 10
        }
      })

      // Score basé sur les variations
      dishData.variations.forEach(variation => {
        if (query.includes(variation.toLowerCase())) {
          score += 15
        }
      })

      if (score > 0) {
        results.push({
          dish: dishData,
          score,
          matches: this.findMatches(query, dishData)
        })
      }
    }

    return results.sort((a, b) => b.score - a.score)
  }

  // === TROUVER LES CORRESPONDANCES ===
  findMatches(query, dishData) {
    const matches = []
    
    dishData.keywords.forEach(keyword => {
      if (query.includes(keyword)) {
        matches.push(keyword)
      }
    })

    dishData.variations.forEach(variation => {
      if (query.includes(variation.toLowerCase())) {
        matches.push(variation)
      }
    })

    return matches
  }

  // === GÉNÉRER UNE RÉPONSE IA POUR PLAT SPÉCIFIQUE ===
  generateDishResponse(dishQuery, userType = 'guest') {
    const results = this.findBestDish(dishQuery)
    
    if (results.length === 0) {
      return {
        success: false,
        message: "Désolé, je n'ai pas trouvé d'établissements pour ce plat. Pouvez-vous être plus spécifique ?"
      }
    }

    const bestMatch = results[0]
    const dish = bestMatch.dish

    let aiResponse = `🍽️ **MEILLEURE ${dish.name.toUpperCase()} À MARBELLA**\n\n`
    
    aiResponse += `J'ai trouvé les meilleurs endroits pour déguster une excellente ${dish.name} :\n\n`

    dish.bestEstablishments.forEach((establishment, index) => {
      aiResponse += `**${index + 1}. ${establishment.name}**\n`
      aiResponse += `🍽️ **Plat** : ${establishment.dish}\n`
      aiResponse += `💰 **Prix** : ${establishment.price}\n`
      aiResponse += `⭐ **Note** : ${establishment.rating}/5\n`
      aiResponse += `📝 **Description** : ${establishment.description}\n`
      aiResponse += `🎯 **Pourquoi c'est le meilleur** : ${establishment.why}\n\n`
    })

    // Ajouter des informations supplémentaires
    aiResponse += `**Conseils de dégustation** :\n`
    if (dish.name === 'paella') {
      aiResponse += `• Demandez la paella pour 2 personnes minimum\n`
      aiResponse += `• Préférez les fruits de mer frais\n`
      aiResponse += `• Accompagnez d'un vin blanc sec\n`
    } else if (dish.name === 'sushi') {
      aiResponse += `• Demandez le sashimi du jour\n`
      aiResponse += `• Préférez le thon rouge\n`
      aiResponse += `• Accompagnez d'un saké premium\n`
    }

    aiResponse += `\n**Réservation** :\n`
    dish.bestEstablishments.forEach(establishment => {
      aiResponse += `📱 **${establishment.name}** : WhatsApp +34 952 77 00 00\n`
    })

    if (userType === 'member') {
      aiResponse += `\n🎯 **Avantages membre** :\n`
      aiResponse += `• Menu dégustation offert\n`
      aiResponse += `• Table préférée réservée\n`
      aiResponse += `• Service prioritaire\n`
    }

    aiResponse += `\n🍽️✨ Bon appétit !`

    return {
      success: true,
      message: aiResponse,
      dish: dish,
      establishments: dish.bestEstablishments
    }
  }

  // === RECHERCHE PAR AMBIANCE ===
  findByAmbiance(ambiance) {
    const establishments = [
      {
        id: 'la-terraza-del-mar',
        name: 'La Terraza del Mar',
        ambiance: 'romantique',
        bestDishes: ['Dorade royale aux herbes', 'Carpaccio de thon rouge'],
        why: 'Vue imprenable sur la mer, ambiance intime, parfait pour un dîner romantique'
      },
      {
        id: 'ocean-club',
        name: 'Ocean Club',
        ambiance: 'festif',
        bestDishes: ['Paella de mariscos', 'Jamón ibérico'],
        why: 'Ambiance moderne, DJ, terrasse avec vue, parfait pour faire la fête'
      },
      {
        id: 'casa-tua',
        name: 'Casa Tua',
        ambiance: 'élégant',
        bestDishes: ['Spaghetti alle vongole', 'Burrata di Puglia'],
        why: 'Cuisine italienne authentique, cadre élégant, parfait pour un dîner chic'
      }
    ]

    return establishments.filter(est => est.ambiance === ambiance)
  }

  // === RECHERCHE PAR BUDGET ===
  findByBudget(budget) {
    const budgetRanges = {
      'économique': { min: 0, max: 20 },
      'moyen': { min: 20, max: 40 },
      'élevé': { min: 40, max: 100 }
    }

    const range = budgetRanges[budget.toLowerCase()]
    if (!range) return []

    // Logique de filtrage par budget
    // Cette fonction serait implémentée avec la base de données des prix
    return []
  }

  // === RECHERCHE MULTICRITÈRES ===
  findMultiCriteria(criteria) {
    const results = []
    
    // Logique de recherche multicritères
    // Combiner ambiance, budget, type de cuisine, etc.
    
    return results
  }

  // === GÉNÉRER UNE RÉPONSE CONTEXTUELLE ===
  generateContextualResponse(userMessage, userType = 'guest') {
    const message = userMessage.toLowerCase()
    
    // Détecter le type de question
    if (message.includes('meilleur') || message.includes('meilleure')) {
      return this.generateDishResponse(userMessage, userType)
    }
    
    if (message.includes('romantique') || message.includes('intime')) {
      const establishments = this.findByAmbiance('romantique')
      return this.generateAmbianceResponse(establishments, 'romantique')
    }
    
    if (message.includes('festif') || message.includes('fête')) {
      const establishments = this.findByAmbiance('festif')
      return this.generateAmbianceResponse(establishments, 'festif')
    }
    
    if (message.includes('élégant') || message.includes('chic')) {
      const establishments = this.findByAmbiance('élégant')
      return this.generateAmbianceResponse(establishments, 'élégant')
    }
    
    // Réponse générique
    return {
      success: false,
      message: "Pouvez-vous être plus spécifique ? Je peux vous aider à trouver le meilleur restaurant selon vos critères."
    }
  }

  // === GÉNÉRER UNE RÉPONSE PAR AMBIANCE ===
  generateAmbianceResponse(establishments, ambiance) {
    let aiResponse = `🍽️ **MEILLEURS RESTAURANTS ${ambiance.toUpperCase()} À MARBELLA**\n\n`
    
    establishments.forEach((establishment, index) => {
      aiResponse += `**${index + 1}. ${establishment.name}**\n`
      aiResponse += `🎯 **Pourquoi c'est parfait** : ${establishment.why}\n`
      aiResponse += `🍽️ **Spécialités** : ${establishment.bestDishes.join(', ')}\n\n`
    })

    aiResponse += `**Réservation** :\n`
    establishments.forEach(establishment => {
      aiResponse += `📱 **${establishment.name}** : WhatsApp +34 952 77 00 00\n`
    })

    aiResponse += `\n🍽️✨ Bon appétit !`

    return {
      success: true,
      message: aiResponse,
      establishments: establishments
    }
  }
}

// === EXPORT POUR UTILISATION ===
export const intelligentRecommendations = new IntelligentRecommendations()
