// 🧠 GÉNÉRATEUR DE CONVERSATIONS HÉSITANTES - 1000 TESTS
// Objectif : Entraîner l'IA avec des conversations réalistes et hésitantes

export class HesitantConversationGenerator {
  constructor() {
    this.conversationTemplates = {
      // Scénarios de base
      scenarios: [
        'restaurant_hesitation',
        'yacht_uncertainty', 
        'villa_doubts',
        'event_planning_confusion',
        'budget_concerns',
        'timing_issues',
        'group_size_changes',
        'preference_changes',
        'location_hesitation',
        'service_uncertainty'
      ],
      
      // Patterns d'hésitation
      hesitationPatterns: [
        'Je ne sais pas...',
        'Hmm, je réfléchis...',
        'Attends, laisse-moi voir...',
        'Je ne suis pas sûr...',
        'Tu penses que...?',
        'Et si on...?',
        'Peut-être que...',
        'Je me demande si...',
        'Qu\'est-ce que tu en penses?',
        'Je hésite entre...'
      ],
      
      // Changements de direction
      directionChanges: [
        'En fait, je change d\'avis...',
        'Attends, j\'ai une autre idée...',
        'Non, finalement...',
        'Je me suis trompé...',
        'En fait, c\'est plutôt...',
        'J\'ai repensé à...',
        'Finalement, je préfère...',
        'Je viens de me rappeler...',
        'En fait, on est plutôt...',
        'J\'ai changé d\'avis sur...'
      ]
    }
  }

  // === GÉNÉRER UNE CONVERSATION HÉSITANTE ===
  generateHesitantConversation(scenario, conversationNumber) {
    const conversation = {
      id: `hesitant_${conversationNumber}`,
      scenario: scenario,
      exchanges: [],
      totalExchanges: 20,
      hesitationLevel: this.calculateHesitationLevel(),
      resolution: this.generateResolution(scenario)
    }

    // Générer les 20 échanges
    for (let i = 0; i < 20; i++) {
      const exchange = this.generateExchange(i, conversation, scenario)
      conversation.exchanges.push(exchange)
    }

    return conversation
  }

  // === GÉNÉRER UN ÉCHANGE ===
  generateExchange(step, conversation, scenario) {
    const isUserTurn = step % 2 === 0
    const exchangeNumber = Math.floor(step / 2) + 1
    
    if (isUserTurn) {
      return this.generateUserMessage(step, conversation, scenario)
    } else {
      return this.generateAIMessage(step, conversation, scenario)
    }
  }

  // === MESSAGE UTILISATEUR ===
  generateUserMessage(step, conversation, scenario) {
    const userMessages = this.getUserMessageTemplates(step, scenario)
    const selectedMessage = userMessages[Math.floor(Math.random() * userMessages.length)]
    
    return {
      sender: 'user',
      text: selectedMessage,
      step: step,
      hesitation: this.detectHesitation(selectedMessage),
      context: this.extractContext(selectedMessage)
    }
  }

