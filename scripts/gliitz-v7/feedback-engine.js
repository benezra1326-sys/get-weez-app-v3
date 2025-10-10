import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import chalk from 'chalk'

dotenv.config({ path: '.env.local' })

/**
 * Gliitz Feedback Engine v7.0
 * Collecte et analyse du feedback utilisateur après chaque interaction clé
 * avec auto-prompts et intégration des règles d'amélioration
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

class FeedbackEngine {
  constructor() {
    this.feedbackHistory = []
    this.autoPrompts = this.initializeAutoPrompts()
    this.integrationRules = this.initializeIntegrationRules()
    this.triggerEvents = ['after_booking', 'after_event', 'after_recommendation', 'after_service']
    this.feedbackDatabase = new Map()
  }

  /**
   * Initialisation des auto-prompts
   */
  initializeAutoPrompts() {
    return {
      after_booking: [
        {
          prompt: "Votre réservation s'est-elle bien déroulée ? (⭐ 1 à 5)",
          type: "rating",
          followUp: "Que pourrions-nous améliorer pour vous surprendre davantage ? 💬"
        },
        {
          prompt: "Souhaitez-vous que Gliitz retienne vos préférences pour la prochaine fois ?",
          type: "preference_save",
          followUp: "Quelles sont vos préférences spécifiques ?"
        }
      ],
      
      after_event: [
        {
          prompt: "Comment s'est passée votre soirée/événement ? (⭐ 1 à 5)",
          type: "rating",
          followUp: "Qu'est-ce qui vous a le plus plu ?"
        },
        {
          prompt: "Aimeriez-vous recevoir des suggestions similaires ?",
          type: "preference_learning",
          followUp: "Quel type d'événement vous intéresse le plus ?"
        }
      ],
      
      after_recommendation: [
        {
          prompt: "Cette recommandation vous a-t-elle aidé ? (⭐ 1 à 5)",
          type: "rating",
          followUp: "Que pourrions-nous améliorer dans nos suggestions ?"
        },
        {
          prompt: "Souhaitez-vous plus de détails sur cette recommandation ?",
          type: "detail_request",
          followUp: "Quelles informations supplémentaires souhaitez-vous ?"
        }
      ],
      
      after_service: [
        {
          prompt: "Votre expérience Gliitz s'est-elle bien passée ? (⭐ 1 à 5)",
          type: "rating",
          followUp: "Qu'est-ce qui vous a le plus marqué ?"
        },
        {
          prompt: "Recommanderiez-vous Gliitz à vos proches ?",
          type: "nps",
          followUp: "Que diriez-vous de Gliitz en une phrase ?"
        }
      ]
    }
  }

  /**
   * Initialisation des règles d'intégration
   */
  initializeIntegrationRules() {
    return {
      score_5: {
        action: "Renforcer le modèle ayant généré la réponse",
        weight: 1.2,
        learning: "positive_reinforcement",
        adaptation: "increase_similar_responses"
      },
      score_4: {
        action: "Analyser les petites incohérences",
        weight: 1.0,
        learning: "minor_adjustment",
        adaptation: "fine_tune_response_style"
      },
      score_3: {
        action: "Vérifier le ton et la précision",
        weight: 0.8,
        learning: "moderate_review",
        adaptation: "improve_tone_and_precision"
      },
      score_2: {
        action: "Réévaluer l'intention et déclencher correction automatique",
        weight: 0.5,
        learning: "significant_review",
        adaptation: "major_response_restructuring"
      },
      score_1: {
        action: "Correction complète et apprentissage approfondi",
        weight: 0.2,
        learning: "complete_review",
        adaptation: "fundamental_approach_change"
      }
    }
  }

  /**
   * Déclenchement automatique des prompts de feedback
   */
  async triggerFeedbackPrompt(triggerEvent, context = {}) {
    if (!this.triggerEvents.includes(triggerEvent)) {
      console.log(chalk.yellow(`⚠️ Événement de feedback non reconnu: ${triggerEvent}`))
      return null
    }

    const prompts = this.autoPrompts[triggerEvent]
    if (!prompts || prompts.length === 0) {
      console.log(chalk.yellow(`⚠️ Aucun prompt configuré pour: ${triggerEvent}`))
      return null
    }

    const selectedPrompt = this.selectOptimalPrompt(prompts, context)
    const feedbackSession = {
      id: this.generateFeedbackId(),
      triggerEvent,
      context,
      prompt: selectedPrompt,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }

    // Sauvegarde de la session de feedback
    await this.saveFeedbackSession(feedbackSession)
    
    console.log(chalk.blue(`📝 Prompt de feedback généré pour ${triggerEvent}`))
    return feedbackSession
  }

  /**
   * Sélection du prompt optimal basé sur le contexte
   */
  selectOptimalPrompt(prompts, context) {
    // Logique de sélection basée sur le contexte utilisateur
    const userHistory = context.userHistory || []
    const lastFeedback = this.getLastUserFeedback(context.userId)
    
    // Si l'utilisateur a déjà donné un feedback récemment, utiliser un prompt différent
    if (lastFeedback && this.isRecentFeedback(lastFeedback)) {
      return prompts.find(p => p.type === 'preference_learning') || prompts[0]
    }
    
    // Si c'est un nouvel utilisateur, commencer par un rating simple
    if (userHistory.length < 3) {
      return prompts.find(p => p.type === 'rating') || prompts[0]
    }
    
    // Utilisateur expérimenté, proposer des prompts plus détaillés
    return prompts.find(p => p.type === 'preference_save') || prompts[0]
  }

  /**
   * Traitement du feedback utilisateur
   */
  async processUserFeedback(feedbackId, userResponse, additionalData = {}) {
    const feedbackSession = await this.getFeedbackSession(feedbackId)
    if (!feedbackSession) {
      console.log(chalk.red(`❌ Session de feedback non trouvée: ${feedbackId}`))
      return null
    }

    const processedFeedback = {
      id: feedbackId,
      sessionId: feedbackSession.id,
      triggerEvent: feedbackSession.triggerEvent,
      userResponse,
      additionalData,
      timestamp: new Date().toISOString(),
      analysis: await this.analyzeFeedback(userResponse, feedbackSession),
      integration: await this.generateIntegrationPlan(userResponse, feedbackSession)
    }

    // Sauvegarde du feedback traité
    await this.saveProcessedFeedback(processedFeedback)
    
    // Application des règles d'intégration
    await this.applyIntegrationRules(processedFeedback)
    
    // Mise à jour de l'historique
    this.feedbackHistory.push(processedFeedback)
    
    console.log(chalk.green(`✅ Feedback traité et intégré: ${feedbackId}`))
    return processedFeedback
  }

  /**
   * Analyse du feedback utilisateur
   */
  async analyzeFeedback(userResponse, feedbackSession) {
    const analysis = {
      sentiment: await this.analyzeSentiment(userResponse),
      rating: this.extractRating(userResponse),
      preferences: this.extractPreferences(userResponse),
      suggestions: this.extractSuggestions(userResponse),
      emotions: await this.analyzeFeedbackEmotions(userResponse),
      intent: this.analyzeFeedbackIntent(userResponse, feedbackSession)
    }

    return analysis
  }

  /**
   * Analyse du sentiment du feedback
   */
  async analyzeSentiment(text) {
    const positiveWords = ['bien', 'parfait', 'excellent', 'super', 'génial', 'magnifique', 'fantastique', 'merveilleux']
    const negativeWords = ['mal', 'nul', 'horrible', 'décevant', 'mauvais', 'pas bien', 'problème', 'difficulté']
    const neutralWords = ['correct', 'ok', 'moyen', 'normal', 'acceptable']

    const textLower = text.toLowerCase()
    
    let positiveScore = 0
    let negativeScore = 0
    let neutralScore = 0

    positiveWords.forEach(word => {
      if (textLower.includes(word)) positiveScore++
    })

    negativeWords.forEach(word => {
      if (textLower.includes(word)) negativeScore++
    })

    neutralWords.forEach(word => {
      if (textLower.includes(word)) neutralScore++
    })

    const totalScore = positiveScore + negativeScore + neutralScore
    
    if (totalScore === 0) {
      return { sentiment: 'neutral', confidence: 0.5, score: 0 }
    }

    let sentiment = 'neutral'
    let confidence = 0.5
    
    if (positiveScore > negativeScore && positiveScore > neutralScore) {
      sentiment = 'positive'
      confidence = positiveScore / totalScore
    } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
      sentiment = 'negative'
      confidence = negativeScore / totalScore
    } else {
      sentiment = 'neutral'
      confidence = neutralScore / totalScore
    }

    return {
      sentiment,
      confidence,
      score: (positiveScore - negativeScore) / Math.max(totalScore, 1)
    }
  }

  /**
   * Extraction du rating numérique
   */
  extractRating(text) {
    // Recherche de patterns de rating
    const ratingPatterns = [
      /(\d+)\/5/g,
      /(\d+)\s*étoiles?/gi,
      /rating[:\s]*(\d+)/gi,
      /note[:\s]*(\d+)/gi,
      /(\d+)\s*\/\s*5/g
    ]

    for (const pattern of ratingPatterns) {
      const match = text.match(pattern)
      if (match) {
        const rating = parseInt(match[1])
        if (rating >= 1 && rating <= 5) {
          return { rating, confidence: 0.9, method: 'explicit' }
        }
      }
    }

    // Recherche de ratings implicites via emojis
    const starCount = (text.match(/⭐/g) || []).length
    if (starCount > 0 && starCount <= 5) {
      return { rating: starCount, confidence: 0.8, method: 'emoji' }
    }

    // Recherche de ratings textuels
    const textRatings = {
      'excellent': 5,
      'très bien': 4,
      'bien': 3,
      'correct': 3,
      'moyen': 2,
      'pas bien': 2,
      'mauvais': 1,
      'nul': 1
    }

    const textLower = text.toLowerCase()
    for (const [textRating, score] of Object.entries(textRatings)) {
      if (textLower.includes(textRating)) {
        return { rating: score, confidence: 0.7, method: 'textual' }
      }
    }

    return { rating: null, confidence: 0, method: 'none' }
  }

  /**
   * Extraction des préférences utilisateur
   */
  extractPreferences(text) {
    const preferences = {
      tone: [],
      style: [],
      content: [],
      timing: [],
      format: []
    }

    const textLower = text.toLowerCase()

    // Préférences de ton
    const toneKeywords = {
      'formel': ['formel', 'professionnel', 'sérieux'],
      'décontracté': ['décontracté', 'casual', 'relax'],
      'amical': ['amical', 'chaleureux', 'convivial'],
      'empathique': ['empathique', 'compréhensif', 'soutien']
    }

    Object.entries(toneKeywords).forEach(([tone, keywords]) => {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        preferences.tone.push(tone)
      }
    })

    // Préférences de style
    const styleKeywords = {
      'détaillé': ['détails', 'précis', 'complet', 'exhaustif'],
      'concis': ['concis', 'court', 'bref', 'résumé'],
      'visuel': ['images', 'photos', 'visuel', 'illustrations'],
      'structuré': ['organisé', 'structuré', 'claire', 'logique']
    }

    Object.entries(styleKeywords).forEach(([style, keywords]) => {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        preferences.style.push(style)
      }
    })

    // Préférences de contenu
    const contentKeywords = {
      'local': ['local', 'régional', 'marbella', 'espagne'],
      'luxe': ['luxe', 'premium', 'haut de gamme', 'exclusif'],
      'budget': ['budget', 'prix', 'économique', 'accessible'],
      'culturel': ['culture', 'art', 'musée', 'tradition'],
      'gastronomie': ['cuisine', 'restaurant', 'gastronomie', 'chef']
    }

    Object.entries(contentKeywords).forEach(([content, keywords]) => {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        preferences.content.push(content)
      }
    })

    return preferences
  }

  /**
   * Extraction des suggestions d'amélioration
   */
  extractSuggestions(text) {
    const suggestions = []
    
    // Recherche de patterns de suggestion
    const suggestionPatterns = [
      /(?:pourrait|pourriez|suggest|recommand).*?(?:être|améliorer|changer|ajouter)/gi,
      /(?:il faudrait|il serait bien de|je suggère|je recommande)/gi,
      /(?:plus de|moins de|davantage de).*?/gi
    ]

    suggestionPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          suggestions.push({
            text: match.trim(),
            type: 'improvement_suggestion',
            confidence: 0.8
          })
        })
      }
    })

    // Recherche de suggestions spécifiques
    const specificSuggestions = {
      'plus de détails': /plus de détails?/gi,
      'réponses plus rapides': /plus rapide|plus vite/gi,
      'plus d\'options': /plus d\'options?|plus de choix/gi,
      'personnalisation': /personnalisé|sur mesure/gi,
      'notifications': /notification|alerte|rappel/gi
    }

    Object.entries(specificSuggestions).forEach(([suggestion, pattern]) => {
      if (pattern.test(text)) {
        suggestions.push({
          text: suggestion,
          type: 'specific_improvement',
          confidence: 0.9
        })
      }
    })

    return suggestions
  }

  /**
   * Analyse des émotions dans le feedback
   */
  async analyzeFeedbackEmotions(text) {
    // Utilisation d'une analyse émotionnelle simplifiée
    const emotions = {
      satisfaction: ['satisfait', 'content', 'heureux', 'plaisir'],
      frustration: ['frustré', 'déçu', 'insatisfait', 'problème'],
      excitement: ['excité', 'enthousiaste', 'impatient', 'hâte'],
      confusion: ['confus', 'perdu', 'pas clair', 'incompréhensible'],
      gratitude: ['merci', 'reconnaissant', 'apprécie', 'gracieux']
    }

    const textLower = text.toLowerCase()
    const detectedEmotions = []

    Object.entries(emotions).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => textLower.includes(keyword))
      if (matches.length > 0) {
        detectedEmotions.push({
          emotion,
          confidence: matches.length / keywords.length,
          keywords: matches
        })
      }
    })

    return detectedEmotions
  }

  /**
   * Analyse de l'intention du feedback
   */
  analyzeFeedbackIntent(text, feedbackSession) {
    const textLower = text.toLowerCase()
    
    const intents = {
      'complaint': ['problème', 'erreur', 'mauvaise', 'nul', 'déçu'],
      'compliment': ['parfait', 'excellent', 'super', 'génial', 'merveilleux'],
      'suggestion': ['pourrait', 'suggère', 'recommand', 'améliorer'],
      'question': ['comment', 'pourquoi', 'quand', 'où', 'quoi'],
      'request': ['peux', 'pourrais', 'souhaite', 'veux', 'besoin']
    }

    const detectedIntents = []

    Object.entries(intents).forEach(([intent, keywords]) => {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        detectedIntents.push({
          intent,
          confidence: keywords.filter(k => textLower.includes(k)).length / keywords.length
        })
      }
    })

    return detectedIntents.length > 0 ? detectedIntents[0] : { intent: 'general', confidence: 0.5 }
  }

  /**
   * Génération du plan d'intégration
   */
  async generateIntegrationPlan(userResponse, feedbackSession) {
    const rating = this.extractRating(userResponse)
    const sentiment = await this.analyzeSentiment(userResponse)
    
    let integrationPlan = {
      priority: 'medium',
      actions: [],
      learning: [],
      adaptation: []
    }

    // Application des règles d'intégration basées sur le rating
    if (rating.rating) {
      const rule = this.integrationRules[`score_${rating.rating}`]
      if (rule) {
        integrationPlan.priority = rating.rating <= 2 ? 'high' : rating.rating <= 3 ? 'medium' : 'low'
        integrationPlan.actions.push(rule.action)
        integrationPlan.learning.push(rule.learning)
        integrationPlan.adaptation.push(rule.adaptation)
      }
    }

    // Plan basé sur le sentiment
    if (sentiment.sentiment === 'negative') {
      integrationPlan.priority = 'high'
      integrationPlan.actions.push('Analyser les causes de mécontentement')
      integrationPlan.learning.push('negative_feedback_analysis')
      integrationPlan.adaptation.push('response_improvement')
    } else if (sentiment.sentiment === 'positive') {
      integrationPlan.learning.push('positive_reinforcement')
      integrationPlan.adaptation.push('maintain_successful_patterns')
    }

    return integrationPlan
  }

  /**
   * Application des règles d'intégration
   */
  async applyIntegrationRules(processedFeedback) {
    const integration = processedFeedback.integration
    
    // Sauvegarde des règles d'intégration pour apprentissage
    await this.saveIntegrationRules(processedFeedback.id, integration)
    
    // Application des actions d'apprentissage
    await this.applyLearningActions(integration.learning, processedFeedback)
    
    // Application des adaptations
    await this.applyAdaptations(integration.adaptation, processedFeedback)
    
    console.log(chalk.blue(`🔄 Règles d'intégration appliquées pour ${processedFeedback.id}`))
  }

  /**
   * Génération du rapport d'analyse de feedback
   */
  async generateFeedbackAnalysisReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalFeedback: this.feedbackHistory.length,
      feedbackDistribution: this.calculateFeedbackDistribution(),
      sentimentAnalysis: this.calculateSentimentTrends(),
      ratingDistribution: this.calculateRatingDistribution(),
      commonSuggestions: this.extractCommonSuggestions(),
      integrationEffectiveness: await this.calculateIntegrationEffectiveness(),
      recommendations: this.generateFeedbackRecommendations()
    }

    fs.writeFileSync('user_feedback_analysis.json', JSON.stringify(report, null, 2))
    console.log(chalk.green('✅ Rapport d\'analyse de feedback généré: user_feedback_analysis.json'))
    
    return report
  }

  /**
   * Méthodes utilitaires
   */
  generateFeedbackId() {
    return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async saveFeedbackSession(session) {
    try {
      const { error } = await supabase
        .from('gliitz_feedback_sessions')
        .insert([{
          id: session.id,
          trigger_event: session.triggerEvent,
          context: session.context,
          prompt: session.prompt,
          timestamp: session.timestamp,
          status: session.status
        }])

      if (error) {
        console.error('❌ Erreur sauvegarde session feedback:', error)
      }
    } catch (error) {
      console.error('❌ Erreur Supabase feedback session:', error)
    }
  }

  async getFeedbackSession(feedbackId) {
    try {
      const { data, error } = await supabase
        .from('gliitz_feedback_sessions')
        .select('*')
        .eq('id', feedbackId)
        .single()

      if (error) {
        console.error('❌ Erreur récupération session feedback:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('❌ Erreur Supabase get feedback session:', error)
      return null
    }
  }

  async saveProcessedFeedback(feedback) {
    try {
      const { error } = await supabase
        .from('gliitz_feedback_processed')
        .insert([{
          id: feedback.id,
          session_id: feedback.sessionId,
          trigger_event: feedback.triggerEvent,
          user_response: feedback.userResponse,
          additional_data: feedback.additionalData,
          timestamp: feedback.timestamp,
          analysis: feedback.analysis,
          integration: feedback.integration
        }])

      if (error) {
        console.error('❌ Erreur sauvegarde feedback traité:', error)
      }
    } catch (error) {
      console.error('❌ Erreur Supabase feedback traité:', error)
    }
  }

  async saveIntegrationRules(feedbackId, integration) {
    // Sauvegarde des règles d'intégration pour suivi
    try {
      const { error } = await supabase
        .from('gliitz_integration_rules')
        .insert([{
          feedback_id: feedbackId,
          priority: integration.priority,
          actions: integration.actions,
          learning: integration.learning,
          adaptation: integration.adaptation,
          timestamp: new Date().toISOString()
        }])

      if (error) {
        console.error('❌ Erreur sauvegarde règles intégration:', error)
      }
    } catch (error) {
      console.error('❌ Erreur Supabase règles intégration:', error)
    }
  }

  async applyLearningActions(learningActions, feedback) {
    // Application des actions d'apprentissage
    console.log(chalk.blue(`📚 Application des actions d'apprentissage: ${learningActions.join(', ')}`))
  }

  async applyAdaptations(adaptations, feedback) {
    // Application des adaptations
    console.log(chalk.blue(`🔧 Application des adaptations: ${adaptations.join(', ')}`))
  }

  getLastUserFeedback(userId) {
    return this.feedbackHistory
      .filter(feedback => feedback.additionalData.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
  }

  isRecentFeedback(feedback) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return new Date(feedback.timestamp) > oneDayAgo
  }

  calculateFeedbackDistribution() {
    const distribution = {}
    this.feedbackHistory.forEach(feedback => {
      const event = feedback.triggerEvent
      distribution[event] = (distribution[event] || 0) + 1
    })
    return distribution
  }

  calculateSentimentTrends() {
    const sentiments = this.feedbackHistory.map(feedback => feedback.analysis.sentiment.sentiment)
    const sentimentCounts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1
      return acc
    }, {})

    return sentimentCounts
  }

  calculateRatingDistribution() {
    const ratings = this.feedbackHistory
      .map(feedback => feedback.analysis.rating.rating)
      .filter(rating => rating !== null)

    const ratingCounts = ratings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {})

    return ratingCounts
  }

  extractCommonSuggestions() {
    const allSuggestions = this.feedbackHistory
      .flatMap(feedback => feedback.analysis.suggestions)
      .map(suggestion => suggestion.text)

    const suggestionCounts = allSuggestions.reduce((acc, suggestion) => {
      acc[suggestion] = (acc[suggestion] || 0) + 1
      return acc
    }, {})

    return Object.entries(suggestionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([suggestion, count]) => ({ suggestion, count }))
  }

  async calculateIntegrationEffectiveness() {
    // Calcul de l'efficacité des intégrations basé sur l'évolution des ratings
    const ratings = this.feedbackHistory
      .map(feedback => ({
        rating: feedback.analysis.rating.rating,
        timestamp: feedback.timestamp
      }))
      .filter(item => item.rating !== null)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    if (ratings.length < 2) return 0

    const firstHalf = ratings.slice(0, Math.floor(ratings.length / 2))
    const secondHalf = ratings.slice(Math.floor(ratings.length / 2))

    const firstAvg = firstHalf.reduce((sum, item) => sum + item.rating, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.rating, 0) / secondHalf.length

    return secondAvg - firstAvg // Amélioration moyenne
  }

  generateFeedbackRecommendations() {
    const recommendations = []

    const ratingDistribution = this.calculateRatingDistribution()
    const avgRating = Object.entries(ratingDistribution)
      .reduce((sum, [rating, count]) => sum + (parseInt(rating) * count), 0) /
      Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0)

    if (avgRating < 3.5) {
      recommendations.push({
        priority: 'critical',
        issue: 'Rating moyen faible',
        recommendation: 'Analyser les causes principales de mécontentement',
        action: 'Mettre en place des corrections immédiates'
      })
    }

    const commonSuggestions = this.extractCommonSuggestions()
    if (commonSuggestions.length > 0) {
      recommendations.push({
        priority: 'high',
        issue: 'Suggestions récurrentes',
        recommendation: 'Implémenter les suggestions les plus fréquentes',
        action: 'Prioriser les améliorations demandées par les utilisateurs'
      })
    }

    return recommendations
  }
}

export { FeedbackEngine }


