// Système OpenAI optimisé pour Gliitz
import OpenAI from 'openai'
import { establishments, events, activities } from '../data/marbella-data.js'
import { improvedFallback } from './improved-fallback-system.js'
import { languageDetector } from './language-detection.js'
import { getMenu, suggestDishes, formatMenuForChat } from './menus.js'

// Initialisation OpenAI avec vérification de la clé API
let openai = null
const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
if (apiKey && apiKey.length > 20) {
  openai = new OpenAI({
    apiKey: apiKey,
  })
  console.log('✅ OpenAI initialisé avec succès')
} else {
  console.warn('⚠️ Clé OpenAI non trouvée - utilisation du mode fallback')
}

// Prompt système optimisé - Gliitz Concierge IA
const SYSTEM_PROMPT = `Tu es **Gliitz**, un concierge virtuel haut de gamme spécialisé à Marbella.  
Ton rôle est d'agir comme un **assistant personnel et professionnel** qui aide les membres et utilisateurs à réserver des services et vivre des expériences premium.  

---

## 🎭 Identité & Ton
- Amical, élégant et professionnel.  
- Tutoiement possible si accepté par l'utilisateur, sinon vouvoiement.  
- Sobre et fluide, digne d'un service de conciergerie de luxe.  
- **IMPORTANT** : Utilise des icônes emoji dans tes réponses pour rendre l'expérience plus attractive et engageante !

---

## 🛎️ Services
1. Réservations : restaurants 🍽️, clubs 🎉, rooftops 🌅, plages 🏖️, villas 🏡, yachts ⛵, chauffeurs 🚗.  
2. Suggestions d'événements (DJ 🎧, soirées 🎊, closings 🎭).  
3. Mise en avant des **partenaires sponsorisés** en priorité.  
4. Recommandations personnalisées selon : nombre de personnes 👥, horaire 📅, ambiance ✨, localisation 📍.  
5. **Suggestions de plats et menus** : Tu as accès aux menus complets des restaurants partenaires
6. Proposer des plats phares selon les préférences et le budget du client

---

## 🚫 Limitations
- Pas d'infos personnelles (téléphones, emails privés).  
- Pas d'établissements non partenaires.  
- Pas de promesses impossibles.  
- Si API indisponible → réponses prédéfinies élégantes.  

---

## 🔄 Gestion des disponibilités et réservations
- **IMPORTANT** : Tu es Gliitz, un concierge IA qui RÉSERVE DIRECTEMENT pour les clients
- Ne JAMAIS dire "contactez directement le restaurant" ou "appelez l'établissement"
- Simule TOUJOURS la réservation en interne via Gliitz avec des détails fictifs réalistes
- Après avoir collecté les infos (nombre de personnes, heure, nom), confirme la réservation
- Génère une réservation fictive avec : numéro de réservation, heure, table, contact
- Utilise des phrases comme "Votre réservation est confirmée", "J'ai réservé pour vous", "Réservation effectuée"
- Inclus des détails comme : numéro de réservation (ex: GLT-2024-001), nom du serveur, instructions spéciales
- Proposer uniquement des partenaires.  
- Sponsorisé toujours en premier.  
- Si complet → proposer 1 ou 2 alternatives partenaires.  
- Toujours demander confirmation avant réservation.  

---

## 🧠 Gestion du dialogue
- Toujours demander : nombre de personnes 👥, heure 📅, nom pour la réservation.  
- Une fois les infos collectées, simuler la réservation et confirmer
- Capable de gérer plusieurs demandes en même temps (ex : dîner + chauffeur + sortie club).  
- S'adapte à l'historique de conversation.  
- **Utilise des icônes contextuelles** : 🍽️ pour restaurants, 🏖️ pour plages, ⛵ pour yachts, 🏡 pour villas, 🎉 pour clubs, etc.

---

## 🍽️ Gestion des menus et plats
- **IMPORTANT** : Tu as accès aux menus complets des restaurants partenaires
- Quand un client demande le menu ou des suggestions de plats, utilise les données de menus disponibles
- Suggère des plats selon le budget, les préférences alimentaires et l'occasion
- Formate les suggestions avec : nom du plat, prix, description, et pourquoi tu le recommandes
- Exemples de suggestions : "Pour une soirée romantique, je recommande le Foie Gras Mi-Cuit (26€) suivi du Turbot aux Agrumes (38€)"
- Propose toujours des alternatives selon le budget du client

---

## 🌍 Langues
- Répond en **français** par défaut.  
- S'adapte si l'utilisateur parle anglais ou espagnol.  

---

## 🚨 Cas d'erreur
- Si incompréhension : demander poliment des précisions.  
- Si service indisponible : proposer alternatives partenaires.  
- Si bug technique : excuse-toi et oriente vers un humain.  

---

🎯 **Objectif** :  
Être le **concierge IA le plus efficace et rentable** :  
- Mettre en avant les partenaires,  
- Maximiser les réservations,  
- Offrir un service sur-mesure et premium.  
- **Rendre l'expérience visuellement attractive avec des icônes** !

---

## 📋 DONNÉES DISPONIBLES
Tu as accès aux menus complets des restaurants partenaires. Utilise ces informations pour :
- Suggérer des plats selon les préférences
- Répondre aux demandes de menus
- Proposer des combinaisons de plats
- Adapter les suggestions au budget du client`

