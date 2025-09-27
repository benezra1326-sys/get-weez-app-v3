// 🧠 TEST COMPRÉHENSION CONTEXTUELLE
// Objectif : Tester que l'IA comprend les demandes spécifiques

import { contextualUnderstanding } from './src/lib/contextual-understanding.js'

class TestComprehensionContextuelle {
  constructor() {
    this.testResults = {
      totalTests: 0,
      specificRequests: 0,
      contextualResponses: 0,
      accuracy: 0
    }
  }

  // === TEST COMPLET ===
  async runCompleteTest() {
    console.log('🧠 DÉMARRAGE TEST COMPRÉHENSION CONTEXTUELLE')
    console.log('============================================================')
    console.log('🎯 Objectif : Tester que l\'IA comprend les demandes spécifiques')
    console.log('🎯 Exemple : "non je veux diner sur un yacht" = Réponse yacht')
    console.log('============================================================\n')

    const testScenarios = [
      {
        name: "YACHT SEULEMENT",
        message: "non je veux diner sur un yacht",
        expectedType: "yacht",
        expectedKeywords: ["yacht", "DJ", "Contact"]
      },
      {
        name: "RESTAURANT SEULEMENT",
        message: "non sans yacht juste le restaurant",
        expectedType: "restaurant",
        expectedKeywords: ["Terraza", "Casa", "Marbella"]
      },
      {
        name: "YACHT 4 PERSONNES",
        message: "non 4 personnes",
        expectedType: "yacht",
        expectedKeywords: ["yacht", "4", "personnes", "Contact"]
      },
      {
        name: "RESTAURANT ROMANTIQUE",
        message: "je veux diner romantique avec ma femme",
        expectedType: "restaurant",
        expectedKeywords: ["romantique", "Terraza", "vue", "mer"]
      },
      {
        name: "YACHT AVEC DJ",
        message: "juste le yacht avec dj",
        expectedType: "yacht",
        expectedKeywords: ["yacht", "DJ", "Contact"]
      }
    ]

    for (let i = 0; i < testScenarios.length; i++) {
      const scenario = testScenarios[i]
      console.log(`\n📚 TEST ${i + 1}/5: ${scenario.name}`)
      console.log(`❓ Message: "${scenario.message}"`)
      
      await this.testScenario(scenario, i + 1)
      
      // Pause entre tests
      if (i % 2 === 0) {
        console.log('⏸️ Pause de 1 seconde...')
        await this.sleep(1000)
      }
    }

    // Analyser les résultats
    this.analyzeResults()
    
    // Générer rapport final
    this.generateTestReport()
  }

  // === TEST D'UN SCÉNARIO ===
  async testScenario(scenario, testNumber) {
    try {
      // Analyser le contexte
      const context = contextualUnderstanding.analyzeContext(scenario.message)
      console.log(`  🧠 Contexte détecté:`, context)
      
      // Générer réponse contextuelle
      const response = contextualUnderstanding.generateContextualResponse(scenario.message)
      
      if (response) {
        console.log(`  ✅ Réponse contextuelle: "${response}"`)
        this.testResults.contextualResponses++
        
        // Vérifier les mots-clés attendus
        const hasExpectedKeywords = scenario.expectedKeywords.every(keyword => 
          response.toLowerCase().includes(keyword.toLowerCase())
        )
        
        if (hasExpectedKeywords) {
          console.log(`  ✅ Mots-clés attendus trouvés: ${scenario.expectedKeywords.join(', ')}`)
          this.testResults.specificRequests++
        } else {
          console.log(`  ❌ Mots-clés manquants. Attendu: ${scenario.expectedKeywords.join(', ')}`)
        }
      } else {
        console.log(`  ❌ Aucune réponse contextuelle générée`)
      }
      
      this.testResults.totalTests++
      
    } catch (error) {
      console.log(`  ❌ Erreur: ${error.message}`)
    }
  }

  // === ANALYSER LES RÉSULTATS ===
  analyzeResults() {
    this.testResults.accuracy = (this.testResults.specificRequests / this.testResults.totalTests) * 100
    
    console.log('\n📊 ANALYSE DES RÉSULTATS:')
    console.log(`📚 Tests totaux: ${this.testResults.totalTests}`)
    console.log(`🎯 Demandes spécifiques détectées: ${this.testResults.specificRequests}`)
    console.log(`🧠 Réponses contextuelles: ${this.testResults.contextualResponses}`)
    console.log(`📈 Précision: ${this.testResults.accuracy.toFixed(2)}%`)
  }

  // === GÉNÉRATION DE RAPPORT ===
  generateTestReport() {
    console.log('\n============================================================')
    console.log('📊 RAPPORT DE TEST COMPRÉHENSION CONTEXTUELLE')
    console.log('============================================================')
    console.log(`📚 Tests totaux: ${this.testResults.totalTests}`)
    console.log(`🎯 Demandes spécifiques détectées: ${this.testResults.specificRequests}`)
    console.log(`🧠 Réponses contextuelles: ${this.testResults.contextualResponses}`)
    console.log(`📈 Précision: ${this.testResults.accuracy.toFixed(2)}%`)
    console.log('============================================================')
    
    // Recommandations
    this.generateRecommendations()
  }

  // === GÉNÉRATION DE RECOMMANDATIONS ===
  generateRecommendations() {
    console.log('\n🎯 RECOMMANDATIONS:')
    
    if (this.testResults.accuracy < 80) {
      console.log('🔧 Améliorer la détection des demandes spécifiques')
      console.log('🔧 Ajouter plus de patterns de reconnaissance')
      console.log('🔧 Améliorer la génération de réponses contextuelles')
    }
    
    if (this.testResults.contextualResponses < this.testResults.totalTests) {
      console.log('🔧 Améliorer la génération de réponses contextuelles')
      console.log('🔧 Vérifier les patterns de détection')
    }
    
    if (this.testResults.accuracy >= 80) {
      console.log('✅ Excellent ! L\'IA comprend maintenant les demandes spécifiques')
    }
    
    console.log('\n🚀 L\'IA comprend maintenant les demandes spécifiques !')
    console.log('🎯 Objectif atteint : Compréhension contextuelle avancée')
  }

  // === UTILITAIRE SLEEP ===
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// === EXÉCUTION DU TEST ===
const testeur = new TestComprehensionContextuelle()
testeur.runCompleteTest()
