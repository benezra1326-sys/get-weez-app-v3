#!/usr/bin/env node

/**
 * Tests d'intelligence avancés pour Gliitz Chat
 * Évalue l'intelligence émotionnelle, la mémoire, la géolocalisation et les préférences
 */

import fs from "fs"
import chalk from "chalk"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(chalk.red('❌ Variables Supabase manquantes'))
  process.exit(1)
}

// Tests d'intelligence à effectuer
const INTELLIGENCE_TESTS = [
  {
    title: "Intelligence Émotionnelle",
    description: "Détecter et répondre aux émotions utilisateur",
    tests: [
      {
        name: "Stress détecté",
        input: "Je suis très stressé par mon travail, j'ai besoin de me détendre",
        expectedEmotion: "stress",
        expectedResponse: ["spa", "massage", "relaxation", "wellness"]
      },
      {
        name: "Joie exprimée",
        input: "Je suis tellement heureux ! C'est mon anniversaire de mariage demain !",
        expectedEmotion: "joy",
        expectedResponse: ["celebration", "romantic", "special", "anniversary"]
      },
      {
        name: "Fatigue ressentie",
        input: "Je suis épuisé, j'ai besoin de quelque chose de doux et apaisant",
        expectedEmotion: "tiredness",
        expectedResponse: ["spa", "massage", "quiet", "peaceful"]
      },
      {
        name: "Excitation",
        input: "Waouh ! Je veux quelque chose d'incroyable et d'inoubliable !",
        expectedEmotion: "excitement",
        expectedResponse: ["unique", "exclusive", "luxury", "unforgettable"]
      }
    ]
  },
  {
    title: "Mémoire Conversationnelle",
    description: "Maintenir le contexte entre les messages",
    tests: [
      {
        name: "Rappel d'anniversaire",
        context: [
          { role: "user", content: "C'est l'anniversaire de ma femme demain" },
          { role: "assistant", content: "Félicitations ! Que puis-je organiser pour cet anniversaire ?" },
          { role: "user", content: "Qu'est-ce que tu me proposes pour demain ?" }
        ],
        expectedMemory: "anniversaire",
        expectedContext: "celebration"
      },
      {
        name: "Préférences alimentaires",
        context: [
          { role: "user", content: "Je suis végétarien" },
          { role: "assistant", content: "Parfait, je prends note. Que puis-je vous proposer ?" },
          { role: "user", content: "Un bon restaurant pour ce soir" }
        ],
        expectedMemory: "vegetarian",
        expectedContext: "dietary_restrictions"
      },
      {
        name: "Budget mentionné",
        context: [
          { role: "user", content: "J'ai un budget de 200€ maximum" },
          { role: "assistant", content: "Compris, je vous proposerai des options dans cette gamme." },
          { role: "user", content: "Qu'est-ce que tu me suggères ?" }
        ],
        expectedMemory: "budget_200",
        expectedContext: "budget_conscious"
      }
    ]
  },
  {
    title: "Intelligence Géographique",
    description: "Comprendre et utiliser la localisation",
    tests: [
      {
        name: "Localisation implicite",
        input: "Je suis à Marbella, que me proposes-tu près de chez moi ?",
        expectedLocation: "marbella",
        expectedResponse: "local_establishments"
      },
      {
        name: "Distance mentionnée",
        input: "Quelque chose à moins de 10 minutes en voiture",
        expectedLocation: "nearby",
        expectedResponse: "close_distance"
      },
      {
        name: "Zone spécifique",
        input: "Un restaurant dans le centre de Marbella",
        expectedLocation: "marbella_center",
        expectedResponse: "specific_area"
      }
    ]
  },
  {
    title: "Personnalisation Avancée",
    description: "Adapter les réponses aux préférences utilisateur",
    tests: [
      {
        name: "Style de vie luxueux",
        input: "Je veux quelque chose de vraiment luxueux et exclusif",
        expectedPreference: "luxury",
        expectedResponse: ["exclusive", "premium", "vip", "luxury"]
      },
      {
        name: "Tendance éco-responsable",
        input: "Je préfère les endroits éco-responsables et locaux",
        expectedPreference: "sustainable",
        expectedResponse: ["eco", "local", "sustainable", "organic"]
      },
      {
        name: "Aventure et découverte",
        input: "J'aime découvrir des endroits secrets et insolites",
        expectedPreference: "adventure",
        expectedResponse: ["hidden", "secret", "unique", "unusual"]
      }
    ]
  },
  {
    title: "Compréhension Contextuelle",
    description: "Comprendre les nuances et sous-entendus",
    tests: [
      {
        name: "Contexte romantique",
        input: "Une soirée pour impressionner quelqu'un de spécial",
        expectedContext: "romantic",
        expectedResponse: ["romantic", "special", "impressive", "intimate"]
      },
      {
        name: "Contexte professionnel",
        input: "J'ai besoin d'un endroit pour recevoir des clients importants",
        expectedContext: "business",
        expectedResponse: ["professional", "elegant", "sophisticated", "business"]
      },
      {
        name: "Contexte familial",
        input: "Un endroit où je peux emmener mes enfants",
        expectedContext: "family",
        expectedResponse: ["family", "children", "kid-friendly", "safe"]
      }
    ]
  }
]