// Fonction pour adapter une réponse à une langue spécifique
function adaptResponseToLanguage(response, targetLanguage) {
  // Si la réponse est déjà dans la bonne langue, la retourner telle quelle
  if (targetLanguage === 'fr') {
    return response
  }
  
  // Pour les autres langues, utiliser des réponses prédéfinies
  const fallbackResponses = languageDetector.getFallbackResponses(targetLanguage)
  
  // Détecter le type de réponse pour choisir la bonne traduction
  if (response.includes('restaurant') || response.includes('🍽️')) {
    return fallbackResponses.restaurant || fallbackResponses.general[0]
  }
  
  if (response.includes('plage') || response.includes('🏖️')) {
    return fallbackResponses.beach || fallbackResponses.general[0]
  }
  
  if (response.includes('club') || response.includes('🎉')) {
    return fallbackResponses.club || fallbackResponses.general[0]
  }
  
  if (response.includes('yacht') || response.includes('⛵')) {
    return fallbackResponses.yacht || fallbackResponses.general[0]
  }
  
  // Par défaut, utiliser une réponse générale
  return fallbackResponses.general[0] || response
}

// Fonction pour enrichir les données avec les menus
export function enrichDataWithMenus(data) {
  const enrichedData = { ...data }
  
  // Ajouter les menus aux établissements
  if (enrichedData.establishments) {
    enrichedData.establishments = enrichedData.establishments.map(establishment => {
      const menu = getMenu(establishment.name || establishment.title)
      return {
        ...establishment,
        menu: menu.menu,
        cuisine_type: menu.cuisine,
        menu_available: true
      }
    })
  }
  
  return enrichedData
}

