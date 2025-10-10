import fs from 'fs'
import chalk from 'chalk'

/**
 * Gliitz Semantic Reflection Engine v7.0
 * Analyse sémantique, émotionnelle et contextuelle de chaque échange
 * pour mesurer l'intelligence globale et générer des auto-ajustements
 */

class SemanticReflectionEngine {
  constructor() {
    this.intelligenceMetrics = {
      semantic_understanding: 0,
      contextual_memory: 0,
      tonal_coherence: 0,
      temporal_awareness: 0,
      intent_mapping_accuracy: 0
    }
    
    this.autoAdjustments = []
    this.reflectionHistory = []
  }

  /**
   * Analyse complète d'une conversation
   */
  async analyzeConversation(conversation) {
    const analysis = {
      id: conversation.id,
      timestamp: new Date().toISOString(),
      semantic: await this.analyzeSemanticUnderstanding(conversation),
      contextual: this.analyzeContextualMemory(conversation),
      tonal: this.analyzeTonalCoherence(conversation),
      temporal: this.analyzeTemporalAwareness(conversation),
      intent: this.analyzeIntentMapping(conversation),
      overall: null
    }

    // Calcul du score global
    analysis.overall = this.calculateOverallIntelligence(analysis)

    // Génération des ajustements automatiques
    analysis.autoAdjustments = this.generateAutoAdjustments(analysis)

    this.reflectionHistory.push(analysis)
    this.updateGlobalMetrics(analysis)

    return analysis
  }

  /**
   * Analyse de la compréhension sémantique
   */
  async analyzeSemanticUnderstanding(conversation) {
    const userMessage = conversation.userMessage.content
    const aiResponse = conversation.aiResponse.content

    // Pertinence sémantique
    const semanticRelevance = this.calculateSemanticRelevance(userMessage, aiResponse)
    
    // Alignement d'intention
    const intentAlignment = this.calculateIntentAlignment(
      conversation.userMessage.intent,
      conversation.aiResponse.content
    )

    // Cohérence émotionnelle
    const emotionalCoherence = this.calculateEmotionalCoherence(
      conversation.userMessage.emotion,
      conversation.aiResponse.tone
    )

    // Précision des détails
    const detailPrecision = this.calculateDetailPrecision(aiResponse)

    // Structure de réponse
    const responseStructure = this.evaluateResponseStructure(aiResponse)

    const score = (
      semanticRelevance * 0.3 +
      intentAlignment * 0.25 +
      emotionalCoherence * 0.2 +
      detailPrecision * 0.15 +
      responseStructure * 0.1
    ) * 100

    return {
      score: Math.round(score),
      components: {
        semanticRelevance,
        intentAlignment,
        emotionalCoherence,
        detailPrecision,
        responseStructure
      },
      analysis: {
        relevance: this.analyzeSemanticRelevance(userMessage, aiResponse),
        alignment: this.analyzeIntentAlignment(conversation.userMessage.intent, aiResponse),
        emotion: this.analyzeEmotionalCoherence(conversation.userMessage.emotion, conversation.aiResponse.tone)
      }
    }
  }

  /**
   * Analyse de la mémoire contextuelle
   */
  analyzeContextualMemory(conversation) {
    const context = conversation.context
    const conversationHistory = context.conversationHistory || []

    // Rétention de contexte multi-tour
    const contextRetention = this.evaluateContextRetention(conversationHistory, conversation.userMessage.content)

    // Personnalisation basée sur l'historique
    const personalization = this.evaluatePersonalization(conversationHistory, conversation.aiResponse.content)

    // Continuité conversationnelle
    const continuity = this.evaluateConversationalContinuity(conversationHistory, conversation.userMessage.content)

    const score = (
      contextRetention * 0.4 +
      personalization * 0.35 +
      continuity * 0.25
    ) * 100

    return {
      score: Math.round(score),
      components: {
        contextRetention,
        personalization,
        continuity
      },
      analysis: {
        retained: this.analyzeRetainedContext(conversationHistory),
        personalized: this.analyzePersonalization(conversationHistory, conversation.aiResponse.content),
        continuous: this.analyzeContinuity(conversationHistory, conversation.userMessage.content)
      }
    }
  }

