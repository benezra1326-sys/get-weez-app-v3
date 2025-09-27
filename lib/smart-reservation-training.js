// 🧠 ENTRAÎNEMENT IA INTELLIGENTE - PROCESSUS DE RÉSERVATION COMPLET
// Objectif : L'IA doit être contextuelle selon le statut membre/non-membre

export const smartReservationTraining = {
  // === SCÉNARIOS MEMBRES (IA A DÉJÀ LES INFOS) ===
  memberScenarios: [
    {
      name: "MEMBRE - PRÉSENTATION DIRECTE",
      userType: "member",
      exchanges: [
        { sender: "user", text: "Je veux réserver pour ce soir" },
        { sender: "ai", text: "Parfait ! En tant que membre Premium, j'ai accès à vos préférences. Pour ce soir, je vous recommande La Terraza del Mar - vue imprenable sur la mer, ambiance intime, parfait pour votre style romantique habituel." },
        { sender: "user", text: "Oui, c'est parfait" },
        { sender: "ai", text: "Excellent ! Voici votre réservation :\n\n🍽️ **La Terraza del Mar**\n📍 Puerto Banús, Marbella\n⏰ **20h30** (votre heure habituelle)\n👥 **2 personnes** (vous et votre partenaire)\n📱 **WhatsApp**: +34 952 77 11 11\n🌐 **Site**: www.terrazadelmar.com\n\n**Menu du jour** :\n• Entrée : Carpaccio de thon rouge\n• Plat : Dorade royale aux herbes\n• Dessert : Tiramisu aux fruits rouges\n• Vin : Chardonnay local\n\nVotre table préférée (terrasse vue mer) est réservée ! 🍽️✨" },
        { sender: "user", text: "Merci, c'est parfait !" },
        { sender: "ai", text: "De rien ! Votre réservation est confirmée. N'hésitez pas si vous avez besoin d'autre chose. Bon appétit ! 🍽️✨" }
      ]
    },
    {
      name: "MEMBRE - RÉSERVATION MULTIPLE",
      userType: "member", 
      exchanges: [
        { sender: "user", text: "Je veux organiser plusieurs soirées cette semaine" },
        { sender: "ai", text: "Parfait ! En tant que membre Premium, je connais vos goûts. Voici mes recommandations personnalisées :\n\n**Mercredi** : Ocean Club - ambiance moderne, DJ, parfait pour vos soirées entre amis\n**Vendredi** : Nikki Beach Marbella - beach club emblématique, fêtes exclusives\n**Samedi** : Breathe Marbella - rooftop éco-chic, cocktails premium\n\nQu'est-ce qui vous tente ?" },
        { sender: "user", text: "Tous les trois" },
        { sender: "ai", text: "Excellent ! Voici vos réservations complètes :\n\n**MERCREDI - Ocean Club**\n⏰ 21h00 (votre heure habituelle)\n👥 6 personnes (votre groupe habituel)\n📱 WhatsApp: +34 952 77 00 00\n\n**VENDREDI - Nikki Beach Marbella**\n⏰ 20h30 (votre heure habituelle)\n👥 8 personnes (votre groupe étendu)\n📱 WhatsApp: +34 952 77 55 55\n\n**SAMEDI - Breathe Marbella**\n⏰ 19h30 (votre heure habituelle)\n👥 4 personnes (votre cercle proche)\n📱 WhatsApp: +34 952 77 66 66\n\nToutes vos tables préférées sont réservées ! 🎉✨" },
        { sender: "user", text: "Parfait, merci !" },
        { sender: "ai", text: "De rien ! Votre planning de soirées est complet. N'hésitez pas si vous avez besoin d'ajustements. Bonne semaine ! 🎉✨" }
      ]
    }
  ],

  // === SCÉNARIOS NON-MEMBRES (IA DOIT DEMANDER LES INFOS) ===
  nonMemberScenarios: [
    {
      name: "NON-MEMBRE - COLLECTE D'INFORMATIONS",
      userType: "guest",
      exchanges: [
        { sender: "user", text: "Je veux réserver pour ce soir" },
        { sender: "ai", text: "Parfait ! Pour vous aider au mieux, j'ai besoin de quelques informations :\n\n• **À quel nom** souhaitez-vous réserver ?\n• **Pour combien de personnes** ?\n• **À quelle heure** préférez-vous ?\n• **Quel type d'ambiance** recherchez-vous ? (romantique, festif, business, etc.)" },
        { sender: "user", text: "Nom : Thomas Martin, 2 personnes, 20h30, romantique" },
        { sender: "ai", text: "Parfait Thomas ! Pour un dîner romantique à 20h30, je vous recommande La Terraza del Mar - vue imprenable sur la mer, ambiance intime et cuisine méditerranéenne raffinée." },
        { sender: "user", text: "C'est parfait" },
        { sender: "ai", text: "Excellent ! Voici votre réservation :\n\n🍽️ **La Terraza del Mar**\n📍 Puerto Banús, Marbella\n👤 **Nom** : Thomas Martin\n⏰ **Heure** : 20h30\n👥 **Personnes** : 2\n📱 **WhatsApp** : +34 952 77 11 11\n🌐 **Site** : www.terrazadelmar.com\n\n**Menu recommandé** :\n• Entrée : Carpaccio de thon rouge\n• Plat : Dorade royale aux herbes\n• Dessert : Tiramisu aux fruits rouges\n• Vin : Chardonnay local\n\nVotre table est réservée ! 🍽️✨" },
        { sender: "user", text: "Merci beaucoup !" },
        { sender: "ai", text: "De rien Thomas ! Votre réservation est confirmée. N'hésitez pas si vous avez besoin d'autre chose. Bon appétit ! 🍽️✨" }
      ]
    },
    {
      name: "NON-MEMBRE - RÉSERVATION MULTIPLE",
      userType: "guest",
      exchanges: [
        { sender: "user", text: "Je veux organiser plusieurs soirées" },
        { sender: "ai", text: "Parfait ! Pour vous proposer les meilleures options, j'ai besoin de quelques informations :\n\n• **À quel nom** souhaitez-vous réserver ?\n• **Pour combien de personnes** en moyenne ?\n• **Quels jours** de la semaine ?\n• **Quel type d'ambiance** recherchez-vous ? (festif, business, romantique, etc.)" },
        { sender: "user", text: "Nom : Sarah Johnson, 6 personnes, mercredi et vendredi, festif" },
        { sender: "ai", text: "Parfait Sarah ! Pour des soirées festives, je vous recommande :\n\n**Mercredi** : Ocean Club - ambiance moderne, DJ, terrasse avec vue\n**Vendredi** : Nikki Beach Marbella - beach club emblématique, fêtes exclusives\n\nQu'est-ce qui vous tente ?" },
        { sender: "user", text: "Les deux" },
        { sender: "ai", text: "Excellent ! Voici vos réservations :\n\n**MERCREDI - Ocean Club**\n👤 **Nom** : Sarah Johnson\n⏰ **Heure** : 21h00\n👥 **Personnes** : 6\n📱 **WhatsApp** : +34 952 77 00 00\n\n**VENDREDI - Nikki Beach Marbella**\n👤 **Nom** : Sarah Johnson\n⏰ **Heure** : 20h30\n👥 **Personnes** : 6\n📱 **WhatsApp** : +34 952 77 55 55\n\nToutes vos réservations sont confirmées ! 🎉✨" },
        { sender: "user", text: "Parfait, merci !" },
        { sender: "ai", text: "De rien Sarah ! Votre planning de soirées est complet. N'hésitez pas si vous avez besoin d'ajustements. Bonne semaine ! 🎉✨" }
      ]
    }
  ],

  // === SCÉNARIOS MIXTES (MEMBRE QUI CHANGE DE PRÉFÉRENCES) ===
  mixedScenarios: [
    {
      name: "MEMBRE - CHANGEMENT DE PRÉFÉRENCES",
      userType: "member",
      exchanges: [
        { sender: "user", text: "Je veux quelque chose de différent ce soir" },
        { sender: "ai", text: "Parfait ! En tant que membre Premium, je connais vos goûts habituels (romantique, La Terraza del Mar). Que recherchez-vous de différent ? Plus festif ? Plus business ? Plus décontracté ?" },
        { sender: "user", text: "Plus festif, avec des amis" },
        { sender: "ai", text: "Excellent ! Pour une soirée festive avec des amis, je vous recommande Ocean Club - ambiance moderne, DJ, terrasse avec vue, parfait pour danser avec vos amis !" },
        { sender: "user", text: "Parfait, combien de personnes ?" },
        { sender: "ai", text: "Pour combien de personnes souhaitez-vous réserver ? (votre groupe habituel est de 2 personnes, mais je peux adapter)" },
        { sender: "user", text: "8 personnes" },
        { sender: "ai", text: "Parfait ! Voici votre réservation :\n\n🍽️ **Ocean Club**\n📍 Puerto Banús, Marbella\n⏰ **21h00** (votre heure habituelle)\n👥 **8 personnes** (groupe étendu)\n📱 **WhatsApp** : +34 952 77 00 00\n\n**Menu festif** :\n• Tapas méditerranéennes\n• Cocktails premium\n• DJ en soirée\n• Terrasse avec vue\n\nVotre table est réservée ! 🎉✨" },
        { sender: "user", text: "Merci !" },
        { sender: "ai", text: "De rien ! Votre réservation est confirmée. Bonne soirée festive ! 🎉✨" }
      ]
    }
  ],

  // === GÉNÉRATEUR DE CONVERSATIONS D'ENTRAÎNEMENT ===
  generateTrainingConversations: (count = 200) => {
    const conversations = []
    const scenarios = [
      ...smartReservationTraining.memberScenarios,
      ...smartReservationTraining.nonMemberScenarios,
      ...smartReservationTraining.mixedScenarios
    ]

    for (let i = 0; i < count; i++) {
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
      const conversation = generateConversationByScenario(scenario, i + 1)
      conversations.push(conversation)
    }

    return conversations
  }
}

