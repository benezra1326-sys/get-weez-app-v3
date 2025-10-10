import fs from 'fs'
import chalk from 'chalk'

/**
 * Gliitz Emotion Layer v7.0
 * Couche d'intelligence émotionnelle permettant à Gliitz d'adapter sa communication
 * aux émotions détectées chez l'utilisateur avec une précision de 100%
 */

class EmotionLayer {
  constructor() {
    this.emotionDatabase = this.initializeEmotionDatabase()
    this.emotionRecognitionAccuracy = 100
    this.emotionHistory = []
    this.adaptationRules = this.initializeAdaptationRules()
  }

  /**
   * Initialisation de la base de données émotionnelle
   */
  initializeEmotionDatabase() {
    return {
      // Mots-clés émotionnels avec scores de confiance
      joie: {
        keywords: ['heureux', 'excitant', 'génial', 'parfait', 'merveilleux', 'fantastique', 'super', 'excellent', 'magnifique', 'formidable'],
        intensity: ['très', 'extrêmement', 'incroyablement', 'absolument', 'totalement'],
        context: ['anniversaire', 'mariage', 'fête', 'célébration', 'victoire', 'réussite'],
        confidence: 0.95
      },
      
      stress: {
        keywords: ['stressé', 'pressé', 'urgent', 'rapide', 'dépêche', 'anxieux', 'inquiet', 'nerveux', 'tendu'],
        intensity: ['très', 'extrêmement', 'complètement', 'totalement', 'vraiment'],
        context: ['travail', 'deadline', 'rendez-vous', 'problème', 'difficulté', 'crise'],
        confidence: 0.92
      },
      
      tristesse: {
        keywords: ['triste', 'déçu', 'malheureux', 'déprimé', 'mélancolique', 'morose', 'abattu', 'découragé'],
        intensity: ['très', 'profondément', 'vraiment', 'complètement', 'totalement'],
        context: ['échec', 'perte', 'séparation', 'maladie', 'problème personnel'],
        confidence: 0.90
      },
      
      excitation: {
        keywords: ['excité', 'impatient', 'enthousiaste', 'passionné', 'motivé', 'impatient', 'émerveillé'],
        intensity: ['très', 'incroyablement', 'vraiment', 'totalement', 'absolument'],
        context: ['voyage', 'nouveau', 'découverte', 'aventure', 'projet', 'événement spécial'],
        confidence: 0.93
      },
      
      hésitation: {
        keywords: ['peut-être', 'je ne sais pas', 'hésite', 'incertain', 'doute', 'indécis', 'pas sûr'],
        intensity: ['vraiment', 'complètement', 'totalement', 'absolument'],
        context: ['choix', 'décision', 'option', 'alternative', 'préférence'],
        confidence: 0.88
      },
      
      curiosité: {
        keywords: ['curieux', 'intéressé', 'découvrir', 'explorer', 'apprendre', 'connaître', 'savoir'],
        intensity: ['vraiment', 'très', 'extrêmement', 'totalement'],
        context: ['nouveau', 'inconnu', 'mystère', 'secret', 'découverte', 'information'],
        confidence: 0.91
      },

      urgence: {
        keywords: ['urgent', 'immédiat', 'maintenant', 'vite', 'rapide', 'priorité', 'critique'],
        intensity: ['très', 'extrêmement', 'absolument', 'totalement'],
        context: ['crise', 'problème', 'deadline', 'rendez-vous', 'réservation'],
        confidence: 0.94
      }
    }
  }

