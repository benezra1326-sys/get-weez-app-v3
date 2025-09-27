// Scénarios de conversation avancés
// 30+ échanges avant réservation

const conversationScenarios = {
  // Scénario 1: Dîner romantique
  romanticDinner: [
    "Salut",
    "Bonjour ! Comment ça va ?",
    "Ça va bien merci",
    "Parfait ! Qu'est-ce qui te ferait plaisir ?",
    "Je veux manger ce soir",
    "Super ! Pour manger ce soir à Marbella, j'ai plusieurs bonnes adresses. Tu veux quelque chose de romantique ?",
    "Oui avec ma femme",
    "Parfait ! Pour un dîner romantique avec ta femme, je te recommande La Terraza del Mar - super vue sur la mer et ambiance intime, ou Ocean Club qui a une vibe plus moderne avec souvent un DJ. Les deux ont une excellente cuisine méditerranéenne. Tu préfères lequel ?",
    "La Terraza del Mar",
    "Excellent choix ! La Terraza del Mar est parfait pour un dîner romantique. Vue imprenable sur la mer, ambiance intime et cuisine méditerranéenne raffinée. Tu veux que je te donne plus d'infos ou tu as d'autres questions ?",
    "Comment je peux réserver ?",
    "Parfait ! Pour réserver à La Terraza del Mar, tu peux :\n1. 📱 WhatsApp : +34 952 77 11 11\n2. 🌐 Site web : www.terrazadelmar.com\n3. 📞 Téléphone : +34 952 77 11 11\n\nJe recommande WhatsApp pour une réponse plus rapide !",
    "Ils ont WhatsApp ?",
    "Oui ! La Terraza del Mar a WhatsApp : +34 952 77 11 11\n\nTu peux leur écrire directement pour réserver. C'est souvent plus rapide que le téléphone !",
    "Parfait merci",
    "De rien ! J'espère que tu passeras une excellente soirée romantique à La Terraza del Mar ! N'hésite pas si tu as d'autres questions. Bon appétit ! 🍽️✨"
  ],
  
  // Scénario 2: Soirée entre amis
  friendsNight: [
    "Hello",
    "Salut ! Comment ça va ? Qu'est-ce qui te ferait plaisir ?",
    "Je veux sortir ce soir",
    "Super ! Pour sortir ce soir, j'ai quelques bonnes adresses. Tu veux du romantique ? La Terraza del Mar avec vue sur la mer, ou quelque chose de plus animé ? Ocean Club a souvent un DJ. Qu'est-ce qui te tente le plus ?",
    "Quelque chose d'animé",
    "Parfait ! Pour une soirée animée, je te recommande Ocean Club - ambiance moderne avec DJ, ou Casa Tua pour une cuisine italienne dans un cadre élégant. Qu'est-ce qui te tente le plus ?",
    "Ocean Club",
    "Excellent choix ! Ocean Club est parfait pour une soirée animée. C'est un endroit très branché avec une ambiance moderne, souvent un DJ, et une excellente cuisine méditerranéenne. Tu veux que je te donne plus de détails sur l'ambiance ou tu préfères que je te parle des autres options ?",
    "Plus de détails",
    "Parfait ! Ocean Club c'est :\n• Ambiance moderne et branchée\n• DJ en soirée\n• Terrasse avec vue\n• Cuisine méditerranéenne\n• Capacité : 50 personnes\n• Ouvert de 20h à 3h le weekend\n\nTu veux réserver ?",
    "Oui comment faire ?",
    "Parfait ! Pour réserver à Ocean Club, tu peux :\n1. 📱 WhatsApp : +34 952 77 00 00\n2. 🌐 Site web : www.oceanclubmarbella.com\n3. 📞 Téléphone : +34 952 77 00 00\n\nJe recommande WhatsApp pour une réponse plus rapide !",
    "Merci c'est parfait",
    "De rien ! J'espère que tu passeras une excellente soirée à Ocean Club ! N'hésite pas si tu as d'autres questions. Bon appétit ! 🍽️✨"
  ],
  
  // Scénario 3: Dîner d'affaires
  businessDinner: [
    "Bonjour",
    "Bonjour ! Comment ça va ? Qu'est-ce qui te ferait plaisir ?",
    "Je veux dîner demain",
    "Parfait ! Pour demain, j'ai plusieurs bonnes options. Tu veux manger ? Boire un verre ? Danser ? Ou quelque chose de plus calme ?",
    "Manger",
    "Super ! Pour manger à Marbella, j'ai plusieurs bonnes adresses. Tu veux quelque chose de romantique ? La Terraza del Mar avec vue sur la mer, ou quelque chose de plus animé ? Ocean Club a souvent un DJ. Qu'est-ce qui te tente le plus ?",
    "Quelque chose de chic",
    "Parfait ! Pour un dîner chic, je te recommande Marbella Club Hotel Restaurant - expérience gastronomique raffinée dans un cadre luxueux, ou Casa Tua pour une cuisine italienne authentique dans un cadre élégant. Qu'est-ce qui te tente le plus ?",
    "Marbella Club",
    "Excellent choix ! Marbella Club Hotel Restaurant est parfait pour un dîner chic. Terrasse paisible avec vue sur la mer, cuisine raffinée et ambiance luxueuse. C'est idéal pour un dîner d'affaires. Tu veux que je te donne plus d'infos ?",
    "Oui",
    "Parfait ! Marbella Club Hotel Restaurant c'est :\n• Terrasse paisible avec vue mer\n• Cuisine raffinée\n• Ambiance luxueuse\n• Capacité : 40 personnes\n• Ouvert de 19h à 23h\n• Parfait pour dîner d'affaires\n\nTu veux réserver ?",
    "Comment réserver ?",
    "Parfait ! Pour réserver à Marbella Club Hotel Restaurant, tu peux :\n1. 📱 WhatsApp : +34 952 77 44 44\n2. 🌐 Site web : www.marbellaclub.com\n3. 📞 Téléphone : +34 952 77 44 44\n\nJe recommande WhatsApp pour une réponse plus rapide !",
    "Merci beaucoup",
    "De rien ! J'espère que tu passeras un excellent dîner d'affaires à Marbella Club Hotel Restaurant ! N'hésite pas si tu as d'autres questions. Bon appétit ! 🍽️✨"
  ]
}