  /**
   * Analyse de la cohérence tonale
   */
  analyzeTonalCoherence(conversation) {
    const expectedTone = this.determineExpectedTone(conversation.userMessage.emotion, conversation.userMessage.intent)
    const actualTone = conversation.aiResponse.tone

    // Alignement tonal
    const tonalAlignment = this.calculateTonalAlignment(expectedTone, actualTone)

    // Cohérence avec l'identité Gliitz
    const brandCoherence = this.evaluateBrandCoherence(conversation.aiResponse.content)

    // Adaptation émotionnelle
    const emotionalAdaptation = this.evaluateEmotionalAdaptation(
      conversation.userMessage.emotion,
      conversation.aiResponse.content
    )

    const score = (
      tonalAlignment * 0.4 +
      brandCoherence * 0.35 +
      emotionalAdaptation * 0.25
    ) * 100

    return {
      score: Math.round(score),
      components: {
        tonalAlignment,
        brandCoherence,
        emotionalAdaptation
      },
      analysis: {
        expected: expectedTone,
        actual: actualTone[0]?.tone || 'neutre',
        alignment: this.analyzeTonalAlignment(expectedTone, actualTone)
      }
    }
  }

  /**
   * Analyse de la conscience temporelle
   */
  analyzeTemporalAwareness(conversation) {
    const timeOfDay = conversation.context.timeOfDay
    const userMessage = conversation.userMessage.content
    const aiResponse = conversation.aiResponse.content

    // Reconnaissance temporelle
    const temporalRecognition = this.evaluateTemporalRecognition(userMessage, aiResponse, timeOfDay)

    // Adaptation saisonnière
    const seasonalAdaptation = this.evaluateSeasonalAdaptation(userMessage, aiResponse)

    // Urgence temporelle
    const temporalUrgency = this.evaluateTemporalUrgency(userMessage, aiResponse)

    const score = (
      temporalRecognition * 0.4 +
      seasonalAdaptation * 0.35 +
      temporalUrgency * 0.25
    ) * 100

    return {
      score: Math.round(score),
      components: {
        temporalRecognition,
        seasonalAdaptation,
        temporalUrgency
      },
      analysis: {
        timeContext: this.analyzeTimeContext(timeOfDay, userMessage),
        urgency: this.analyzeTemporalUrgency(userMessage)
      }
    }
  }

  /**
   * Analyse de la précision de mapping d'intention
   */
  analyzeIntentMapping(conversation) {
    const detectedIntent = conversation.userMessage.intent
    const aiResponse = conversation.aiResponse.content

    // Précision du mapping
    const mappingAccuracy = this.evaluateIntentMapping(detectedIntent, aiResponse)

    // Complétude de la réponse
    const responseCompleteness = this.evaluateResponseCompleteness(detectedIntent, aiResponse)

    // Pertinence des suggestions
    const suggestionRelevance = this.evaluateSuggestionRelevance(detectedIntent, aiResponse)

    const score = (
      mappingAccuracy * 0.4 +
      responseCompleteness * 0.35 +
      suggestionRelevance * 0.25
    ) * 100

    return {
      score: Math.round(score),
      components: {
        mappingAccuracy,
        responseCompleteness,
        suggestionRelevance
      },
      analysis: {
        detected: detectedIntent.intent,
        confidence: detectedIntent.confidence,
        mapping: this.analyzeIntentMapping(detectedIntent, aiResponse)
      }
    }
  }

  /**
   * Calcul du score d'intelligence global
   */
  calculateOverallIntelligence(analysis) {
    const weights = {
      semantic: 0.25,
      contextual: 0.25,
      tonal: 0.20,
      temporal: 0.15,
      intent: 0.15
    }

    const weightedScore = 
      analysis.semantic.score * weights.semantic +
      analysis.contextual.score * weights.contextual +
      analysis.tonal.score * weights.tonal +
      analysis.temporal.score * weights.temporal +
      analysis.intent.score * weights.intent

    return Math.round(weightedScore)
  }