  // === MESSAGE IA ===
  generateAIMessage(step, conversation, scenario) {
    const aiMessages = this.getAIMessageTemplates(step, conversation, scenario)
    const selectedMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)]
    
    return {
      sender: 'ai',
      text: selectedMessage,
      step: step,
      helpfulness: this.calculateHelpfulness(selectedMessage),
      suggestions: this.extractSuggestions(selectedMessage)
    }
  }

  // === TEMPLATES DE MESSAGES UTILISATEUR ===
  getUserMessageTemplates(step, scenario) {
    const baseMessages = {
      restaurant_hesitation: [
        "Je veux manger quelque chose...",
        "Hmm, je ne sais pas quoi...",
        "Tu penses qu'un restaurant ce soir c'est bien ?",
        "Je ne suis pas sûr de ce que je veux...",
        "Et si on allait quelque part de différent ?",
        "Je me demande si c'est une bonne idée...",
        "Attends, j'ai changé d'avis...",
        "En fait, je préfère peut-être...",
        "Je ne sais pas si c'est le bon moment...",
        "Tu crois que c'est trop cher ?",
        "Je hésite entre plusieurs options...",
        "Et si on essayait autre chose ?",
        "Je ne suis pas sûr du style...",
        "Peut-être que c'est mieux demain...",
        "Je me demande si c'est approprié...",
        "En fait, j'ai une autre idée...",
        "Je ne sais pas combien on sera...",
        "Tu penses que c'est une bonne idée ?",
        "Je me demande si c'est trop loin...",
        "Attends, j'ai repensé à quelque chose..."
      ],
      yacht_uncertainty: [
        "Je veux un yacht...",
        "Mais je ne sais pas pour combien de personnes...",
        "Hmm, c'est peut-être trop cher...",
        "Tu penses qu'un yacht c'est bien ?",
        "Je ne suis pas sûr de la taille...",
        "Et si on prenait quelque chose de plus petit ?",
        "Je me demande si c'est nécessaire...",
        "Attends, j'ai changé d'avis...",
        "En fait, je préfère peut-être...",
        "Je ne sais pas si c'est le bon moment...",
        "Tu crois que c'est trop compliqué ?",
        "Je hésite entre yacht et autre chose...",
        "Et si on essayait autre chose ?",
        "Je ne suis pas sûr du budget...",
        "Peut-être que c'est mieux plus tard...",
        "Je me demande si c'est approprié...",
        "En fait, j'ai une autre idée...",
        "Je ne sais pas combien de temps...",
        "Tu penses que c'est une bonne idée ?",
        "Je me demande si c'est trop risqué..."
      ],
      villa_doubts: [
        "Je veux une villa...",
        "Mais je ne sais pas pour combien de personnes...",
        "Hmm, c'est peut-être trop grand...",
        "Tu penses qu'une villa c'est bien ?",
        "Je ne suis pas sûr de la localisation...",
        "Et si on prenait quelque chose de plus petit ?",
        "Je me demande si c'est nécessaire...",
        "Attends, j'ai changé d'avis...",
        "En fait, je préfère peut-être...",
        "Je ne sais pas si c'est le bon moment...",
        "Tu crois que c'est trop cher ?",
        "Je hésite entre villa et hôtel...",
        "Et si on essayait autre chose ?",
        "Je ne suis pas sûr du style...",
        "Peut-être que c'est mieux ailleurs...",
        "Je me demande si c'est approprié...",
        "En fait, j'ai une autre idée...",
        "Je ne sais pas combien de jours...",
        "Tu penses que c'est une bonne idée ?",
        "Je me demande si c'est trop isolé..."
      ]
    }

    return baseMessages[scenario] || baseMessages.restaurant_hesitation
  }

  // === TEMPLATES DE MESSAGES IA ===
  getAIMessageTemplates(step, conversation, scenario) {
    const aiResponses = {
      restaurant_hesitation: [
        "Je comprends ton hésitation ! Laisse-moi t'aider à trouver quelque chose de parfait...",
        "Pas de problème, c'est normal d'hésiter ! Qu'est-ce qui te ferait plaisir ?",
        "Je vois que tu réfléchis... C'est une bonne approche ! Dis-moi ce qui te tente...",
        "Hmm, je comprends ton incertitude. Laisse-moi te proposer quelques options...",
        "C'est tout à fait normal d'hésiter ! Je suis là pour t'aider à choisir...",
        "Je vois que tu n'es pas sûr... C'est parfait, on va trouver ensemble !",
        "Pas de stress ! Laisse-moi te guider vers quelque chose qui te plaira...",
        "Je comprends ton hésitation... C'est important de bien choisir !",
        "C'est normal de réfléchir ! Dis-moi ce qui te préoccupe...",
        "Je vois que tu changes d'avis... C'est parfait, on s'adapte !",
        "Pas de problème ! Laisse-moi te proposer quelque chose de différent...",
        "Je comprends ton incertitude... On va trouver la solution parfaite !",
        "C'est normal d'hésiter ! Qu'est-ce qui te ferait vraiment plaisir ?",
        "Je vois que tu réfléchis... C'est une excellente approche !",
        "Pas de stress ! Laisse-moi t'aider à clarifier tes envies...",
        "Je comprends ton hésitation... On va y aller étape par étape !",
        "C'est parfait de réfléchir ! Dis-moi ce qui te préoccupe...",
        "Je vois que tu changes d'avis... C'est normal, on s'adapte !",
        "Pas de problème ! Laisse-moi te proposer des alternatives...",
        "Je comprends ton incertitude... On va trouver la solution idéale !"
      ],
      yacht_uncertainty: [
        "Je comprends ton hésitation ! Un yacht, c'est un investissement important...",
        "Pas de problème, c'est normal d'hésiter ! Laisse-moi t'aider...",
        "Je vois que tu réfléchis... C'est une bonne approche ! Dis-moi tes besoins...",
        "Hmm, je comprends ton incertitude. Laisse-moi te proposer quelques options...",
        "C'est tout à fait normal d'hésiter ! Je suis là pour t'aider à choisir...",
        "Je vois que tu n'es pas sûr... C'est parfait, on va trouver ensemble !",
        "Pas de stress ! Laisse-moi te guider vers quelque chose qui te plaira...",
        "Je comprends ton hésitation... C'est important de bien choisir !",
        "C'est normal de réfléchir ! Dis-moi ce qui te préoccupe...",
        "Je vois que tu changes d'avis... C'est parfait, on s'adapte !",
        "Pas de problème ! Laisse-moi te proposer quelque chose de différent...",
        "Je comprends ton incertitude... On va trouver la solution parfaite !",
        "C'est normal d'hésiter ! Qu'est-ce qui te ferait vraiment plaisir ?",
        "Je vois que tu réfléchis... C'est une excellente approche !",
        "Pas de stress ! Laisse-moi t'aider à clarifier tes envies...",
        "Je comprends ton hésitation... On va y aller étape par étape !",
        "C'est parfait de réfléchir ! Dis-moi ce qui te préoccupe...",
        "Je vois que tu changes d'avis... C'est normal, on s'adapte !",
        "Pas de problème ! Laisse-moi te proposer des alternatives...",
        "Je comprends ton incertitude... On va trouver la solution idéale !"
      ],
      villa_doubts: [
        "Je comprends ton hésitation ! Une villa, c'est un choix important...",
        "Pas de problème, c'est normal d'hésiter ! Laisse-moi t'aider...",
        "Je vois que tu réfléchis... C'est une bonne approche ! Dis-moi tes besoins...",
        "Hmm, je comprends ton incertitude. Laisse-moi te proposer quelques options...",
        "C'est tout à fait normal d'hésiter ! Je suis là pour t'aider à choisir...",
        "Je vois que tu n'es pas sûr... C'est parfait, on va trouver ensemble !",
        "Pas de stress ! Laisse-moi te guider vers quelque chose qui te plaira...",
        "Je comprends ton hésitation... C'est important de bien choisir !",
        "C'est normal de réfléchir ! Dis-moi ce qui te préoccupe...",
        "Je vois que tu changes d'avis... C'est parfait, on s'adapte !",
        "Pas de problème ! Laisse-moi te proposer quelque chose de différent...",
        "Je comprends ton incertitude... On va trouver la solution parfaite !",
        "C'est normal d'hésiter ! Qu'est-ce qui te ferait vraiment plaisir ?",
        "Je vois que tu réfléchis... C'est une excellente approche !",
        "Pas de stress ! Laisse-moi t'aider à clarifier tes envies...",
        "Je comprends ton hésitation... On va y aller étape par étape !",
        "C'est parfait de réfléchir ! Dis-moi ce qui te préoccupe...",
        "Je vois que tu changes d'avis... C'est normal, on s'adapte !",
        "Pas de problème ! Laisse-moi te proposer des alternatives...",
        "Je comprends ton incertitude... On va trouver la solution idéale !"
      ]
    }

    return aiResponses[scenario] || aiResponses.restaurant_hesitation
  }

  // === CALCULER LE NIVEAU D'HÉSITATION ===
  calculateHesitationLevel() {
    return Math.random() * 0.8 + 0.2 // Entre 0.2 et 1.0
  }

  // === DÉTECTER L'HÉSITATION ===
  detectHesitation(message) {
    const hesitationWords = ['hésite', 'pas sûr', 'ne sais pas', 'réfléchis', 'attends', 'peut-être']
    return hesitationWords.some(word => message.toLowerCase().includes(word))
  }

  // === EXTRAIRE LE CONTEXTE ===
  extractContext(message) {
    const contexts = {
      budget: ['cher', 'prix', 'coût', 'budget'],
      timing: ['ce soir', 'demain', 'maintenant', 'plus tard'],
      group: ['personnes', 'gens', 'groupe', 'nous'],
      location: ['ici', 'là', 'marbella', 'centre']
    }
    
    const detectedContexts = []
    for (const [context, keywords] of Object.entries(contexts)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        detectedContexts.push(context)
      }
    }
    
    return detectedContexts
  }

  // === CALCULER L'UTILITÉ ===
  calculateHelpfulness(message) {
    const helpfulWords = ['aide', 'propose', 'suggère', 'recommandation', 'option']
    const helpfulCount = helpfulWords.filter(word => 
      message.toLowerCase().includes(word)
    ).length
    
    return Math.min(helpfulCount / helpfulWords.length, 1.0)
  }

  // === EXTRAIRE LES SUGGESTIONS ===
  extractSuggestions(message) {
    const suggestions = []
    if (message.includes('propose')) suggestions.push('proposition')
    if (message.includes('recommandation')) suggestions.push('recommandation')
    if (message.includes('option')) suggestions.push('alternative')
    if (message.includes('aide')) suggestions.push('assistance')
    
    return suggestions
  }

  // === GÉNÉRER LA RÉSOLUTION ===
  generateResolution(scenario) {
    const resolutions = {
      restaurant_hesitation: 'Réservation confirmée au restaurant recommandé',
      yacht_uncertainty: 'Yacht réservé avec équipage complet',
      villa_doubts: 'Villa réservée avec services inclus',
      event_planning_confusion: 'Événement organisé avec succès',
      budget_concerns: 'Solution trouvée dans le budget',
      timing_issues: 'Timing optimisé et confirmé',
      group_size_changes: 'Capacité adaptée au groupe',
      preference_changes: 'Préférences mises à jour',
      location_hesitation: 'Localisation confirmée',
      service_uncertainty: 'Services clarifiés et réservés'
    }
    
    return resolutions[scenario] || 'Résolution trouvée'
  }

  // === GÉNÉRER LES 1000 TESTS ===
  generateAllTests() {
    const allTests = []
    
    for (let i = 1; i <= 1000; i++) {
      const scenario = this.conversationTemplates.scenarios[
        Math.floor(Math.random() * this.conversationTemplates.scenarios.length)
      ]
      
      const conversation = this.generateHesitantConversation(scenario, i)
      allTests.push(conversation)
    }
    
    return allTests
  }

  // === EXPORT DES TESTS ===
  exportTests() {
    const tests = this.generateAllTests()
    
    return {
      totalTests: tests.length,
      scenarios: this.conversationTemplates.scenarios,
      averageHesitation: tests.reduce((sum, test) => sum + test.hesitationLevel, 0) / tests.length,
      tests: tests
    }
  }
}

// === INSTANCE GLOBALE ===
export const hesitantGenerator = new HesitantConversationGenerator()