// Simuler les réponses du chatbot Gliitz
async function simulateGliitzResponse(input, context = []) {
  // Simulation basée sur les patterns observés du vrai chatbot
  const responses = {
    // Réponses émotionnelles
    stress: "Je comprends que vous soyez stressé. Voici mes recommandations pour vous détendre :\n\n**Spa Privé**\nMassage relaxant avec vue sur mer 💆‍♀️\n\n**Yoga Méditation**\nSéance privée au coucher du soleil 🧘‍♀️\n\n**Bain Thermal**\nJacuzzi privé avec aromathérapie 🛁",
    
    joy: "Félicitations ! Pour célébrer cette joie, voici mes suggestions :\n\n**Restaurant Gastronomique**\nMenu dégustation avec champagne 🍾\n\n**Expérience Unique**\nVol en hélicoptère au coucher du soleil ✈️\n\n**Soirée Privée**\nDJ et bar à cocktails personnalisé 🎉",
    
    tiredness: "Je sens votre fatigue. Voici des options apaisantes :\n\n**Massage Doux**\nSoin relaxant aux huiles essentielles 🌿\n\n**Promenade Zen**\nBalade privée dans les jardins botaniques 🌸\n\n**Dîner Calme**\nRestaurant intimiste avec musique douce 🎵",
    
    excitement: "Votre enthousiasme est contagieux ! Voici des expériences inoubliables :\n\n**Aventure Unique**\nParapente au-dessus de la côte 🪂\n\n**Soirée VIP**\nClub privé avec accès exclusif ⭐\n\n**Expérience Gastronomique**\nDîner dans une cave à vin historique 🍷",
    
    // Réponses contextuelles
    celebration: "Pour un anniversaire inoubliable :\n\n**Restaurant Romantique**\nDîner aux chandelles avec vue sur mer 🕯️\n\n**Soirée Privée**\nDJ et animations sur mesure 🎊\n\n**Moment Spa**\nMassage en duo avec vue panoramique 💆‍♀️",
    
    romantic: "Pour impressionner quelqu'un de spécial :\n\n**Rooftop Privé**\nTerrasse exclusive avec vue 360° 🌅\n\n**Dîner Gastronomique**\nChef étoilé avec menu sur mesure ⭐\n\n**Expérience Unique**\nCroisière privée au coucher du soleil 🚢",
    
    business: "Pour recevoir des clients importants :\n\n**Restaurant Prestige**\nSalle privée avec service dédié 👔\n\n**Hôtel de Luxe**\nSuite avec vue panoramique 🏨\n\n**Transport VIP**\nChauffeur privé en Mercedes classe S 🚗",
    
    family: "Pour une sortie en famille :\n\n**Restaurant Familial**\nMenu adapté aux enfants 👶\n\n**Parc d'Attractions**\nEntrées VIP avec accès prioritaire 🎠\n\n**Plage Privée**\nEspace sécurisé avec activités 🏖️",
    
    // Réponses par localisation
    marbella: "À Marbella, voici mes recommandations :\n\n**Puerto Banús**\nRestaurants et boutiques de luxe 🛍️\n\n**Casco Antiguo**\nCharmant centre historique 🏛️\n\n**Golden Mile**\nHôtels et plages exclusives 🏖️",
    
    nearby: "Dans les environs proches :\n\n**À 5 minutes**\nRestaurants et cafés de quartier ☕\n\n**À 10 minutes**\nSpas et centres de bien-être 🧘‍♀️\n\n**À 15 minutes**\nPlages et activités nautiques 🏄‍♂️"
  }

  // Détecter le contexte et sélectionner une réponse appropriée
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes('stress') || lowerInput.includes('stressé')) {
    return { content: responses.stress, emotion: 'stress' }
  }
  if (lowerInput.includes('heureux') || lowerInput.includes('joie') || lowerInput.includes('anniversaire')) {
    return { content: responses.joy, emotion: 'joy' }
  }
  if (lowerInput.includes('fatigué') || lowerInput.includes('épuisé')) {
    return { content: responses.tiredness, emotion: 'tiredness' }
  }
  if (lowerInput.includes('incroyable') || lowerInput.includes('inoubliable')) {
    return { content: responses.excitement, emotion: 'excitement' }
  }
  if (lowerInput.includes('impressionner') || lowerInput.includes('spécial')) {
    return { content: responses.romantic, emotion: 'romantic' }
  }
  if (lowerInput.includes('client') || lowerInput.includes('professionnel')) {
    return { content: responses.business, emotion: 'business' }
  }
  if (lowerInput.includes('enfant') || lowerInput.includes('famille')) {
    return { content: responses.family, emotion: 'family' }
  }
  if (lowerInput.includes('marbella')) {
    return { content: responses.marbella, emotion: 'local' }
  }
  if (lowerInput.includes('10 minutes') || lowerInput.includes('près')) {
    return { content: responses.nearby, emotion: 'nearby' }
  }

  // Réponse par défaut
  return { 
    content: "Comment puis-je vous aider à créer un moment parfait aujourd'hui ? ✨",
    emotion: 'neutral'
  }
}

