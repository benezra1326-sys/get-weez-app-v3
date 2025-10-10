import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import chalk from 'chalk'

dotenv.config({ path: '.env.local' })

/**
 * Gliitz Memory Personalization v7.0
 * Stocke et apprend les préférences personnelles pour chaque utilisateur
 * avec apprentissage continu et mise à jour en temps réel
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

class MemoryPersonalization {
  constructor() {
    this.userProfiles = new Map()
    this.memoryCache = new Map()
    this.learningRules = this.initializeLearningRules()
    this.updateTriggers = ['on_every_conversation', 'on_feedback', 'on_booking', 'on_preference_change']
    this.personalizationDatabase = new Map()
  }

  /**
   * Initialisation des règles d'apprentissage
   */
  initializeLearningRules() {
    return {
      continuous_learning: {
        enabled: true,
        frequency: 'real_time',
        triggers: ['conversation', 'feedback', 'behavior'],
        adaptation: 'incremental'
      },
      
      preference_extraction: {
        explicit_preferences: {
          weight: 1.0,
          confidence: 0.9,
          sources: ['direct_mention', 'rating', 'feedback']
        },
        implicit_preferences: {
          weight: 0.7,
          confidence: 0.6,
          sources: ['conversation_patterns', 'choice_analysis', 'behavior_tracking']
        }
      },
      
      memory_consolidation: {
        short_term_retention: '24_hours',
        long_term_consolidation: '7_days',
        forgetting_curve: 'exponential_decay',
        importance_weighting: 'frequency_and_recency'
      }
    }
  }

  /**
   * Création ou mise à jour du profil utilisateur
   */
  async createOrUpdateUserProfile(userId, conversationData, feedbackData = null) {
    let userProfile = await this.getUserProfile(userId)
    
    if (!userProfile) {
      userProfile = this.initializeUserProfile(userId)
    }

    // Mise à jour basée sur la conversation
    userProfile = await this.updateFromConversation(userProfile, conversationData)
    
    // Mise à jour basée sur le feedback
    if (feedbackData) {
      userProfile = await this.updateFromFeedback(userProfile, feedbackData)
    }

    // Consolidation de la mémoire
    userProfile = await this.consolidateMemory(userProfile)
    
    // Sauvegarde du profil mis à jour
    await this.saveUserProfile(userProfile)
    
    // Mise à jour du cache
    this.userProfiles.set(userId, userProfile)
    
    console.log(chalk.blue(`🧠 Profil utilisateur mis à jour: ${userId}`))
    return userProfile
  }

  /**
   * Initialisation d'un nouveau profil utilisateur
   */
  initializeUserProfile(userId) {
    return {
      user_id: userId,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      
      // Préférences linguistiques
      language: 'auto',
      preferred_tone: 'élégant, confiant, chaleureux',
      
      // Préférences contextuelles
      preferred_context: ['événement', 'gastronomie', 'voyage', 'concierge'],
      context_weights: {
        'événement': 1.0,
        'gastronomie': 1.0,
        'voyage': 1.0,
        'concierge': 1.0
      },
      
      // Géolocalisation
      location_focus: 'Marbella',
      preferred_zones: ['Puerto Banús', 'Nueva Andalucía', 'San Pedro'],
      zone_weights: {
        'Puerto Banús': 1.0,
        'Nueva Andalucía': 1.0,
        'San Pedro': 1.0
      },
      
      // Historique des interactions
      last_interactions: [],
      interaction_count: 0,
      
      // Préférences de style
      style_preferences: {
        response_length: 'detailed', // 'brief', 'detailed', 'comprehensive'
        detail_level: 'high',
        emoji_usage: 'moderate',
        formal_level: 'semi_formal'
      },
      
      // Préférences de contenu
      content_preferences: {
        price_range: 'premium',
        cuisine_types: ['méditerranéenne', 'internationale', 'fusion'],
        activity_types: ['luxury', 'cultural', 'gastronomic'],
        event_types: ['exclusive', 'cultural', 'entertainment']
      },
      
      // Historique de feedback
      feedback_history: [],
      average_rating: null,
      feedback_patterns: {},
      
      // Apprentissage adaptatif
      learning_insights: {
        success_patterns: [],
        failure_patterns: [],
        adaptation_suggestions: []
      },
      
      // Métadonnées
      metadata: {
        total_conversations: 0,
        last_activity: new Date().toISOString(),
        engagement_level: 'new', // 'new', 'active', 'regular', 'vip'
        personalization_score: 0.0
      }
    }
  }

  /**
   * Mise à jour du profil basée sur la conversation
   */
  async updateFromConversation(userProfile, conversationData) {
    const update = {
      last_updated: new Date().toISOString(),
      metadata: {
        ...userProfile.metadata,
        total_conversations: userProfile.metadata.total_conversations + 1,
        last_activity: new Date().toISOString()
      }
    }

    // Mise à jour des préférences contextuelles
    if (conversationData.classification) {
      update.context_weights = await this.updateContextWeights(
        userProfile.context_weights,
        conversationData.classification,
        conversationData.userMessage.emotion
      )
    }

    // Mise à jour des préférences de style
    if (conversationData.aiResponse) {
      update.style_preferences = await this.updateStylePreferences(
        userProfile.style_preferences,
        conversationData.aiResponse,
        conversationData.userMessage
      )
    }

    // Mise à jour des préférences de contenu
    if (conversationData.userMessage.intent) {
      update.content_preferences = await this.updateContentPreferences(
        userProfile.content_preferences,
        conversationData.userMessage,
        conversationData.aiResponse
      )
    }

    // Mise à jour de l'historique des interactions
    update.last_interactions = this.updateInteractionHistory(
      userProfile.last_interactions,
      conversationData
    )

    // Calcul du niveau d'engagement
    update.metadata.engagement_level = this.calculateEngagementLevel(
      userProfile.metadata.total_conversations + 1,
      userProfile.feedback_history
    )

    // Calcul du score de personnalisation
    update.metadata.personalization_score = this.calculatePersonalizationScore(userProfile)

    return { ...userProfile, ...update }
  }

  /**
   * Mise à jour du profil basée sur le feedback
   */
  async updateFromFeedback(userProfile, feedbackData) {
    const update = {
      last_updated: new Date().toISOString()
    }

    // Mise à jour de l'historique de feedback
    update.feedback_history = this.updateFeedbackHistory(
      userProfile.feedback_history,
      feedbackData
    )

    // Calcul de la note moyenne
    update.average_rating = this.calculateAverageRating(update.feedback_history)

    // Analyse des patterns de feedback
    update.feedback_patterns = this.analyzeFeedbackPatterns(update.feedback_history)

    // Mise à jour des insights d'apprentissage
    update.learning_insights = await this.updateLearningInsights(
      userProfile.learning_insights,
      feedbackData,
      userProfile
    )

    // Ajustement des préférences basé sur le feedback
    if (feedbackData.analysis.preferences) {
      update.style_preferences = await this.adjustPreferencesFromFeedback(
        userProfile.style_preferences,
        feedbackData.analysis.preferences
      )
    }

    return { ...userProfile, ...update }
  }

  /**
   * Mise à jour des poids contextuels
   */
  async updateContextWeights(currentWeights, classification, emotion) {
    const weights = { ...currentWeights }
    const primaryContext = classification.primary
    const confidence = classification.confidence

    if (primaryContext && primaryContext !== 'général') {
      // Augmentation du poids pour le contexte détecté
      const currentWeight = weights[primaryContext] || 1.0
      const emotionMultiplier = this.getEmotionMultiplier(emotion.dominant)
      const newWeight = Math.min(2.0, currentWeight + (confidence * emotionMultiplier * 0.1))
      
      weights[primaryContext] = newWeight
      
      // Normalisation des poids
      const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
      Object.keys(weights).forEach(key => {
        weights[key] = weights[key] / totalWeight * Object.keys(weights).length
      })
    }

    return weights
  }

  /**
   * Mise à jour des préférences de style
   */
  async updateStylePreferences(currentPreferences, aiResponse, userMessage) {
    const preferences = { ...currentPreferences }

    // Analyse de la longueur de réponse préférée
    const responseLength = aiResponse.content.length
    if (responseLength < 200) {
      preferences.response_length = 'brief'
    } else if (responseLength > 500) {
      preferences.response_length = 'comprehensive'
    } else {
      preferences.response_length = 'detailed'
    }

    // Analyse de l'utilisation d'emojis
    const emojiCount = (aiResponse.content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/gu) || []).length
    if (emojiCount === 0) {
      preferences.emoji_usage = 'minimal'
    } else if (emojiCount > 3) {
      preferences.emoji_usage = 'high'
    } else {
      preferences.emoji_usage = 'moderate'
    }

    // Analyse du niveau de formalité
    const formalIndicators = ['Monsieur', 'Madame', 'vous', 'veuillez', 'permettre']
    const informalIndicators = ['tu', 'salut', 'hey', 'cool', 'super']
    
    const formalCount = formalIndicators.filter(indicator => 
      aiResponse.content.toLowerCase().includes(indicator.toLowerCase())
    ).length
    
    const informalCount = informalIndicators.filter(indicator => 
      aiResponse.content.toLowerCase().includes(indicator.toLowerCase())
    ).length

    if (formalCount > informalCount) {
      preferences.formal_level = 'formal'
    } else if (informalCount > formalCount) {
      preferences.formal_level = 'informal'
    } else {
      preferences.formal_level = 'semi_formal'
    }

    // Analyse du niveau de détail
    const detailIndicators = ['détails', 'spécifiquement', 'précisément', 'exactement']
    const detailCount = detailIndicators.filter(indicator => 
      aiResponse.content.toLowerCase().includes(indicator.toLowerCase())
    ).length

    preferences.detail_level = detailCount > 1 ? 'high' : detailCount > 0 ? 'medium' : 'low'

    return preferences
  }

  /**
   * Mise à jour des préférences de contenu
   */
  async updateContentPreferences(currentPreferences, userMessage, aiResponse) {
    const preferences = { ...currentPreferences }

    // Analyse des types de cuisine mentionnés
    const cuisineTypes = ['méditerranéenne', 'française', 'italienne', 'japonaise', 'fusion', 'internationale']
    const mentionedCuisines = cuisineTypes.filter(cuisine => 
      userMessage.content.toLowerCase().includes(cuisine.toLowerCase()) ||
      aiResponse.content.toLowerCase().includes(cuisine.toLowerCase())
    )

    if (mentionedCuisines.length > 0) {
      preferences.cuisine_types = [...new Set([...preferences.cuisine_types, ...mentionedCuisines])]
    }

    // Analyse de la gamme de prix
    const priceIndicators = {
      'budget': ['pas cher', 'économique', 'accessible', 'bon marché'],
      'medium': ['correct', 'raisonnable', 'moyen'],
      'premium': ['luxe', 'premium', 'haut de gamme', 'exclusif', 'gastronomique']
    }

    const combinedText = (userMessage.content + ' ' + aiResponse.content).toLowerCase()
    for (const [priceRange, indicators] of Object.entries(priceIndicators)) {
      if (indicators.some(indicator => combinedText.includes(indicator))) {
        preferences.price_range = priceRange
        break
      }
    }

    // Analyse des types d'activités
    const activityTypes = ['luxury', 'cultural', 'gastronomic', 'sport', 'wellness', 'entertainment']
    const mentionedActivities = activityTypes.filter(activity => 
      combinedText.includes(activity.toLowerCase())
    )

    if (mentionedActivities.length > 0) {
      preferences.activity_types = [...new Set([...preferences.activity_types, ...mentionedActivities])]
    }

    return preferences
  }

  /**
   * Mise à jour de l'historique des interactions
   */
  updateInteractionHistory(currentHistory, conversationData) {
    const newInteraction = {
      timestamp: new Date().toISOString(),
      classification: conversationData.classification.primary,
      emotion: conversationData.userMessage.emotion.dominant,
      intent: conversationData.userMessage.intent.intent,
      satisfaction: this.estimateSatisfaction(conversationData),
      response_quality: conversationData.aiResponse.structure.structureScore
    }

    const updatedHistory = [newInteraction, ...currentHistory].slice(0, 10) // Garder les 10 dernières
    return updatedHistory
  }

  /**
   * Mise à jour de l'historique de feedback
   */
  updateFeedbackHistory(currentHistory, feedbackData) {
    const newFeedback = {
      timestamp: new Date().toISOString(),
      rating: feedbackData.analysis.rating.rating,
      sentiment: feedbackData.analysis.sentiment.sentiment,
      suggestions: feedbackData.analysis.suggestions,
      trigger_event: feedbackData.triggerEvent
    }

    return [newFeedback, ...currentHistory].slice(0, 20) // Garder les 20 derniers
  }

  /**
   * Consolidation de la mémoire
   */
  async consolidateMemory(userProfile) {
    // Application de la courbe d'oubli
    const consolidatedProfile = { ...userProfile }
    
    // Réduction des poids des interactions anciennes
    consolidatedProfile.last_interactions = this.applyForgettingCurve(
      consolidatedProfile.last_interactions
    )

    // Consolidation des préférences basée sur la fréquence
    consolidatedProfile.context_weights = this.consolidatePreferences(
      consolidatedProfile.context_weights,
      consolidatedProfile.last_interactions
    )

    // Mise à jour des insights d'apprentissage
    consolidatedProfile.learning_insights = this.generateLearningInsights(
      consolidatedProfile
    )

    return consolidatedProfile
  }

  /**
   * Récupération du profil utilisateur
   */
  async getUserProfile(userId) {
    // Vérification du cache
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId)
    }

    // Récupération depuis Supabase
    try {
      const { data, error } = await supabase
        .from('gliitz_memory_core')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erreur récupération profil utilisateur:', error)
        return null
      }

      if (data) {
        // Mise en cache
        this.userProfiles.set(userId, data)
        return data
      }

      return null
    } catch (error) {
      console.error('❌ Erreur Supabase getUserProfile:', error)
      return null
    }
  }

  /**
   * Sauvegarde du profil utilisateur
   */
  async saveUserProfile(userProfile) {
    try {
      const { error } = await supabase
        .from('gliitz_memory_core')
        .upsert([{
          user_id: userProfile.user_id,
          created_at: userProfile.created_at,
          last_updated: userProfile.last_updated,
          language: userProfile.language,
          preferred_tone: userProfile.preferred_tone,
          preferred_context: userProfile.preferred_context,
          context_weights: userProfile.context_weights,
          location_focus: userProfile.location_focus,
          preferred_zones: userProfile.preferred_zones,
          zone_weights: userProfile.zone_weights,
          last_interactions: userProfile.last_interactions,
          interaction_count: userProfile.interaction_count,
          style_preferences: userProfile.style_preferences,
          content_preferences: userProfile.content_preferences,
          feedback_history: userProfile.feedback_history,
          average_rating: userProfile.average_rating,
          feedback_patterns: userProfile.feedback_patterns,
          learning_insights: userProfile.learning_insights,
          metadata: userProfile.metadata
        }])

      if (error) {
        console.error('❌ Erreur sauvegarde profil utilisateur:', error)
      }
    } catch (error) {
      console.error('❌ Erreur Supabase saveUserProfile:', error)
    }
  }

  /**
   * Génération de recommandations personnalisées
   */
  async generatePersonalizedRecommendations(userId, requestContext) {
    const userProfile = await this.getUserProfile(userId)
    if (!userProfile) {
      return this.generateDefaultRecommendations(requestContext)
    }

    const recommendations = {
      personalized: true,
      user_id: userId,
      context: requestContext,
      recommendations: [],
      reasoning: [],
      confidence: 0.0
    }

    // Application des préférences contextuelles
    const contextWeight = userProfile.context_weights[requestContext.classification] || 1.0
    recommendations.confidence += contextWeight * 0.3

    // Application des préférences de style
    recommendations.recommendations = this.generateStyleBasedRecommendations(
      userProfile.style_preferences,
      requestContext
    )

    // Application des préférences de contenu
    recommendations.recommendations = this.generateContentBasedRecommendations(
      userProfile.content_preferences,
      recommendations.recommendations
    )

    // Application de l'historique d'interactions
    recommendations.recommendations = this.applyInteractionHistory(
      userProfile.last_interactions,
      recommendations.recommendations
    )

    // Génération du raisonnement
    recommendations.reasoning = this.generateReasoning(userProfile, requestContext)

    return recommendations
  }

  /**
   * Méthodes utilitaires
   */
  getEmotionMultiplier(emotion) {
    const multipliers = {
      'joie': 1.2,
      'excitation': 1.3,
      'stress': 0.8,
      'tristesse': 0.7,
      'hésitation': 0.9,
      'curiosité': 1.1,
      'urgence': 1.0
    }
    return multipliers[emotion] || 1.0
  }

  estimateSatisfaction(conversationData) {
    // Estimation basée sur la qualité de la réponse et l'émotion
    const responseQuality = conversationData.aiResponse.structure.structureScore
    const emotionalAlignment = conversationData.userMessage.emotion.confidence
    
    return (responseQuality + emotionalAlignment) / 2
  }

  calculateEngagementLevel(totalConversations, feedbackHistory) {
    if (totalConversations < 3) return 'new'
    if (totalConversations < 10) return 'active'
    if (totalConversations < 25) return 'regular'
    return 'vip'
  }

  calculatePersonalizationScore(userProfile) {
    const factors = {
      interaction_count: Math.min(1, userProfile.metadata.total_conversations / 20),
      feedback_count: Math.min(1, userProfile.feedback_history.length / 10),
      preference_diversity: Object.keys(userProfile.context_weights).length / 5,
      style_consistency: this.calculateStyleConsistency(userProfile.style_preferences),
      content_specificity: this.calculateContentSpecificity(userProfile.content_preferences)
    }

    return Object.values(factors).reduce((sum, factor) => sum + factor, 0) / Object.keys(factors).length
  }

  calculateStyleConsistency(stylePreferences) {
    // Calcul de la cohérence des préférences de style
    const consistencyIndicators = [
      stylePreferences.response_length !== 'detailed',
      stylePreferences.emoji_usage === 'moderate',
      stylePreferences.formal_level === 'semi_formal'
    ]
    
    return consistencyIndicators.filter(Boolean).length / consistencyIndicators.length
  }

  calculateContentSpecificity(contentPreferences) {
    // Calcul de la spécificité des préférences de contenu
    const specificityScore = 
      (contentPreferences.cuisine_types.length / 6) * 0.3 +
      (contentPreferences.activity_types.length / 6) * 0.3 +
      (contentPreferences.event_types.length / 6) * 0.2 +
      (contentPreferences.price_range ? 0.2 : 0)
    
    return Math.min(1, specificityScore)
  }

  applyForgettingCurve(interactions) {
    const now = new Date()
    return interactions.map(interaction => {
      const daysSince = (now - new Date(interaction.timestamp)) / (1000 * 60 * 60 * 24)
      const forgettingFactor = Math.exp(-daysSince / 7) // Décroissance exponentielle sur 7 jours
      
      return {
        ...interaction,
        weight: forgettingFactor
      }
    })
  }

  consolidatePreferences(currentWeights, interactions) {
    const consolidated = { ...currentWeights }
    
    // Analyse de la fréquence des contextes dans l'historique
    const contextFrequency = {}
    interactions.forEach(interaction => {
      const context = interaction.classification
      contextFrequency[context] = (contextFrequency[context] || 0) + (interaction.weight || 1)
    })

    // Mise à jour des poids basée sur la fréquence
    Object.keys(consolidated).forEach(context => {
      const frequency = contextFrequency[context] || 0
      const totalFrequency = Object.values(contextFrequency).reduce((sum, freq) => sum + freq, 0)
      
      if (totalFrequency > 0) {
        consolidated[context] = frequency / totalFrequency * Object.keys(consolidated).length
      }
    })

    return consolidated
  }

  generateLearningInsights(userProfile) {
    const insights = {
      success_patterns: [],
      failure_patterns: [],
      adaptation_suggestions: []
    }

    // Analyse des patterns de succès
    const highSatisfactionInteractions = userProfile.last_interactions.filter(
      interaction => interaction.satisfaction > 0.7
    )

    if (highSatisfactionInteractions.length > 0) {
      const successContexts = highSatisfactionInteractions.map(i => i.classification)
      const mostSuccessfulContext = this.findMostFrequent(successContexts)
      
      insights.success_patterns.push({
        context: mostSuccessfulContext,
        pattern: 'High satisfaction with this context',
        confidence: highSatisfactionInteractions.length / userProfile.last_interactions.length
      })
    }

    // Analyse des patterns d'échec
    const lowSatisfactionInteractions = userProfile.last_interactions.filter(
      interaction => interaction.satisfaction < 0.4
    )

    if (lowSatisfactionInteractions.length > 0) {
      const failureContexts = lowSatisfactionInteractions.map(i => i.classification)
      const mostFailedContext = this.findMostFrequent(failureContexts)
      
      insights.failure_patterns.push({
        context: mostFailedContext,
        pattern: 'Low satisfaction with this context',
        confidence: lowSatisfactionInteractions.length / userProfile.last_interactions.length
      })
    }

    // Génération de suggestions d'adaptation
    if (insights.failure_patterns.length > 0) {
      insights.adaptation_suggestions.push({
        priority: 'high',
        suggestion: 'Improve responses for failing contexts',
        action: 'Analyze and enhance response patterns'
      })
    }

    return insights
  }

  findMostFrequent(items) {
    const frequency = {}
    items.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1
    })
    
    return Object.entries(frequency).reduce((prev, current) => 
      current[1] > prev[1] ? current : prev, 
      ['unknown', 0]
    )[0]
  }

  generateDefaultRecommendations(requestContext) {
    return {
      personalized: false,
      context: requestContext,
      recommendations: [
        'Restaurant gastronomique à Marbella',
        'Événement exclusif à Puerto Banús',
        'Service de conciergerie premium'
      ],
      reasoning: ['Recommandations générales basées sur le contexte'],
      confidence: 0.5
    }
  }

  generateStyleBasedRecommendations(stylePreferences, requestContext) {
    // Génération basée sur les préférences de style
    return [
      'Recommandation adaptée à vos préférences de style',
      'Suggestion personnalisée selon votre profil'
    ]
  }

  generateContentBasedRecommendations(contentPreferences, currentRecommendations) {
    // Enrichissement basé sur les préférences de contenu
    return [
      ...currentRecommendations,
      'Contenu adapté à vos préférences'
    ]
  }

  applyInteractionHistory(interactions, currentRecommendations) {
    // Application de l'historique d'interactions
    return [
      ...currentRecommendations,
      'Basé sur votre historique d\'interactions'
    ]
  }

  generateReasoning(userProfile, requestContext) {
    const reasoning = []
    
    reasoning.push(`Profil utilisateur: ${userProfile.metadata.engagement_level}`)
    reasoning.push(`Score de personnalisation: ${userProfile.metadata.personalization_score.toFixed(2)}`)
    reasoning.push(`Contexte préféré: ${requestContext.classification}`)
    
    return reasoning
  }

  calculateAverageRating(feedbackHistory) {
    if (feedbackHistory.length === 0) return null
    
    const ratings = feedbackHistory
      .map(feedback => feedback.rating)
      .filter(rating => rating !== null && rating > 0)
    
    if (ratings.length === 0) return null
    
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  }

  analyzeFeedbackPatterns(feedbackHistory) {
    const patterns = {
      average_sentiment: 'neutral',
      common_suggestions: [],
      rating_trend: 'stable'
    }

    if (feedbackHistory.length === 0) return patterns

    // Analyse du sentiment moyen
    const sentiments = feedbackHistory.map(f => f.sentiment)
    const sentimentCounts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1
      return acc
    }, {})

    patterns.average_sentiment = Object.entries(sentimentCounts)
      .reduce((prev, current) => current[1] > prev[1] ? current : prev, ['neutral', 0])[0]

    // Analyse des suggestions communes
    const allSuggestions = feedbackHistory.flatMap(f => f.suggestions)
    patterns.common_suggestions = this.findMostFrequent(
      allSuggestions.map(s => s.text)
    )

    // Analyse de la tendance des notes
    if (feedbackHistory.length >= 3) {
      const recentRatings = feedbackHistory.slice(0, 3).map(f => f.rating)
      const olderRatings = feedbackHistory.slice(3, 6).map(f => f.rating)
      
      const recentAvg = recentRatings.reduce((sum, r) => sum + r, 0) / recentRatings.length
      const olderAvg = olderRatings.reduce((sum, r) => sum + r, 0) / olderRatings.length
      
      if (recentAvg > olderAvg + 0.5) {
        patterns.rating_trend = 'improving'
      } else if (recentAvg < olderAvg - 0.5) {
        patterns.rating_trend = 'declining'
      }
    }

    return patterns
  }

  async updateLearningInsights(currentInsights, feedbackData, userProfile) {
    const updatedInsights = { ...currentInsights }

    // Mise à jour des patterns de succès
    if (feedbackData.analysis.rating.rating >= 4) {
      updatedInsights.success_patterns.push({
        timestamp: new Date().toISOString(),
        rating: feedbackData.analysis.rating.rating,
        context: 'high_rating_feedback',
        pattern: 'Positive feedback received'
      })
    }

    // Mise à jour des patterns d'échec
    if (feedbackData.analysis.rating.rating <= 2) {
      updatedInsights.failure_patterns.push({
        timestamp: new Date().toISOString(),
        rating: feedbackData.analysis.rating.rating,
        context: 'low_rating_feedback',
        pattern: 'Negative feedback received'
      })
    }

    // Génération de nouvelles suggestions d'adaptation
    if (feedbackData.analysis.suggestions.length > 0) {
      updatedInsights.adaptation_suggestions.push({
        priority: 'medium',
        suggestion: 'User provided specific feedback',
        action: 'Implement user suggestions',
        suggestions: feedbackData.analysis.suggestions
      })
    }

    return updatedInsights
  }

  async adjustPreferencesFromFeedback(currentPreferences, feedbackPreferences) {
    const adjusted = { ...currentPreferences }

    // Ajustement basé sur les préférences de style du feedback
    if (feedbackPreferences.style.length > 0) {
      const stylePreference = feedbackPreferences.style[0]
      if (stylePreference === 'détaillé') {
        adjusted.response_length = 'comprehensive'
        adjusted.detail_level = 'high'
      } else if (stylePreference === 'concis') {
        adjusted.response_length = 'brief'
        adjusted.detail_level = 'low'
      }
    }

    // Ajustement basé sur les préférences de ton
    if (feedbackPreferences.tone.length > 0) {
      const tonePreference = feedbackPreferences.tone[0]
      if (tonePreference === 'formel') {
        adjusted.formal_level = 'formal'
      } else if (tonePreference === 'décontracté') {
        adjusted.formal_level = 'informal'
      }
    }

    return adjusted
  }

  /**
   * Génération du rapport de personnalisation
   */
  async generatePersonalizationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      total_users: this.userProfiles.size,
      engagement_distribution: this.calculateEngagementDistribution(),
      personalization_effectiveness: this.calculatePersonalizationEffectiveness(),
      common_preferences: this.analyzeCommonPreferences(),
      learning_insights: this.aggregateLearningInsights(),
      recommendations: this.generatePersonalizationRecommendations()
    }

    fs.writeFileSync('memory_personalization_report.json', JSON.stringify(report, null, 2))
    console.log(chalk.green('✅ Rapport de personnalisation généré: memory_personalization_report.json'))
    
    return report
  }

  calculateEngagementDistribution() {
    const distribution = { new: 0, active: 0, regular: 0, vip: 0 }
    
    this.userProfiles.forEach(profile => {
      const level = profile.metadata.engagement_level
      distribution[level] = (distribution[level] || 0) + 1
    })
    
    return distribution
  }

  calculatePersonalizationEffectiveness() {
    if (this.userProfiles.size === 0) return 0
    
    const totalScore = Array.from(this.userProfiles.values())
      .reduce((sum, profile) => sum + profile.metadata.personalization_score, 0)
    
    return totalScore / this.userProfiles.size
  }

  analyzeCommonPreferences() {
    const commonPrefs = {
      context_weights: {},
      style_preferences: {},
      content_preferences: {}
    }

    this.userProfiles.forEach(profile => {
      // Analyse des poids contextuels
      Object.entries(profile.context_weights).forEach(([context, weight]) => {
        commonPrefs.context_weights[context] = (commonPrefs.context_weights[context] || 0) + weight
      })

      // Analyse des préférences de style
      const style = profile.style_preferences.response_length
      commonPrefs.style_preferences[style] = (commonPrefs.style_preferences[style] || 0) + 1

      // Analyse des préférences de contenu
      const priceRange = profile.content_preferences.price_range
      commonPrefs.content_preferences[priceRange] = (commonPrefs.content_preferences[priceRange] || 0) + 1
    })

    return commonPrefs
  }

  aggregateLearningInsights() {
    const aggregated = {
      total_success_patterns: 0,
      total_failure_patterns: 0,
      common_adaptations: []
    }

    this.userProfiles.forEach(profile => {
      aggregated.total_success_patterns += profile.learning_insights.success_patterns.length
      aggregated.total_failure_patterns += profile.learning_insights.failure_patterns.length
      aggregated.common_adaptations.push(...profile.learning_insights.adaptation_suggestions)
    })

    return aggregated
  }

  generatePersonalizationRecommendations() {
    const recommendations = []

    const effectiveness = this.calculatePersonalizationEffectiveness()
    if (effectiveness < 0.7) {
      recommendations.push({
        priority: 'high',
        issue: 'Low personalization effectiveness',
        recommendation: 'Improve preference detection and adaptation',
        action: 'Enhance learning algorithms and feedback integration'
      })
    }

    const engagement = this.calculateEngagementDistribution()
    if (engagement.new > engagement.vip * 3) {
      recommendations.push({
        priority: 'medium',
        issue: 'High ratio of new users',
        recommendation: 'Improve onboarding and early personalization',
        action: 'Develop faster initial preference detection'
      })
    }

    return recommendations
  }
}

export { MemoryPersonalization }


