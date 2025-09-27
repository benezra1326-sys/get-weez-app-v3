// 🧠 TEST DE L'IA AMÉLIORÉE
// Objectif : Tester que l'IA donne des réponses directes et concrètes

import { askWeezAgent } from './lib/openai.js'

class ImprovedAITester {
  constructor() {
    this.testCases = [
      {
        message: "bonjour",
        expectedKeywords: ["Get Weez", "concierge", "Marbella", "villas", "restaurants", "clubs"],
        description: "Salutation simple"
      },
      {
        message: "je veux un restaurant ce soir",
        expectedKeywords: ["La Terraza del Mar", "Nobu Marbella", "ce soir", "réservation"],
        description: "Demande restaurant spécifique"
      },
      {
        message: "ou aller a la plage demain pour 2",
        expectedKeywords: ["Nikki Beach", "Puente Romano Beach", "demain", "2 personnes"],
        description: "Demande plage avec contexte"
      },
      {
        message: "je veux un yacht pour une semaine",
        expectedKeywords: ["Princess 50", "Sunseeker 60", "semaine", "capitaine", "équipage"],
        description: "Demande yacht avec durée"
      },
      {
        message: "villa pour un evg 10 personnes",
        expectedKeywords: ["Villa Marbella Club", "Villa Golden Mile", "EVG", "10 personnes"],
        description: "Demande villa EVG"
      },
      {
        message: "jet privé, yacht et villa pour 10 personnes",
        expectedKeywords: ["jet privé", "yacht", "villa", "10 personnes", "organise"],
        description: "Demande multiple complexe"
      }
    ]
  }

  // === TESTER UN CAS ===
  async testCase(testCase) {
    console.log(`\n🧪 Test: ${testCase.description}`)
    console.log(`📝 Message: "${testCase.message}"`)
    
    try {
      const response = await askWeezAgent(
        testCase.message,
        "Test User",
        true,
        []
      )
      
      console.log(`🤖 Réponse: "${response}"`)
      
      // Vérifier les mots-clés attendus
      const foundKeywords = testCase.expectedKeywords.filter(keyword => 
        response.toLowerCase().includes(keyword.toLowerCase())
      )
      
      const score = (foundKeywords.length / testCase.expectedKeywords.length) * 100
      
      console.log(`✅ Mots-clés trouvés: ${foundKeywords.length}/${testCase.expectedKeywords.length}`)
      console.log(`📊 Score: ${score.toFixed(1)}%`)
      
      // Vérifier qu'il n'y a pas de questions génériques
      const hasGenericQuestions = response.includes("qu'est-ce qui te tente") || 
                                 response.includes("que cherches-tu") ||
                                 response.includes("que puis-je faire")
      
      if (hasGenericQuestions) {
        console.log(`⚠️  ATTENTION: Questions génériques détectées`)
        return { score: Math.max(0, score - 20), hasGenericQuestions: true }
      }
      
      return { score, hasGenericQuestions: false, response }
      
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`)
      return { score: 0, hasGenericQuestions: true, error: error.message }
    }
  }

  // === TESTER TOUS LES CAS ===
  async runAllTests() {
    console.log('🚀 DÉMARRAGE DES TESTS IA AMÉLIORÉE')
    console.log('='.repeat(60))
    
    const results = []
    let totalScore = 0
    let testsWithGenericQuestions = 0
    
    for (const testCase of this.testCases) {
      const result = await this.testCase(testCase)
      results.push({
        ...testCase,
        result
      })
      
      totalScore += result.score
      if (result.hasGenericQuestions) {
        testsWithGenericQuestions++
      }
    }
    
    // Calculer les statistiques
    const averageScore = totalScore / this.testCases.length
    const successRate = ((this.testCases.length - testsWithGenericQuestions) / this.testCases.length) * 100
    
    console.log('\n📊 RÉSULTATS FINAUX')
    console.log('='.repeat(40))
    console.log(`Tests effectués: ${this.testCases.length}`)
    console.log(`Score moyen: ${averageScore.toFixed(1)}%`)
    console.log(`Tests sans questions génériques: ${this.testCases.length - testsWithGenericQuestions}/${this.testCases.length}`)
    console.log(`Taux de réussite: ${successRate.toFixed(1)}%`)
    
    if (averageScore >= 80 && successRate >= 80) {
      console.log('🎉 IA AMÉLIORÉE AVEC SUCCÈS !')
      console.log('✅ Réponses directes et concrètes')
      console.log('✅ Plus de questions génériques')
      console.log('✅ Recommandations spécifiques')
    } else {
      console.log('⚠️  IA ENCORE À AMÉLIORER')
      console.log('❌ Trop de questions génériques')
      console.log('❌ Réponses pas assez concrètes')
    }
    
    return {
      averageScore,
      successRate,
      results,
      improved: averageScore >= 80 && successRate >= 80
    }
  }

  // === ANALYSER LES RÉPONSES ===
  analyzeResponses(results) {
    console.log('\n🔍 ANALYSE DÉTAILLÉE')
    console.log('='.repeat(40))
    
    results.forEach((test, index) => {
      console.log(`\n${index + 1}. ${test.description}`)
      console.log(`   Score: ${test.result.score.toFixed(1)}%`)
      console.log(`   Questions génériques: ${test.result.hasGenericQuestions ? 'OUI' : 'NON'}`)
      
      if (test.result.response) {
        const responseLength = test.result.response.length
        console.log(`   Longueur réponse: ${responseLength} caractères`)
        
        if (responseLength < 50) {
          console.log(`   ⚠️  Réponse trop courte`)
        } else if (responseLength > 500) {
          console.log(`   ⚠️  Réponse trop longue`)
        } else {
          console.log(`   ✅ Longueur appropriée`)
        }
      }
    })
  }
}

// === LANCEMENT DES TESTS ===
async function testImprovedAI() {
  const tester = new ImprovedAITester()
  const results = await tester.runAllTests()
  tester.analyzeResponses(results.results)
  
  return results
}

// === EXPORT ===
export { ImprovedAITester, testImprovedAI }

// === LANCEMENT SI EXÉCUTÉ DIRECTEMENT ===
if (import.meta.url === `file://${process.argv[1]}`) {
  testImprovedAI()
    .then(results => {
      console.log('\n🏁 Tests terminés !')
      process.exit(results.improved ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Erreur lors des tests:', error)
      process.exit(1)
    })
}
