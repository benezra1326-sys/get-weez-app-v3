// 🚀 CAPACITÉS D'IA AVANCÉES - NIVEAU CHATGPT
// Objectif : Faire de Get Weez une IA aussi intelligente que ChatGPT

export class AdvancedAICapabilities {
  constructor() {
    this.conversationMemory = new Map()
    this.userPreferences = new Map()
    this.contextualLearning = new Map()
    this.emotionalIntelligence = new Map()
  }

  // === ANALYSE ÉMOTIONNELLE ===
  analyzeEmotionalTone(message) {
    const emotionalKeywords = {
      excited: ['super', 'génial', 'excellent', 'parfait', 'fantastique', 'incroyable'],
      urgent: ['urgent', 'rapidement', 'vite', 'immédiatement', 'maintenant'],
      romantic: ['romantique', 'couple', 'anniversaire', 'mariage', 'proposition'],
      business: ['business', 'travail', 'réunion', 'client', 'partenaire'],
      casual: ['cool', 'sympa', 'chill', 'détente', 'relax'],
      luxury: ['luxe', 'exclusif', 'vip', 'premium', 'haut de gamme']
    }

    const tone = { primary: 'neutral', intensity: 0.5, keywords: [] }
    
    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      const foundKeywords = keywords.filter(keyword => 
        message.toLowerCase().includes(keyword)
      )
      
      if (foundKeywords.length > 0) {
        tone.primary = emotion
        tone.intensity = Math.min(0.9, foundKeywords.length * 0.2)
        tone.keywords = foundKeywords
        break
      }
    }