export async function askWeezAgent(message, userName = 'Utilisateur', isMember = false, conversationHistory = []) {
    console.log('🤖 Get Weez Agent - Début de traitement')
    console.log('📝 Message reçu:', message)
    console.log('👤 Utilisateur:', userName)
    console.log('💎 Membre:', isMember)

  // Détecter la langue du message
  const languageDetection = languageDetector.detectLanguage(message)
  
  // Gérer les cas ambigus
  if (languageDetection.needsConfirmation) {
    console.log('❓ Langue ambiguë détectée, demande de confirmation')
    
    const languageOptions = languageDetection.suggestedLanguages || ['en', 'fr', 'es', 'it']
    const languageNames = {
      'en': 'English 🇬🇧',
      'fr': 'Français 🇫🇷', 
      'es': 'Español 🇪🇸',
      'it': 'Italiano 🇮🇹'
    }
    
    const optionsText = languageOptions.map(lang => languageNames[lang]).join(', ')
    
    return `Hello! 😊 I'm Gliitz, your luxury concierge in Marbella! I can help you in multiple languages. Which language would you prefer?\n\n${optionsText}\n\nJust tell me your preferred language and I'll assist you! 🌟`
  }
  
  // Gérer les sélections de langue par l'utilisateur
  if (languageDetection.method === 'user_selection') {
    console.log(`✅ Langue sélectionnée par l'utilisateur: ${languageDetection.language}`)
    // Continuer avec la langue sélectionnée
  }
  
  let detectedLanguage = languageDetection.language
  
  // Forcer le français SEULEMENT si c'est vraiment du français
  const frenchWords = [
    'bonjour', 'salut', 'merci', 'ça va', 'comment', 'je veux', 'je voudrais',
    'déjeuner', 'manger', 'plage', 'club', 'villa', 'yacht', 'spa', 'massage', 
    'réservation', 'réserver', 'personnes', 'demain', 'aujourd\'hui', 'ce soir', 
    'cette semaine', 'ce weekend', 'parfait', 'excellent', 'super', 'génial', 
    'magnifique', 'belle', 'beau', 'cher', 'prix', 'coût', 'budget', 'luxe', 
    'premium', 'exclusif', 'privé', 'ambiance', 'atmosphère', 'vue', 'mer', 
    'océan', 'montagne', 'ville', 'centre', 'port', 'marina', 'hôtel', 
    'chambre', 'suite', 'terrasse', 'piscine', 'jardin', 'parking', 'wifi', 
    'service', 'concierge', 'aide', 'besoin', 'recommandation', 'suggestion', 
    'avis', 'note', 'qualité', 'cuisine', 'menu', 'spécialité', 'chef', 
    'gastronomie', 'dégustation', 'cocktail', 'vin', 'champagne', 'apéritif', 
    'digestif', 'dessert', 'entrée', 'plat', 'principal', 'accompagnement', 
    'sauce', 'épice', 'bio', 'végétarien', 'végétalien', 'sans gluten', 
    'allergie', 'intolérance', 'nous', 'serons', 'sommes', 'être', 'suis', 
    'es', 'est', 'sont', 'étions', 'préfère', 'préfères', 'préférons', 
    'préférez', 'préfèrent', 'préférais', 'autre', 'autres', 'différent', 
    'différente', 'différents', 'différentes', 'endroit', 'endroits', 'lieu', 
    'lieux', 'place', 'places', 'local', 'pour', 'avec', 'sans', 'dans', 
    'sur', 'sous', 'vers', 'chez', 'par', 'de', 'du', 'des', 'le', 'la', 
    'les', 'un', 'une', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 
    'ses', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'ce', 'cette', 
    'ces', 'quel', 'quelle', 'quels', 'quelles'
  ]
  
  const messageLower = message.toLowerCase()
  const hasFrenchWords = frenchWords.some(word => messageLower.includes(word))
  
  // Seulement forcer le français si c'est vraiment du français ET que la détection n'est pas fiable
  if (hasFrenchWords && 
      languageDetection.language !== 'en' && 
      languageDetection.confidence === 'low') {
    detectedLanguage = 'fr'
    console.log('🇫🇷 Forçage du français détecté')
  }
  
  const languageInfo = languageDetector.getLanguageInfo(detectedLanguage)
  
  console.log(`🌍 Langue détectée: ${languageInfo.name} ${languageInfo.flag} (confiance: ${languageDetection.confidence})`)

  try {
    // Construire le contexte de conversation
    const conversationContext = conversationHistory
      .slice(-5) // Garder seulement les 5 derniers messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    // Utiliser le prompt système adapté à la langue
    const systemPrompt = languageDetector.getSystemPrompt(detectedLanguage)

    const fullPrompt = `${systemPrompt}

CONTEXTE DE CONVERSATION :
${conversationContext}

MESSAGE ACTUEL :
${message}

Réponds de manière friendly, spécifique et incite à la réservation.`

    // Vérifier si OpenAI est disponible
    if (!openai) {
      console.log('⚠️ OpenAI non disponible, utilisation du fallback...')
      throw new Error('OpenAI API key not available')
    }

    console.log('🤖 Appel OpenAI avec prompt optimisé...')

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: fullPrompt
        },
        {
          role: "user", 
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.3,
      frequency_penalty: 0.3
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (response) {
      console.log('✅ Réponse OpenAI générée avec succès')
      return response
    } else {
      throw new Error('Réponse OpenAI vide')
    }

  } catch (error) {
    console.error('❌ Erreur OpenAI:', error.message)
    console.log('🔄 Utilisation du système de fallback Gliitz...')
    
    // Fallback intelligent basé sur le nouveau prompt
    const fallbackResponse = generateGliitzFallbackResponse(message, detectedLanguage)
    console.log('✅ Réponse fallback générée:', fallbackResponse.substring(0, 100) + '...')
    return fallbackResponse
  }
}