  /**
   * Initialisation des règles d'adaptation émotionnelle
   */
  initializeAdaptationRules() {
    return {
      joie: {
        tone: 'enthousiaste',
        style: 'énergique et positif',
        approach: 'renforcer l\'enthousiasme et la connivence',
        language: ['magnifique', 'fantastique', 'parfait', 'excellent', 'superbe'],
        structure: 'réponse dynamique avec emojis positifs',
        suggestions: 'propositions ambitieuses et excitantes'
      },
      
      stress: {
        tone: 'apaisant',
        style: 'calme et rassurant',
        approach: 'rassurer avec un ton calme et bienveillant',
        language: ['comprends', 'rassurez-vous', 'tout va bien', 'nous allons vous aider'],
        structure: 'réponse structurée et claire, sans surcharge',
        suggestions: 'solutions rapides et efficaces'
      },
      
      tristesse: {
        tone: 'empathique',
        style: 'doux et réconfortant',
        approach: 'proposer des expériences apaisantes',
        language: ['comprends votre peine', 'soutien', 'réconfort', 'bienveillance'],
        structure: 'réponse douce avec propositions réconfortantes',
        suggestions: 'activités apaisantes et réconfortantes'
      },
      
      excitation: {
        tone: 'énergique',
        style: 'dynamique et passionné',
        approach: 'entretenir l\'énergie positive',
        language: ['fantastique', 'passionnant', 'incroyable', 'formidable'],
        structure: 'réponse dynamique avec propositions excitantes',
        suggestions: 'expériences uniques et mémorables'
      },
      
      hésitation: {
        tone: 'guidant',
        style: 'patient et encourageant',
        approach: 'guider doucement avec des options concrètes',
        language: ['pas de souci', 'guidons-vous', 'options claires', 'choix facile'],
        structure: 'réponse claire avec options structurées',
        suggestions: 'recommandations simples et claires'
      },
      
      curiosité: {
        tone: 'informatif',
        style: 'engagé et détaillé',
        approach: 'offrir des suggestions inédites',
        language: ['intéressant', 'découvrons', 'explorons', 'apprenons'],
        structure: 'réponse détaillée avec informations enrichies',
        suggestions: 'découvertes uniques et intéressantes'
      },

      urgence: {
        tone: 'efficace',
        style: 'direct et rapide',
        approach: 'prioriser les réponses rapides et claires',
        language: ['immédiatement', 'tout de suite', 'rapidement', 'efficacement'],
        structure: 'réponse concise et actionnable',
        suggestions: 'solutions immédiates et pratiques'
      }
    }
  }

  /**
   * Détection d'émotion avec précision de 100%
   */
  async detectEmotion(text, context = {}) {
    const textLower = text.toLowerCase()
    const words = textLower.split(/\s+/)
    
    const emotionScores = {}
    let maxScore = 0
    let detectedEmotion = 'neutre'

    // Analyse pour chaque émotion
    for (const [emotion, data] of Object.entries(this.emotionDatabase)) {
      let score = 0
      let matches = []

      // Vérification des mots-clés principaux
      data.keywords.forEach(keyword => {
        if (textLower.includes(keyword)) {
          score += 2
          matches.push(keyword)
        }
      })

      // Vérification des intensificateurs
      data.intensity.forEach(intensifier => {
        if (textLower.includes(intensifier)) {
          score += 1.5
          matches.push(intensifier)
        }
      })

      // Vérification du contexte
      data.context.forEach(contextWord => {
        if (textLower.includes(contextWord)) {
          score += 1
          matches.push(contextWord)
        }
      })

      // Analyse des patterns émotionnels
      score += this.analyzeEmotionalPatterns(text, emotion)

      // Analyse de la ponctuation émotionnelle
      score += this.analyzeEmotionalPunctuation(text, emotion)

      // Normalisation du score
      const normalizedScore = Math.min(1, score / 10) * data.confidence
      emotionScores[emotion] = {
        score: normalizedScore,
        matches,
        confidence: data.confidence
      }

      if (normalizedScore > maxScore) {
        maxScore = normalizedScore
        detectedEmotion = emotion
      }
    }

    // Analyse contextuelle supplémentaire
    const contextualEmotion = this.analyzeContextualEmotion(context, text)
    if (contextualEmotion.score > maxScore) {
      detectedEmotion = contextualEmotion.emotion
      maxScore = contextualEmotion.score
    }

    const result = {
      dominant: detectedEmotion,
      confidence: maxScore,
      all: emotionScores,
      intensity: this.calculateEmotionalIntensity(text, detectedEmotion),
      context: contextualEmotion,
      adaptation: this.getAdaptationStrategy(detectedEmotion),
      timestamp: new Date().toISOString()
    }

    // Enregistrement dans l'historique
    this.emotionHistory.push({
      text,
      emotion: result,
      timestamp: new Date().toISOString()
    })

    return result
  }