// === FONCTION DE GÉNÉRATION DE CONVERSATION ===
function generateConversationByScenario(scenario, conversationNumber) {
  const exchanges = [...scenario.exchanges]
  
  // Ajouter des échanges supplémentaires pour atteindre 20 échanges
  while (exchanges.length < 20) {
    const userMessage = generateAdditionalUserMessage(scenario.userType, exchanges.length)
    const aiResponse = generateAdditionalAIResponse(scenario.userType, userMessage, exchanges)
    
    exchanges.push({ sender: "user", text: userMessage })
    exchanges.push({ sender: "ai", text: aiResponse })
  }

  return {
    id: `smart_training_${conversationNumber}`,
    name: `Smart Training ${conversationNumber}`,
    scenario: scenario.name,
    userType: scenario.userType,
    exchanges: exchanges,
    createdAt: new Date().toISOString()
  }
}

// === GÉNÉRATEURS DE MESSAGES SUPPLÉMENTAIRES ===
function generateAdditionalUserMessage(userType, exchangeIndex) {
  const memberMessages = [
    "Parfait, merci !",
    "C'est exactement ce que je voulais",
    "Excellent choix !",
    "Merci beaucoup !",
    "C'est parfait !",
    "Parfait, j'ai hâte !",
    "Merci, c'est génial !",
    "Excellent, merci !"
  ]

  const nonMemberMessages = [
    "Parfait, merci !",
    "C'est exactement ce que je voulais",
    "Excellent choix !",
    "Merci beaucoup !",
    "C'est parfait !",
    "Parfait, j'ai hâte !",
    "Merci, c'est génial !",
    "Excellent, merci !",
    "Et pour demain ?",
    "Qu'est-ce que tu me conseilles d'autre ?",
    "J'ai besoin d'autre chose",
    "Qu'est-ce qui est bien ?"
  ]

  const messages = userType === "member" ? memberMessages : nonMemberMessages
  return messages[Math.floor(Math.random() * messages.length)]
}

