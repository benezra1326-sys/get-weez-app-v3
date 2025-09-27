// 🧪 GÉNÉRATEUR DE 1000 TESTS HÉSITANTS
// Objectif : Générer 1000 tests avec conversations hésitantes de 20 échanges

import { HesitantConversationGenerator } from './lib/hesitant-conversation-generator.js'

class TestGenerator {
  constructor() {
    this.generator = new HesitantConversationGenerator()
    this.tests = []
  }

  // === GÉNÉRER LES 1000 TESTS ===
  generateAllTests() {
    console.log('🧪 GÉNÉRATION DE 1000 TESTS HÉSITANTS')
    console.log('='.repeat(60))
    
    for (let i = 1; i <= 1000; i++) {
      const test = this.generateSingleTest(i)
      this.tests.push(test)
      
      if (i % 100 === 0) {
        console.log(`📊 Tests générés: ${i}/1000`)
      }
    }
    
    console.log('\n✅ 1000 tests générés avec succès !')
    return this.tests
  }

  // === GÉNÉRER UN TEST ===
  generateSingleTest(testNumber) {
    const scenarios = [
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
    ]
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    const conversation = this.generator.generateHesitantConversation(scenario, testNumber)
    
    return {
      testId: `test_${testNumber}`,
      scenario,
      conversation,
      hesitationLevel: conversation.hesitationLevel,
      totalExchanges: conversation.exchanges.length,
      resolution: conversation.resolution
    }
  }

  // === ANALYSER LES TESTS ===
  analyzeTests() {
    const analysis = {
      totalTests: this.tests.length,
      scenarios: {},
      averageHesitation: 0,
      averageExchanges: 0,
      hesitationDistribution: {
        low: 0,
        medium: 0,
        high: 0
      }
    }

    // Analyser les scénarios
    this.tests.forEach(test => {
      if (!analysis.scenarios[test.scenario]) {
        analysis.scenarios[test.scenario] = 0
      }
      analysis.scenarios[test.scenario]++
    })

    // Calculer les moyennes
    analysis.averageHesitation = this.tests.reduce((sum, test) => sum + test.hesitationLevel, 0) / this.tests.length
    analysis.averageExchanges = this.tests.reduce((sum, test) => sum + test.totalExchanges, 0) / this.tests.length

    // Distribution de l'hésitation
    this.tests.forEach(test => {
      if (test.hesitationLevel < 0.4) analysis.hesitationDistribution.low++
      else if (test.hesitationLevel < 0.7) analysis.hesitationDistribution.medium++
      else analysis.hesitationDistribution.high++
    })

    return analysis
  }

  // === EXPORTER LES TESTS ===
  exportTests() {
    const analysis = this.analyzeTests()
    
    console.log('\n📊 ANALYSE DES TESTS')
    console.log('='.repeat(40))
    console.log(`Total des tests: ${analysis.totalTests}`)
    console.log(`Hésitation moyenne: ${analysis.averageHesitation.toFixed(2)}`)
    console.log(`Échanges moyens: ${analysis.averageExchanges.toFixed(1)}`)
    
    console.log('\n📈 Distribution de l\'hésitation:')
    console.log(`   Faible (0-0.4): ${analysis.hesitationDistribution.low} tests`)
    console.log(`   Moyenne (0.4-0.7): ${analysis.hesitationDistribution.medium} tests`)
    console.log(`   Élevée (0.7-1.0): ${analysis.hesitationDistribution.high} tests`)
    
    console.log('\n🎭 Scénarios:')
    Object.entries(analysis.scenarios).forEach(([scenario, count]) => {
      console.log(`   ${scenario}: ${count} tests`)
    })

    return {
      tests: this.tests,
      analysis
    }
  }

  // === EXEMPLE DE TEST ===
  showExampleTest() {
    if (this.tests.length === 0) return

    const exampleTest = this.tests[0]
    console.log('\n🎭 EXEMPLE DE TEST')
    console.log('='.repeat(40))
    console.log(`Test ID: ${exampleTest.testId}`)
    console.log(`Scénario: ${exampleTest.scenario}`)
    console.log(`Niveau d'hésitation: ${exampleTest.hesitationLevel.toFixed(2)}`)
    console.log(`Résolution: ${exampleTest.resolution}`)
    
    console.log('\n💬 Échanges (premiers 6):')
    exampleTest.conversation.exchanges.slice(0, 6).forEach((exchange, index) => {
      console.log(`   ${index + 1}. ${exchange.sender}: "${exchange.text}"`)
    })
    
    console.log('   ... (14 échanges supplémentaires)')
  }
}

// === LANCEMENT DE LA GÉNÉRATION ===
async function generateAllTests() {
  const generator = new TestGenerator()
  
  console.log('🚀 DÉMARRAGE DE LA GÉNÉRATION')
  console.log('='.repeat(60))
  
  // Générer les 1000 tests
  generator.generateAllTests()
  
  // Analyser et exporter
  const results = generator.exportTests()
  
  // Montrer un exemple
  generator.showExampleTest()
  
  console.log('\n🎉 GÉNÉRATION TERMINÉE !')
  console.log('='.repeat(60))
  console.log('✅ 1000 tests hésitants générés')
  console.log('🧠 Conversations réalistes avec hésitation')
  console.log('🎯 20 échanges par conversation')
  console.log('📊 Analyse complète des patterns')
  console.log('\n🎊 Prêt pour l\'entraînement de l\'IA !')
  
  return results
}

// === EXPORT POUR UTILISATION ===
export { TestGenerator, generateAllTests }

// === LANCEMENT SI EXÉCUTÉ DIRECTEMENT ===
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllTests()
    .then(results => {
      console.log('\n🏁 Génération terminée avec succès !')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Erreur lors de la génération:', error)
      process.exit(1)
    })
}
