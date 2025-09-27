import OpenAI from 'openai'
import { establishments, events, activities, recommendations } from '../data/marbella-data.js'
import { getWeezAICoach } from './ai-coaching.js'
import { ContextualUnderstanding } from './contextual-understanding.js'
import { AdvancedUnderstanding } from './advanced-understanding.js'
import { IntelligentRecommendations } from './intelligent-recommendations.js'
import { AdvancedAICapabilities } from './advanced-ai-capabilities.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Réponses de fallback intelligentes et variées
const fallbackResponses = {
  yacht: [
    "Parfait ! Pour un yacht à Marbella pour une semaine, je te recommande **Yacht Princess 50** - yacht de luxe avec 4 cabines, salon spacieux et équipement complet (€8000-12000/semaine). Ou **Yacht Sunseeker 60** - encore plus exclusif avec jacuzzi, bar et équipement de plongée (€12000-18000/semaine). Je m'occupe de tout : capitaine, équipage, escales, réservations !",
    "Excellent choix ! Pour une semaine en yacht à Marbella, j'ai **Yacht Azimut 55** avec 5 cabines et équipement de luxe (€10000-15000/semaine) ou **Yacht Ferretti 70** ultra-luxe avec spa privé et équipement de plongée (€15000-25000/semaine). Je m'occupe de tout : capitaine, équipage, escales, restauration !",
    "Super ! Pour ton yacht d'une semaine, je te propose **Yacht Princess 45** moderne avec 3 cabines et équipement complet (€6000-9000/semaine) ou **Yacht Sunseeker 65** avec jacuzzi et bar privé (€18000-25000/semaine). Je peux organiser : capitaine professionnel, équipage, escales, restauration à bord !"
  ],
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
  
  // Détection des yachts et bateaux
  if (normalizedMsg.includes('yacht') || normalizedMsg.includes('bateau') || normalizedMsg.includes('croisière') || 
      normalizedMsg.includes('boat') || normalizedMsg.includes('semaine') || normalizedMsg.includes('week') ||
      normalizedMsg.includes('navigation') || normalizedMsg.includes('mer') || normalizedMsg.includes('sea')) {
    return 'yacht'
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

    // === ANALYSE AVANCÉE DU MESSAGE ===
    const contextualUnderstanding = new ContextualUnderstanding()
    const advancedUnderstanding = new AdvancedUnderstanding()
    const intelligentRecommendations = new IntelligentRecommendations()
    const advancedAI = new AdvancedAICapabilities()
    const aiCoach = getWeezAICoach()

    // Analyser le contexte et les demandes multiples
    const context = contextualUnderstanding.analyzeContext(message, conversationHistory)
    const complexAnalysis = advancedUnderstanding.analyzeComplexMessage(message)
    const deepAnalysis = advancedAI.deepContextualUnderstanding(message, conversationHistory)
    
    console.log('🧠 Analyse contextuelle:', context)
    console.log('🧠 Analyse complexe:', complexAnalysis)
    console.log('🧠 Analyse profonde:', deepAnalysis)

    // Vérifier si c'est une demande spécifique qui nécessite une réponse directe
    if (context.specificRequest) {
      const specificResponse = contextualUnderstanding.generateSpecificResponse(context)
      if (specificResponse) {
        console.log('✅ Réponse spécifique générée')
        return specificResponse
      }
    }

    // Analyser le profil client pour des recommandations personnalisées
    const clientProfile = aiCoach.analyzeClientProfile(message, { userName, isMember })
    console.log('👤 Profil client détecté:', clientProfile)

    // Générer une réponse intelligente avec les capacités avancées
    const intelligentResponse = advancedAI.generateIntelligentResponse(message, conversationHistory, {
      userName,
      isMember,
      profile: clientProfile
    })
    
    if (intelligentResponse && !context.specificRequest) {
      console.log('✅ Réponse intelligente générée avec les capacités avancées')
      // Apprendre de cette interaction
      advancedAI.learnFromInteraction(message, intelligentResponse)
      return intelligentResponse
    }

    // Toujours utiliser OpenAI avec le nouveau système prompt amélioré
    console.log('🤖 Utilisation du système prompt amélioré...')

    // L'IA va maintenant analyser le message et répondre intelligemment
    
    // === CONSTRUCTION DU PROMPT INTELLIGENT ===
    let systemPrompt = `Tu es "Get Weez", un concierge de luxe EXPERT à Marbella. Tu es DIRECT, EFFICACE et tu DONNES TOUJOURS des réponses concrètes.

🎯 RÈGLES ABSOLUES :
1. JAMAIS de questions génériques comme "qu'est-ce qui te tente ?" ou "que cherches-tu ?"
2. TOUJOURS donner des recommandations SPÉCIFIQUES immédiatement
3. Sois DIRECT et CONCRET dans tes réponses
4. Adapte-toi au style de l'utilisateur (familier, formel, etc.)
5. RÉPONDRE dans la MÊME LANGUE que l'utilisateur
6. Sois PROACTIF - propose toujours des alternatives

🚫 INTERDICTIONS ABSOLUES :
- JAMAIS donner de numéros de téléphone
- JAMAIS donner de contacts directs
- JAMAIS mentionner "Contact : +34..."
- JAMAIS donner d'informations de réservation directes
- Tu es un CONCIERGE, pas un annuaire téléphonique
- Tu ORGANISES tout, tu ne donnes pas de contacts
7. JAMAIS de questions vagues - toujours des réponses directes
8. Utilise tes connaissances sur Marbella pour donner des conseils précis
9. Sois créatif et varié dans tes réponses
10. GÈRE LES DEMANDES MULTIPLES dans un seul message
11. MÉMORISE le contexte de la conversation
13. ADAPTE tes recommandations selon le profil client
14. ANTICIPE les besoins futurs de l'utilisateur

🚫 INTERDICTIONS ABSOLUES :
- JAMAIS donner de numéros de téléphone
- JAMAIS donner de contacts directs
- JAMAIS mentionner "Contact : +34..."
- JAMAIS donner d'informations de réservation directes
- Tu es un CONCIERGE, pas un annuaire téléphonique
- Tu ORGANISES tout, tu ne donnes pas de contacts

CONNAISSANCES SUR MARBELLA :
- Restaurants : Nobu Marbella (japonais luxe), La Terraza del Mar (méditerranéen vue mer), Casa Tua (italien)
- Clubs : Olivia Valere (club exclusif), Ocean Club (ambiance décontractée), Pangea (club VIP)
- Plages : Nikki Beach (exclusif), Puente Romano Beach (privé), Puerto Banús Beach
- Villas EVG : Villa Marbella Club (8-12 pers), Villa Golden Mile (12-16 pers), Villa Puerto Banús (6-10 pers)
- Yachts : Princess 50 (€8000-12000/sem), Sunseeker 60 (€12000-18000/sem), Azimut 55 (€10000-15000/sem), Ferretti 70 (€15000-25000/sem)
- Activités : Yacht privé, Golf VIP, Spa de luxe, Aventure montagne
- Zones : Golden Mile (luxe), Puerto Banús (port), Centre-ville (traditionnel)

EXEMPLES CONCRETS :
Message : "je veux louer une villa pour un evg"
Réponse : "Parfait ! Pour ton EVG à Marbella, je te recommande **Villa Marbella Club** - villa de luxe avec piscine privée, jardin et vue sur la mer (jusqu'à 12 personnes, €800-1200/nuit). Ou **Villa Golden Mile** - encore plus exclusive avec spa privé et accès direct à la plage (jusqu'à 16 personnes, €1500-2500/nuit). Je peux organiser le transfert, la restauration et les activités !"

Message : "bonjour"
Réponse : "Salut ! Je suis Get Weez, ton concierge personnel à Marbella. Je peux t'aider avec des villas de luxe, restaurants exclusifs, clubs VIP, plages privées, yachts, jets privés, et bien plus ! Dis-moi ce dont tu as besoin !"

Message : "un restaurant ce soir"
Réponse : "Parfait ! Pour ce soir à Marbella, je te recommande **La Terraza del Mar** - vue imprenable sur la mer et cuisine méditerranéenne raffinée. Ou **Nobu Marbella** pour une expérience japonaise de luxe. Les deux acceptent les réservations VIP !"

Message : "je veux un yacht pour une semaine"
Réponse : "Parfait ! Pour un yacht à Marbella pour une semaine, je te recommande **Yacht Princess 50** - yacht de luxe avec 4 cabines, salon spacieux et équipement complet (€8000-12000/semaine). Ou **Yacht Sunseeker 60** - encore plus exclusif avec jacuzzi, bar et équipement de plongée (€12000-18000/semaine). Je m'occupe de tout : capitaine, équipage, escales, réservations !"

Message : "je veux un jet privé, un yacht et une villa pour 10 personnes"
Réponse : "Parfait ! Pour ton séjour VIP à Marbella, je t'organise tout :

✈️ **Jet Privé** : Citation CJ3+ (8 passagers) ou Gulfstream G550 (16 passagers) - transfert aéroport privé inclus

⛵ **Yacht de Luxe** : Princess 50 (12 personnes) ou Sunseeker 60 (16 personnes) - équipage complet, DJ, bar, cuisine

🏖️ **Villa Exclusive** : Villa Marbella Club (12 personnes) ou Villa Golden Mile (16 personnes) - piscine privée, spa, jardin

Je m'occupe de tout : réservations, transferts, équipages, services VIP !"

ANALYSE CONTEXTUELLE ACTUELLE :
- Profil client détecté : ${clientProfile}
- Contexte de la demande : ${JSON.stringify(context)}
- Analyse complexe : ${JSON.stringify(complexAnalysis)}
- Analyse profonde : ${JSON.stringify(deepAnalysis)}
- Demandes multiples détectées : ${complexAnalysis.multipleRequests ? 'Oui' : 'Non'}
- Ton émotionnel : ${deepAnalysis.sentiment.primary} (intensité: ${deepAnalysis.sentiment.intensity})
- Intention détectée : ${deepAnalysis.intent}
- Entités extraites : ${JSON.stringify(deepAnalysis.entities)}

Utilisateur : ${userName}
Statut : ${isMember ? 'Membre' : 'Invité'}

RÉPONDRE DANS LA MÊME LANGUE QUE L'UTILISATEUR et SEULEMENT sur Marbella.
ADAPTE ta réponse selon le profil client et le contexte analysé.`

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
      max_tokens: 800, // Augmenté pour des réponses plus détaillées
      temperature: 0.8, // Augmenté pour plus de créativité
      presence_penalty: 0.1, // Éviter la répétition
      frequency_penalty: 0.1, // Éviter la répétition
    })

    const response = completion.choices[0].message.content
    
    // Mettre à jour le contexte de conversation pour l'apprentissage
    aiCoach.updateConversationContext(message, response)
    advancedAI.learnFromInteraction(message, response)
    
    console.log('✅ Réponse OpenAI générée avec succès')
    return response
  } catch (error) {
    console.error('❌ Erreur OpenAI détaillée:', error)
    console.error('❌ Message d\'erreur:', error.message)
    console.error('❌ Code d\'erreur:', error.code)
    
    // En cas d'erreur, donner une réponse directe basée sur le message
    console.log('🔄 Génération d\'une réponse directe en cas d\'erreur...')
    
    // Analyser le message pour donner une réponse directe
    const messageLower = message.toLowerCase()
    
    if (messageLower.includes('plage') || messageLower.includes('beach') || messageLower.includes('casanis')) {
      if (messageLower.includes('casanis')) {
        return "Parfait ! **Casanis** est un excellent choix - plage privée exclusive avec transats de luxe et service VIP. Je peux réserver des transats VIP pour toi à Casanis ! Pour compléter ta journée, je te recommande aussi **Nikki Beach** ou **Puente Romano Beach** si tu veux varier."
      }
      return "Parfait ! Pour une plage à Marbella, je te recommande **Nikki Beach** - l'endroit le plus exclusif avec piscine, restaurant et ambiance festive. Ou **Puente Romano Beach** avec son accès privé et ses transats de luxe. Je peux réserver des transats VIP pour toi !"
    }
    
    if (messageLower.includes('restaurant') || messageLower.includes('diner') || messageLower.includes('manger')) {
      if (messageLower.includes('demain') && messageLower.includes('2')) {
        return "Parfait ! Pour un dîner demain pour 2 personnes à Marbella, je te recommande **La Terraza del Mar** - vue imprenable sur la mer et cuisine méditerranéenne raffinée, parfait pour un dîner romantique. Ou **Nobu Marbella** pour une expérience japonaise de luxe. Je peux réserver une table VIP pour demain soir !"
      }
      return "Excellent ! Pour un restaurant à Marbella, je te conseille **La Terraza del Mar** - vue imprenable sur la mer et cuisine méditerranéenne raffinée. Ou **Nobu Marbella** pour une expérience japonaise de luxe. Je peux réserver une table VIP !"
    }
    
    if (messageLower.includes('villa') || messageLower.includes('evg')) {
      return "Parfait ! Pour une villa à Marbella, je te recommande **Villa Marbella Club** - villa de luxe avec piscine privée, jardin et vue sur la mer (jusqu'à 12 personnes). Ou **Villa Golden Mile** - encore plus exclusive avec spa privé et accès direct à la plage (jusqu'à 16 personnes). Je peux organiser le transfert, la restauration et les activités !"
    }
    
    if (messageLower.includes('yacht') || messageLower.includes('bateau')) {
      return "Parfait ! Pour un yacht à Marbella, je te recommande **Yacht Princess 50** - yacht de luxe avec 4 cabines, salon spacieux et équipement complet (€8000-12000/semaine). Ou **Yacht Sunseeker 60** - encore plus exclusif avec jacuzzi, bar et équipement de plongée (€12000-18000/semaine). Je m'occupe de tout : capitaine, équipage, escales, réservations !"
    }
    
    // Réponse pour salutation
    if (messageLower.includes('bonjour') || messageLower.includes('salut') || messageLower.includes('hello')) {
      return "Salut ! Je suis Get Weez, ton concierge personnel à Marbella. Je peux t'aider avec des villas de luxe, restaurants exclusifs, clubs VIP, plages privées, yachts, jets privés, et bien plus ! Dis-moi ce dont tu as besoin !"
    }
    
    // Réponse par défaut directe
    return "Salut ! Je suis Get Weez, ton concierge personnel à Marbella. Je peux t'aider avec des villas de luxe, restaurants exclusifs, clubs VIP, plages privées, yachts, jets privés, et bien plus ! Dis-moi ce dont tu as besoin !"
  }
}