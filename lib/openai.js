import OpenAI from 'openai'
import { establishments, events, activities, recommendations } from '../data/marbella-data.js'
import { intelligentRecommendations } from './intelligent-recommendations.js'
import { reservationSystem } from './reservation-system.js'
import { advancedUnderstanding } from './advanced-understanding.js'
import { dynamicResponses } from './dynamic-responses.js'
import { contextualUnderstanding } from './contextual-understanding.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Système de fallback en cas de quota dépassé
const fallbackResponses = {
  member: [
    (userName) => `Salut ${userName} ! Comment ça va ? Qu'est-ce qui te ferait plaisir ?`,
    (userName) => `Salut ${userName} ! De quoi aurais-tu besoin ?`,
    (userName) => `Salut ${userName} ! Qu'est-ce qui te brancherait ?`,
    (userName) => `Salut ${userName} ! Tu cherches quoi aujourd'hui ?`,
    (userName) => `Salut ${userName} ! Qu'est-ce qui te ferait kiffer ?`,
    (userName) => `Salut ${userName} ! Tu veux sortir où ?`,
    (userName) => `Salut ${userName} ! Tu as envie de quoi ?`
  ],
  guest: [
    (userName) => `Salut ${userName} ! Comment ça va ? Qu'est-ce qui te ferait plaisir ?`,
    (userName) => `Salut ${userName} ! De quoi aurais-tu besoin ?`,
    (userName) => `Salut ${userName} ! Qu'est-ce qui te tente ?`,
    (userName) => `Salut ${userName} ! Tu cherches quoi aujourd'hui ?`,
    (userName) => `Salut ${userName} ! Tu veux sortir où ?`,
    (userName) => `Salut ${userName} ! Tu as envie de quoi ?`,
    (userName) => `Salut ${userName} ! Qu'est-ce qui te ferait kiffer ?`
  ]
}

// Fonction pour normaliser les fautes d'orthographe
function normalizeText(text) {
  const corrections = {
    // Fautes d'orthographe courantes
    'zutre': 'autre',
    'zutre chose': 'autre chose',
    'diner': 'dîner',
    'diner': 'dîner',
    'manger': 'manger',
    'calme': 'calme',
    'tranquille': 'tranquille',
    'intime': 'intime',
    'paisible': 'paisible',
    'sympa': 'sympa',
    'cool': 'cool',
    'bien': 'bien',
    'demain': 'demain',
    'soir': 'soir',
    'femme': 'femme',
    'romantique': 'romantique',
    'ne va pas': 'ne va pas',
    'pas bien': 'pas bien',
    'problème': 'problème'
  }
  
  let normalized = text.toLowerCase()
  
  // Appliquer les corrections
  for (const [wrong, correct] of Object.entries(corrections)) {
    normalized = normalized.replace(new RegExp(wrong, 'g'), correct)
  }
  
  return normalized
}