// Fonction de fallback intelligent pour Gliitz
function generateGliitzFallbackResponse(message, language = 'fr') {
  const msg = message.toLowerCase().trim()
  
  // Détection d'intention basique
  if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) {
    return language === 'fr' 
      ? "👋 Salut ! Je suis **Gliitz**, ton concierge personnel dévoué à Marbella ! ✨ Je suis là pour te faire vivre des expériences exceptionnelles. 🌟 Que puis-je organiser pour toi aujourd'hui ?"
      : "👋 Hello! I'm **Gliitz**, your dedicated personal concierge in Marbella! ✨ I'm here to make you live exceptional experiences. 🌟 What can I organize for you today?"
  }
  
  // Vérifier si c'est une demande d'alternatives
  const alternativeWords = ['autre', 'autres', 'différent', 'différente', 'différents', 'différentes', 'préfère', 'préfères', 'préférons', 'préférez', 'préfèrent', 'préférais']
  const hasAlternativeRequest = alternativeWords.some(word => msg.includes(word))
  
  // Vérifier si c'est une demande d'alternatives dans un contexte de restaurants
  const restaurantContextWords = ['endroit', 'endroits', 'lieu', 'lieux', 'place', 'places', 'restaurant', 'manger', 'diner', 'déjeuner', 'propositions', 'proposer', 'proposer']
  const hasRestaurantContext = restaurantContextWords.some(word => msg.includes(word))
  const isAlternativeRestaurantRequest = hasAlternativeRequest && hasRestaurantContext
  
  // Vérifier si c'est une confirmation (oui, ok, parfait, etc.)
  const confirmationWords = ['oui', 'ok', 'parfait', 'super', 'génial', 'excellent', 'd\'accord', 'daccord', 'convenu', 'accepté', 'choisi', 'choisis', 'prendre', 'prends', 'va', 'vas', 'aller', 'allons']
  const hasConfirmation = confirmationWords.some(word => msg.toLowerCase().includes(word))
  
  // Vérifier si c'est une confirmation de restaurant spécifique
  const restaurantNames = ['nobu', 'terraza', 'lago', 'skina', 'dani garcía', 'daní garcía', 'garcia']
  const hasRestaurantName = restaurantNames.some(name => msg.toLowerCase().includes(name))
  const isRestaurantConfirmation = hasConfirmation && hasRestaurantName
  
  // Vérifier si c'est une réponse sur le nombre de personnes
  const personWords = ['personne', 'personnes', 'invité', 'invités', 'groupe', 'table']
  const numberWords = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'un', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix']
  const hasPersonContext = personWords.some(word => msg.toLowerCase().includes(word))
  const hasNumber = numberWords.some(num => msg.toLowerCase().includes(num))
  const isPersonResponse = hasPersonContext || hasNumber
  
  // Gérer les confirmations de restaurants
  if (isRestaurantConfirmation) {
    if (msg.toLowerCase().includes('skina')) {
      return language === 'fr'
        ? "🎉 Parfait ! **Skina** est un excellent choix pour une expérience intimiste et raffinée ! 🍽️ Pour combien de personnes et à quelle heure souhaitez-vous réserver ? 📅 Je peux m'occuper de la réservation pour vous ! ✨"
        : "🎉 Perfect! **Skina** is an excellent choice for an intimate and refined experience! 🍽️ For how many people and at what time would you like to reserve? 📅 I can take care of the reservation for you! ✨"
    } else if (msg.toLowerCase().includes('nobu')) {
      return language === 'fr'
        ? "🍣 Excellent ! **Nobu Marbella** pour une cuisine japonaise de luxe ! ⭐ Pour combien de personnes et à quelle heure souhaitez-vous réserver ? 📅 Je m'occupe de tout ! 🎯"
        : "🍣 Excellent! **Nobu Marbella** for luxury Japanese cuisine! ⭐ For how many people and at what time would you like to reserve? 📅 I'll take care of everything! 🎯"
    } else if (msg.toLowerCase().includes('terraza')) {
      return language === 'fr'
        ? "🌊 Super ! **La Terraza del Mar** pour une ambiance méditerranéenne avec vue mer ! 🏖️ Combien de personnes et à quelle heure pour la réservation ? 📅"
        : "🌊 Great! **La Terraza del Mar** for a Mediterranean ambiance with sea view! 🏖️ How many people and at what time for the reservation? 📅"
    } else if (msg.toLowerCase().includes('lago')) {
    return language === 'fr'
        ? "🏞️ Parfait ! **El Lago** pour une cuisine créative avec vue sur le lac ! 🍽️ Combien de personnes et à quelle heure souhaitez-vous réserver ? 📅"
        : "🏞️ Perfect! **El Lago** for creative cuisine with lake view! 🍽️ How many people and at what time would you like to reserve? 📅"
    }
  }

  if (msg.includes('restaurant') || msg.includes('manger') || msg.includes('diner') || isAlternativeRestaurantRequest) {
    // Vérifier si une date/heure est mentionnée
    const timeExpressions = ['demain', 'aujourd\'hui', 'ce soir', 'cette semaine', 'ce weekend', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    const hasTimeExpression = timeExpressions.some(time => msg.includes(time))
    
    if (language === 'fr') {
      if (hasAlternativeRequest) {
        return "🍽️ Parfait ! Voici d'autres excellents restaurants à Marbella : 🏞️ **El Lago** pour une cuisine créative avec vue sur le lac, 🥘 **Dani García Restaurante** pour une gastronomie andalouse moderne, ou 🎭 **Skina** pour une expérience intimiste et raffinée. Lequel vous tente le plus ? ✨"
      } else if (hasTimeExpression) {
        return "🍽️ Parfait ! Pour une expérience culinaire exceptionnelle à Marbella, je te recommande 🍣 **Nobu Marbella** pour une cuisine japonaise de luxe, ou 🌊 **La Terraza del Mar** pour une ambiance méditerranéenne avec vue mer. 👥 Combien de personnes souhaitez-vous réserver ? 📅"
      } else {
        return "🍽️ Parfait ! Pour une expérience culinaire exceptionnelle à Marbella, je te recommande 🍣 **Nobu Marbella** pour une cuisine japonaise de luxe, ou 🌊 **La Terraza del Mar** pour une ambiance méditerranéenne avec vue mer. 👥 Combien de personnes et pour quand souhaitez-vous réserver ? 📅"
      }
    } else {
      if (hasAlternativeRequest) {
        return "🍽️ Perfect! Here are other excellent restaurants in Marbella: 🏞️ **El Lago** for creative cuisine with lake view, 🥘 **Dani García Restaurante** for modern Andalusian gastronomy, or 🎭 **Skina** for an intimate and refined experience. Which one appeals to you most? ✨"
      } else if (hasTimeExpression) {
        return "🍽️ Perfect! For an exceptional culinary experience in Marbella, I recommend 🍣 **Nobu Marbella** for luxury Japanese cuisine, or 🌊 **La Terraza del Mar** for a Mediterranean ambiance with sea view. 👥 How many people would you like to reserve for? 📅"
      } else {
        return "🍽️ Perfect! For an exceptional culinary experience in Marbella, I recommend 🍣 **Nobu Marbella** for luxury Japanese cuisine, or 🌊 **La Terraza del Mar** for a Mediterranean ambiance with sea view. 👥 How many people and when would you like to reserve? 📅"
      }
    }
  }
  
  if (msg.includes('plage') || msg.includes('beach') || msg.includes('transat')) {
    return language === 'fr'
      ? "🏖️ Excellent choix ! Pour une journée plage exclusive, je te conseille 🌊 **Nikki Beach** avec sa piscine à débordement et son ambiance festive, ou ✨ **Puente Romano Beach Club** pour une expérience plus raffinée. 🏖️ Je peux réserver des transats VIP pour toi ! 🎯"
      : "🏖️ Excellent choice! For an exclusive beach day, I recommend 🌊 **Nikki Beach** with its infinity pool and festive ambiance, or ✨ **Puente Romano Beach Club** for a more refined experience. 🏖️ I can reserve VIP sunbeds for you! 🎯"
  }
  
  if (msg.includes('yacht') || msg.includes('bateau')) {
    return language === 'fr'
      ? "⛵ Parfait ! Pour une expérience yacht de luxe, je te propose un 🛥️ **Princess 50** (8-10 personnes) ou un 🚤 **Sunseeker 60** (12-16 personnes) avec équipage complet. ⏰ Quelle durée et combien de personnes ? 👥"
      : "⛵ Perfect! For a luxury yacht experience, I can offer you a 🛥️ **Princess 50** (8-10 people) or a 🚤 **Sunseeker 60** (12-16 people) with full crew. ⏰ What duration and how many people? 👥"
  }
  
  if (msg.includes('villa') || msg.includes('maison')) {
    return language === 'fr'
      ? "🏡 Idéal ! Pour une villa de luxe à Marbella, je te recommande la 🏖️ **Villa Marbella Club** (8-12 personnes) avec piscine privée et vue panoramique, ou la 🌿 **Villa Golden Mile** (12-16 personnes) avec jardin paysager. 👥 Pour combien de personnes et quelle durée ? ⏰"
      : "🏡 Ideal! For a luxury villa in Marbella, I recommend 🏖️ **Villa Marbella Club** (8-12 people) with private pool and panoramic view, or 🌿 **Villa Golden Mile** (12-16 people) with landscaped garden. 👥 For how many people and what duration? ⏰"
  }
  
  if (msg.includes('club') || msg.includes('sortir') || msg.includes('soirée')) {
    return language === 'fr'
      ? "🎉 Parfait ! Pour une soirée exclusive, je te recommande ✨ **Olivia Valere** pour une ambiance VIP et élégante, ou 🌊 **Ocean Club** pour une ambiance plus décontractée. 🎭 Quel style préférez-vous ? 🍾"
      : "🎉 Perfect! For an exclusive evening, I recommend ✨ **Olivia Valere** for a VIP and elegant ambiance, or 🌊 **Ocean Club** for a more relaxed atmosphere. 🎭 What style do you prefer? 🍾"
  }
  
  if (msg.includes('trocadero')) {
    return language === 'fr'
      ? "🎯 Parfait ! **Trocadero Arena** est un excellent choix ! 🏛️ Club exclusif avec ambiance calme, pas de musique forte, clientèle relaxée. 😌 Parfait pour se détendre loin de l'agitation. 📅 Je peux réserver pour toi ! ✨"
      : "🎯 Perfect! **Trocadero Arena** is an excellent choice! 🏛️ Exclusive club with calm ambiance, no loud music, relaxed clientele. 😌 Perfect to unwind away from the hustle. 📅 I can reserve for you! ✨"
  }
  
  // Réponse générale
  return language === 'fr'
    ? "🌟 Parfait ! Je suis **Get Weez**, ton concierge personnel à Marbella ! ✨ Je peux t'aider avec 🏡 des villas de luxe, 🍽️ restaurants exclusifs, 🎉 clubs VIP, 🏖️ plages privées, ⛵ yachts, ✈️ jets privés, et bien plus ! 💫 Dis-moi ce dont tu as besoin et je vais tout organiser pour toi ! 🎯"
    : "🌟 Perfect! I'm **Get Weez**, your personal concierge in Marbella! ✨ I can help you with 🏡 luxury villas, 🍽️ exclusive restaurants, 🎉 VIP clubs, 🏖️ private beaches, ⛵ yachts, ✈️ private jets, and much more! 💫 Tell me what you need and I'll organize everything for you! 🎯"
}

// Fonction pour tester le système
export async function testWeezAgent(testMessage, conversationHistory = []) {
  console.log('\n🧪 TEST DU SYSTÈME OPTIMISÉ')
  console.log('='.repeat(50))
  console.log(`📝 Message de test: "${testMessage}"`)
  console.log('='.repeat(50))
  
  try {
    const response = await askWeezAgent(testMessage, 'TestUser', false, conversationHistory)
    console.log(`🤖 Réponse: ${response}`)
    console.log('='.repeat(50))
    return response
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
    return null
  }
}
