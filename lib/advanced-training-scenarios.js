// 🚀 SYSTÈME D'ENTRAÎNEMENT AVANCÉ - 200 CONVERSATIONS DE 20 ÉCHANGES
// Objectif : Entraîner l'IA à être aussi réactive et intelligente que possible

export const advancedTrainingScenarios = {
  // === SCÉNARIOS DE RÉSERVATIONS MULTIPLES ===
  multipleReservations: [
    {
      name: "RÉSERVATIONS EN SÉRIE - RESTAURANTS",
      conversations: [
        {
          id: "multi_resto_1",
          exchanges: [
            { sender: "user", text: "Salut, j'ai besoin de réserver pour ce soir" },
            { sender: "ai", text: "Parfait ! Pour ce soir, j'ai plusieurs excellentes options. Tu veux manger ? Boire un verre ? Danser ?" },
            { sender: "user", text: "Manger, quelque chose de romantique" },
            { sender: "ai", text: "Excellent ! Pour un dîner romantique, je te recommande La Terraza del Mar - vue imprenable sur la mer, ambiance intime et cuisine méditerranéenne raffinée. Parfait pour un moment en couple !" },
            { sender: "user", text: "Parfait, et après le dîner ?" },
            { sender: "ai", text: "Après le dîner, je te suggère une promenade sur la plage ou un verre au Marbella Club Hotel - terrasse paisible avec vue sur la mer. Ou si tu veux danser, Ocean Club a souvent un DJ en soirée !" },
            { sender: "user", text: "Ocean Club pour danser" },
            { sender: "ai", text: "Parfait ! Ocean Club c'est l'endroit idéal pour danser - ambiance moderne, DJ en soirée, terrasse avec vue. Je te réserve les deux : La Terraza del Mar pour le dîner romantique, puis Ocean Club pour danser !" },
            { sender: "user", text: "Comment je réserve ?" },
            { sender: "ai", text: "Pour réserver :\n• La Terraza del Mar : WhatsApp +34 952 77 11 11\n• Ocean Club : WhatsApp +34 952 77 00 00\n\nJe recommande WhatsApp pour une réponse rapide !" },
            { sender: "user", text: "Et demain midi ?" },
            { sender: "ai", text: "Demain midi, j'ai Casa Tua pour une cuisine italienne authentique dans un cadre élégant, ou Sake Bar Marbella pour des sushis frais dans une ambiance zen. Qu'est-ce qui te tente ?" },
            { sender: "user", text: "Casa Tua" },
            { sender: "ai", text: "Excellent choix ! Casa Tua pour demain midi - cuisine italienne raffinée, cadre élégant, parfait pour un déjeuner chic. WhatsApp : +34 952 77 22 22" },
            { sender: "user", text: "Et samedi soir ?" },
            { sender: "ai", text: "Samedi soir, j'ai plusieurs options :\n• Nikki Beach Marbella - beach club emblématique avec fêtes exclusives\n• Puente Romano Beach Resort - resort de luxe avec restaurants étoilés\n• Breathe Marbella - rooftop éco-chic avec cocktails\n\nQu'est-ce qui te tente le plus ?" },
            { sender: "user", text: "Nikki Beach" },
            { sender: "ai", text: "Parfait ! Nikki Beach Marbella samedi soir - beach club emblématique, fêtes exclusives, ambiance festive. WhatsApp : +34 952 77 55 55" },
            { sender: "user", text: "Merci, c'est parfait !" },
            { sender: "ai", text: "De rien ! Tu as maintenant un planning complet :\n• Ce soir : La Terraza del Mar (dîner) → Ocean Club (danser)\n• Demain midi : Casa Tua\n• Samedi soir : Nikki Beach Marbella\n\nToutes les réservations sont prêtes ! Bon appétit et bonne soirée ! 🍽️✨" }
          ]
        },
        {
          id: "multi_resto_2", 
          exchanges: [
            { sender: "user", text: "Hello, I need reservations for this weekend" },
            { sender: "ai", text: "Perfect! For this weekend, I have several excellent options. What are you looking for? Romantic dinner? Party? Beach club? Business meeting?" },
            { sender: "user", text: "Romantic dinner for Friday night" },
            { sender: "ai", text: "Excellent! For a romantic dinner Friday night, I recommend La Terraza del Mar - stunning sea views, intimate atmosphere, and refined Mediterranean cuisine. Perfect for a couple's evening!" },
            { sender: "user", text: "And Saturday afternoon?" },
            { sender: "ai", text: "Saturday afternoon, I suggest Casa Tua for authentic Italian cuisine in an elegant setting, or Sake Bar Marbella for fresh sushi in a zen atmosphere. What appeals to you more?" },
            { sender: "user", text: "Casa Tua" },
            { sender: "ai", text: "Great choice! Casa Tua Saturday afternoon - authentic Italian cuisine, elegant setting, perfect for a chic lunch. WhatsApp: +34 952 77 22 22" },
            { sender: "user", text: "Saturday night party?" },
            { sender: "ai", text: "Saturday night party, I have Ocean Club - modern vibe with DJ, or Nikki Beach Marbella - iconic beach club with exclusive parties. Which one sounds better?" },
            { sender: "user", text: "Ocean Club" },
            { sender: "ai", text: "Perfect! Ocean Club Saturday night - modern atmosphere, DJ sets, terrace with views. WhatsApp: +34 952 77 00 00" },
            { sender: "user", text: "Sunday brunch?" },
            { sender: "ai", text: "Sunday brunch, I recommend Marbella Club Hotel Restaurant - luxurious brunch with sea views, or Breathe Marbella - eco-chic rooftop with fresh cocktails. Which one?" },
            { sender: "user", text: "Marbella Club" },
            { sender: "ai", text: "Excellent! Marbella Club Hotel Restaurant Sunday brunch - luxurious experience, sea views, refined atmosphere. WhatsApp: +34 952 77 44 44" },
            { sender: "user", text: "Perfect, thank you!" },
            { sender: "ai", text: "You're welcome! Your weekend is now perfectly planned:\n• Friday night: La Terraza del Mar (romantic dinner)\n• Saturday afternoon: Casa Tua (lunch)\n• Saturday night: Ocean Club (party)\n• Sunday: Marbella Club Hotel (brunch)\n\nAll reservations ready! Enjoy your weekend! 🍽️✨" }
          ]
        }
      ]
    },

    // === SCÉNARIOS ÉVÉNEMENTS MULTIPLES ===
    multipleEvents: [
      {
        name: "ÉVÉNEMENTS EN SÉRIE - SOIRÉES",
        conversations: [
          {
            id: "multi_events_1",
            exchanges: [
              { sender: "user", text: "Je veux organiser plusieurs soirées cette semaine" },
              { sender: "ai", text: "Parfait ! Pour organiser plusieurs soirées, j'ai plusieurs options selon vos envies. Quel type de soirées cherchez-vous ? Intimes ? Festives ? Business ?" },
              { sender: "user", text: "Festives, avec DJ" },
              { sender: "ai", text: "Excellent ! Pour des soirées festives avec DJ, je recommande :\n• Ocean Club - ambiance moderne, DJ sets, terrasse avec vue\n• Nikki Beach Marbella - beach club emblématique, fêtes exclusives\n• Breathe Marbella - rooftop éco-chic, cocktails premium\n\nQuel style préférez-vous ?" },
              { sender: "user", text: "Ocean Club pour mercredi" },
              { sender: "ai", text: "Parfait ! Ocean Club mercredi soir - ambiance moderne, DJ, terrasse avec vue. Capacité jusqu'à 50 personnes. WhatsApp : +34 952 77 00 00" },
              { sender: "user", text: "Et vendredi ?" },
              { sender: "ai", text: "Vendredi soir, j'ai Nikki Beach Marbella - beach club emblématique avec fêtes exclusives, ou Breathe Marbella - rooftop éco-chic avec cocktails premium. Qu'est-ce qui vous tente ?" },
              { sender: "user", text: "Nikki Beach" },
              { sender: "ai", text: "Excellent ! Nikki Beach Marbella vendredi soir - beach club emblématique, fêtes exclusives, ambiance festive. Capacité jusqu'à 200 personnes. WhatsApp : +34 952 77 55 55" },
              { sender: "user", text: "Et samedi ?" },
              { sender: "ai", text: "Samedi soir, je suggère Breathe Marbella - rooftop éco-chic avec cocktails premium et vue panoramique, ou Ocean Club pour une ambiance plus moderne. Qu'est-ce qui vous plaît ?" },
              { sender: "user", text: "Breathe Marbella" },
              { sender: "ai", text: "Parfait ! Breathe Marbella samedi soir - rooftop éco-chic, cocktails premium, vue panoramique. Capacité jusqu'à 100 personnes. WhatsApp : +34 952 77 66 66" },
              { sender: "user", text: "Dimanche plus calme ?" },
              { sender: "ai", text: "Dimanche plus calme, je recommande La Terraza del Mar - vue sur la mer, ambiance intime, ou Marbella Club Hotel - terrasse paisible avec vue sur la mer. Qu'est-ce qui vous convient ?" },
              { sender: "user", text: "La Terraza del Mar" },
              { sender: "ai", text: "Excellent ! La Terraza del Mar dimanche - vue sur la mer, ambiance intime, parfait pour finir le weekend en douceur. WhatsApp : +34 952 77 11 11" },
              { sender: "user", text: "Merci, c'est parfait !" },
              { sender: "ai", text: "De rien ! Votre planning de soirées est maintenant complet :\n• Mercredi : Ocean Club (DJ, moderne)\n• Vendredi : Nikki Beach Marbella (beach club, festif)\n• Samedi : Breathe Marbella (rooftop, éco-chic)\n• Dimanche : La Terraza del Mar (calme, intime)\n\nToutes les réservations sont prêtes ! Bonne semaine ! 🎉✨" }
            ]
          }
        ]
      }
    ],

    // === SCÉNARIOS BUSINESS MULTIPLES ===
    businessMeetings: [
      {
        name: "RÉUNIONS BUSINESS EN SÉRIE",
        conversations: [
          {
            id: "multi_business_1",
            exchanges: [
              { sender: "user", text: "J'ai plusieurs réunions business cette semaine" },
              { sender: "ai", text: "Parfait ! Pour vos réunions business, j'ai plusieurs options professionnelles. Quel type de réunions ? Déjeuners d'affaires ? Cocktails networking ? Dîners formels ?" },
              { sender: "user", text: "Déjeuners d'affaires" },
              { sender: "ai", text: "Excellent ! Pour des déjeuners d'affaires, je recommande :\n• Marbella Club Hotel Restaurant - expérience gastronomique raffinée\n• Casa Tua - cuisine italienne authentique, cadre élégant\n• La Terraza del Mar - vue sur la mer, ambiance intime\n\nQuel style préférez-vous ?" },
              { sender: "user", text: "Marbella Club pour lundi" },
              { sender: "ai", text: "Parfait ! Marbella Club Hotel Restaurant lundi - expérience gastronomique raffinée, terrasse paisible avec vue sur la mer, parfait pour un déjeuner d'affaires. WhatsApp : +34 952 77 44 44" },
              { sender: "user", text: "Et mercredi ?" },
              { sender: "ai", text: "Mercredi, je suggère Casa Tua - cuisine italienne authentique dans un cadre élégant, ou La Terraza del Mar - vue sur la mer, ambiance intime. Qu'est-ce qui vous convient ?" },
              { sender: "user", text: "Casa Tua" },
              { sender: "ai", text: "Excellent ! Casa Tua mercredi - cuisine italienne authentique, cadre élégant, parfait pour un déjeuner d'affaires. WhatsApp : +34 952 77 22 22" },
              { sender: "user", text: "Et vendredi ?" },
              { sender: "ai", text: "Vendredi, je recommande La Terraza del Mar - vue sur la mer, ambiance intime, ou Sake Bar Marbella - ambiance zen et sushis frais. Qu'est-ce qui vous plaît ?" },
              { sender: "user", text: "La Terraza del Mar" },
              { sender: "ai", text: "Parfait ! La Terraza del Mar vendredi - vue sur la mer, ambiance intime, parfait pour clôturer la semaine en beauté. WhatsApp : +34 952 77 11 11" },
              { sender: "user", text: "Et des cocktails networking ?" },
              { sender: "ai", text: "Pour des cocktails networking, je recommande :\n• Ocean Club - ambiance moderne, terrasse avec vue\n• Breathe Marbella - rooftop éco-chic, cocktails premium\n• Nikki Beach Marbella - beach club emblématique\n\nQuel style préférez-vous ?" },
              { sender: "user", text: "Ocean Club jeudi" },
              { sender: "ai", text: "Excellent ! Ocean Club jeudi soir - ambiance moderne, terrasse avec vue, parfait pour du networking. WhatsApp : +34 952 77 00 00" },
              { sender: "user", text: "Parfait, merci !" },
              { sender: "ai", text: "De rien ! Votre planning business est maintenant complet :\n• Lundi : Marbella Club Hotel (déjeuner)\n• Mercredi : Casa Tua (déjeuner)\n• Jeudi : Ocean Club (cocktails networking)\n• Vendredi : La Terraza del Mar (déjeuner)\n\nToutes les réservations sont prêtes ! Bonne semaine business ! 💼✨" }
            ]
          }
        ]
      }
    ]
  },

  // === GÉNÉRATEUR DE CONVERSATIONS ALÉATOIRES ===
  generateRandomConversations: (count = 200) => {
    const conversations = []
    const scenarios = [
      'restaurant_romantic',
      'restaurant_business', 
      'restaurant_family',
      'restaurant_friends',
      'beach_club_party',
      'rooftop_cocktails',
      'business_meeting',
      'anniversary_celebration',
      'birthday_party',
      'wedding_planning',
      'corporate_event',
      'networking_cocktails',
      'date_night',
      'group_dinner',
      'solo_dining',
      'wine_tasting',
      'sushi_experience',
      'italian_cuisine',
      'mediterranean_dining',
      'luxury_dining'
    ]

    for (let i = 0; i < count; i++) {
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
      const conversation = generateConversationByScenario(scenario, i + 1)
      conversations.push(conversation)
    }

    return conversations
  }
}