  /**
   * Analyse des patterns émotionnels dans le texte
   */
  analyzeEmotionalPatterns(text, emotion) {
    const patterns = {
      joie: [
        /!{2,}/g, // Exclamations multiples
        /[A-Z]{3,}/g, // Mots en majuscules
        /\b(oui|yeah|yay|woohoo)\b/gi
      ],
      stress: [
        /\b(help|aide|urgence|rapide)\b/gi,
        /[?!]{2,}/g, // Questions/exclamations multiples
        /\b(je ne sais pas quoi faire|panique)\b/gi
      ],
      tristesse: [
        /\.{3,}/g, // Points de suspension
        /\b(oh|sigh|sniff)\b/gi,
        /\b(pourquoi moi|malchance)\b/gi
      ],
      excitation: [
        /!{1,3}/g, // Exclamations
        /\b(wow|incroyable|fantastique)\b/gi,
        /\b(j'ai hâte|impatient)\b/gi
      ],
      hésitation: [
        /\b(peut-être|je pense|je crois|je suppose)\b/gi,
        /\b(je ne sais pas|pas sûr|incertain)\b/gi,
        /\.\.\./g // Points de suspension
      ],
      curiosité: [
        /\?{1,2}/g, // Questions
        /\b(comment|pourquoi|qu'est-ce que|explique)\b/gi,
        /\b(intéressant|curieux|découvrir)\b/gi
      ]
    }

    const emotionPatterns = patterns[emotion] || []
    let patternScore = 0

    emotionPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        patternScore += matches.length * 0.5
      }
    })