  /**
   * Génération des ajustements automatiques
   */
  generateAutoAdjustments(analysis) {
    const adjustments = []

    // Ajustement dynamique du ton
    if (analysis.tonal.score < 80) {
      adjustments.push({
        type: 'tonal_adjustment',
        priority: 'high',
        action: 'Ajuster le ton selon l\'émotion utilisateur',
        target: analysis.tonal.analysis.expected,
        current: analysis.tonal.analysis.actual
      })
    }

    // Correction automatique de contexte manquant
    if (analysis.contextual.score < 70) {
      adjustments.push({
        type: 'context_correction',
        priority: 'critical',
        action: 'Enrichir la mémoire conversationnelle',
        issue: 'Contexte manquant ou mal retenu'
      })
    }

    // Réécriture silencieuse en cas de réponse vague
    if (analysis.semantic.score < 75) {
      adjustments.push({
        type: 'precision_improvement',
        priority: 'high',
        action: 'Améliorer la précision et les détails',
        issue: 'Réponse trop vague ou imprécise'
      })
    }

    // Amélioration de la conscience temporelle
    if (analysis.temporal.score < 70) {
      adjustments.push({
        type: 'temporal_awareness',
        priority: 'medium',
        action: 'Renforcer la conscience temporelle',
        issue: 'Manque d\'adaptation au contexte temporel'
      })
    }

    // Optimisation du mapping d'intention
    if (analysis.intent.score < 75) {
      adjustments.push({
        type: 'intent_optimization',
        priority: 'high',
        action: 'Améliorer la détection et réponse aux intentions',
        issue: 'Mapping d\'intention imprécis'
      })
    }

    return adjustments
  }

  /**
   * Mise à jour des métriques globales
   */
  updateGlobalMetrics(analysis) {
    this.intelligenceMetrics.semantic_understanding = 
      (this.intelligenceMetrics.semantic_understanding + analysis.semantic.score) / 2

    this.intelligenceMetrics.contextual_memory = 
      (this.intelligenceMetrics.contextual_memory + analysis.contextual.score) / 2

    this.intelligenceMetrics.tonal_coherence = 
      (this.intelligenceMetrics.tonal_coherence + analysis.tonal.score) / 2

    this.intelligenceMetrics.temporal_awareness = 
      (this.intelligenceMetrics.temporal_awareness + analysis.temporal.score) / 2

    this.intelligenceMetrics.intent_mapping_accuracy = 
      (this.intelligenceMetrics.intent_mapping_accuracy + analysis.intent.score) / 2
  }

  /**
   * Méthodes utilitaires pour les calculs
   */
  calculateSemanticRelevance(userMessage, aiResponse) {
    // Analyse simple de la pertinence basée sur les mots-clés communs
    const userWords = new Set(userMessage.toLowerCase().split(/\s+/))
    const aiWords = new Set(aiResponse.toLowerCase().split(/\s+/))
    
    const intersection = new Set([...userWords].filter(x => aiWords.has(x)))
    const union = new Set([...userWords, ...aiWords])
    
    return intersection.size / union.size
  }

  calculateIntentAlignment(intent, response) {
    // Vérification si la réponse correspond à l'intention détectée
    const responseLower = response.toLowerCase()
    const intentKeywords = this.getIntentKeywords(intent.intent)
    
    const matches = intentKeywords.filter(keyword => responseLower.includes(keyword))
    return matches.length / intentKeywords.length
  }

  calculateEmotionalCoherence(userEmotion, aiTone) {
    const emotionToneMapping = {
      'joie': ['enthousiaste', 'chaleureux', 'positif'],
      'stress': ['apaisant', 'rassurant', 'calme'],
      'tristesse': ['empathique', 'réconfortant', 'doux'],
      'excitation': ['énergique', 'passionné', 'dynamique'],
      'hésitation': ['guidant', 'encourageant', 'patient'],
      'curiosité': ['informatif', 'engagé', 'intéressant']
    }

    const expectedTones = emotionToneMapping[userEmotion.dominant] || ['neutre']
    const actualTone = aiTone[0]?.tone || 'neutre'

    return expectedTones.includes(actualTone) ? 1 : 0.3
  }