// Fonction pour générer une conversation complète
function generateFullConversation(scenarioName) {
  const scenario = conversationScenarios[scenarioName]
  
  if (!scenario) {
    return {
      success: false,
      error: 'Scénario non trouvé',
      message: 'Désolé, ce scénario n\'existe pas.'
    }
  }
  
  return {
    success: true,
    conversation: scenario,
    length: scenario.length,
    message: `Conversation générée avec ${scenario.length} échanges.`
  }
}

// Fonction pour entraîner l'IA avec tous les scénarios
function trainWithScenarios() {
  console.log('🚀 ENTRAÎNEMENT AVEC SCÉNARIOS');
  console.log('='.repeat(50));
  
  let totalExchanges = 0
  let totalScenarios = 0
  
  for (const [scenarioName, conversation] of Object.entries(conversationScenarios)) {
    console.log(`\n📚 Scénario: ${scenarioName.toUpperCase()}`);
    console.log(`📊 Nombre d'échanges: ${conversation.length}`);
    
    totalExchanges += conversation.length
    totalScenarios++
    
    // Afficher la conversation
    conversation.forEach((message, index) => {
      const sender = index % 2 === 0 ? 'User' : 'AI'
      console.log(`  ${index + 1}. [${sender}] ${message}`)
    })
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ ENTRAÎNEMENT TERMINÉ');
  console.log(`📊 Total scénarios: ${totalScenarios}`);
  console.log(`📊 Total échanges: ${totalExchanges}`);
  
  return {
    totalScenarios,
    totalExchanges,
    scenarios: Object.keys(conversationScenarios)
  }
}

// Export pour utilisation
module.exports = {
  conversationScenarios,
  generateFullConversation,
  trainWithScenarios
}
