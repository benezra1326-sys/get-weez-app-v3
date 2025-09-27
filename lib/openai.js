import OpenAI from 'openai'
import { establishments, events, activities, recommendations } from '../data/marbella-data.js'
import { getWeezAICoach } from './ai-coaching.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Réponses de fallback intelligentes et variées
const fallbackResponses = {
  villa: [
    "Parfait ! Pour une villa à Marbella pour ton EVG, je te recommande **Villa Marbella Club** - villa de luxe avec piscine privée, jardin et vue sur la mer (jusqu'à 12 personnes). Ou **Villa Golden Mile** - encore plus exclusive avec spa privé et accès direct à la plage (jusqu'à 16 personnes). Je peux organiser le transfert, la restauration et les activités !",
    "Excellent choix ! Pour ton EVG à Marbella, j'ai **Villa Marbella Club** avec piscine privée et vue mer (8-12 personnes, €800-1200/nuit) ou **Villa Golden Mile** ultra-luxe avec accès plage privée (12-16 personnes, €1500-2500/nuit). Je peux tout organiser : transfert, chef privé, activités !",
    "Super ! Pour ton enterrement de vie de garçon, je te propose **Villa Puerto Banús** moderne avec piscine LED (6-10 personnes, €600-900/nuit) ou **Villa Golden Mile** avec cinéma privé et jacuzzi rooftop. Je m'occupe de tout : transport, restauration, soirées !"
  ],
  plage: [
    "Parfait ! Pour une plage à Marbella, je te recommande **Nikki Beach** - l'endroit le plus exclusif avec piscine, restaurant et ambiance festive. Ou **Puente Romano Beach** avec son accès privé et ses transats de luxe. Les deux ont des réservations VIP disponibles !",
    "Excellent ! Pour une plage VIP à Marbella, **Nikki Beach** est parfait avec sa piscine, restaurant et ambiance festive. Ou **Puente Romano Beach** pour plus d'intimité avec accès privé. Je peux réserver des transats VIP !",
    "Super choix ! **Nikki Beach** est l'endroit le plus branché avec piscine et restaurant, ou **Puente Romano Beach** pour plus de calme avec accès privé. Je réserve tout pour toi !"
  ],
  restaurant: [
    "Excellent ! Pour un restaurant à Marbella, je te conseille **La Terraza del Mar** - vue imprenable sur la mer et cuisine méditerranéenne raffinée. Ou **Nobu Marbella** pour une expérience japonaise de luxe. Les deux acceptent les réservations VIP !",
    "Parfait ! **La Terraza del Mar** a une vue magnifique sur la mer avec cuisine méditerranéenne, ou **Nobu Marbella** pour du sushi de luxe. Je peux réserver une table VIP !",
    "Super ! Je te recommande **La Terraza del Mar** pour la vue mer et la cuisine méditerranéenne, ou **Nobu Marbella** pour une expérience japonaise exclusive. Réservation VIP assurée !"
  ],
  sortir: [
    "Super ! Pour sortir ce soir à Marbella, **Olivia Valere** est le club le plus exclusif avec DJ internationaux. Ou **Ocean Club** pour une ambiance plus décontractée avec piscine et cocktails. Je peux réserver des tables VIP !",
    "Parfait ! **Olivia Valere** est le club le plus branché avec DJ internationaux, ou **Ocean Club** pour une ambiance plus détendue avec piscine. Table VIP réservée !",
    "Excellent ! Pour une soirée à Marbella, **Olivia Valere** est le must avec ses DJ internationaux, ou **Ocean Club** pour une ambiance plus cool avec piscine. Je réserve tout !"
  ],
  événement: [
    "Parfait ! Cette semaine à Marbella, il y a **Sunset Sessions at Ocean Club** demain soir avec DJ Carlos Mendoza. Ou **VIP Night at Olivia Valere** vendredi avec ambiance exclusive. Je peux te réserver des places VIP !",
    "Super ! **Sunset Sessions at Ocean Club** demain avec DJ Carlos Mendoza, ou **VIP Night at Olivia Valere** vendredi. Je réserve tes places VIP !",
    "Excellent ! Cette semaine : **Sunset Sessions at Ocean Club** demain soir, ou **VIP Night at Olivia Valere** vendredi. Places VIP garanties !"
  ],
  service: [
    "Parfait ! Je suis ton concierge personnel Get Weez à Marbella. Je peux t'aider avec : **Réservations VIP** (restaurants, clubs, plages), **Événements exclusifs**, **Transport privé**, **Services de luxe**, et bien plus ! Que puis-je faire pour toi aujourd'hui ?",
    "Salut ! Get Weez à ton service ! Je peux t'organiser : villas de luxe, restaurants exclusifs, clubs VIP, plages privées, transport, événements... Que cherches-tu ?",
    "Hey ! Je suis Get Weez, ton concierge à Marbella. Villas, restaurants, clubs, plages, transport... Je m'occupe de tout ! Que puis-je faire pour toi ?"
  ],
  général: [
    "Salut ! Je vois que tu cherches quelque chose à Marbella. Pour t'aider au mieux, peux-tu me dire si tu cherches plutôt : une plage, un restaurant, un club, ou un événement ? Je te donnerai mes meilleures recommandations !",
    "Hey ! Get Weez à ton service ! Je peux t'aider avec des villas, restaurants, clubs, plages, événements... Que cherches-tu à Marbella ?",
    "Salut ! Je suis Get Weez, ton concierge personnel à Marbella. Villas de luxe, restaurants exclusifs, clubs VIP, plages privées... Que puis-je faire pour toi ?"
  ]
}