  calculateDetailPrecision(response) {
    const precisionIndicators = {
      location: /Marbella|Puerto Banús|Nueva Andalucía|San Pedro|Estepona/i.test(response),
      time: /\d+h|\d+:\d+|ce soir|demain|week-end/i.test(response),
      price: /€|\beuros?\b|prix|tarif/i.test(response),
      contact: /réservation|booking|contact|téléphone/i.test(response),
      specifics: this.countSpecificDetails(response) > 3
    }

    return Object.values(precisionIndicators).filter(Boolean).length / Object.keys(precisionIndicators).length
  }

  evaluateResponseStructure(response) {
    const hasTitle = /^\*\*.*\*\*/.test(response)
    const hasBullets = response.includes('•') || response.includes('-')
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/u.test(response)
    const hasNumbers = /\d+/.test(response)
    const hasQuestions = /\?/.test(response)

    const structureElements = [hasTitle, hasBullets, hasEmojis, hasNumbers, hasQuestions]
    return structureElements.filter(Boolean).length / structureElements.length
  }

  // Méthodes d'évaluation supplémentaires
  evaluateContextRetention(history, currentMessage) {
    if (history.length === 0) return 1
    
    const currentKeywords = new Set(currentMessage.toLowerCase().split(/\s+/))
    let retentionScore = 0
    
    history.slice(-3).forEach(prevMessage => {
      const prevKeywords = new Set(prevMessage.toLowerCase().split(/\s+/))
      const intersection = new Set([...currentKeywords].filter(x => prevKeywords.has(x)))
      retentionScore += intersection.size / currentKeywords.size
    })
    
    return Math.min(1, retentionScore / Math.min(3, history.length))
  }

  evaluatePersonalization(history, response) {
    if (history.length === 0) return 0.5
    
    // Analyse simple de la personnalisation basée sur l'historique
    const historyText = history.join(' ').toLowerCase()
    const responseLower = response.toLowerCase()
    
    const personalizationIndicators = [
      'comme la dernière fois',
      'selon vos préférences',
      'comme vous aimez',
      'comme d\'habitude',
      'personnalisé'
    ]
    
    const matches = personalizationIndicators.filter(indicator => responseLower.includes(indicator))
    return Math.min(1, matches.length / personalizationIndicators.length + 0.3)
  }

  evaluateConversationalContinuity(history, currentMessage) {
    if (history.length === 0) return 1
    
    const lastMessage = history[history.length - 1]
    const continuity = this.calculateSemanticRelevance(lastMessage, currentMessage)
    return continuity > 0.1 ? 1 : 0.3
  }

  determineExpectedTone(emotion, intent) {
    const toneMapping = {
      'joie': 'enthousiaste',
      'stress': 'apaisant',
      'tristesse': 'empathique',
      'excitation': 'énergique',
      'hésitation': 'guidant',
      'curiosité': 'informatif'
    }
    
    return toneMapping[emotion.dominant] || 'professionnel'
  }

  calculateTonalAlignment(expected, actual) {
    const actualTone = actual[0]?.tone || 'neutre'
    
    const toneCompatibility = {
      'enthousiaste': ['chaleureux', 'positif', 'énergique'],
      'apaisant': ['calme', 'rassurant', 'doux'],
      'empathique': ['réconfortant', 'compréhensif', 'bienveillant'],
      'énergique': ['dynamique', 'passionné', 'motivé'],
      'guidant': ['encourageant', 'patient', 'explicatif'],
      'informatif': ['claire', 'détaillé', 'précis']
    }
    
    const compatibleTones = toneCompatibility[expected] || [expected]
    return compatibleTones.includes(actualTone) ? 1 : 0.3
  }

