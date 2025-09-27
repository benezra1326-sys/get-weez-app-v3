// 🏢 GESTIONNAIRE D'ÉTABLISSEMENTS INTELLIGENT
// Objectif : Gérer les établissements avec menus automatiques et scraping intelligent

export class EstablishmentManager {
  constructor() {
    this.establishments = new Map()
    this.menuCache = new Map()
    this.instagramCache = new Map()
    this.pdfGenerator = null
  }

  // === ÉTABLISSEMENTS DE BASE ===
  initializeEstablishments() {
    const establishments = [
      {
        id: 'la-terraza-del-mar',
        name: 'La Terraza del Mar',
        type: 'Restaurant',
        category: 'Méditerranéen',
        location: 'Puerto Banús, Marbella',
        description: 'Restaurant avec vue imprenable sur la mer, ambiance intime et cuisine méditerranéenne raffinée.',
        ambiance: ['romantique', 'intime', 'vue mer', 'calme'],
        capacity: 30,
        openingHours: '19h-00h',
        contact: {
          whatsapp: '+34 952 77 11 11',
          website: 'www.terrazadelmar.com',
          phone: '+34 952 77 11 11',
          email: 'reservas@terrazadelmar.com',
          instagram: '@laterrazadelmar'
        },
        menu: {
          source: 'website',
          url: 'https://www.terrazadelmar.com/menu',
          lastUpdated: new Date().toISOString(),
          items: [
            {
              category: 'Entrées',
              items: [
                { name: 'Carpaccio de thon rouge', price: '18€', description: 'Thon rouge frais, huile d\'olive, roquette' },
                { name: 'Burrata de Puglia', price: '16€', description: 'Burrata fraîche, tomates cerises, basilic' },
                { name: 'Tartare de saumon', price: '17€', description: 'Saumon frais, avocat, citron vert' }
              ]
            },
            {
              category: 'Plats principaux',
              items: [
                { name: 'Dorade royale aux herbes', price: '28€', description: 'Dorade fraîche, herbes de Provence, légumes de saison' },
                { name: 'Risotto aux fruits de mer', price: '26€', description: 'Risotto crémeux, fruits de mer frais, parmesan' },
                { name: 'Côte de bœuf', price: '35€', description: 'Côte de bœuf grillée, pommes de terre, sauce béarnaise' }
              ]
            },
            {
              category: 'Desserts',
              items: [
                { name: 'Tiramisu aux fruits rouges', price: '12€', description: 'Tiramisu classique, fruits rouges frais' },
                { name: 'Tarte tatin', price: '11€', description: 'Tarte tatin aux pommes, glace vanille' },
                { name: 'Panna cotta', price: '10€', description: 'Panna cotta à la vanille, coulis de fruits' }
              ]
            }
          ]
        },
        bestDishes: [
          'Dorade royale aux herbes',
          'Carpaccio de thon rouge',
          'Risotto aux fruits de mer'
        ],
        wineList: [
          'Chardonnay local - 25€',
          'Sauvignon Blanc - 28€',
          'Pinot Grigio - 26€',
          'Champagne Dom Pérignon - 120€'
        ]
      },
      {
        id: 'ocean-club',
        name: 'Ocean Club',
        type: 'Beach Club, Restaurant',
        category: 'Méditerranéen, International',
        location: 'Puerto Banús, Marbella',
        description: 'Beach club moderne avec DJ, terrasse avec vue et atmosphère festive.',
        ambiance: ['festif', 'moderne', 'animé', 'DJ'],
        capacity: 50,
        openingHours: '20h-3h (weekend)',
        contact: {
          whatsapp: '+34 952 77 00 00',
          website: 'www.oceanclubmarbella.com',
          phone: '+34 952 77 00 00',
          email: 'info@oceanclubmarbella.com',
          instagram: '@oceanclubmarbella'
        },
        menu: {
          source: 'website',
          url: 'https://www.oceanclubmarbella.com/menu',
          lastUpdated: new Date().toISOString(),
          items: [
            {
              category: 'Tapas',
              items: [
                { name: 'Jamón ibérico', price: '22€', description: 'Jambon ibérique 24 mois, pain tomate' },
                { name: 'Gambas al ajillo', price: '18€', description: 'Crevettes à l\'ail, piment, persil' },
                { name: 'Croquetas de jamón', price: '14€', description: 'Croquettes de jambon, béchamel' }
              ]
            },
            {
              category: 'Plats principaux',
              items: [
                { name: 'Paella de mariscos', price: '32€', description: 'Paella aux fruits de mer, safran, riz bomba' },
                { name: 'Lubina a la sal', price: '28€', description: 'Loup de mer au sel, légumes vapeur' },
                { name: 'Solomillo de ternera', price: '35€', description: 'Filet de bœuf, pommes de terre, sauce au poivre' }
              ]
            },
            {
              category: 'Cocktails',
              items: [
                { name: 'Mojito Ocean', price: '14€', description: 'Mojito signature, menthe fraîche, rhum blanc' },
                { name: 'Piña Colada', price: '13€', description: 'Piña colada, coco, ananas' },
                { name: 'Margarita', price: '12€', description: 'Margarita, tequila, citron vert' }
              ]
            }
          ]
        },
        bestDishes: [
          'Paella de mariscos',
          'Jamón ibérico',
          'Lubina a la sal'
        ],
        wineList: [
          'Rioja Reserva - 35€',
          'Ribera del Duero - 40€',
          'Cava Brut - 25€',
          'Champagne Veuve Clicquot - 85€'
        ]
      },
      {
        id: 'casa-tua',
        name: 'Casa Tua',
        type: 'Restaurant',
        category: 'Italien',
        location: 'Marbella Centro',
        description: 'Cuisine italienne authentique dans un cadre élégant et intime.',
        ambiance: ['élégant', 'intime', 'italien', 'chic'],
        capacity: 40,
        openingHours: '19h30-23h30',
        contact: {
          whatsapp: '+34 952 77 22 22',
          website: 'www.casatuamarbella.com',
          phone: '+34 952 77 22 22',
          email: 'info@casatuamarbella.com',
          instagram: '@casatuamarbella'
        },
        menu: {
          source: 'website',
          url: 'https://www.casatuamarbella.com/menu',
          lastUpdated: new Date().toISOString(),
          items: [
            {
              category: 'Antipasti',
              items: [
                { name: 'Burrata di Puglia', price: '16€', description: 'Burrata fraîche, tomates cerises, basilic' },
                { name: 'Prosciutto di Parma', price: '18€', description: 'Jambon de Parme 24 mois, mozzarella' },
                { name: 'Carpaccio di manzo', price: '17€', description: 'Carpaccio de bœuf, roquette, parmesan' }
              ]
            },
            {
              category: 'Primi Piatti',
              items: [
                { name: 'Spaghetti alle vongole', price: '22€', description: 'Spaghetti aux palourdes, ail, persil' },
                { name: 'Risotto ai porcini', price: '24€', description: 'Risotto aux cèpes, parmesan, truffe' },
                { name: 'Penne all\'arrabbiata', price: '18€', description: 'Penne à l\'arrabbiata, tomates, piment' }
              ]
            },
            {
              category: 'Secondi Piatti',
              items: [
                { name: 'Osso buco alla milanese', price: '32€', description: 'Osso buco, risotto safran, gremolata' },
                { name: 'Branzino al sale', price: '28€', description: 'Loup de mer au sel, légumes vapeur' },
                { name: 'Tagliata di manzo', price: '35€', description: 'Tagliata de bœuf, roquette, parmesan' }
              ]
            }
          ]
        },
        bestDishes: [
          'Spaghetti alle vongole',
          'Burrata di Puglia',
          'Osso buco alla milanese'
        ],
        wineList: [
          'Chianti Classico - 30€',
          'Barolo - 45€',
          'Brunello di Montalcino - 55€',
          'Prosecco - 22€'
        ]
      }
    ]

    // Initialiser la map des établissements
    establishments.forEach(est => {
      this.establishments.set(est.id, est)
    })

    return establishments
  }