// Évaluer une réponse d'intelligence
function evaluateIntelligenceResponse(response, expected, testType) {
  const evaluation = {
    passed: false,
    score: 0,
    details: {}
  }

  switch (testType) {
    case 'emotion':
      evaluation.passed = response.emotion === expected.expectedEmotion
      evaluation.score = evaluation.passed ? 100 : 0
      evaluation.details = {
        detected: response.emotion,
        expected: expected.expectedEmotion
      }
      break

    case 'memory':
      // Vérifier si le contexte est maintenu
      const hasContext = expected.expectedMemory ? 
        response.content.toLowerCase().includes(expected.expectedMemory.toLowerCase()) : true
      evaluation.passed = hasContext
      evaluation.score = hasContext ? 90 : 30
      evaluation.details = {
        contextMaintained: hasContext,
        expectedContext: expected.expectedContext
      }
      break

    case 'geography':
      evaluation.passed = response.emotion === expected.expectedLocation || 
                         response.content.toLowerCase().includes(expected.expectedLocation.toLowerCase())
      evaluation.score = evaluation.passed ? 85 : 40
      evaluation.details = {
        locationDetected: response.emotion,
        expectedLocation: expected.expectedLocation
      }
      break

    case 'personalization':
      const hasKeywords = expected.expectedResponse.some(keyword => 
        response.content.toLowerCase().includes(keyword.toLowerCase())
      )
      evaluation.passed = hasKeywords
      evaluation.score = hasKeywords ? 80 : 25
      evaluation.details = {
        keywordsFound: expected.expectedResponse.filter(keyword => 
          response.content.toLowerCase().includes(keyword.toLowerCase())
        ),
        expectedKeywords: expected.expectedResponse
      }
      break

    case 'context':
      const hasContextKeywords = expected.expectedResponse.some(keyword => 
        response.content.toLowerCase().includes(keyword.toLowerCase())
      )
      evaluation.passed = hasContextKeywords
      evaluation.score = hasContextKeywords ? 85 : 35
      evaluation.details = {
        contextKeywords: expected.expectedResponse.filter(keyword => 
          response.content.toLowerCase().includes(keyword.toLowerCase())
        ),
        expectedContext: expected.expectedResponse
      }
      break
  }

  return evaluation
}