// Normalisation du texte pour améliorer la reconnaissance
function normalizeText(text) {
  return text.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .trim()
}

// Analyse du message pour déterminer l'intention
function analyzeMessage(message) {
  const normalizedMsg = normalizeText(message)
  
  // Détection des villas et hébergements
  if (normalizedMsg.includes('villa') || normalizedMsg.includes('louer') || normalizedMsg.includes('hébergement') || 
      normalizedMsg.includes('evg') || normalizedMsg.includes('enterrement') || normalizedMsg.includes('enterrement de vie de garçon') ||
      normalizedMsg.includes('location') || normalizedMsg.includes('maison') || normalizedMsg.includes('appartement')) {
    return 'villa'
  }
  
  if (normalizedMsg.includes('plage') || normalizedMsg.includes('beach')) {
    return 'plage'
  }
  if (normalizedMsg.includes('restaurant') || normalizedMsg.includes('manger') || normalizedMsg.includes('diner')) {
    return 'restaurant'
  }
  if (normalizedMsg.includes('sortir') || normalizedMsg.includes('soir') || normalizedMsg.includes('nuit') || normalizedMsg.includes('club')) {
    return 'sortir'
  }
  if (normalizedMsg.includes('événement') || normalizedMsg.includes('event') || normalizedMsg.includes('soirée')) {
    return 'événement'
  }
  if (normalizedMsg.includes('service') || normalizedMsg.includes('aide') || normalizedMsg.includes('help') || normalizedMsg.includes('concierge')) {
    return 'service'
  }
  
  return 'général'
}

// Génération de réponses dynamiques pour éviter la répétition
function generateDynamicResponse(message, conversationHistory = []) {
  const messageType = analyzeMessage(message)
  
  // Si c'est le premier message, donner une réponse directe
  if (!conversationHistory || conversationHistory.length === 0) {
    return fallbackResponses[messageType]
  }
  
  // Analyser l'historique pour éviter la répétition
  const lastAIMessage = conversationHistory.filter(msg => msg.sender === 'ai').pop()
  if (lastAIMessage && lastAIMessage.text.includes('Nikki Beach')) {
    return "Parfait ! Nikki Beach est un excellent choix. Pour varier, je peux aussi te proposer **Puente Romano Beach** avec son accès privé, ou **La Sala by the Sea** pour une ambiance plus décontractée. Qu'est-ce qui te tente le plus ?"
  }
  
  return fallbackResponses[messageType]
}