  // === RECHERCHE D'ÉTABLISSEMENTS ===
  searchEstablishments(query, filters = {}) {
    const results = []
    const queryLower = query.toLowerCase()

    for (const [id, establishment] of this.establishments) {
      let matches = false

      // Recherche par nom, description, type
      if (establishment.name.toLowerCase().includes(queryLower) ||
          establishment.description.toLowerCase().includes(queryLower) ||
          establishment.type.toLowerCase().includes(queryLower)) {
        matches = true
      }

      // Filtres
      if (filters.ambiance && !establishment.ambiance.some(a => a === filters.ambiance)) {
        matches = false
      }

      if (filters.type && establishment.type !== filters.type) {
        matches = false
      }

      if (matches) {
        results.push(establishment)
      }
    }

    return results
  }

  // === RECOMMANDATIONS INTELLIGENTES ===
  getRecommendations(userPreferences, userType = 'guest') {
    const recommendations = []

    for (const [id, establishment] of this.establishments) {
      let score = 0

      // Score basé sur les préférences
      if (userPreferences.ambiance) {
        if (establishment.ambiance.includes(userPreferences.ambiance)) {
          score += 10
        }
      }

      if (userPreferences.type) {
        if (establishment.type.includes(userPreferences.type)) {
          score += 10
        }
      }

      if (userPreferences.capacity && establishment.capacity >= userPreferences.capacity) {
        score += 5
      }

      // Bonus pour les membres
      if (userType === 'member') {
        score += 5
      }

      if (score > 0) {
        recommendations.push({
          establishment,
          score,
          reasons: this.generateReasons(establishment, userPreferences)
        })
      }
    }

    return recommendations.sort((a, b) => b.score - a.score)
  }