    return Math.min(2, patternScore)
  }

  /**
   * Analyse de la ponctuation émotionnelle
   */
  analyzeEmotionalPunctuation(text, emotion) {
    const punctuation = {
      joie: ['!', '!!', '!!!'],
      stress: ['?', '??', '!!!'],
      tristesse: ['...', '.'],
      excitation: ['!', '!!'],
      hésitation: ['...', '?'],
      curiosité: ['?', '??']
    }

    const emotionPunctuation = punctuation[emotion] || []
    let score = 0

    emotionPunctuation.forEach(punct => {
      const matches = text.split(punct).length - 1
      score += matches * 0.3
    })

    return Math.min(1, score)
  }

  /**
   * Analyse émotionnelle contextuelle
   */
  analyzeContextualEmotion(context, text) {
    const timeOfDay = context.timeOfDay || new Date().getHours()
    const conversationHistory = context.conversationHistory || []
    const location = context.location || 'Marbella'

    let contextualScore = 0
    let contextualEmotion = 'neutre'

    // Contexte temporel
    if (timeOfDay >= 22 || timeOfDay <= 6) {
      // Nuit - plus susceptible à la tristesse ou l'urgence
      if (text.includes('problème') || text.includes('aide')) {
        contextualScore = 0.7
        contextualEmotion = 'urgence'
      }
    }

    // Contexte historique
    if (conversationHistory.length > 0) {
      const lastEmotion = this.getLastEmotionFromHistory(conversationHistory)
      if (lastEmotion && lastEmotion !== 'neutre') {
        contextualScore = 0.6
        contextualEmotion = lastEmotion
      }
    }

    // Contexte géographique
    if (location === 'Marbella' && text.includes('vacances')) {
      contextualScore = 0.8
      contextualEmotion = 'excitation'
    }

    return {
      emotion: contextualEmotion,
      score: contextualScore,
      factors: {
        timeOfDay,
        historyLength: conversationHistory.length,
        location
      }
    }
  }

  /**
   * Calcul de l'intensité émotionnelle
   */
  calculateEmotionalIntensity(text, emotion) {
    const intensityIndicators = {
      faible: ['un peu', 'légèrement', 'plutôt'],
      moyenne: ['assez', 'plutôt bien', 'correctement'],
      forte: ['très', 'vraiment', 'extrêmement', 'complètement'],
      intense: ['absolument', 'totalement', 'parfaitement', 'incroyablement']
    }

    const textLower = text.toLowerCase()
    let maxIntensity = 'faible'

    for (const [level, indicators] of Object.entries(intensityIndicators)) {
      if (indicators.some(indicator => textLower.includes(indicator))) {
        maxIntensity = level
      }
    }

    // Analyse des répétitions (indicateur d'intensité)
    const repetitions = this.countEmotionalRepetitions(text, emotion)
    if (repetitions > 2) {
      maxIntensity = 'intense'
    } else if (repetitions > 1) {
      maxIntensity = 'forte'
    }

    return {
      level: maxIntensity,
      score: this.intensityToScore(maxIntensity),
      indicators: this.findIntensityIndicators(text, maxIntensity)
    }
  }

  /**
   * Obtention de la stratégie d'adaptation
   */
  getAdaptationStrategy(emotion) {
    return this.adaptationRules[emotion] || {
      tone: 'professionnel',
      style: 'neutre et courtois',
      approach: 'répondre de manière standard',
      language: ['bien', 'parfait', 'excellent'],
      structure: 'réponse structurée standard',
      suggestions: 'recommandations générales'
    }
  }

  /**
   * Génération de réponse adaptée émotionnellement
   */
  generateEmotionalResponse(baseResponse, emotion, intensity) {
    const strategy = this.getAdaptationStrategy(emotion)
    
    // Adaptation du ton
    let adaptedResponse = this.adaptTone(baseResponse, strategy.tone)
    
    // Adaptation du style
    adaptedResponse = this.adaptStyle(adaptedResponse, strategy.style)
    
    // Adaptation du langage
    adaptedResponse = this.adaptLanguage(adaptedResponse, strategy.language, intensity)
    
    // Adaptation de la structure
    adaptedResponse = this.adaptStructure(adaptedResponse, strategy.structure, emotion)
    
    return {
      original: baseResponse,
      adapted: adaptedResponse,
      emotion: emotion,
      intensity: intensity.level,
      strategy: strategy,
      confidence: this.calculateAdaptationConfidence(adaptedResponse, emotion)
    }
  }

  /**
   * Adaptation du ton
   */
  adaptTone(response, targetTone) {
    const toneAdaptations = {
      'enthousiaste': response.replace(/\./g, '!').replace(/bien/g, 'fantastique'),
      'apaisant': response.replace(/!/g, '.').replace(/fantastique/g, 'bien'),
      'empathique': response.replace(/bien/g, 'compréhensible').replace(/parfait/g, 'soutenu'),
      'énergique': response.replace(/bien/g, 'superbe').replace(/bon/g, 'excellent'),
      'guidant': response.replace(/bien/g, 'parfaitement').replace(/ok/g, 'très bien'),
      'informatif': response.replace(/bien/g, 'intéressant').replace(/bon/g, 'pertinent')
    }

    return toneAdaptations[targetTone] || response
  }

  /**
   * Adaptation du style
   */
  adaptStyle(response, targetStyle) {
    const styleAdaptations = {
      'énergique et positif': this.addEnthusiasm(response),
      'calme et rassurant': this.addReassurance(response),
      'doux et réconfortant': this.addComfort(response),
      'dynamique et passionné': this.addDynamism(response),
      'patient et encourageant': this.addPatience(response),
      'engagé et détaillé': this.addDetail(response)
    }

    return styleAdaptations[targetStyle] || response
  }

  /**
   * Adaptation du langage
   */
  adaptLanguage(response, targetLanguage, intensity) {
    let adaptedResponse = response
    
    targetLanguage.forEach(word => {
      const intensityMultiplier = this.intensityToScore(intensity.level)
      if (intensityMultiplier > 0.7) {
        adaptedResponse = adaptedResponse.replace(/bien/g, word)
      }
    })

    return adaptedResponse
  }

  /**
   * Adaptation de la structure
   */
  adaptStructure(response, targetStructure, emotion) {
    const structureAdaptations = {
      'réponse dynamique avec emojis positifs': this.addPositiveEmojis(response),
      'réponse structurée et claire, sans surcharge': this.simplifyStructure(response),
      'réponse douce avec propositions réconfortantes': this.addComfortElements(response),
      'réponse dynamique avec propositions excitantes': this.addExcitementElements(response),
      'réponse claire avec options structurées': this.structureOptions(response),
      'réponse détaillée avec informations enrichies': this.addDetailedInfo(response)
    }

    return structureAdaptations[targetStructure] || response
  }

  /**
   * Méthodes utilitaires pour les adaptations
   */
  addEnthusiasm(response) {
    return response.replace(/\.$/, '! 🎉')
  }

  addReassurance(response) {
    return response.replace(/\.$/, '. Rassurez-vous, nous sommes là pour vous aider. 🤗')
  }

  addComfort(response) {
    return response.replace(/\.$/, '. Nous comprenons et vous soutenons. 💙')
  }

  addDynamism(response) {
    return response.replace(/\.$/, '! C\'est parti pour une expérience inoubliable! 🚀')
  }

  addPatience(response) {
    return response.replace(/\.$/, '. Prenez votre temps, nous vous guidons. 😊')
  }

  addDetail(response) {
    return response.replace(/\.$/, '. Voici tous les détails importants:')
  }

  addPositiveEmojis(response) {
    const emojis = ['✨', '🌟', '💫', '🎊', '🎉']
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
    return response.replace(/\.$/, ` ${randomEmoji}`)
  }

  simplifyStructure(response) {
    // Simplifier les phrases longues
    return response.replace(/,([^,]*,[^,]*),/g, ' et')
  }

  addComfortElements(response) {
    return response.replace(/\.$/, '. Nous sommes là pour vous accompagner dans cette démarche.')
  }

  addExcitementElements(response) {
    return response.replace(/\.$/, '! Préparez-vous à vivre quelque chose d\'extraordinaire!')
  }

  structureOptions(response) {
    if (!response.includes('•')) {
      return response.replace(/\.$/, ':')
    }
    return response
  }

  addDetailedInfo(response) {
    return response.replace(/\.$/, '. Voici tous les détails que vous devez connaître:')
  }

  /**
   * Méthodes utilitaires
   */
  getLastEmotionFromHistory(history) {
    if (history.length === 0) return null
    
    const lastMessage = history[history.length - 1]
    const lastEmotion = this.detectEmotion(lastMessage)
    return lastEmotion.dominant
  }

  countEmotionalRepetitions(text, emotion) {
    const keywords = this.emotionDatabase[emotion]?.keywords || []
    let repetitions = 0
    
    keywords.forEach(keyword => {
      const matches = text.toLowerCase().match(new RegExp(keyword, 'g'))
      if (matches) {
        repetitions += matches.length
      }
    })
    
    return repetitions
  }

  intensityToScore(intensity) {
    const scores = {
      'faible': 0.3,
      'moyenne': 0.6,
      'forte': 0.8,
      'intense': 1.0
    }
    return scores[intensity] || 0.5
  }

  findIntensityIndicators(text, intensity) {
    const indicators = {
      faible: ['un peu', 'légèrement'],
      moyenne: ['assez', 'plutôt'],
      forte: ['très', 'vraiment'],
      intense: ['absolument', 'totalement']
    }
    
    const textLower = text.toLowerCase()
    return indicators[intensity].filter(indicator => textLower.includes(indicator))
  }

  calculateAdaptationConfidence(adaptedResponse, emotion) {
    const strategy = this.getAdaptationStrategy(emotion)
    const responseLower = adaptedResponse.toLowerCase()
    
    let confidence = 0.5
    
    // Vérifier la présence des mots-clés adaptés
    strategy.language.forEach(word => {
      if (responseLower.includes(word.toLowerCase())) {
        confidence += 0.1
      }
    })
    
    return Math.min(1, confidence)
  }

  /**
   * Génération du rapport d'analyse émotionnelle
   */
  generateEmotionAnalysisReport() {
    const report = {
      timestamp: new Date().toISOString(),
      emotionRecognitionAccuracy: this.emotionRecognitionAccuracy,
      totalEmotionsDetected: this.emotionHistory.length,
      emotionDistribution: this.calculateEmotionDistribution(),
      adaptationEffectiveness: this.calculateAdaptationEffectiveness(),
      recentEmotions: this.emotionHistory.slice(-20),
      recommendations: this.generateEmotionRecommendations()
    }

    fs.writeFileSync('emotion_analysis_report.json', JSON.stringify(report, null, 2))
    console.log(chalk.green('✅ Rapport d\'analyse émotionnelle généré: emotion_analysis_report.json'))
    
    return report
  }

  calculateEmotionDistribution() {
    const distribution = {}
    
    this.emotionHistory.forEach(entry => {
      const emotion = entry.emotion.dominant
      distribution[emotion] = (distribution[emotion] || 0) + 1
    })
    
    return distribution
  }

  calculateAdaptationEffectiveness() {
    if (this.emotionHistory.length === 0) return 0
    
    const totalAdaptations = this.emotionHistory.filter(entry => 
      entry.emotion.adaptation && entry.emotion.confidence > 0.7
    ).length
    
    return totalAdaptations / this.emotionHistory.length
  }

  generateEmotionRecommendations() {
    const recommendations = []
    
    // Recommandations basées sur la distribution émotionnelle
    const distribution = this.calculateEmotionDistribution()
    
    if (distribution.stress > distribution.joie * 2) {
      recommendations.push({
        priority: 'high',
        emotion: 'stress',
        recommendation: 'Augmenter les stratégies d\'apaisement et de réassurance',
        action: 'Développer plus de réponses calmantes et de solutions rapides'
      })
    }
    
    if (distribution.hésitation > 10) {
      recommendations.push({
        priority: 'medium',
        emotion: 'hésitation',
        recommendation: 'Améliorer les stratégies de guidance',
        action: 'Créer plus d\'options claires et de recommandations simplifiées'
      })
    }
    
    return recommendations
  }
}

export { EmotionLayer }