  evaluateBrandCoherence(response) {
    const gliitzIndicators = [
      'élégant', 'raffiné', 'sophistiqué', 'premium', 'exclusif',
      'bienveillant', 'attentionné', 'personnalisé', 'sur mesure'
    ]
    
    const responseLower = response.toLowerCase()
    const matches = gliitzIndicators.filter(indicator => responseLower.includes(indicator))
    return Math.min(1, matches.length / 3)
  }

  evaluateEmotionalAdaptation(emotion, response) {
    const emotionResponses = {
      'joie': ['félicitations', 'magnifique', 'parfait', 'excellent'],
      'stress': ['comprends', 'rassure', 'aide', 'soutien'],
      'tristesse': ['comprends', 'réconforte', 'soutien', 'empathie'],
      'excitation': ['enthousiaste', 'passionné', 'dynamique', 'énergie']
    }
    
    const expectedResponses = emotionResponses[emotion.dominant] || []
    const responseLower = response.toLowerCase()
    const matches = expectedResponses.filter(word => responseLower.includes(word))
    
    return matches.length > 0 ? 1 : 0.2
  }

  // Méthodes utilitaires
  getIntentKeywords(intent) {
    const keywords = {
      'recherche_restaurant': ['restaurant', 'manger', 'cuisine', 'menu', 'chef'],
      'recherche_événement': ['événement', 'soirée', 'fête', 'concert', 'spectacle'],
      'recherche_hébergement': ['hôtel', 'villa', 'appartement', 'chambre', 'séjour'],
      'recherche_activité': ['activité', 'loisir', 'sport', 'excursion', 'visite'],
      'réservation': ['réserver', 'disponible', 'planifier', 'organiser', 'booking'],
      'information': ['information', 'détails', 'renseignement', 'explication'],
      'aide': ['aide', 'assistance', 'support', 'problème', 'difficulté']
    }
    
    return keywords[intent] || ['général']
  }

  countSpecificDetails(response) {
    const details = ['Marbella', 'Puerto Banús', '€', 'hôtel', 'restaurant', 'spa', 'plage', 'golf', 'chef', 'menu']
    return details.filter(detail => response.toLowerCase().includes(detail.toLowerCase())).length
  }

  evaluateTemporalRecognition(message, response, timeOfDay) {
    const timeContexts = {
      morning: ['petit-déjeuner', 'matin', 'tôt'],
      afternoon: ['déjeuner', 'après-midi', 'midi'],
      evening: ['dîner', 'soir', 'soirée'],
      night: ['nuit', 'tard', 'nocturne']
    }
    
    const currentContext = timeContexts[this.getTimeOfDay(timeOfDay)] || []
    const messageLower = message.toLowerCase()
    const responseLower = response.toLowerCase()
    
    const messageMatches = currentContext.filter(word => messageLower.includes(word))
    const responseMatches = currentContext.filter(word => responseLower.includes(word))
    
    return (messageMatches.length + responseMatches.length) > 0 ? 1 : 0.5
  }

  evaluateSeasonalAdaptation(message, response) {
    const seasons = {
      summer: ['été', 'chaud', 'plage', 'bain'],
      winter: ['hiver', 'froid', 'chauffage', 'intérieur'],
      spring: ['printemps', 'fleur', 'renouveau'],
      autumn: ['automne', 'feuille', 'récolte']
    }
    
    const messageLower = message.toLowerCase()
    const responseLower = response.toLowerCase()
    
    for (const [season, keywords] of Object.entries(seasons)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return keywords.some(keyword => responseLower.includes(keyword)) ? 1 : 0.3
      }
    }
    