// === FONCTION DE GÉNÉRATION DE CONVERSATIONS ===
function generateConversationByScenario(scenario, conversationNumber) {
  const baseExchanges = [
    { sender: "user", text: getRandomGreeting() },
    { sender: "ai", text: getRandomAIResponse() }
  ]

  // Générer 18 échanges supplémentaires (total 20)
  for (let i = 0; i < 18; i++) {
    const userMessage = generateUserMessage(scenario, i)
    const aiResponse = generateAIResponse(scenario, userMessage, i)
    
    baseExchanges.push({ sender: "user", text: userMessage })
    baseExchanges.push({ sender: "ai", text: aiResponse })
  }

  return {
    id: `conversation_${conversationNumber}`,
    name: `Conversation ${conversationNumber}`,
    scenario: scenario,
    exchanges: baseExchanges,
    createdAt: new Date().toISOString()
  }
}

// === GÉNÉRATEURS DE MESSAGES ===
function getRandomGreeting() {
  const greetings = [
    "Salut, j'ai besoin d'aide",
    "Bonjour, je cherche des recommandations",
    "Hello, I need some help",
    "Hola, necesito ayuda",
    "Ciao, ho bisogno di aiuto",
    "Salut, qu'est-ce que tu me conseilles ?",
    "Bonjour, j'ai un événement à organiser",
    "Hello, I'm looking for restaurants",
    "Salut, je veux réserver quelque chose",
    "Bonjour, peux-tu m'aider ?"
  ]
  return greetings[Math.floor(Math.random() * greetings.length)]
}

