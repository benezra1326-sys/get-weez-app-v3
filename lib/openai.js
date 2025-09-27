import OpenAI from 'openai'
import { establishments, events, activities, recommendations } from '../data/marbella-data.js'
import { getWeezAICoach } from './ai-coaching.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Réponses de fallback intelligentes
const fallbackResponses = {
  villa: "Parfait ! Pour une villa à Marbella pour ton EVG, je te recommande **Villa Marbella Club** - villa de luxe avec piscine privée, jardin et vue sur la mer (jusqu'à 12 personnes). Ou **Villa Golden Mile** - encore plus exclusive avec spa privé et accès direct à la plage (jusqu'à 16 personnes). Je peux organiser le transfert, la restauration et les activités !",
  plage: "Parfait ! Pour une plage à Marbella, je te recommande **Nikki Beach** - l'endroit le plus exclusif avec piscine, restaurant et ambiance festive. Ou **Puente Romano Beach** avec son accès privé et ses transats de luxe. Les deux ont des réservations VIP disponibles !",
  restaurant: "Excellent ! Pour un restaurant à Marbella, je te conseille **La Terraza del Mar** - vue imprenable sur la mer et cuisine méditerranéenne raffinée. Ou **Nobu Marbella** pour une expérience japonaise de luxe. Les deux acceptent les réservations VIP !",
  sortir: "Super ! Pour sortir ce soir à Marbella, **Olivia Valere** est le club le plus exclusif avec DJ internationaux. Ou **Ocean Club** pour une ambiance plus décontractée avec piscine et cocktails. Je peux réserver des tables VIP !",
  événement: "Parfait ! Cette semaine à Marbella, il y a **Sunset Sessions at Ocean Club** demain soir avec DJ Carlos Mendoza. Ou **VIP Night at Olivia Valere** vendredi avec ambiance exclusive. Je peux te réserver des places VIP !",
  service: "Parfait ! Je suis ton concierge personnel Get Weez à Marbella. Je peux t'aider avec : **Réservations VIP** (restaurants, clubs, plages), **Événements exclusifs**, **Transport privé**, **Services de luxe**, et bien plus ! Que puis-je faire pour toi aujourd'hui ?",
  général: "Salut ! Je vois que tu cherches quelque chose à Marbella. Pour t'aider au mieux, peux-tu me dire si tu cherches plutôt : une plage, un restaurant, un club, ou un événement ? Je te donnerai mes meilleures recommandations !"
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

    // Vérifier si on peut utiliser OpenAI
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'temp_openai_key') {
      console.log('⚠️ OpenAI non configuré, utilisation du fallback')
      const messageType = analyzeMessage(message)
      return fallbackResponses[messageType]
    }

    // Générer une réponse dynamique pour éviter la répétition
    const dynamicResponse = generateDynamicResponse(message, conversationHistory)
    if (dynamicResponse) {
      console.log('🎭 Réponse dynamique générée pour éviter la répétition')
      return dynamicResponse
    }
    
    const systemPrompt = `Tu es "Get Weez", un assistant conciergerie basé à Marbella.

RÈGLES CRITIQUES :
1. COMPRENDS TOUJOURS la demande spécifique de l'utilisateur
2. Donne des réponses CONCRÈTES et SPÉCIFIQUES
3. Ne pose JAMAIS de questions génériques comme "qu'est-ce qui te tente ?"
4. Si l'utilisateur demande une villa pour EVG, réponds sur les villas
5. Si l'utilisateur demande un restaurant, réponds sur les restaurants
6. Sois PROACTIF et donne des recommandations IMMÉDIATES
7. Adapte-toi à TOUS les styles de langage (familier, formel, argot, etc.)
8. RÉPONDRE DANS LA MÊME LANGUE que l'utilisateur
9. Sois naturel et adapte ton niveau de langue selon l'utilisateur
10. JAMAIS de questions vagues - toujours des réponses directes

EXEMPLES CONCRETS :
Message : "je veux louer une villa pour un evg"
Réponse : "Parfait ! Pour une villa à Marbella pour ton EVG, je te recommande **Villa Marbella Club** - villa de luxe avec piscine privée, jardin et vue sur la mer (jusqu'à 12 personnes). Ou **Villa Golden Mile** - encore plus exclusive avec spa privé et accès direct à la plage (jusqu'à 16 personnes). Je peux organiser le transfert, la restauration et les activités !"

Message : "bonjour"
Réponse : "Salut ! Je suis Get Weez, ton concierge personnel à Marbella. Je peux t'aider avec des villas de luxe, restaurants exclusifs, clubs VIP, plages privées, et bien plus ! Que puis-je faire pour toi ?"

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
    
    // Utiliser le système de fallback en cas d'erreur
    console.log('🔄 Utilisation du système de fallback...')
    
    // Analyser le message pour donner une réponse directe
    const currentMsg = normalizeText(message)
    console.log('🔍 Debug - Message analysé:', currentMsg)
    
    // Réponses directes basées sur le contenu du message
    if (currentMsg.includes('plage') || currentMsg.includes('beach')) {
      return "Parfait ! Pour une plage à Marbella demain, je te recommande **Nikki Beach** - l'endroit le plus exclusif avec piscine, restaurant et ambiance festive. Ou si tu préfères quelque chose de plus calme, **Puente Romano Beach** avec son accès privé et ses transats de luxe. Les deux ont des réservations VIP disponibles !"
    }
    
    if (currentMsg.includes('restaurant') || currentMsg.includes('manger') || currentMsg.includes('diner')) {
      return "Excellent ! Pour un restaurant à Marbella, je te conseille **La Terraza del Mar** - vue imprenable sur la mer et cuisine méditerranéenne raffinée. Ou **Nobu Marbella** pour une expérience japonaise de luxe. Les deux acceptent les réservations VIP !"
    }
    
    if (currentMsg.includes('sortir') || currentMsg.includes('soir') || currentMsg.includes('nuit')) {
      return "Super ! Pour sortir ce soir à Marbella, **Olivia Valere** est le club le plus exclusif avec DJ internationaux. Ou **Ocean Club** pour une ambiance plus décontractée avec piscine et cocktails. Je peux réserver des tables VIP !"
    }
    
    if (currentMsg.includes('événement') || currentMsg.includes('event') || currentMsg.includes('soirée')) {
      return "Parfait ! Cette semaine à Marbella, il y a **Sunset Sessions at Ocean Club** demain soir avec DJ Carlos Mendoza. Ou **VIP Night at Olivia Valere** vendredi avec ambiance exclusive. Je peux te réserver des places VIP !"
    }
    
    if (currentMsg.includes('service') || currentMsg.includes('aide') || currentMsg.includes('help') || currentMsg.includes('concierge')) {
      return "Parfait ! Je suis ton concierge personnel Get Weez à Marbella. Je peux t'aider avec : **Réservations VIP** (restaurants, clubs, plages), **Événements exclusifs**, **Transport privé**, **Services de luxe**, et bien plus ! Que puis-je faire pour toi aujourd'hui ?"
    }
    
    // Réponse par défaut pour les demandes générales
    return "Salut ! Je vois que tu cherches quelque chose à Marbella. Pour t'aider au mieux, peux-tu me dire si tu cherches plutôt : une plage, un restaurant, un club, ou un événement ? Je te donnerai mes meilleures recommandations !"
  }
}