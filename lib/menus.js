// Système de menus pour les établissements partenaires
// Gère les menus fictifs pour les restaurants et établissements

export const menusData = {
  // Restaurants
  'coya marbella': {
    name: 'COYA Marbella',
    type: 'restaurant',
    cuisine: 'péruvienne',
    menu: {
      entrées: [
        { name: 'Ceviche de Corvina', price: 24, description: 'Corvina, leche de tigre, maíz morado', category: 'signature' },
        { name: 'Tiradito de Atún', price: 22, description: 'Thon, sauce aji amarillo, edamame', category: 'signature' },
        { name: 'Anticuchos de Wagyu', price: 28, description: 'Brochettes de bœuf wagyu, purée de manioc', category: 'premium' }
      ],
      plats_principaux: [
        { name: 'Lomo Saltado', price: 34, description: 'Sauté de bœuf, pommes de terre, riz', category: 'classic' },
        { name: 'Arroz Nikkei', price: 36, description: 'Riz sushi, saumon, avocat, wasabi', category: 'signature' },
        { name: 'Pollo a la Brasa', price: 28, description: 'Poulet rôti, quinoa, légumes grillés', category: 'classic' }
      ],
      desserts: [
        { name: 'Suspiro Limeño', price: 12, description: 'Crème au porto, meringue italienne', category: 'classic' },
        { name: 'Churros con Chocolate', price: 14, description: 'Churros maison, chocolat chaud épais', category: 'signature' }
      ]
    }
  },

  'el lago': {
    name: 'El Lago',
    type: 'restaurant',
    cuisine: 'méditerranéenne',
    menu: {
      entrées: [
        { name: 'Burrata di Puglia', price: 18, description: 'Burrata, tomates confites, basilic', category: 'signature' },
        { name: 'Carpaccio de Thon Rouge', price: 22, description: 'Thon rouge, huile d\'olive, câpres', category: 'premium' },
        { name: 'Tartare de Saumon', price: 20, description: 'Saumon, avocat, citron vert', category: 'classic' }
      ],
      plats_principaux: [
        { name: 'Risotto aux Champignons', price: 26, description: 'Risotto crémeux, champignons sauvages', category: 'signature' },
        { name: 'Branzino al Sale', price: 32, description: 'Loup de mer en croûte de sel, légumes', category: 'premium' },
        { name: 'Pasta Carbonara', price: 24, description: 'Pâtes, pancetta, œuf, parmesan', category: 'classic' }
      ],
      desserts: [
        { name: 'Tiramisu della Casa', price: 12, description: 'Tiramisu traditionnel, cacao', category: 'signature' },
        { name: 'Panna Cotta aux Fruits', price: 10, description: 'Panna cotta, coulis de fruits rouges', category: 'classic' }
      ]
    }
  },

  'buddha beach': {
    name: 'Buddha Beach',
    type: 'restaurant',
    cuisine: 'fusion asiatique',
    menu: {
      entrées: [
        { name: 'Dumplings de Crevettes', price: 16, description: 'Raviolis vapeur, sauce soja', category: 'signature' },
        { name: 'Salade de Papaye Verte', price: 14, description: 'Papaye, tomates, cacahuètes', category: 'classic' },
        { name: 'Sashimi de Thon', price: 20, description: 'Thon frais, wasabi, gingembre', category: 'premium' }
      ],
      plats_principaux: [
        { name: 'Pad Thai Royal', price: 24, description: 'Nouilles sautées, crevettes, germes', category: 'signature' },
        { name: 'Curry Vert au Poulet', price: 22, description: 'Curry thaï, riz jasmin', category: 'classic' },
        { name: 'Wok de Légumes Tofu', price: 18, description: 'Légumes sautés, tofu grillé', category: 'vegetarian' }
      ],
      desserts: [
        { name: 'Mango Sticky Rice', price: 12, description: 'Riz gluant, mangue, lait de coco', category: 'signature' },
        { name: 'Glace Matcha', price: 8, description: 'Glace au thé vert, sésame', category: 'classic' }
      ]
    }
  },

  'pangea': {
    name: 'Pangea',
    type: 'restaurant',
    cuisine: 'gastronomique',
    menu: {
      entrées: [
        { name: 'Foie Gras Mi-Cuit', price: 26, description: 'Foie gras, chutney de figues, pain brioche', category: 'premium' },
        { name: 'Langoustines Grillées', price: 28, description: 'Langoustines, beurre blanc, cresson', category: 'signature' },
        { name: 'Velouté de Potimarron', price: 16, description: 'Crème de potimarron, huile de noisette', category: 'classic' }
      ],
      plats_principaux: [
        { name: 'Côte de Bœuf', price: 48, description: 'Côte de bœuf wagyu, pommes sarladaises', category: 'premium' },
        { name: 'Turbot aux Agrumes', price: 38, description: 'Turbot, sauce aux agrumes, légumes', category: 'signature' },
        { name: 'Pigeon Rôti', price: 34, description: 'Pigeon, jus au porto, légumes confits', category: 'signature' }
      ],
      desserts: [
        { name: 'Soufflé au Grand Marnier', price: 16, description: 'Soufflé chaud, glace vanille', category: 'signature' },
        { name: 'Tarte Tatin', price: 14, description: 'Tarte aux pommes renversée, crème anglaise', category: 'classic' }
      ]
    }
  }
}

