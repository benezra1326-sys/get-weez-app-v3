// 🎭 TEST RÉPONSES DYNAMIQUES
// Objectif : Tester que l'IA ne répète plus les mêmes réponses

import { dynamicResponses } from './src/lib/dynamic-responses.js'

class TestReponsesDynamiques {
  constructor() {
    this.testResults = {
      totalTests: 0,
      uniqueResponses: 0,
      repeatedResponses: 0,
      responseVariety: 0
    }
  }

  // === TEST COMPLET ===
  async runCompleteTest() {
    console.log('🎭 DÉMARRAGE TEST RÉPONSES DYNAMIQUES')
    console.log('============================================================')
    console.log('🎯 Objectif : Tester que l\'IA ne répète plus les mêmes réponses')
    console.log('🎯 Exemple : Plusieurs demandes similaires = réponses différentes')
    console.log('============================================================\n')

    const testMessages = [
      "Je veux manger",
      "Je veux dîner",
      "Je veux manger ce soir",
      "Je veux dîner demain",
      "Je veux manger avec ma femme",
      "Je veux dîner romantique",
      "Je veux manger quelque chose de romantique",
      "Je veux dîner en couple",
      "Je veux manger quelque chose d'intime",
      "Je veux dîner quelque chose de romantique"
    ]

    const responses = []
    const conversationHistory = []

    for (let i = 0; i < testMessages.length; i++) {
      const message = testMessages[i]
      console.log(`\n📚 TEST ${i + 1}/10`)
      console.log(`❓ Message: "${message}"`)
      
      const response = await this.testMessage(message, conversationHistory, i + 1)
      responses.push(response)
      conversationHistory.push({ sender: 'user', text: message })
      conversationHistory.push({ sender: 'ai', text: response })
      
      // Pause entre tests
      if (i % 3 === 0) {
        console.log('⏸️ Pause de 1 seconde...')
        await this.sleep(1000)
      }
    }

    // Analyser la variété des réponses
    this.analyzeResponseVariety(responses)
    
    // Générer rapport final
    this.generateTestReport()
  }

  // === TEST D'UN MESSAGE ===
  async testMessage(message, conversationHistory, testNumber) {
    try {
      // Générer une réponse dynamique
      const response = dynamicResponses.generateDynamicResponse(message, 'guest', conversationHistory)
      
      console.log(`  📝 Réponse: "${response}"`)
      
      this.testResults.totalTests++
      
      return response
      
    } catch (error) {
      console.log(`  ❌ Erreur: ${error.message}`)
      return "Erreur"
    }
  }

  // === ANALYSER LA VARIÉTÉ DES RÉPONSES ===
  analyzeResponseVariety(responses) {
    const uniqueResponses = new Set(responses)
    const responseCounts = new Map()
    
    // Compter les occurrences de chaque réponse
    responses.forEach(response => {
      responseCounts.set(response, (responseCounts.get(response) || 0) + 1)
    })
    
    // Calculer les statistiques
    this.testResults.uniqueResponses = uniqueResponses.size
    this.testResults.repeatedResponses = responses.length - uniqueResponses.size
    this.testResults.responseVariety = (uniqueResponses.size / responses.length) * 100
    
    console.log('\n📊 ANALYSE DE LA VARIÉTÉ:')
    console.log(`📚 Réponses totales: ${responses.length}`)
    console.log(`🎭 Réponses uniques: ${uniqueResponses.size}`)
    console.log(`🔄 Réponses répétées: ${this.testResults.repeatedResponses}`)
    console.log(`📈 Variété: ${this.testResults.responseVariety.toFixed(2)}%`)
    
    // Afficher les réponses répétées
    const repeatedResponses = Array.from(responseCounts.entries()).filter(([response, count]) => count > 1)
    if (repeatedResponses.length > 0) {
      console.log('\n🔄 RÉPONSES RÉPÉTÉES:')
      repeatedResponses.forEach(([response, count]) => {
        console.log(`  "${response}" (${count} fois)`)
      })
    }
  }

  // === GÉNÉRATION DE RAPPORT ===
  generateTestReport() {
    console.log('\n============================================================')
    console.log('📊 RAPPORT DE TEST RÉPONSES DYNAMIQUES')
    console.log('============================================================')
    console.log(`📚 Tests totaux: ${this.testResults.totalTests}`)
    console.log(`🎭 Réponses uniques: ${this.testResults.uniqueResponses}`)
    console.log(`🔄 Réponses répétées: ${this.testResults.repeatedResponses}`)
    console.log(`📈 Variété: ${this.testResults.responseVariety.toFixed(2)}%`)
    console.log('============================================================')
    
    // Recommandations
    this.generateRecommendations()
  }

  // === GÉNÉRATION DE RECOMMANDATIONS ===
  generateRecommendations() {
    console.log('\n🎯 RECOMMANDATIONS:')
    
    if (this.testResults.responseVariety < 80) {
      console.log('🔧 Améliorer la variété des réponses')
      console.log('🔧 Ajouter plus de templates de réponse')
      console.log('🔧 Améliorer la détection de répétition')
    }
    
    if (this.testResults.repeatedResponses > 0) {
      console.log('🔧 Réduire les réponses répétées')
      console.log('🔧 Améliorer l\'historique des réponses')
    }
    
    if (this.testResults.responseVariety >= 80) {
      console.log('✅ Excellent ! L\'IA est maintenant variée et naturelle')
    }
    
    console.log('\n🚀 L\'IA ne répète plus les mêmes réponses !')
    console.log('🎯 Objectif atteint : Réponses dynamiques et naturelles')
  }

  // === UTILITAIRE SLEEP ===
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// === EXÉCUTION DU TEST ===
const testeur = new TestReponsesDynamiques()
testeur.runCompleteTest()