    return 0.7 // Pas de contexte saisonnier spécifique
  }

  evaluateTemporalUrgency(message, response) {
    const urgencyKeywords = ['urgent', 'rapide', 'immédiat', 'maintenant', 'vite', 'pressé']
    const messageLower = message.toLowerCase()
    const responseLower = response.toLowerCase()
    
    const hasUrgency = urgencyKeywords.some(keyword => messageLower.includes(keyword))
    const addressesUrgency = urgencyKeywords.some(keyword => responseLower.includes(keyword))
    
    if (hasUrgency) {
      return addressesUrgency ? 1 : 0.2
    }
    
    return 0.8 // Pas d'urgence détectée
  }

  evaluateIntentMapping(intent, response) {
    const intentKeywords = this.getIntentKeywords(intent.intent)
    const responseLower = response.toLowerCase()
    
    const matches = intentKeywords.filter(keyword => responseLower.includes(keyword))
    return matches.length / intentKeywords.length
  }

  evaluateResponseCompleteness(intent, response) {
    const completenessRequirements = {
      'recherche_restaurant': ['nom', 'adresse', 'cuisine', 'prix'],
      'recherche_événement': ['nom', 'date', 'lieu', 'prix'],
      'recherche_hébergement': ['nom', 'adresse', 'prix', 'disponibilité'],
      'recherche_activité': ['nom', 'lieu', 'durée', 'prix'],
      'réservation': ['processus', 'contact', 'disponibilité'],
      'information': ['détails', 'explication', 'contexte'],
      'aide': ['solution', 'étapes', 'support']
    }
    
    const requirements = completenessRequirements[intent.intent] || []
    const responseLower = response.toLowerCase()
    
    const metRequirements = requirements.filter(req => 
      responseLower.includes(req) || this.hasRelatedContent(req, responseLower)
    )
    
    return metRequirements.length / requirements.length
  }

  evaluateSuggestionRelevance(intent, response) {
    const suggestionKeywords = this.getIntentKeywords(intent.intent)
    const responseLower = response.toLowerCase()
    
    // Vérifier si la réponse contient des suggestions pertinentes
    const hasSuggestions = /\*\*.*\*\*/.test(response) || /•/.test(response)
    const hasRelevantContent = suggestionKeywords.some(keyword => responseLower.includes(keyword))
    
    return hasSuggestions && hasRelevantContent ? 1 : 0.5
  }

  getTimeOfDay(hour) {
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 22) return 'evening'
    return 'night'
  }

  hasRelatedContent(requirement, response) {
    const relatedTerms = {
      'nom': ['établissement', 'restaurant', 'hôtel', 'lieu'],
      'adresse': ['situé', 'localisation', 'adresse', 'zone'],
      'prix': ['€', 'euros', 'tarif', 'coût'],
      'disponibilité': ['disponible', 'réservation', 'booking'],
      'contact': ['téléphone', 'email', 'contact', 'réservation']
    }
    
    const terms = relatedTerms[requirement] || []
    return terms.some(term => response.includes(term))
  }

  /**
   * Génération du rapport de réflexion sémantique
   */
  async generateSemanticReflectionReport() {
    const report = {
      timestamp: new Date().toISOString(),
      globalMetrics: this.intelligenceMetrics,
      totalConversations: this.reflectionHistory.length,
      averageIntelligence: this.reflectionHistory.reduce((sum, analysis) => sum + analysis.overall, 0) / this.reflectionHistory.length,
      recentAnalyses: this.reflectionHistory.slice(-10),
      autoAdjustments: this.autoAdjustments,
      recommendations: this.generateRecommendations()
    }

    fs.writeFileSync('semantic_reflection_results.json', JSON.stringify(report, null, 2))
    console.log(chalk.green('✅ Rapport de réflexion sémantique généré: semantic_reflection_results.json'))
    
    return report
  }

  generateRecommendations() {
    const recommendations = []
    
    Object.entries(this.intelligenceMetrics).forEach(([metric, score]) => {
      if (score < 80) {
        recommendations.push({
          metric,
          currentScore: score,
          targetScore: 100,
          action: `Améliorer ${metric.replace('_', ' ')}`,
          priority: score < 60 ? 'critical' : 'high'
        })
      }
    })
    
    return recommendations
  }

  // Méthodes d'analyse supplémentaires
  analyzeSemanticRelevance(userMessage, aiResponse) {
    return {
      keywordOverlap: this.calculateSemanticRelevance(userMessage, aiResponse),
      topicAlignment: this.evaluateTopicAlignment(userMessage, aiResponse),
      contextPreservation: this.evaluateContextPreservation(userMessage, aiResponse)
    }
  }

  analyzeIntentAlignment(intent, response) {
    return {
      intentDetected: intent.intent,
      confidence: intent.confidence,
      responseAlignment: this.calculateIntentAlignment(intent, response),
      completeness: this.evaluateResponseCompleteness(intent, response)
    }
  }

  analyzeEmotionalCoherence(userEmotion, aiTone) {
    return {
      userEmotion: userEmotion.dominant,
      expectedTone: this.determineExpectedTone(userEmotion, { intent: 'general' }),
      actualTone: aiTone[0]?.tone || 'neutre',
      coherence: this.calculateEmotionalCoherence(userEmotion, aiTone)
    }
  }

  // Méthodes manquantes ajoutées
  analyzeRetainedContext(conversationHistory) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return { retained: [], score: 0 }
    }
    
    const retained = conversationHistory.slice(-3).map(msg => ({
      content: msg,
      timestamp: new Date().toISOString()
    }))
    
    return {
      retained,
      score: retained.length / 3
    }
  }

  analyzePersonalization(conversationHistory, aiResponse) {
    return {
      personalized: conversationHistory.length > 0,
      level: Math.min(1, conversationHistory.length / 5),
      indicators: ['context', 'preferences', 'history']
    }
  }

  analyzeContinuity(conversationHistory, userMessage) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return { continuous: false, score: 0 }
    }
    
    const lastMessage = conversationHistory[conversationHistory.length - 1]
    const continuity = this.calculateSemanticRelevance(lastMessage, userMessage)
    
    return {
      continuous: continuity > 0.3,
      score: continuity
    }
  }

  analyzeTimeContext(timeOfDay, userMessage) {
    const timeContexts = {
      morning: ['petit-déjeuner', 'matin', 'tôt'],
      afternoon: ['déjeuner', 'après-midi', 'midi'],
      evening: ['dîner', 'soir', 'soirée'],
      night: ['nuit', 'tard', 'nocturne']
    }
    
    const currentContext = timeContexts[this.getTimeOfDay(timeOfDay)] || []
    const messageLower = userMessage.toLowerCase()
    
    const matches = currentContext.filter(word => messageLower.includes(word))
    
    return {
      timeContext: this.getTimeOfDay(timeOfDay),
      relevant: matches.length > 0,
      matches
    }
  }

  analyzeTemporalUrgency(userMessage) {
    const urgencyKeywords = ['urgent', 'immédiat', 'maintenant', 'vite', 'rapide', 'priorité']
    const messageLower = userMessage.toLowerCase()
    
    const matches = urgencyKeywords.filter(keyword => messageLower.includes(keyword))
    
    return {
      urgent: matches.length > 0,
      level: matches.length / urgencyKeywords.length,
      keywords: matches
    }
  }

  evaluateTopicAlignment(userMessage, aiResponse) {
    const userTopics = this.extractTopics(userMessage)
    const aiTopics = this.extractTopics(aiResponse)
    
    const intersection = userTopics.filter(topic => aiTopics.includes(topic))
    return intersection.length / Math.max(userTopics.length, 1)
  }

  evaluateContextPreservation(userMessage, aiResponse) {
    const userKeywords = new Set(userMessage.toLowerCase().split(/\s+/))
    const aiKeywords = new Set(aiResponse.toLowerCase().split(/\s+/))
    
    const preserved = [...userKeywords].filter(keyword => aiKeywords.has(keyword))
    return preserved.length / userKeywords.size
  }

  extractTopics(text) {
    const topics = ['restaurant', 'hôtel', 'événement', 'spa', 'plage', 'golf', 'shopping', 'culture']
    const textLower = text.toLowerCase()
    return topics.filter(topic => textLower.includes(topic))
  }
}

export { SemanticReflectionEngine }
