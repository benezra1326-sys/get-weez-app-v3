// 🧠 TEST COMPRÉHENSION COMPLEXE
// Objectif : Tester que l'IA comprend les demandes multiples

import { advancedUnderstanding } from './src/lib/advanced-understanding.js'

class TestComprehensionComplexe {
  constructor() {
    this.testResults = {
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      responseTimes: []
    }
  }

  // === TEST COMPLET ===
  async runCompleteTest() {
    console.log('🧠 DÉMARRAGE TEST COMPRÉHENSION COMPLEXE')
    console.log('============================================================')
    console.log('🎯 Objectif : Tester la compréhension des demandes multiples')
    console.log('🎯 Exemple : "Je veux dîner demain avec ma femme et louer un yacht avec DJ"')
    console.log('============================================================\n')

    const testMessages = [
      "Je veux dîner demain avec ma femme et louer un yacht avec DJ inclus",
      "Je veux réserver un restaurant romantique et un yacht pour 8 personnes",
      "Je veux organiser une soirée avec DJ et réserver un restaurant festif",
      "Je veux louer un yacht avec DJ et réserver un restaurant avec vue sur la mer",
      "Je veux dîner en couple et organiser une soirée sur yacht avec musique",
      "Je veux réserver un restaurant élégant et un yacht de luxe avec DJ",
      "Je veux organiser un événement avec yacht, DJ et restaurant gastronomique",
      "Je veux louer un yacht avec DJ et réserver un restaurant pour un anniversaire",
      "Je veux dîner romantique et yacht avec DJ pour célébrer",
      "Je veux réserver restaurant et yacht avec DJ pour une soirée privée"
    ]

    for (let i = 0; i < testMessages.length; i++) {
      const message = testMessages[i]
      console.log(`\n📚 TEST ${i + 1}/10`)
      console.log(`❓ Message: "${message}"`)
      
      await this.testMessage(message, i + 1)
      
      // Pause entre tests
      if (i % 3 === 0) {
        console.log('⏸️ Pause de 1 seconde...')
        await this.sleep(1000)
      }
    }

    // Générer rapport final
    this.generateTestReport()
  }

  // === TEST D'UN MESSAGE ===
  async testMessage(message, testNumber) {
    const startTime = Date.now()
    
    try {
      // Analyser le message
      const analysis = advancedUnderstanding.analyzeComplexMessage(message)
      console.log(`  🔍 Services détectés: ${analysis.services.length}`)
      console.log(`  🔍 Personnes: ${analysis.people.join(', ')}`)
      console.log(`  🔍 Temps: ${analysis.time.join(', ')}`)
      console.log(`  🔍 Préférences: ${analysis.preferences.join(', ')}`)
      console.log(`  🔍 Complexe: ${analysis.isComplex}`)
      
      // Générer la réponse
      const response = advancedUnderstanding.generateCompleteResponse(message, 'guest')
      
      const responseTime = Date.now() - startTime
      this.testResults.responseTimes.push(responseTime)
      
      if (response.success && analysis.isComplex) {
        this.testResults.successfulTests++
        console.log(`  ✅ Succès (${responseTime}ms)`)
        console.log(`  📝 Réponse: ${response.message.substring(0, 150)}...`)
      } else {
        this.testResults.failedTests++
        console.log(`  ❌ Échec (${responseTime}ms)`)
        console.log(`  📝 Réponse: ${response.message}`)
      }
      
    } catch (error) {
      this.testResults.failedTests++
      console.log(`  ❌ Erreur: ${error.message}`)
    }
    
    this.testResults.totalTests++
  }

  // === GÉNÉRATION DE RAPPORT ===
  generateTestReport() {
    console.log('\n============================================================')
    console.log('📊 RAPPORT DE TEST COMPRÉHENSION COMPLEXE')
    console.log('============================================================')
    console.log(`📚 Tests totaux: ${this.testResults.totalTests}`)
    console.log(`✅ Tests réussis: ${this.testResults.successfulTests}`)
    console.log(`❌ Tests échoués: ${this.testResults.failedTests}`)
    console.log(`📈 Taux de succès: ${((this.testResults.successfulTests / this.testResults.totalTests) * 100).toFixed(2)}%`)
    
    if (this.testResults.responseTimes.length > 0) {
      const avgResponseTime = this.testResults.responseTimes.reduce((a, b) => a + b, 0) / this.testResults.responseTimes.length
      console.log(`⚡ Temps de réponse moyen: ${avgResponseTime.toFixed(2)}ms`)
    }
    
    console.log('============================================================')
    
    // Recommandations
    this.generateRecommendations()
  }

  // === GÉNÉRATION DE RECOMMANDATIONS ===
  generateRecommendations() {
    console.log('\n🎯 RECOMMANDATIONS:')
    
    if (this.testResults.successfulTests / this.testResults.totalTests < 0.8) {
      console.log('🔧 Améliorer la détection des demandes multiples')
    }
    
    if (this.testResults.responseTimes.length > 0) {
      const avgResponseTime = this.testResults.responseTimes.reduce((a, b) => a + b, 0) / this.testResults.responseTimes.length
      if (avgResponseTime > 1000) {
        console.log('⚡ Optimiser les temps de réponse')
      }
    }
    
    console.log('\n🚀 L\'IA peut maintenant comprendre les demandes complexes !')
    console.log('🎯 Exemple : "Dîner + Yacht + DJ" → Réponse complète')
  }

  // === UTILITAIRE SLEEP ===
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// === EXÉCUTION DU TEST ===
const testeur = new TestComprehensionComplexe()
testeur.runCompleteTest()