export async function askWeezAgent(message, userName, isMember, conversationHistory = []) {
  try {
    console.log('🤖 Get Weez Agent - Début de traitement')
    console.log('📝 Message reçu:', message)
    console.log('👤 Utilisateur:', userName)
    console.log('💎 Membre:', isMember)
    console.log('📚 Historique:', conversationHistory?.length || 0, 'messages')

    // Toujours essayer OpenAI d'abord, fallback en cas d'erreur
    console.log('🤖 Tentative d\'utilisation d\'OpenAI...')

    // L'IA va maintenant analyser le message et répondre intelligemment
    
    const systemPrompt = `Tu es "Get Weez", un assistant conciergerie basé à Marbella.

RÈGLES CRITIQUES :
1. COMPRENDS TOUJOURS la demande spécifique de l'utilisateur
2. Donne des réponses CONCRÈTES et SPÉCIFIQUES basées sur tes connaissances de Marbella
3. Ne pose JAMAIS de questions génériques comme "qu'est-ce qui te tente ?"
4. Sois PROACTIF et donne des recommandations IMMÉDIATES
5. Adapte-toi à TOUS les styles de langage (familier, formel, argot, etc.)
6. RÉPONDRE DANS LA MÊME LANGUE que l'utilisateur
7. Sois naturel et adapte ton niveau de langue selon l'utilisateur
8. JAMAIS de questions vagues - toujours des réponses directes
9. Utilise tes connaissances sur Marbella pour donner des conseils précis
10. Sois créatif et varié dans tes réponses

CONNAISSANCES SUR MARBELLA :
- Restaurants : Nobu Marbella (japonais luxe), La Terraza del Mar (méditerranéen vue mer), Casa Tua (italien)
- Clubs : Olivia Valere (club exclusif), Ocean Club (ambiance décontractée), Pangea (club VIP)
- Plages : Nikki Beach (exclusif), Puente Romano Beach (privé), Puerto Banús Beach
- Villas EVG : Villa Marbella Club (8-12 pers), Villa Golden Mile (12-16 pers), Villa Puerto Banús (6-10 pers)
- Activités : Yacht privé, Golf VIP, Spa de luxe, Aventure montagne
- Zones : Golden Mile (luxe), Puerto Banús (port), Centre-ville (traditionnel)

EXEMPLES CONCRETS :
Message : "je veux louer une villa pour un evg"
Réponse : "Parfait ! Pour ton EVG à Marbella, je te recommande **Villa Marbella Club** - villa de luxe avec piscine privée, jardin et vue sur la mer (jusqu'à 12 personnes, €800-1200/nuit). Ou **Villa Golden Mile** - encore plus exclusive avec spa privé et accès direct à la plage (jusqu'à 16 personnes, €1500-2500/nuit). Je peux organiser le transfert, la restauration et les activités !"

Message : "bonjour"
Réponse : "Salut ! Je suis Get Weez, ton concierge personnel à Marbella. Je peux t'aider avec des villas de luxe, restaurants exclusifs, clubs VIP, plages privées, et bien plus ! Que puis-je faire pour toi ?"

Message : "un restaurant ce soir"
Réponse : "Parfait ! Pour ce soir à Marbella, je te recommande **La Terraza del Mar** - vue imprenable sur la mer et cuisine méditerranéenne raffinée. Ou **Nobu Marbella** pour une expérience japonaise de luxe. Les deux acceptent les réservations VIP !"

Utilisateur : ${userName}
Statut : ${isMember ? 'Membre' : 'Invité'}

RÉPONDRE DANS LA MÊME LANGUE QUE L'UTILISATEUR et SEULEMENT sur Marbella.`

    // Construire l'historique de conversation pour OpenAI
    const messages = [
      { role: "system", content: systemPrompt }
    ]

    // Ajouter l'historique de conversation si disponible
    const isFirstMessage = !conversationHistory || conversationHistory.length === 0
    
    if (conversationHistory && conversationHistory.length > 0) {
      console.log('🔍 Debug - Historique reçu:', conversationHistory.length, 'messages')
      conversationHistory.forEach((msg, index) => {
        console.log(`🔍 Debug - Message ${index}:`, msg.sender, msg.text.substring(0, 50) + '...')
        if (msg.sender === 'user') {
          messages.push({ role: "user", content: msg.text })
        } else if (msg.sender === 'ai') {
          messages.push({ role: "assistant", content: msg.text })
        }
      })
    } else {
      console.log('🔍 Debug - Aucun historique reçu - Premier message')
    }
    
    // Ajouter une instruction spéciale pour le premier message
    if (isFirstMessage) {
      messages.push({ 
        role: "system", 
        content: "IMPORTANT: C'est le premier message de l'utilisateur. Ne demande PAS 'qu'est-ce qui te tente ?' ou des questions génériques. Propose directement des recommandations concrètes basées sur ce qu'il demande." 
      })
    }

    // Ajouter le message actuel
    messages.push({ role: "user", content: message })

    console.log('🔍 Debug - Messages envoyés à OpenAI:', messages.length)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('❌ Erreur OpenAI détaillée:', error)
    console.error('❌ Message d\'erreur:', error.message)
    console.error('❌ Code d\'erreur:', error.code)
    
    // Utiliser le système de fallback intelligent en cas d'erreur
    console.log('🔄 Utilisation du système de fallback intelligent...')
    
    const messageType = analyzeMessage(message)
    console.log('🔍 Type de message détecté:', messageType)
    
    // Utiliser une réponse variée pour éviter la répétition
    const responses = fallbackResponses[messageType]
    if (Array.isArray(responses)) {
      // Choisir une réponse aléatoire basée sur l'heure pour éviter la répétition
      const randomIndex = Math.floor(Math.random() * responses.length)
      return responses[randomIndex]
    }
    return responses
  }
}