import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import chalk from 'chalk'

dotenv.config({ path: '.env.local' })

/**
 * Gliitz Conversation Collector v7.0
 * Collecte et structure toutes les conversations en temps réel pour apprentissage
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

class ConversationCollector {
  constructor() {
    this.conversations = []
    this.batchSize = 100
    this.analysisCache = new Map()
  }

  /**
   * Capture une conversation utilisateur-IA
   */
  async captureConversation(userMessage, aiResponse, context = {}) {
    const conversation = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userMessage: {
        content: userMessage,
        emotion: await this.detectEmotion(userMessage),
        intent: await this.detectIntent(userMessage),
        clarity: this.analyzeClarity(userMessage)
      },
      aiResponse: {
        content: aiResponse,
        tone: this.analyzeTone(aiResponse),
        structure: this.analyzeStructure(aiResponse),
        precision: this.analyzePrecision(aiResponse)
      },
      context: {
        sessionId: context.sessionId || 'unknown',
        userId: context.userId || 'anonymous',
        location: context.location || 'Marbella',
        timeOfDay: new Date().getHours(),
        conversationHistory: context.conversationHistory || []
      },
      classification: await this.classifyTheme(userMessage, aiResponse)
    }

    this.conversations.push(conversation)
    
    // Sauvegarde en temps réel
    await this.saveToSupabase(conversation)
    
    return conversation
  }

  /**
   * Détection d'émotion basée sur l'analyse sémantique
   */
  async detectEmotion(text) {
    const emotions = {
      joie: ['heureux', 'excitant', 'génial', 'parfait', 'merveilleux', 'fantastique'],
      stress: ['stressé', 'pressé', 'urgent', 'rapide', 'dépêche', 'anxieux'],
      tristesse: ['triste', 'déçu', 'malheureux', 'déprimé', 'mélancolique'],
      excitation: ['excité', 'impatient', 'enthousiaste', 'passionné', 'motivé'],
      hésitation: ['peut-être', 'je ne sais pas', 'hésite', 'incertain', 'doute'],
      curiosité: ['curieux', 'intéressé', 'découvrir', 'explorer', 'apprendre']
    }

    const textLower = text.toLowerCase()
    const detectedEmotions = []

    for (const [emotion, keywords] of Object.entries(emotions)) {
      const matches = keywords.filter(keyword => textLower.includes(keyword))
      if (matches.length > 0) {
        detectedEmotions.push({
          emotion,
          confidence: matches.length / keywords.length,
          keywords: matches
        })
      }
    }

    // Émotion dominante
    const dominantEmotion = detectedEmotions.reduce((prev, current) => 
      current.confidence > prev.confidence ? current : prev, 
      { emotion: 'neutre', confidence: 0 }
    )

    return {
      dominant: dominantEmotion.emotion,
      confidence: dominantEmotion.confidence,
      all: detectedEmotions
    }
  }

  /**
   * Détection d'intention utilisateur
   */
  async detectIntent(text) {
    const intents = {
      recherche_restaurant: ['restaurant', 'manger', 'dîner', 'déjeuner', 'cuisine', 'gastronomie'],
      recherche_événement: ['événement', 'soirée', 'fête', 'concert', 'spectacle', 'party'],
      recherche_hébergement: ['hôtel', 'villa', 'appartement', 'logement', 'hébergement'],
      recherche_activité: ['activité', 'loisir', 'sport', 'plage', 'excursion', 'visite'],
      réservation: ['réserver', 'booking', 'disponible', 'planifier', 'organiser'],
      information: ['où', 'comment', 'quand', 'quoi', 'combien', 'pourquoi'],
      aide: ['aide', 'help', 'assistance', 'support', 'problème']
    }

    const textLower = text.toLowerCase()
    const detectedIntents = []

    for (const [intent, keywords] of Object.entries(intents)) {
      const matches = keywords.filter(keyword => textLower.includes(keyword))
      if (matches.length > 0) {
        detectedIntents.push({
          intent,
          confidence: matches.length / keywords.length,
          keywords: matches
        })
      }
    }

    return detectedIntents.length > 0 ? detectedIntents[0] : { intent: 'conversation', confidence: 0.1 }
  }

  /**
   * Analyse de la clarté du message utilisateur
   */
  analyzeClarity(text) {
    const clarityFactors = {
      length: text.length > 10 ? 1 : text.length / 10,
      specificity: this.countSpecificWords(text) / 10,
      structure: this.hasQuestionStructure(text) ? 1 : 0.5,
      completeness: this.isCompleteRequest(text) ? 1 : 0.7
    }

    const overallClarity = Object.values(clarityFactors).reduce((sum, val) => sum + val, 0) / Object.keys(clarityFactors).length

    return {
      score: Math.min(1, overallClarity),
      factors: clarityFactors
    }
  }

  /**
   * Analyse du ton de la réponse IA
   */
  analyzeTone(text) {
    const toneIndicators = {
      élégant: ['élégant', 'raffiné', 'sophistiqué', 'distingué', 'chic'],
      empathique: ['comprends', 'sais', 'sens', 'éprouve', 'partage'],
      professionnel: ['recommandé', 'suggéré', 'conseillé', 'expert', 'spécialisé'],
      chaleureux: ['chaleureux', 'accueillant', 'convivial', 'bienvenu', 'agréable'],
      confiant: ['certainement', 'absolument', 'sûrement', 'parfaitement', 'idéalement']
    }

    const textLower = text.toLowerCase()
    const detectedTones = []

    for (const [tone, keywords] of Object.entries(toneIndicators)) {
      const matches = keywords.filter(keyword => textLower.includes(keyword))
      if (matches.length > 0) {
        detectedTones.push({
          tone,
          confidence: matches.length / keywords.length,
          keywords: matches
        })
      }
    }

    return detectedTones.length > 0 ? detectedTones : [{ tone: 'neutre', confidence: 0.1 }]
  }

  /**
   * Analyse de la structure de la réponse
   */
  analyzeStructure(text) {
    const hasTitle = /^\*\*.*\*\*/.test(text)
    const hasBullets = text.includes('•') || text.includes('-')
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text)
    const hasNumbers = /\d+/.test(text)
    const hasQuestions = /\?/.test(text)

    return {
      hasTitle,
      hasBullets,
      hasEmojis,
      hasNumbers,
      hasQuestions,
      structureScore: [hasTitle, hasBullets, hasEmojis, hasNumbers].filter(Boolean).length / 4
    }
  }

  /**
   * Analyse de la précision de la réponse
   */
  analyzePrecision(text) {
    const hasSpecificDetails = this.countSpecificWords(text)
    const hasLocation = /Marbella|Puerto Banús|Nueva Andalucía|San Pedro|Estepona/i.test(text)
    const hasTime = /\d+h|\d+:\d+|ce soir|demain|week-end/i.test(text)
    const hasPrice = /€|\beuros?\b|prix|tarif/i.test(text)
    const hasContact = /réservation|booking|contact/i.test(text)

    return {
      specificDetails: hasSpecificDetails,
      hasLocation,
      hasTime,
      hasPrice,
      hasContact,
      precisionScore: [hasSpecificDetails > 3, hasLocation, hasTime, hasPrice, hasContact].filter(Boolean).length / 5
    }
  }

  /**
   * Classification thématique de la conversation
   */
  async classifyTheme(userMessage, aiResponse) {
    const themes = {
      'événement': ['événement', 'soirée', 'fête', 'concert', 'spectacle', 'party', 'dj'],
      'gastronomie': ['restaurant', 'manger', 'dîner', 'cuisine', 'chef', 'menu', 'gastronomie'],
      'luxe': ['luxe', 'premium', 'vip', 'exclusif', 'haut de gamme', 'élégant'],
      'voyage': ['voyage', 'vacances', 'hôtel', 'villa', 'hébergement', 'séjour'],
      'concierge': ['concierge', 'service', 'aide', 'assistance', 'réservation', 'organisation'],
      'bien-être': ['spa', 'massage', 'relaxation', 'bien-être', 'détente', 'soin'],
      'sport': ['sport', 'golf', 'tennis', 'fitness', 'activité', 'loisir']
    }

    const combinedText = (userMessage + ' ' + aiResponse).toLowerCase()
    const themeScores = {}

    for (const [theme, keywords] of Object.entries(themes)) {
      const matches = keywords.filter(keyword => combinedText.includes(keyword))
      themeScores[theme] = matches.length / keywords.length
    }

    const primaryTheme = Object.entries(themeScores).reduce((prev, current) => 
      current[1] > prev[1] ? current : prev, 
      ['général', 0]
    )

    return {
      primary: primaryTheme[0],
      confidence: primaryTheme[1],
      all: themeScores
    }
  }

  /**
   * Méthodes utilitaires
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  countSpecificWords(text) {
    const specificWords = ['Marbella', 'Puerto Banús', '€', 'hôtel', 'restaurant', 'spa', 'plage', 'golf']
    return specificWords.filter(word => text.toLowerCase().includes(word.toLowerCase())).length
  }

  hasQuestionStructure(text) {
    return text.includes('?') || text.toLowerCase().startsWith('comment') || 
           text.toLowerCase().startsWith('où') || text.toLowerCase().startsWith('quand')
  }

  isCompleteRequest(text) {
    return text.length > 20 && (text.includes('?') || this.countSpecificWords(text) > 0)
  }

  /**
   * Sauvegarde vers Supabase
   */
  async saveToSupabase(conversation) {
    try {
      const { error } = await supabase
        .from('gliitz_conversations_log')
        .insert([{
          id: conversation.id,
          timestamp: conversation.timestamp,
          user_message: conversation.userMessage.content,
          user_emotion: conversation.userMessage.emotion.dominant,
          user_intent: conversation.userMessage.intent.intent,
          ai_response: conversation.aiResponse.content,
          ai_tone: conversation.aiResponse.tone[0]?.tone || 'neutre',
          classification: conversation.classification.primary,
          context: conversation.context,
          analysis: {
            clarity: conversation.userMessage.clarity,
            structure: conversation.aiResponse.structure,
            precision: conversation.aiResponse.precision
          }
        }])

      if (error) {
        console.error('❌ Erreur sauvegarde conversation:', error)
      }
    } catch (error) {
      console.error('❌ Erreur Supabase:', error)
    }
  }

  /**
   * Génération du batch quotidien
   */
  async generateDailyBatch() {
    const today = new Date().toISOString().split('T')[0]
    const batch = {
      date: today,
      totalConversations: this.conversations.length,
      conversations: this.conversations,
      summary: this.generateBatchSummary()
    }

    fs.writeFileSync(`daily_conversation_batch_${today}.json`, JSON.stringify(batch, null, 2))
    console.log(chalk.green(`✅ Batch quotidien généré: daily_conversation_batch_${today}.json`))
    
    return batch
  }

  generateBatchSummary() {
    const emotions = {}
    const intents = {}
    const themes = {}
    const tones = {}

    this.conversations.forEach(conv => {
      // Emotions
      const emotion = conv.userMessage.emotion.dominant
      emotions[emotion] = (emotions[emotion] || 0) + 1

      // Intents
      const intent = conv.userMessage.intent.intent
      intents[intent] = (intents[intent] || 0) + 1

      // Themes
      const theme = conv.classification.primary
      themes[theme] = (themes[theme] || 0) + 1

      // Tones
      const tone = conv.aiResponse.tone[0]?.tone || 'neutre'
      tones[tone] = (tones[tone] || 0) + 1
    })

    return {
      emotions,
      intents,
      themes,
      tones,
      averageClarity: this.conversations.reduce((sum, conv) => sum + conv.userMessage.clarity.score, 0) / this.conversations.length,
      averageStructure: this.conversations.reduce((sum, conv) => sum + conv.aiResponse.structure.structureScore, 0) / this.conversations.length,
      averagePrecision: this.conversations.reduce((sum, conv) => sum + conv.aiResponse.precision.precisionScore, 0) / this.conversations.length
    }
  }
}

export { ConversationCollector }