// Fonction pour récupérer un menu
export function getMenu(establishmentName) {
  const lowerName = establishmentName.toLowerCase()
  
  // Recherche exacte
  if (menusData[lowerName]) {
    return menusData[lowerName]
  }
  
  // Recherche par mots-clés
  for (const [key, menu] of Object.entries(menusData)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return menu
    }
  }
  
  // Menu par défaut si pas trouvé
  return {
    name: establishmentName,
    type: 'restaurant',
    cuisine: 'méditerranéenne',
    menu: {
      entrées: [
        { name: 'Salade César', price: 16, description: 'Salade, poulet grillé, parmesan', category: 'classic' },
        { name: 'Carpaccio de Bœuf', price: 18, description: 'Carpaccio, roquette, parmesan', category: 'classic' }
      ],
      plats_principaux: [
        { name: 'Saumon Grillé', price: 26, description: 'Saumon, légumes de saison', category: 'classic' },
        { name: 'Poulet Rôti', price: 24, description: 'Poulet, pommes de terre, herbes', category: 'classic' }
      ],
      desserts: [
        { name: 'Crème Brûlée', price: 10, description: 'Crème brûlée vanille', category: 'classic' },
        { name: 'Tarte aux Fruits', price: 12, description: 'Tarte aux fruits de saison', category: 'classic' }
      ]
    }
  }
}

// Fonction pour suggérer des plats
export function suggestDishes(establishmentName, preferences = {}) {
  const menu = getMenu(establishmentName)
  const suggestions = []
  
  // Logique de suggestion basée sur les préférences
  const { budget = 'medium', dietary = [], occasion = 'casual' } = preferences
  
  // Filtrer par budget
  let priceRange = { min: 0, max: 100 }
  if (budget === 'low') priceRange = { min: 0, max: 20 }
  if (budget === 'medium') priceRange = { min: 15, max: 35 }
  if (budget === 'high') priceRange = { min: 30, max: 100 }
  
  // Suggérer des entrées
  const entrées = menu.menu.entrées?.filter(dish => 
    dish.price >= priceRange.min && dish.price <= priceRange.max
  ) || []
  
  // Suggérer des plats principaux
  const plats = menu.menu.plats_principaux?.filter(dish => 
    dish.price >= priceRange.min && dish.price <= priceRange.max
  ) || []
  
  // Suggérer des desserts
  const desserts = menu.menu.desserts?.filter(dish => 
    dish.price >= priceRange.min && dish.price <= priceRange.max
  ) || []
  
  // Ajouter les suggestions
  if (entrées.length > 0) {
    suggestions.push({
      category: 'Entrée recommandée',
      dish: entrées[0],
      reason: occasion === 'romantic' ? 'Parfait pour une soirée romantique' : 'Un classique qui ne déçoit jamais'
    })
  }
  
  if (plats.length > 0) {
    suggestions.push({
      category: 'Plat principal',
      dish: plats[0],
      reason: 'Notre spécialité maison'
    })
  }
  
  if (desserts.length > 0) {
    suggestions.push({
      category: 'Dessert',
      dish: desserts[0],
      reason: 'Pour terminer en beauté'
    })
  }
  
  return {
    establishment: menu.name,
    suggestions,
    totalPrice: suggestions.reduce((sum, s) => sum + s.dish.price, 0)
  }
}

// Fonction pour formater un menu en texte
export function formatMenuForChat(establishmentName) {
  const menu = getMenu(establishmentName)
  let text = `🍽️ **Menu de ${menu.name}** (${menu.cuisine})\n\n`
  
  if (menu.menu.entrées?.length > 0) {
    text += `**Entrées :**\n`
    menu.menu.entrées.forEach(dish => {
      text += `• ${dish.name} - ${dish.price}€\n  ${dish.description}\n`
    })
    text += `\n`
  }
  
  if (menu.menu.plats_principaux?.length > 0) {
    text += `**Plats principaux :**\n`
    menu.menu.plats_principaux.forEach(dish => {
      text += `• ${dish.name} - ${dish.price}€\n  ${dish.description}\n`
    })
    text += `\n`
  }
  
  if (menu.menu.desserts?.length > 0) {
    text += `**Desserts :**\n`
    menu.menu.desserts.forEach(dish => {
      text += `• ${dish.name} - ${dish.price}€\n  ${dish.description}\n`
    })
  }
  
  return text
}