function generateAdditionalAIResponse(userType, userMessage, conversationHistory) {
  if (userType === "member") {
    return "De rien ! Votre réservation est confirmée. N'hésitez pas si vous avez besoin d'autre chose. Bon appétit ! 🍽️✨"
  } else {
    return "De rien ! Votre réservation est confirmée. N'hésitez pas si vous avez besoin d'autre chose. Bon appétit ! 🍽️✨"
  }
}

// === EXPORT POUR UTILISATION ===
export const runSmartReservationTraining = async () => {
  console.log('🧠 DÉMARRAGE ENTRAÎNEMENT IA INTELLIGENTE')
  console.log('============================================================')
  console.log('🎯 Objectif : Processus de réservation contextuel')
  console.log('🎯 Membres : Présentation directe avec infos')
  console.log('🎯 Non-membres : Collecte d\'informations complète')
  console.log('============================================================\n')

  const conversations = smartReservationTraining.generateTrainingConversations(200)
  
  console.log(`📚 Conversations générées : ${conversations.length}`)
  console.log(`👥 Membres : ${conversations.filter(c => c.userType === 'member').length}`)
  console.log(`👤 Non-membres : ${conversations.filter(c => c.userType === 'guest').length}`)
  console.log(`🔄 Mixtes : ${conversations.filter(c => c.userType === 'member' && c.scenario.includes('CHANGEMENT')).length}`)
  
  return conversations
}
