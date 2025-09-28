// lib/ai-coaching.js - Système de coaching IA pour Get Weez

import { establishments, events, activities, recommendations, restaurantStyles } from '../data/marbella-data.js'

/**
 * Système de coaching IA avancé pour Get Weez
 * Objectif : Faire de l'IA la référence mondiale en conciergerie
 */

// Base de connaissances enrichie pour le coaching
const conciergeKnowledge = {
  // Expertise en conciergerie de luxe
  luxuryConcierge: {
    principles: [
      "Anticipation des besoins clients",
      "Personnalisation extrême",
      "Accès exclusif aux meilleures adresses",
      "Service 24/7 avec excellence",
      "Réseau de contacts premium",
      "Discretion et confidentialité absolues"
    ],
    services: [
      "Réservations exclusives",
      "Accès VIP aux événements",
      "Transport privé et chauffeur",
      "Shopping personnel",
      "Gestion d'événements privés",
      "Services de sécurité",
      "Conciergerie immobilière"
    ]
  },

  // Expertise locale Marbella
  marbellaExpertise: {
    zones: {
      "Golden Mile": "Zone la plus exclusive avec villas de luxe et restaurants étoilés",
      "Puerto Banús": "Marina de luxe avec boutiques haute couture et vie nocturne",
      "Casco Antiguo": "Vieille ville historique avec charme andalou",
      "Nueva Andalucía": "Zone résidentielle moderne avec golf et tennis",
      "San Pedro": "Village traditionnel avec authenticité andalouse"
    },
    seasons: {
      "Été (Juin-Septembre)": "Haute saison avec événements internationaux",
      "Printemps (Mars-Mai)": "Saison idéale pour le golf et les activités outdoor",
      "Automne (Octobre-Novembre)": "Saison culturelle et gastronomique",
      "Hiver (Décembre-Février)": "Saison calme, parfaite pour les séjours détente"
    }
  },

  // Profils clients types
  clientProfiles: {
    "Business Executive": {
      needs: ["Efficacité", "Prestige", "Réseautage", "Services premium"],
      preferences: ["Restaurants d'affaires", "Clubs privés", "Transport VIP", "Événements networking"]
    },
    "Famille Luxe": {
      needs: ["Sécurité", "Activités enfants", "Confort", "Services familiaux"],
      preferences: ["Restaurants familiaux", "Activités éducatives", "Transport sécurisé", "Services de garde"]
    },
    "Couple Romantique": {
      needs: ["Intimité", "Romance", "Expériences uniques", "Mémoires inoubliables"],
      preferences: ["Restaurants romantiques", "Spa couples", "Excursions privées", "Événements romantiques"]
    },
    "Jet Set International": {
      needs: ["Exclusivité", "Tendances", "Réseau mondial", "Expériences uniques"],
      preferences: ["Événements VIP", "Restaurants branchés", "Parties privées", "Accès exclusifs"]
    }
  }
}

// Système de recommandations intelligentes
export class WeezAICoach {
  constructor() {
    this.conversationContext = []
    this.clientProfile = null
    this.preferences = new Set()
    this.budget = null
    this.occasion = null
  }

  // Analyse du profil client
  analyzeClientProfile(message, userInfo = {}) {
    const profile = this.detectClientProfile(message)
    this.clientProfile = profile
    return profile
  }

  detectClientProfile(message) {
    const text = message.toLowerCase()
    
    // Mots-clés pour identifier le profil
    const businessKeywords = ['business', 'travail', 'réunion', 'client', 'partenaire', 'networking']
    const familyKeywords = ['famille', 'enfant', 'enfant', 'parents', 'grand-parents']
    const romanticKeywords = ['couple', 'romantique', 'anniversaire', 'mariage', 'proposition']
    const luxuryKeywords = ['luxe', 'exclusif', 'vip', 'premium', 'privé', 'jet set']

    if (businessKeywords.some(keyword => text.includes(keyword))) {
      return 'Business Executive'
    } else if (familyKeywords.some(keyword => text.includes(keyword))) {
      return 'Famille Luxe'
    } else if (romanticKeywords.some(keyword => text.includes(keyword))) {
      return 'Couple Romantique'
    } else if (luxuryKeywords.some(keyword => text.includes(keyword))) {
      return 'Jet Set International'
    }
    
    return 'Client Premium'
  }

  // Génération de recommandations personnalisées
  generatePersonalizedRecommendations(profile, occasion, budget) {
    const recommendations = []
    
    switch (profile) {
      case 'Business Executive':
        recommendations.push(...this.getBusinessRecommendations())
        break
      case 'Famille Luxe':
        recommendations.push(...this.getFamilyRecommendations())
        break
      case 'Couple Romantique':
        recommendations.push(...this.getRomanticRecommendations())
        break
      case 'Jet Set International':
        recommendations.push(...this.getLuxuryRecommendations())
        break
      default:
        recommendations.push(...this.getGeneralRecommendations())
    }

    return recommendations
  }

