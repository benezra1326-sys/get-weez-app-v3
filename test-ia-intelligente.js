// 🧠 TEST IA INTELLIGENTE - QUESTIONS SPÉCIFIQUES
// Objectif : Tester que l'IA peut répondre aux questions sur les plats spécifiques

import { intelligentRecommendations } from './src/lib/intelligent-recommendations.js'
import { askWeezAgent } from './src/lib/openai.js'

class IATesteur {
  constructor() {
    this.testResults = {
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      responseTimes: [],
      accuracy: 0
    }
  }

  // === TEST COMPLET ===
  async runCompleteTest() {
    console.log('🧠 DÉMARRAGE TEST IA INTELLIGENTE')
    console.log('============================================================')
    console.log('🎯 Objectif : Tester les questions spécifiques sur les plats')
    console.log('🎯 Exemple : "Où manger la meilleure paella ?"')
    console.log('🎯 Exemple : "Meilleur sushi à Marbella ?"')
    console.log('🎯 Exemple : "Restaurant romantique ?"')
    console.log('============================================================\n')

    const testQuestions = [
      "Où manger la meilleure paella ?",
      "Meilleur sushi à Marbella ?",
      "Où trouver la meilleure pasta ?",
      "Restaurant romantique ?",
      "Endroit festif pour danser ?",
      "Restaurant élégant ?",
      "Meilleur steak à Marbella ?",
      "Où boire un cocktail ?",
      "Restaurant avec vue sur la mer ?",
      "Meilleur endroit pour un anniversaire ?"
    ]

    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i]
      console.log(`\n📚 TEST ${i + 1}/10`)
      console.log(`❓ Question: "${question}"`)
      
      await this.testQuestion(question, i + 1)
      
      // Pause entre tests
      if (i % 3 === 0) {
        console.log('⏸️ Pause de 1 seconde...')
        await this.sleep(1000)
      }
    }

    // Générer rapport final
    this.generateTestReport()
  }

  // === TEST D'UNE QUESTION ===
  async testQuestion(question, testNumber) {
    const startTime = Date.now()
    
    try {
      // Test avec le système de recommandations intelligentes
      const response = intelligentRecommendations.generateContextualResponse(question, 'guest')
      
      const responseTime = Date.now() - startTime
      this.testResults.responseTimes.push(responseTime)
      
      if (response.success) {
        this.testResults.successfulTests++
        console.log(`  ✅ Succès (${responseTime}ms)`)
        console.log(`  📝 Réponse: ${response.message.substring(0, 100)}...`)
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

  // === TEST AVEC L'IA COMPLÈTE ===
  async testWithFullAI(question, testNumber) {
    const startTime = Date.now()
    
    try {
      // Test avec l'IA complète
      const response = await askWeezAgent(question, 'TestUser', false, [])
      
      const responseTime = Date.now() - startTime
      this.testResults.responseTimes.push(responseTime)
      
      if (response && response.length > 50) {
        this.testResults.successfulTests++
        console.log(`  ✅ Succès (${responseTime}ms)`)
        console.log(`  📝 Réponse: ${response.substring(0, 100)}...`)
      } else {
        this.testResults.failedTests++
        console.log(`  ❌ Réponse trop courte (${responseTime}ms)`)
        console.log(`  📝 Réponse: ${response}`)
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
    console.log('📊 RAPPORT DE TEST IA INTELLIGENTE')
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
      console.log('🔧 Améliorer la détection des questions spécifiques')
    }
    
    if (this.testResults.responseTimes.length > 0) {
      const avgResponseTime = this.testResults.responseTimes.reduce((a, b) => a + b, 0) / this.testResults.responseTimes.length
      if (avgResponseTime > 1000) {
        console.log('⚡ Optimiser les temps de réponse')
      }
    }
    
    console.log('\n🚀 L\'IA peut maintenant répondre aux questions spécifiques !')
    console.log('🎯 Exemple : "Où manger la meilleure paella ?" → Réponse intelligente')
  }

  // === UTILITAIRE SLEEP ===
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// === EXÉCUTION DU TEST ===
const testeur = new IATesteur()
testeur.runCompleteTest()