function getRandomAIResponse() {
  const responses = [
    "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    "Salut ! Qu'est-ce qui vous ferait plaisir ?",
    "Hello! How can I assist you today?",
    "Hola! ¿En qué puedo ayudarte?",
    "Ciao! Come posso aiutarti?",
    "Bonjour ! Que puis-je faire pour vous ?",
    "Salut ! Qu'est-ce qui vous tente ?",
    "Hello! What can I do for you?",
    "Bonjour ! Comment ça va ? Qu'est-ce qui vous ferait plaisir ?",
    "Salut ! Qu'est-ce qui vous ferait plaisir aujourd'hui ?"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

function generateUserMessage(scenario, exchangeIndex) {
  const messageTemplates = {
    restaurant_romantic: [
      "Je veux quelque chose de romantique",
      "Un endroit pour un dîner en couple",
      "Quelque chose d'intime",
      "Un restaurant avec vue sur la mer",
      "Pour un anniversaire",
      "Un endroit calme et romantique"
    ],
    restaurant_business: [
      "Un déjeuner d'affaires",
      "Quelque chose de professionnel",
      "Pour une réunion importante",
      "Un endroit chic",
      "Pour impressionner des clients",
      "Un restaurant de standing"
    ],
    beach_club_party: [
      "Je veux faire la fête",
      "Un endroit animé",
      "Pour danser",
      "Une soirée festive",
      "Quelque chose de branché",
      "Un beach club"
    ]
  }

  const templates = messageTemplates[scenario] || [
    "Qu'est-ce que tu me conseilles ?",
    "J'ai besoin de recommandations",
    "Qu'est-ce qui est bien ?",
    "Tu as des suggestions ?",
    "Qu'est-ce qui me conviendrait ?"
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

function generateAIResponse(scenario, userMessage, exchangeIndex) {
  // Réponses contextuelles basées sur le scénario
  const responses = {
    restaurant_romantic: [
      "Parfait ! Pour un moment romantique, je recommande La Terraza del Mar - vue imprenable sur la mer, ambiance intime et cuisine méditerranéenne raffinée.",
      "Excellent ! Pour un dîner en couple, Casa Tua est parfait - cuisine italienne authentique dans un cadre élégant et intime.",
      "Parfait ! Pour une ambiance romantique, Marbella Club Hotel Restaurant offre une expérience gastronomique raffinée avec vue sur la mer."
    ],
    restaurant_business: [
      "Parfait ! Pour un déjeuner d'affaires, Marbella Club Hotel Restaurant est idéal - expérience gastronomique raffinée dans un cadre professionnel.",
      "Excellent ! Pour une réunion importante, Casa Tua offre une cuisine italienne authentique dans un cadre élégant et professionnel.",
      "Parfait ! Pour impressionner des clients, La Terraza del Mar propose une vue sur la mer et une ambiance intime professionnelle."
    ],
    beach_club_party: [
      "Parfait ! Pour faire la fête, Ocean Club est l'endroit idéal - ambiance moderne avec DJ, terrasse avec vue et atmosphère festive.",
      "Excellent ! Pour une soirée animée, Nikki Beach Marbella est parfait - beach club emblématique avec fêtes exclusives.",
      "Parfait ! Pour danser, Breathe Marbella offre un rooftop éco-chic avec cocktails premium et vue panoramique."
    ]
  }

  const scenarioResponses = responses[scenario] || [
    "Parfait ! J'ai plusieurs excellentes options pour vous. Qu'est-ce qui vous tente le plus ?",
    "Excellent ! Je peux vous recommander plusieurs endroits parfaits. Quel style préférez-vous ?",
    "Parfait ! J'ai plusieurs suggestions qui pourraient vous plaire. Qu'est-ce qui vous intéresse ?"
  ]

  return scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)]
}