  getBusinessRecommendations() {
    return [
      {
        type: 'restaurant',
        name: 'Restaurants d\'affaires premium',
        establishments: establishments.filter(e => 
          e.category === 'International' && e.rating >= 4.5
        ).slice(0, 3),
        reasoning: 'Parfaits pour les réunions d\'affaires avec une ambiance professionnelle'
      },
      {
        type: 'activity',
        name: 'Activités de networking',
        activities: ['Golf privé', 'Tennis club', 'Spa business', 'Transport VIP'],
        reasoning: 'Idéales pour développer votre réseau professionnel'
      }
    ]
  }

  getFamilyRecommendations() {
    return [
      {
        type: 'restaurant',
        name: 'Restaurants familiaux',
        establishments: establishments.filter(e => 
          e.features?.includes('Familial') || e.ambiance?.includes('Familial')
        ).slice(0, 3),
        reasoning: 'Parfaits pour toute la famille avec des options pour tous les âges'
      },
      {
        type: 'activity',
        name: 'Activités familiales',
        activities: ['Parcs d\'attractions', 'Zoo marin', 'Plages familiales', 'Musées interactifs'],
        reasoning: 'Des expériences mémorables pour toute la famille'
      }
    ]
  }

  getRomanticRecommendations() {
    return [
      {
        type: 'restaurant',
        name: 'Restaurants romantiques',
        establishments: restaurantStyles.romantic.restaurants.map(id => 
          establishments.find(e => e.id === id)
        ).filter(Boolean),
        reasoning: 'Ambiance intime et romantique parfaite pour un dîner en couple'
      },
      {
        type: 'activity',
        name: 'Expériences romantiques',
        activities: ['Coucher de soleil en yacht', 'Spa couples', 'Dîner privé sur la plage', 'Balade en calèche'],
        reasoning: 'Des moments magiques pour créer des souvenirs inoubliables'
      }
    ]
  }

  getLuxuryRecommendations() {
    return [
      {
        type: 'restaurant',
        name: 'Établissements exclusifs',
        establishments: establishments.filter(e => 
          e.sponsored || e.rating >= 4.8
        ).slice(0, 3),
        reasoning: 'Les adresses les plus exclusives et tendances de Marbella'
      },
      {
        type: 'activity',
        name: 'Expériences VIP',
        activities: ['Parties privées', 'Événements exclusifs', 'Accès VIP', 'Services sur mesure'],
        reasoning: 'Des expériences uniques réservées à l\'élite'
      }
    ]
  }

  getGeneralRecommendations() {
    return [
      {
        type: 'restaurant',
        name: 'Nos meilleures adresses',
        establishments: establishments.filter(e => e.rating >= 4.5).slice(0, 5),
        reasoning: 'Une sélection des meilleurs établissements de Marbella'
      },
      {
        type: 'activity',
        name: 'Activités populaires',
        activities: ['Golf', 'Tennis', 'Spa', 'Shopping', 'Plage'],
        reasoning: 'Les activités les plus appréciées par nos clients'
      }
    ]
  }

  // Génération de réponses contextuelles
  generateContextualResponse(message, userInfo = {}) {
    const profile = this.analyzeClientProfile(message, userInfo)
    const recommendations = this.generatePersonalizedRecommendations(profile)
    
    // Construction de la réponse personnalisée
    let response = `Bonjour ! En tant que concierge premium de Get Weez, je vais vous offrir une expérience personnalisée. `
    
    if (profile !== 'Client Premium') {
      response += `Je vois que vous êtes ${profile.toLowerCase()}, parfait ! `
    }
    
    response += `Voici mes recommandations exclusives pour vous :\n\n`
    
    recommendations.forEach((rec, index) => {
      response += `**${rec.name}**\n`
      response += `${rec.reasoning}\n\n`
      
      if (rec.establishments) {
        rec.establishments.forEach(est => {
          response += `• **${est.name}** - ${est.description}\n`
          response += `  📍 ${est.address}\n`
          response += `  ⭐ ${est.rating}/5 - ${est.price_range}\n`
          if (est.specialties) {
            response += `  🍽️ Spécialités: ${est.specialties.slice(0, 3).join(', ')}\n`
          }
          response += `\n`
        })
      }
      
      if (rec.activities) {
        rec.activities.forEach(activity => {
          response += `• ${activity}\n`
        })
      }
      response += `\n`
    })
    
    response += `💎 **Service Premium Get Weez**\n`
    response += `• Réservation garantie dans les meilleurs établissements\n`
    response += `• Accès VIP et exclusif\n`
    response += `• Service 24/7 personnalisé\n`
    response += `• Réseau de contacts premium\n\n`
    
    response += `Comment puis-je vous aider davantage ? Je peux organiser des réservations, des transports, des événements privés, ou tout autre service de conciergerie de luxe.`
    
    return response
  }

  // Mise à jour du contexte de conversation
  updateConversationContext(message, response) {
    this.conversationContext.push({
      message,
      response,
      timestamp: new Date().toISOString()
    })
    
    // Garder seulement les 10 dernières interactions
    if (this.conversationContext.length > 10) {
      this.conversationContext = this.conversationContext.slice(-10)
    }
  }
}

// Fonction principale d'export
export function getWeezAICoach() {
  return new WeezAICoach()
}
