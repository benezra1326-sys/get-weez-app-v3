#!/usr/bin/env node

// Test de la logique de base de données sans OpenAI
import { establishments, events, activities } from './data/marbella-data.js'

// Import des fonctions de recommandation (sans OpenAI)
function findSpecificEstablishment(message, establishments) {
  for (const establishment of establishments) {
    const nameLower = establishment.name.toLowerCase()
    if (message.includes(nameLower)) {
      return establishment
    }
  }
  return null
}

function findEstablishmentsByServices(message, establishments) {
  const serviceKeywords = {
    'spa': ['spa', 'massage', 'relaxation', 'détente'],
    'piscine': ['piscine', 'pool', 'swimming'],
    'terrasse': ['terrasse', 'terrace', 'extérieur', 'dehors'],
    'vue mer': ['vue mer', 'sea view', 'océan', 'vue sur la mer'],
    'parking': ['parking', 'garage', 'voiture'],
    'wifi': ['wifi', 'internet', 'connexion'],
    'climatisation': ['climatisation', 'air conditionné', 'ac'],
    'dj': ['dj', 'musique', 'mix', 'son'],
    'bar': ['bar', 'cocktail', 'boisson'],
    'cuisine': ['cuisine', 'kitchen', 'repas']
  }
  
  const matchingEstablishments = []
  
  for (const [service, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      const establishmentsWithService = establishments.filter(establishment => {
        return establishment.features && establishment.features.some(feature => 
          feature.toLowerCase().includes(service) || 
          keywords.some(keyword => feature.toLowerCase().includes(keyword))
        )
      })
      matchingEstablishments.push(...establishmentsWithService)
    }
  }
  
  return [...new Set(matchingEstablishments)]
}

function findEstablishmentsByDishes(message, establishments) {
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
  
  const matchingEstablishments = []
  
  for (const [dish, keywords] of Object.entries(dishKeywords)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      const establishmentsWithDish = establishments.filter(establishment => {
        return establishment.specialties && establishment.specialties.some(specialty => 
          specialty.toLowerCase().includes(dish) || 
          keywords.some(keyword => specialty.toLowerCase().includes(keyword))
        ) || establishment.dishes && establishment.dishes.some(dishItem => 
          dishItem.toLowerCase().includes(dish) || 
          keywords.some(keyword => dishItem.toLowerCase().includes(keyword))
        )
      })
      matchingEstablishments.push(...establishmentsWithDish)
    }
  }
  
  return [...new Set(matchingEstablishments)]
}

function generateEstablishmentRecommendation(establishment, message) {
  const { name, type, category, description, rating, price_range, ambiance, features, sponsored, zone, services, menu } = establishment
  
  let recommendation = `Parfait ! 😊 **${name}** est un excellent choix ! `
  
  if (type === 'Restaurant') {
    recommendation += `Restaurant ${category.toLowerCase()} avec une note de ${rating}/5. `
    if (price_range) recommendation += `Prix : ${price_range}. `
    if (ambiance) recommendation += `Ambiance : ${ambiance.toLowerCase()}. `
    if (services && services.length > 0) {
      recommendation += `Services : ${services.slice(0, 3).join(', ').toLowerCase()}. `
    }
  }
  
  if (type === 'Plage') {
    recommendation += `Plage ${category.toLowerCase()} avec transats à partir de 25€. `
    if (ambiance) recommendation += `Ambiance : ${ambiance.toLowerCase()}. `
    if (features && features.includes('Pas de musique')) {
      recommendation += `Parfait pour se détendre - pas de musique, clientèle calme et relaxée. `
    }
  }
  
  if (type === 'Club') {
    recommendation += `Club ${category.toLowerCase()} avec ambiance ${ambiance.toLowerCase()}. `
    if (features) recommendation += `Équipements : ${features.join(', ').toLowerCase()}. `
  }
  
  if (sponsored) {
    recommendation += `C'est l'un de nos partenaires privilégiés ! 💎 `
  }
  
  if (zone) {
    recommendation += `Situé sur la ${zone}. `
  }
  
  recommendation += `Je peux réserver pour toi ! Dis-moi quand tu veux y aller ! 😊`
  
  return recommendation
}

async function testDatabaseLogic() {
  console.log('🧪 Test de la logique de base de données\n')
  
  const testMessages = [
    "je veux du sushi",
    "nobu",
    "un endroit avec spa",
    "je veux du poisson frais",
    "un restaurant avec vue mer",
    "trocadero",
    "je veux des cocktails",
    "un endroit avec piscine"
  ]
  
  for (const message of testMessages) {
    console.log(`\n👤 Utilisateur: "${message}"`)
    
    const messageLower = message.toLowerCase()
    
    // Test établissement spécifique
    const specificEstablishment = findSpecificEstablishment(messageLower, establishments)
    if (specificEstablishment) {
      console.log(`🤖 Get Weez: ${generateEstablishmentRecommendation(specificEstablishment, messageLower)}`)
      continue
    }
    
    // Test services
    const serviceRecommendations = findEstablishmentsByServices(messageLower, establishments)
    if (serviceRecommendations.length > 0) {
      console.log(`🤖 Get Weez: Parfait ! Je vois que tu cherches des services spécifiques. Voici mes recommandations :`)
      serviceRecommendations.slice(0, 2).forEach(establishment => {
        console.log(`   • **${establishment.name}** - ${establishment.type} ${establishment.category} (${establishment.rating}/5)`)
        if (establishment.sponsored) console.log(`     💎 Partenaire privilégié Get Weez !`)
      })
      console.log(`   Je peux réserver ces services pour toi ! 😊`)
      continue
    }
    
    // Test plats
    const dishRecommendations = findEstablishmentsByDishes(messageLower, establishments)
    if (dishRecommendations.length > 0) {
      console.log(`🤖 Get Weez: Excellent ! Je vois que tu cherches des plats spécifiques. Voici mes recommandations :`)
      dishRecommendations.slice(0, 2).forEach(establishment => {
        console.log(`   • **${establishment.name}** - ${establishment.type} ${establishment.category} (${establishment.rating}/5)`)
        if (establishment.specialties) {
          const relevantSpecialties = establishment.specialties.filter(s => 
            messageLower.includes(s.toLowerCase()) || 
            ['sushi', 'poisson', 'cocktail'].some(keyword => s.toLowerCase().includes(keyword))
          )
          if (relevantSpecialties.length > 0) {
            console.log(`     Spécialités : ${relevantSpecialties.slice(0, 2).join(', ')}`)
          }
        }
        if (establishment.sponsored) console.log(`     💎 Partenaire privilégié Get Weez !`)
      })
      console.log(`   Je peux réserver une table et commander ces plats pour toi ! 😊`)
      continue
    }
    
    console.log(`🤖 Get Weez: Je n'ai pas trouvé d'établissement correspondant exactement à ta demande. Peux-tu me donner plus de détails ? Je suis là pour t'aider ! 😊`)
  }
}

// Lancer le test
testDatabaseLogic().catch(console.error)