  // === GÉNÉRATION DE RAISONS ===
  generateReasons(establishment, userPreferences) {
    const reasons = []

    if (userPreferences.ambiance && establishment.ambiance.includes(userPreferences.ambiance)) {
      reasons.push(`Ambiance ${userPreferences.ambiance} parfaite`)
    }

    if (establishment.bestDishes.length > 0) {
      reasons.push(`Spécialités : ${establishment.bestDishes.join(', ')}`)
    }

    if (establishment.ambiance.includes('vue mer')) {
      reasons.push('Vue imprenable sur la mer')
    }

    if (establishment.ambiance.includes('romantique')) {
      reasons.push('Parfait pour un dîner romantique')
    }

    return reasons
  }

  // === GÉNÉRATION DE RÉPONSE IA ===
  generateAIResponse(establishment, userType = 'guest', userPreferences = {}) {
    const response = {
      establishment: establishment.name,
      description: establishment.description,
      location: establishment.location,
      contact: establishment.contact,
      menu: establishment.menu,
      bestDishes: establishment.bestDishes,
      wineList: establishment.wineList,
      reasons: this.generateReasons(establishment, userPreferences)
    }

    // Formatage pour l'IA
    let aiResponse = `🍽️ **${establishment.name}**\n`
    aiResponse += `📍 ${establishment.location}\n`
    aiResponse += `⏰ ${establishment.openingHours}\n`
    aiResponse += `👥 Capacité : ${establishment.capacity} personnes\n\n`
    
    aiResponse += `**Description** :\n${establishment.description}\n\n`
    
    aiResponse += `**Spécialités** :\n`
    establishment.bestDishes.forEach(dish => {
      aiResponse += `• ${dish}\n`
    })
    
    aiResponse += `\n**Menu du jour** :\n`
    establishment.menu.items.forEach(category => {
      aiResponse += `\n**${category.category}** :\n`
      category.items.forEach(item => {
        aiResponse += `• ${item.name} - ${item.price}\n`
        aiResponse += `  ${item.description}\n`
      })
    })
    
    aiResponse += `\n**Carte des vins** :\n`
    establishment.wineList.forEach(wine => {
      aiResponse += `• ${wine}\n`
    })
    
    aiResponse += `\n**Contact** :\n`
    aiResponse += `📱 WhatsApp : ${establishment.contact.whatsapp}\n`
    aiResponse += `🌐 Site : ${establishment.contact.website}\n`
    aiResponse += `📞 Téléphone : ${establishment.contact.phone}\n`
    aiResponse += `📧 Email : ${establishment.contact.email}\n`
    aiResponse += `📸 Instagram : ${establishment.contact.instagram}\n\n`
    
    if (userType === 'member') {
      aiResponse += `🎯 **Recommandation personnalisée** :\n`
      response.reasons.forEach(reason => {
        aiResponse += `• ${reason}\n`
      })
    }
    
    aiResponse += `\n🍽️✨ Bon appétit !`

    return {
      text: aiResponse,
      data: response
    }
  }

  // === GÉNÉRATION DE PDF MENU ===
  async generateMenuPDF(establishment) {
    // Cette fonction sera implémentée avec une librairie PDF
    const pdfData = {
      establishment: establishment.name,
      menu: establishment.menu,
      contact: establishment.contact,
      generatedAt: new Date().toISOString()
    }

    // Pour l'instant, retourner les données
    return pdfData
  }

  // === SCRAPING AUTOMATIQUE ===
  async scrapeMenu(establishment) {
    // Cette fonction sera implémentée avec un scraper
    // Pour l'instant, retourner les données existantes
    return establishment.menu
  }

  // === MISE À JOUR DES MENUS ===
  async updateMenus() {
    for (const [id, establishment] of this.establishments) {
      try {
        const updatedMenu = await this.scrapeMenu(establishment)
        establishment.menu = updatedMenu
        establishment.menu.lastUpdated = new Date().toISOString()
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du menu pour ${establishment.name}:`, error)
      }
    }
  }
}

// === EXPORT POUR UTILISATION ===
export const establishmentManager = new EstablishmentManager()