// Fonction pour analyser intelligemment le message
function analyzeMessage(message, conversationHistory) {
  const msg = normalizeText(message)
  
  // Mots-clés pour différents types de demandes
  const keywords = {
    food: ['manger', 'dîner', 'diner', 'déjeuner', 'petit-déjeuner', 'restaurant', 'cuisine', 'faim', 'repas', 'table', 'boire', 'cocktail', 'vin', 'champagne'],
    date: ['demain', 'aujourd\'hui', 'ce soir', 'ce matin', 'cet après-midi', 'weekend', 'samedi', 'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
    people: ['femme', 'mari', 'copain', 'copine', 'ami', 'amie', 'famille', 'enfants', 'parents', 'collègues', 'équipe', 'groupe'],
    mood: ['romantique', 'branché', 'chic', 'décontracté', 'festif', 'animé', 'calme', 'intime', 'exclusif', 'luxueux'],
    activity: ['sortir', 'boire', 'danser', 'écouter', 'voir', 'regarder', 'participer', 'assister', 'organiser'],
    location: ['marbella', 'plage', 'mer', 'montagne', 'centre-ville', 'port', 'marina', 'golden mile']
  }
  
  // Analyser le contexte de la conversation
  const context = {
    hasFoodRequest: keywords.food.some(word => msg.includes(word)),
    hasDateRequest: keywords.date.some(word => msg.includes(word)),
    hasPeopleMention: keywords.people.some(word => msg.includes(word)),
    hasMoodMention: keywords.mood.some(word => msg.includes(word)),
    hasActivityRequest: keywords.activity.some(word => msg.includes(word)),
    isRomantic: msg.includes('femme') || msg.includes('mari') || msg.includes('romantique'),
    isGroup: msg.includes('groupe') || msg.includes('équipe') || msg.includes('collègues'),
    isFamily: msg.includes('famille') || msg.includes('enfants') || msg.includes('parents'),
    isEvening: msg.includes('soir') || msg.includes('nuit'),
    isLunch: msg.includes('déjeuner') || msg.includes('midi'),
    isDinner: msg.includes('dîner') || msg.includes('diner') || msg.includes('dinner')
  }
  
  return { context, originalMessage: message }
}

export async function askWeezAgent(message, userName, isMember, conversationHistory = []) {
  try {
    console.log('🔍 Debug - Variables reçues:', { message, userName, isMember, conversationHistoryLength: conversationHistory?.length })
    
    // Vérifier d'abord si c'est une question spécifique sur un plat
    const dishResponse = intelligentRecommendations.generateContextualResponse(message, isMember ? 'member' : 'guest')
    if (dishResponse.success) {
      console.log('🍽️ Réponse intelligente générée pour plat spécifique')
      return dishResponse.message
    }
    
    // Vérifier si c'est une demande complexe (plusieurs services)
    const complexResponse = advancedUnderstanding.generateCompleteResponse(message, isMember ? 'member' : 'guest')
    if (complexResponse.success) {
      console.log('🧠 Réponse complexe générée pour demande multiple')
      return complexResponse.message
    }
    
    // Vérifier la compréhension contextuelle pour les demandes spécifiques
    const contextualResponse = contextualUnderstanding.generateContextualResponse(message, conversationHistory)
    if (contextualResponse) {
      console.log('🧠 Réponse contextuelle générée pour demande spécifique')
      return contextualResponse
    }
    
    // Générer une réponse dynamique pour éviter la répétition
    const dynamicResponse = dynamicResponses.generateDynamicResponse(message, isMember ? 'member' : 'guest', conversationHistory)
    if (dynamicResponse) {
      console.log('🎭 Réponse dynamique générée pour éviter la répétition')
      return dynamicResponse
    }
    
    const systemPrompt = `Tu es "Get Weez", un assistant conciergerie basé à Marbella.

RÈGLES CRITIQUES :
1. Tu DOIS analyser l'historique de conversation avant de répondre
2. Ne répète JAMAIS les mêmes questions génériques
3. Si l'utilisateur a déjà donné des informations, utilise-les pour répondre de manière cohérente
4. Sois proactif et donne des recommandations concrètes
5. Adapte-toi à TOUS les styles de langage (familier, formel, argot, etc.)
6. RÉPONDRE DANS LA MÊME LANGUE que l'utilisateur (français, anglais, espagnol, italien, allemand, etc.)
7. Si l'utilisateur mélange les langues, réponds dans sa langue principale
8. Sois naturel et adapte ton niveau de langue (formel/familier) selon l'utilisateur

EXEMPLE CONCRET :
Historique : 
- User: "un endroit ou sortir ce soir"
- AI: "Qu'est-ce qui te tente ?"
- User: "j ai faim"

Réponse correcte : "Ah parfait ! Tu veux sortir ET tu as faim ce soir. Pour un dîner sympa, je te recommande La Terraza del Mar - super vue sur la mer et excellente cuisine méditerranéenne. Ou si tu préfères quelque chose de plus animé, Ocean Club a souvent un DJ et une super carte. Qu'est-ce qui te tente le plus ?"

Réponse INCORRECTE : "Qu'est-ce qui te tente ?" (car l'utilisateur a déjà donné des informations)

Utilisateur : ${userName}
Statut : ${isMember ? 'Membre' : 'Invité'}

RÉPONDRE DANS LA MÊME LANGUE QUE L'UTILISATEUR et SEULEMENT sur Marbella.`

    // Construire l'historique de conversation pour OpenAI
    const messages = [
      { role: "system", content: systemPrompt }
    ]

    // Ajouter l'historique de conversation si disponible
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
      console.log('🔍 Debug - Aucun historique reçu')
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
    
    // Utiliser le système de fallback en cas de quota dépassé
    if (error.code === 'insufficient_quota') {
      console.log('🔄 Utilisation du système de fallback...')
      
      // Analyser l'historique pour donner une réponse contextuelle
      if (conversationHistory && conversationHistory.length > 0) {
        console.log('🔍 Debug - Analyse contextuelle de l\'historique...')
        
        // Analyser le contexte complet de la conversation
        const userMessages = conversationHistory.filter(msg => msg.sender === 'user')
        const aiMessages = conversationHistory.filter(msg => msg.sender === 'ai')
        const lastUserMessage = userMessages[userMessages.length - 1]
        const lastAIMessage = aiMessages[aiMessages.length - 1]
        
        console.log('🔍 Debug - Dernier message utilisateur:', lastUserMessage?.text)
        console.log('🔍 Debug - Dernier message IA:', lastAIMessage?.text)
        
        // Analyser le message actuel avec normalisation des fautes d'orthographe
        const currentMsg = normalizeText(message)
        
        // Si l'utilisateur change le nombre de personnes après une recommandation
        if (currentMsg.includes('8') || currentMsg.includes('huit') || currentMsg.includes('groupe')) {
          // Vérifier si l'IA a parlé de couple/romantique dans l'historique
          const hasMentionedCouple = conversationHistory.some(msg => 
            msg.sender === 'ai' && (msg.text.includes('couple') || msg.text.includes('romantique'))
          )
          if (hasMentionedCouple) {
            const groupRestaurants = establishments.filter(est => est.capacity >= 8)
            const oceanClub = groupRestaurants.find(est => est.name === 'Ocean Club')
            const terraza = groupRestaurants.find(est => est.name === 'La Terraza del Mar')
            const trocadero = groupRestaurants.find(est => est.name === 'Trocadero Arena')
            
            return `Ah parfait ! Pour 8 personnes, c'est différent ! Je te recommande plutôt ${oceanClub.name} qui a de l'espace pour les groupes (${oceanClub.capacity} places) et une ambiance plus festive, ou ${terraza.name} qui peut accueillir des groupes sur leur terrasse (${terraza.capacity} places). ${trocadero.name} est aussi parfait pour les groupes avec sa piscine (${trocadero.capacity} places). Tu veux que je te donne plus de détails sur l'organisation ?`
          }
        }
        
        // Si l'utilisateur demande d'autres propositions après une recommandation
        if (currentMsg.includes('autres') || currentMsg.includes('autres propositions') || currentMsg.includes('d\'autres') || currentMsg.includes('plus') || currentMsg.includes('propositions') || currentMsg.includes('d\'autres propositions') || currentMsg.includes('autres options') || currentMsg.includes('d\'autres options') || currentMsg.includes('autres choix') || currentMsg.includes('d\'autres choix') || currentMsg.includes('autres adresses') || currentMsg.includes('d\'autres adresses') || currentMsg.includes('autres restaurants') || currentMsg.includes('d\'autres restaurants')) {
          if (lastAIMessage && (lastAIMessage.text.includes('La Terraza del Mar') || lastAIMessage.text.includes('Ocean Club'))) {
            return "Bien sûr ! J'ai d'autres excellentes adresses pour un dîner en couple à Marbella : Casa Tua pour une cuisine italienne authentique dans un cadre élégant, Sake Bar Marbella pour des sushis intimes avec une sélection de sakés, ou le Marbella Club Hotel Restaurant pour une expérience gastronomique raffinée. Qu'est-ce qui te tente le plus ?"
          }
        }
        
        // Si l'utilisateur répond à une recommandation spécifique (ex: "ocean club")
        if (lastAIMessage && lastAIMessage.text.includes('Ocean Club') && lastAIMessage.text.includes('La Terraza del Mar')) {
          if (currentMsg.includes('ocean') || currentMsg.includes('club')) {
            return "Excellent choix ! Ocean Club est parfait pour un dîner en couple. C'est un endroit très branché avec une ambiance moderne, souvent un DJ, et une excellente cuisine méditerranéenne. Tu veux que je te donne plus de détails sur l'ambiance ou tu préfères que je te parle des autres options ?"
          }
          if (currentMsg.includes('terraza') || currentMsg.includes('mar')) {
            return "Parfait ! La Terraza del Mar est un choix romantique idéal. Vue imprenable sur la mer, ambiance intime et cuisine méditerranéenne raffinée. C'est parfait pour un dîner en couple. Tu veux que je te donne plus d'infos ou tu as d'autres questions ?"
          }
        }
        
        // Si l'utilisateur veut manger
        if (currentMsg.includes('faim') || currentMsg.includes('manger') || currentMsg.includes('dîner') || currentMsg.includes('diner') || currentMsg.includes('dinner')) {
          // Vérifier si l'utilisateur a mentionné sa femme dans l'historique
          const hasMentionedWife = conversationHistory.some(msg => 
            msg.sender === 'user' && (msg.text.includes('femme') || msg.text.includes('ma femme'))
          )
          
          // Vérifier si l'utilisateur a mentionné romantique
          const hasMentionedRomantic = conversationHistory.some(msg => 
            msg.sender === 'user' && msg.text.includes('romantique')
          )
          
          if (hasMentionedWife || hasMentionedRomantic) {
            return "Parfait ! Pour un dîner romantique avec ta femme, je te recommande La Terraza del Mar - super vue sur la mer et ambiance intime, ou Ocean Club qui a une vibe plus moderne avec souvent un DJ. Les deux ont une excellente cuisine méditerranéenne. Tu préfères lequel ?"
          } else if (currentMsg.includes('demain') || currentMsg.includes('tomorrow')) {
            return "Parfait ! Pour manger demain à Marbella, j'ai plusieurs excellentes adresses : La Terraza del Mar avec vue imprenable sur la mer et cuisine méditerranéenne, Ocean Club pour une ambiance plus moderne avec DJ, ou Casa Tua pour une cuisine italienne authentique. Qu'est-ce qui te tente le plus ?"
          } else {
            return "Super ! Pour manger à Marbella, j'ai plusieurs bonnes adresses. Tu veux quelque chose de romantique ? La Terraza del Mar avec vue sur la mer, ou quelque chose de plus animé ? Ocean Club a souvent un DJ. Qu'est-ce qui te tente le plus ?"
          }
        }
        
        // Si l'utilisateur mentionne sa femme (contexte romantique)
        if (currentMsg.includes('femme') || currentMsg.includes('ma femme')) {
          return "Parfait ! Pour un dîner romantique avec ta femme, je te recommande La Terraza del Mar - super vue sur la mer et ambiance intime, ou Ocean Club qui a une vibe plus moderne avec souvent un DJ. Les deux ont une excellente cuisine méditerranéenne. Tu préfères lequel ?"
        }
        
        // Si l'utilisateur mentionne romantique
        if (currentMsg.includes('romantique')) {
          return "Parfait ! Pour un dîner romantique, je te recommande La Terraza del Mar - super vue sur la mer et ambiance intime, ou Ocean Club qui a une vibe plus moderne avec souvent un DJ. Les deux ont une excellente cuisine méditerranéenne. Tu préfères lequel ?"
        }
        
        // Si l'utilisateur a mentionné des sushis
        if (currentMsg.includes('sushi') || currentMsg.includes('sushis')) {
          return "Ah parfait ! Pour des sushis à Marbella, je te recommande Sushi Marbella sur la Golden Mile - super frais et ambiance chic. Ou si tu veux quelque chose de plus intime, Sake Bar a une carte de sushis incroyable. Tu préfères lequel ?"
        }
        
        // Si l'utilisateur veut dîner
        if (currentMsg.includes('dîner') || currentMsg.includes('diner')) {
          // Vérifier si l'utilisateur a mentionné sa femme dans l'historique
          const hasMentionedWife = conversationHistory.some(msg => 
            msg.sender === 'user' && (msg.text.includes('femme') || msg.text.includes('ma femme'))
          )
          
          if (hasMentionedWife || currentMsg.includes('femme') || currentMsg.includes('branché') || currentMsg.includes('romantique')) {
            return "Parfait ! Pour un dîner en couple dans un endroit branché à Marbella, je te recommande La Terraza del Mar - super vue sur la mer et ambiance romantique, ou Ocean Club qui a une vibe plus moderne avec souvent un DJ. Les deux ont une excellente cuisine méditerranéenne. Tu préfères lequel ?"
          } else {
            return "Super ! Pour un dîner à Marbella, j'ai plusieurs bonnes adresses. Tu veux quelque chose de romantique ? La Terraza del Mar avec vue sur la mer, ou quelque chose de plus animé ? Ocean Club a souvent un DJ. Qu'est-ce qui te tente le plus ?"
          }
        }
        
        // Si l'utilisateur cherche un endroit pour sortir
        if (currentMsg.includes('sortir') || currentMsg.includes('soir')) {
          return "Super ! Pour sortir ce soir, j'ai quelques bonnes adresses. Tu veux du romantique ? La Terraza del Mar avec vue sur la mer, ou quelque chose de plus animé ? Ocean Club a souvent un DJ. Qu'est-ce qui te tente le plus ?"
        }
        
        // Si l'utilisateur demande comment réserver
        if (currentMsg.includes('réserver') || currentMsg.includes('reservation') || currentMsg.includes('comment réserver') || currentMsg.includes('comment reserver')) {
          // Vérifier si l'utilisateur a mentionné Ocean Club dans l'historique
          const hasMentionedOceanClub = conversationHistory.some(msg => 
            msg.sender === 'user' && (msg.text.toLowerCase().includes('ocean') || msg.text.toLowerCase().includes('club'))
          )
          
          if (hasMentionedOceanClub) {
            return "Parfait ! Pour réserver à Ocean Club, tu peux :\n1. 📱 WhatsApp : +34 952 77 00 00\n2. 🌐 Site web : www.oceanclubmarbella.com\n3. 📞 Téléphone : +34 952 77 00 00\n\nJe recommande WhatsApp pour une réponse plus rapide !"
          } else {
            return "Pour réserver, je peux te donner les contacts de plusieurs établissements. Tu veux réserver où exactement ?"
          }
        }
        
        // Si l'utilisateur demande WhatsApp
        if (currentMsg.includes('whatsapp') || currentMsg.includes('wa') || currentMsg.includes('contact')) {
          // Vérifier si l'utilisateur a mentionné Ocean Club dans l'historique
          const hasMentionedOceanClub = conversationHistory.some(msg => 
            msg.sender === 'user' && (msg.text.toLowerCase().includes('ocean') || msg.text.toLowerCase().includes('club'))
          )
          
          if (hasMentionedOceanClub) {
            return "Oui ! Ocean Club a WhatsApp : +34 952 77 00 00\n\nTu peux leur écrire directement pour réserver. C'est souvent plus rapide que le téléphone !"
          } else {
            return "Oui, la plupart des établissements ont WhatsApp ! Tu veux le contact de quel endroit ?"
          }
        }
        
        // Si l'utilisateur dit merci
        if (currentMsg.includes('merci') || currentMsg.includes('parfait') || currentMsg.includes('super')) {
          return "De rien ! J'espère que tu passeras une excellente soirée ! N'hésite pas si tu as d'autres questions. Bon appétit ! 🍽️✨"
        }
        
        // Si l'utilisateur dit que ça ne va pas (priorité haute)
        if (currentMsg.includes('ne va pas') || currentMsg.includes('pas bien') || currentMsg.includes('problème') || currentMsg.includes('ca ne va pas')) {
          return "Ah désolé ! Qu'est-ce qui ne va pas ? Je peux t'aider autrement ?"
        }
        
        // Si l'utilisateur dit "autre chose" ou "non" (mais pas "ca ne va pas")
        // La normalisation gère déjà les fautes d'orthographe
        if ((currentMsg.includes('autre chose') || currentMsg.includes('autre') || currentMsg.includes('non') || currentMsg.includes('pas ça')) && !currentMsg.includes('ne va pas')) {
          // Vérifier le contexte de la conversation
          const hasMentionedFood = conversationHistory.some(msg => 
            msg.sender === 'user' && (msg.text.includes('manger') || msg.text.includes('dîner') || msg.text.includes('diner'))
          )
          
          if (hasMentionedFood) {
            return "D'accord ! Tu veux quoi d'autre ? Un bar sympa pour boire un verre ? Un endroit pour danser ? Ou tu préfères quelque chose de plus calme ?"
          } else {
            return "Pas de problème ! Qu'est-ce qui te tente alors ? Un bar, un club, un endroit pour boire un verre ?"
          }
        }
        
        // Si l'utilisateur cherche un endroit pour demain
        if (currentMsg.includes('demain') || currentMsg.includes('tomorrow')) {
          return "Parfait ! Pour demain, j'ai plusieurs bonnes options. Tu veux manger ? Boire un verre ? Danser ? Ou quelque chose de plus calme ?"
        }
        
        // Si l'utilisateur cherche un endroit calme
        if (currentMsg.includes('calme') || currentMsg.includes('tranquille') || currentMsg.includes('intime') || currentMsg.includes('paisible')) {
          return "Parfait ! Pour un endroit calme à Marbella, je te recommande :\n• **La Terraza del Mar** - vue sur la mer, ambiance intime\n• **Casa Tua** - cuisine italienne dans un cadre élégant\n• **Sake Bar Marbella** - ambiance zen et sushis frais\n• **Marbella Club Hotel** - terrasse paisible avec vue sur la mer\n\nQu'est-ce qui te tente le plus ?"
        }
        
        // Si l'utilisateur cherche un endroit sympa
        if (currentMsg.includes('sympa') || currentMsg.includes('sympa') || currentMsg.includes('cool') || currentMsg.includes('bien')) {
          return "Super ! Pour un endroit sympa à Marbella, j'ai plusieurs options. Tu veux manger, boire un verre, danser, ou quelque chose de plus calme ?"
        }
        
        // Si l'utilisateur dit bonjour après une conversation
        if (currentMsg.includes('hello') || currentMsg.includes('bonjour') || currentMsg.includes('salut')) {
          if (conversationHistory.length > 2) {
            return "Salut ! Comment ça va ? Tu veux continuer notre conversation ou tu as besoin d'autre chose ?"
          }
        }
      }
      
      // Fallback générique amélioré avec plus de variété
      const responses = isMember ? fallbackResponses.member : fallbackResponses.guest
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      return randomResponse(userName)
    }
    
    return "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants."
  }
}