    return tone
  }

  // === COMPRÉHENSION CONTEXTUELLE PROFONDE ===
  deepContextualUnderstanding(message, conversationHistory = []) {
    const analysis = {
      intent: this.detectIntent(message),
      entities: this.extractEntities(message),
      sentiment: this.analyzeEmotionalTone(message),
      complexity: this.assessComplexity(message),
      urgency: this.detectUrgency(message),
      preferences: this.extractPreferences(message),
      context: this.buildContext(conversationHistory)
    }

    return analysis
  }

  detectIntent(message) {
    const intents = {
      reservation: ['réserver', 'reservation', 'book', 'booking', 'table', 'place'],
      recommendation: ['recommandation', 'suggestion', 'conseil', 'idée', 'option'],
      information: ['info', 'information', 'détails', 'prix', 'horaires', 'contact'],
      complaint: ['problème', 'erreur', 'déçu', 'mauvais', 'négatif'],
      compliment: ['merci', 'parfait', 'excellent', 'génial', 'super'],
      planning: ['planifier', 'organiser', 'prévoir', 'arranger', 'programmer']
    }

    const msg = message.toLowerCase()
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => msg.includes(keyword))) {
        return intent
      }
    }
    return 'general'
  }

  extractEntities(message) {
    const entities = {
      time: this.extractTimeEntities(message),
      location: this.extractLocationEntities(message),
      people: this.extractPeopleEntities(message),
      budget: this.extractBudgetEntities(message),
      preferences: this.extractPreferenceEntities(message)
    }
    return entities
  }

  extractTimeEntities(message) {
    const timePatterns = {
      today: /(?:aujourd'hui|today|ce soir|tonight)/i,
      tomorrow: /(?:demain|tomorrow)/i,
      weekend: /(?:weekend|week-end|samedi|dimanche)/i,
      specific: /(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i
    }

    const times = []
    for (const [type, pattern] of Object.entries(timePatterns)) {
      if (pattern.test(message)) {
        times.push({ type, matched: message.match(pattern)[0] })
      }
    }
    return times
  }

  extractLocationEntities(message) {
    const locations = {
      marbella: /marbella/i,
      puerto_banus: /(?:puerto banús|puerto banus)/i,
      golden_mile: /(?:golden mile|golden mile)/i,
      beach: /(?:plage|beach)/i,
      marina: /(?:marina|port)/i
    }

    const found = []
    for (const [location, pattern] of Object.entries(locations)) {
      if (pattern.test(message)) {
        found.push(location)
      }
    }
    return found
  }

  extractPeopleEntities(message) {
    const peoplePatterns = {
      couple: /(?:couple|deux|2 personnes)/i,
      family: /(?:famille|enfants|parents)/i,
      group: /(?:groupe|équipe|équipe|team)/i,
      business: /(?:collègues|partenaires|clients)/i
    }

    const people = []
    for (const [type, pattern] of Object.entries(peoplePatterns)) {
      if (pattern.test(message)) {
        people.push(type)
      }
    }
    return people
  }

  extractBudgetEntities(message) {
    const budgetPatterns = {
      low: /(?:budget|économique|pas cher|low budget)/i,
      medium: /(?:moyen|standard|normal)/i,
      high: /(?:luxe|premium|haut de gamme|high end)/i,
      specific: /(?:€\d+|euros?|budget de \d+)/i
    }

    const budgets = []
    for (const [type, pattern] of Object.entries(budgetPatterns)) {
      if (pattern.test(message)) {
        budgets.push(type)
      }
    }
    return budgets
  }

  extractPreferenceEntities(message) {
    const preferences = {
      cuisine: ['italien', 'japonais', 'méditerranéen', 'français', 'espagnol'],
      ambiance: ['romantique', 'familial', 'business', 'festif', 'calme'],
      activity: ['golf', 'spa', 'plage', 'shopping', 'culture'],
      style: ['moderne', 'traditionnel', 'luxueux', 'décontracté', 'élégant']
    }

    const found = []
    for (const [category, options] of Object.entries(preferences)) {
      const matched = options.filter(option => 
        message.toLowerCase().includes(option)
      )
      if (matched.length > 0) {
        found.push({ category, options: matched })
      }
    }
    return found
  }

  assessComplexity(message) {
    const complexityFactors = {
      length: message.length > 100 ? 1 : 0,
      questions: (message.match(/\?/g) || []).length,
      multipleRequests: (message.match(/et|puis|aussi|également/g) || []).length,
      specificDetails: (message.match(/\d+|€|personnes|heures/g) || []).length
    }

    const complexityScore = Object.values(complexityFactors).reduce((a, b) => a + b, 0)
    return {
      score: complexityScore,
      level: complexityScore > 3 ? 'high' : complexityScore > 1 ? 'medium' : 'low',
      factors: complexityFactors
    }
  }

  detectUrgency(message) {
    const urgentKeywords = ['urgent', 'rapidement', 'vite', 'immédiatement', 'maintenant', 'asap']
    const urgent = urgentKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
    return urgent ? 'high' : 'normal'
  }

  extractPreferences(message) {
    const preferences = {
      cuisine: [],
      ambiance: [],
      budget: [],
      time: [],
      location: []
    }

    // Analyser les entités extraites pour construire les préférences
    const entities = this.extractEntities(message)
    
    if (entities.preferences.length > 0) {
      entities.preferences.forEach(pref => {
        if (pref.category === 'cuisine') {
          preferences.cuisine.push(...pref.options)
        } else if (pref.category === 'ambiance') {
          preferences.ambiance.push(...pref.options)
        }
      })
    }

    if (entities.budget.length > 0) {
      preferences.budget = entities.budget
    }

    if (entities.time.length > 0) {
      preferences.time = entities.time
    }

    if (entities.location.length > 0) {
      preferences.location = entities.location
    }

    return preferences
  }

  buildContext(conversationHistory) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return { isFirstMessage: true, previousTopics: [], userPatterns: {} }
    }

    const previousTopics = conversationHistory
      .filter(msg => msg.sender === 'user')
      .map(msg => this.detectIntent(msg.text))
      .filter((intent, index, arr) => arr.indexOf(intent) === index)

    const userPatterns = {
      preferredLanguage: this.detectLanguagePattern(conversationHistory),
      communicationStyle: this.detectCommunicationStyle(conversationHistory),
      interests: this.extractUserInterests(conversationHistory)
    }

    return {
      isFirstMessage: false,
      previousTopics,
      userPatterns,
      conversationLength: conversationHistory.length
    }
  }

  detectLanguagePattern(conversationHistory) {
    const messages = conversationHistory
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.text)

    if (messages.length === 0) return 'unknown'

    // Analyse simple de la langue dominante
    const frenchWords = ['le', 'la', 'de', 'et', 'à', 'un', 'une', 'je', 'tu', 'il']
    const englishWords = ['the', 'and', 'to', 'a', 'an', 'i', 'you', 'he', 'she', 'it']
    const spanishWords = ['el', 'la', 'de', 'y', 'a', 'un', 'una', 'yo', 'tú', 'él']

    const frenchCount = messages.join(' ').toLowerCase().split(' ')
      .filter(word => frenchWords.includes(word)).length
    const englishCount = messages.join(' ').toLowerCase().split(' ')
      .filter(word => englishWords.includes(word)).length
    const spanishCount = messages.join(' ').toLowerCase().split(' ')
      .filter(word => spanishWords.includes(word)).length

    if (frenchCount > englishCount && frenchCount > spanishCount) return 'french'
    if (englishCount > frenchCount && englishCount > spanishCount) return 'english'
    if (spanishCount > frenchCount && spanishCount > englishCount) return 'spanish'
    return 'mixed'
  }

  detectCommunicationStyle(conversationHistory) {
    const messages = conversationHistory
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.text)

    if (messages.length === 0) return 'neutral'

    const styles = {
      formal: ['bonjour', 'merci', 'veuillez', 'pourriez-vous', 's\'il vous plaît'],
      casual: ['salut', 'hey', 'cool', 'super', 'génial'],
      business: ['réunion', 'client', 'partenaire', 'projet', 'délai'],
      friendly: ['😊', '😄', '👍', '❤️', 'merci beaucoup']
    }

    const styleScores = {}
    for (const [style, keywords] of Object.entries(styles)) {
      styleScores[style] = messages.join(' ').toLowerCase().split(' ')
        .filter(word => keywords.includes(word)).length
    }

    const dominantStyle = Object.entries(styleScores)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0]

    return dominantStyle
  }

  extractUserInterests(conversationHistory) {
    const messages = conversationHistory
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.text)
      .join(' ')

    const interests = {
      dining: ['restaurant', 'manger', 'cuisine', 'gastronomie'],
      entertainment: ['club', 'bar', 'musique', 'danse', 'fête'],
      luxury: ['yacht', 'villa', 'spa', 'luxe', 'premium'],
      activities: ['golf', 'tennis', 'plage', 'shopping', 'culture'],
      business: ['réunion', 'client', 'partenaire', 'networking']
    }

    const userInterests = []
    for (const [category, keywords] of Object.entries(interests)) {
      const matches = keywords.filter(keyword => 
        messages.toLowerCase().includes(keyword)
      )
      if (matches.length > 0) {
        userInterests.push({ category, keywords: matches })
      }
    }

    return userInterests
  }

  // === GÉNÉRATION DE RÉPONSES INTELLIGENTES ===
  generateIntelligentResponse(message, conversationHistory = [], userProfile = {}) {
    const analysis = this.deepContextualUnderstanding(message, conversationHistory)
    
    // Construire une réponse adaptée au contexte
    let response = this.buildContextualResponse(analysis, userProfile)
    
    // Ajouter des recommandations personnalisées
    const recommendations = this.generatePersonalizedRecommendations(analysis, userProfile)
    if (recommendations) {
      response += '\n\n' + recommendations
    }

    // Ajouter des suggestions proactives
    const proactiveSuggestions = this.generateProactiveSuggestions(analysis, conversationHistory)
    if (proactiveSuggestions) {
      response += '\n\n' + proactiveSuggestions
    }

    return response
  }

  buildContextualResponse(analysis, userProfile) {
    const { intent, entities, sentiment, complexity, urgency } = analysis
    
    let response = ''

    // Adapter le ton selon l'analyse émotionnelle
    if (sentiment.primary === 'excited') {
      response += 'Super ! Je vois que vous êtes enthousiaste ! '
    } else if (sentiment.primary === 'urgent') {
      response += 'Parfait, je vais m\'occuper de cela immédiatement ! '
    } else if (sentiment.primary === 'romantic') {
      response += 'Quel moment romantique ! Je vais vous préparer quelque chose de spécial ! '
    }

    // Adapter selon l'intention
    switch (intent) {
      case 'reservation':
        response += 'Je vais vous aider à réserver exactement ce dont vous avez besoin. '
        break
      case 'recommendation':
        response += 'Voici mes meilleures recommandations personnalisées pour vous. '
        break
      case 'information':
        response += 'Je vais vous donner toutes les informations dont vous avez besoin. '
        break
      default:
        response += 'Je vais vous aider au mieux avec votre demande. '
    }

    return response
  }

  generatePersonalizedRecommendations(analysis, userProfile) {
    const { entities, preferences } = analysis
    
    if (entities.location.includes('marbella')) {
      return '📍 **Recommandations Marbella** :\n• La Terraza del Mar pour une vue exceptionnelle\n• Olivia Valere pour une soirée exclusive\n• Nikki Beach pour une expérience plage VIP'
    }

    if (preferences.cuisine.includes('japonais')) {
      return '🍣 **Spécialités japonaises** :\n• Nobu Marbella - expérience japonaise de luxe\n• Sake Bar Marbella - ambiance authentique\n• Kabuki Raw - sushi frais et créatif'
    }

    if (preferences.ambiance.includes('romantique')) {
      return '💕 **Ambiance romantique** :\n• Dîner en terrasse avec vue mer\n• Promenade au coucher du soleil\n• Spa couples pour un moment détente'
    }

    return null
  }

  generateProactiveSuggestions(analysis, conversationHistory) {
    const suggestions = []

    // Suggérer des activités complémentaires
    if (analysis.entities.location.includes('beach')) {
      suggestions.push('🏖️ Après la plage, je peux vous réserver un restaurant avec vue mer !')
    }

    if (analysis.intent === 'reservation') {
      suggestions.push('🚗 Besoin d\'un transport ? Je peux organiser un chauffeur privé !')
    }

    if (analysis.entities.time.some(t => t.type === 'today')) {
      suggestions.push('⏰ Pour ce soir, j\'ai aussi des événements exclusifs disponibles !')
    }

    return suggestions.length > 0 ? '💡 **Suggestions supplémentaires** :\n' + suggestions.join('\n') : null
  }

  // === APPRENTISSAGE CONTINU ===
  learnFromInteraction(message, response, userFeedback = null) {
    const interaction = {
      timestamp: new Date().toISOString(),
      message,
      response,
      userFeedback,
      success: userFeedback === null || userFeedback.positive
    }

    // Stocker l'interaction pour l'apprentissage
    if (!this.conversationMemory.has('interactions')) {
      this.conversationMemory.set('interactions', [])
    }
    
    const interactions = this.conversationMemory.get('interactions')
    interactions.push(interaction)
    
    // Garder seulement les 100 dernières interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100)
    }

    // Analyser les patterns de succès
    this.analyzeSuccessPatterns(interactions)
  }

  analyzeSuccessPatterns(interactions) {
    const successfulInteractions = interactions.filter(i => i.success)
    
    if (successfulInteractions.length > 0) {
      // Analyser les patterns de messages qui fonctionnent bien
      const successfulPatterns = successfulInteractions.map(i => ({
        intent: this.detectIntent(i.message),
        sentiment: this.analyzeEmotionalTone(i.message),
        complexity: this.assessComplexity(i.message)
      }))

      // Mettre à jour les préférences d'utilisateur
      this.updateUserPreferences(successfulPatterns)
    }
  }

  updateUserPreferences(patterns) {
    // Analyser les patterns pour mettre à jour les préférences
    const preferences = {
      preferredIntents: {},
      preferredSentiments: {},
      preferredComplexity: {}
    }

    patterns.forEach(pattern => {
      preferences.preferredIntents[pattern.intent] = 
        (preferences.preferredIntents[pattern.intent] || 0) + 1
      preferences.preferredSentiments[pattern.sentiment.primary] = 
        (preferences.preferredSentiments[pattern.sentiment.primary] || 0) + 1
      preferences.preferredComplexity[pattern.complexity.level] = 
        (preferences.preferredComplexity[pattern.complexity.level] || 0) + 1
    })

    this.userPreferences.set('learned', preferences)
  }

  // === EXPORT DES CAPACITÉS ===
  getCapabilities() {
    return {
      emotionalIntelligence: true,
      contextualUnderstanding: true,
      personalizedRecommendations: true,
      proactiveSuggestions: true,
      continuousLearning: true,
      multiLanguageSupport: true,
      complexRequestHandling: true
    }
  }
}

// Instance globale pour l'utilisation
export const advancedAI = new AdvancedAICapabilities()