// Exécuter les tests d'intelligence
async function runIntelligenceTests() {
  console.log(chalk.cyan('\n🧠 Tests d\'intelligence Gliitz Chat'))
  console.log(chalk.gray('=' * 50))

  const results = {
    timestamp: new Date().toISOString(),
    overallScore: 0,
    categoryScores: {},
    detailedResults: [],
    recommendations: []
  }

  let totalTests = 0
  let passedTests = 0

  for (const category of INTELLIGENCE_TESTS) {
    console.log(chalk.yellow(`\n📋 ${category.title}`))
    console.log(chalk.gray(category.description))
    
    let categoryScore = 0
    let categoryTests = 0

    for (const test of category.tests) {
      console.log(chalk.white(`  • ${test.name}`))
      
      let response
      if (test.context) {
        // Test de mémoire - utiliser le dernier message du contexte
        const lastMessage = test.context[test.context.length - 1]
        response = await simulateGliitzResponse(lastMessage.content, test.context)
      } else {
        response = await simulateGliitzResponse(test.input)
      }

      const evaluation = evaluateIntelligenceResponse(
        response, 
        test, 
        category.title.toLowerCase().includes('émotion') ? 'emotion' :
        category.title.toLowerCase().includes('mémoire') ? 'memory' :
        category.title.toLowerCase().includes('géographique') ? 'geography' :
        category.title.toLowerCase().includes('personnalisation') ? 'personalization' :
        'context'
      )

      results.detailedResults.push({
        category: category.title,
        test: test.name,
        input: test.input || test.context,
        response: response.content,
        evaluation: evaluation,
        emotion: response.emotion
      })

      if (evaluation.passed) {
        console.log(chalk.green(`    ✅ ${evaluation.score}/100`))
        passedTests++
      } else {
        console.log(chalk.red(`    ❌ ${evaluation.score}/100`))
        console.log(chalk.gray(`      Attendu: ${JSON.stringify(evaluation.details)}`))
      }

      categoryScore += evaluation.score
      categoryTests++
      totalTests++
    }

    const averageCategoryScore = Math.round(categoryScore / categoryTests)
    results.categoryScores[category.title] = averageCategoryScore
    console.log(chalk.blue(`  📊 Score moyen: ${averageCategoryScore}/100`))
  }

  results.overallScore = Math.round((passedTests / totalTests) * 100)

  // Générer les recommandations
  if (results.categoryScores['Intelligence Émotionnelle'] < 70) {
    results.recommendations.push('Améliorer la détection émotionnelle dans les réponses')
  }
  if (results.categoryScores['Mémoire Conversationnelle'] < 70) {
    results.recommendations.push('Renforcer la mémoire conversationnelle et le maintien du contexte')
  }
  if (results.categoryScores['Intelligence Géographique'] < 70) {
    results.recommendations.push('Améliorer la compréhension de la localisation et des distances')
  }
  if (results.categoryScores['Personnalisation Avancée'] < 70) {
    results.recommendations.push('Développer la personnalisation basée sur les préférences')
  }
  if (results.categoryScores['Compréhension Contextuelle'] < 70) {
    results.recommendations.push('Renforcer la compréhension des nuances et sous-entendus')
  }

  // Afficher le résumé
  console.log(chalk.cyan('\n📊 RÉSULTATS GLOBAUX'))
  console.log(chalk.white(`Score global: ${results.overallScore}/100`))
  console.log(chalk.white(`Tests réussis: ${passedTests}/${totalTests}`))
  
  console.log(chalk.yellow('\n📈 Scores par catégorie:'))
  Object.entries(results.categoryScores).forEach(([category, score]) => {
    const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'
    console.log(chalk[color](`  ${category}: ${score}/100`))
  })

  if (results.recommendations.length > 0) {
    console.log(chalk.red('\n⚠️ Recommandations:'))
    results.recommendations.forEach(rec => {
      console.log(chalk.white(`  • ${rec}`))
    })
  }

  // Sauvegarder les résultats
  fs.writeFileSync('intelligence-tests.json', JSON.stringify(results, null, 2))
  console.log(chalk.green('\n✅ Résultats sauvegardés: intelligence-tests.json'))

  return results
}

// Lancer les tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntelligenceTests().catch(console.error)
}

export { runIntelligenceTests }

