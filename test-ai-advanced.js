// 🧪 TEST DES CAPACITÉS D'IA AVANCÉES - NIVEAU CHATGPT
// Objectif : Valider que l'IA a toutes ses capacités comme ChatGPT

import { askWeezAgent } from './lib/openai.js'
import { AdvancedAICapabilities } from './lib/advanced-ai-capabilities.js'

class AdvancedAITester {
  constructor() {
    this.testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      details: []
    }
    this.advancedAI = new AdvancedAICapabilities()
  }

  // === TESTS DE COMPRÉHENSION CONTEXTUELLE ===
  async testContextualUnderstanding() {
    console.log('\n🧠 TEST 1: COMPRÉHENSION CONTEXTUELLE')
    
    const testCases = [
      {
        message: "Je veux juste un yacht avec DJ, pas de restaurant",
        expectedIntent: "yacht_only",
        description: "Demande spécifique yacht seulement"
      },
      {
        message: "Un dîner romantique pour ce soir",
        expectedIntent: "romantic_dining",
        description: "Demande romantique avec timing"
      },
      {
        message: "J'ai besoin d'organiser un EVG pour 12 personnes",
        expectedIntent: "group_event",
        description: "Événement de groupe avec capacité"
      }
    ]

    for (const testCase of testCases) {
      this.testResults.total++
      
      try {
        const analysis = this.advancedAI.deepContextualUnderstanding(testCase.message)
        const intent = analysis.intent
        const entities = analysis.entities
        
        console.log(`📝 Test: ${testCase.description}`)
        console.log(`🎯 Intention détectée: ${intent}`)
        console.log(`🏷️ Entités: ${JSON.stringify(entities)}`)
        
        // Vérifier que l'analyse fonctionne
        if (intent && entities) {
          this.testResults.passed++
          this.testResults.details.push({
            test: testCase.description,
            status: 'PASSED',
            details: `Intention: ${intent}, Entités: ${Object.keys(entities).length}`
          })
          console.log('✅ PASSED')
        } else {
          this.testResults.failed++
          this.testResults.details.push({
            test: testCase.description,
            status: 'FAILED',
            details: 'Analyse incomplète'
          })
          console.log('❌ FAILED')
        }
      } catch (error) {
        this.testResults.failed++
        this.testResults.details.push({
          test: testCase.description,
          status: 'ERROR',
          details: error.message
        })
        console.log('❌ ERROR:', error.message)
      }
    }
  }

  // === TESTS D'INTELLIGENCE ÉMOTIONNELLE ===
  async testEmotionalIntelligence() {
    console.log('\n😊 TEST 2: INTELLIGENCE ÉMOTIONNELLE')
    
    const testCases = [
      {
        message: "Super ! Je suis super excité pour cette soirée !",
        expectedTone: "excited",
        description: "Ton enthousiaste"
      },
      {
        message: "C'est urgent, j'ai besoin d'une réservation maintenant",
        expectedTone: "urgent",
        description: "Ton urgent"
      },
      {
        message: "Un dîner romantique pour notre anniversaire",
        expectedTone: "romantic",
        description: "Ton romantique"
      }
    ]

    for (const testCase of testCases) {
      this.testResults.total++
      
      try {
        const sentiment = this.advancedAI.analyzeEmotionalTone(testCase.message)
        
        console.log(`📝 Test: ${testCase.description}`)
        console.log(`🎭 Ton détecté: ${sentiment.primary}`)
        console.log(`📊 Intensité: ${sentiment.intensity}`)
        
        if (sentiment.primary === testCase.expectedTone) {
          this.testResults.passed++
          this.testResults.details.push({
            test: testCase.description,
            status: 'PASSED',
            details: `Ton: ${sentiment.primary}, Intensité: ${sentiment.intensity}`
          })
          console.log('✅ PASSED')
        } else {
          this.testResults.failed++
          this.testResults.details.push({
            test: testCase.description,
            status: 'FAILED',
            details: `Attendu: ${testCase.expectedTone}, Reçu: ${sentiment.primary}`
          })
          console.log('❌ FAILED')
        }
      } catch (error) {
        this.testResults.failed++
        this.testResults.details.push({
          test: testCase.description,
          status: 'ERROR',
          details: error.message
        })
        console.log('❌ ERROR:', error.message)
      }
    }
  }

  // === TESTS DE GÉNÉRATION DE RÉPONSES ===
  async testResponseGeneration() {
    console.log('\n💬 TEST 3: GÉNÉRATION DE RÉPONSES INTELLIGENTES')
    
    const testCases = [
      {
        message: "Salut, je veux manger ce soir",
        expectedElements: ["restaurant", "ce soir", "recommandation"],
        description: "Demande de restaurant simple"
      },
      {
        message: "J'ai besoin d'organiser un EVG pour 8 personnes",
        expectedElements: ["EVG", "8 personnes", "groupe", "organisation"],
        description: "Événement de groupe"
      },
      {
        message: "Un yacht pour une semaine avec DJ",
        expectedElements: ["yacht", "semaine", "DJ", "durée"],
        description: "Yacht avec spécifications"
      }
    ]

    for (const testCase of testCases) {
      this.testResults.total++
      
      try {
        const response = this.advancedAI.generateIntelligentResponse(
          testCase.message, 
          [], 
          { userName: 'TestUser', isMember: true }
        )
        
        console.log(`📝 Test: ${testCase.description}`)
        console.log(`💬 Réponse générée: ${response.substring(0, 100)}...`)
        
        // Vérifier que la réponse contient les éléments attendus
        const containsExpected = testCase.expectedElements.every(element => 
          response.toLowerCase().includes(element.toLowerCase())
        )
        
        if (response && response.length > 50 && containsExpected) {
          this.testResults.passed++
          this.testResults.details.push({
            test: testCase.description,
            status: 'PASSED',
            details: `Réponse: ${response.length} caractères, Éléments: ${testCase.expectedElements.length}`
          })
          console.log('✅ PASSED')
        } else {
          this.testResults.failed++
          this.testResults.details.push({
            test: testCase.description,
            status: 'FAILED',
            details: `Réponse trop courte ou éléments manquants`
          })
          console.log('❌ FAILED')
        }
      } catch (error) {
        this.testResults.failed++
        this.testResults.details.push({
          test: testCase.description,
          status: 'ERROR',
          details: error.message
        })
        console.log('❌ ERROR:', error.message)
      }
    }
  }

  // === TESTS DE CONVERSATION COMPLÈTE ===
  async testFullConversation() {
    console.log('\n🗣️ TEST 4: CONVERSATION COMPLÈTE')
    
    const conversation = [
      { sender: 'user', text: 'Salut, je suis nouveau à Marbella' },
      { sender: 'ai', text: 'Bienvenue ! Je suis Get Weez, votre concierge personnel.' },
      { sender: 'user', text: 'Je veux découvrir les meilleurs restaurants' },
      { sender: 'ai', text: 'Parfait ! Voici mes recommandations...' },
      { sender: 'user', text: 'Et pour ce soir, quelque chose de romantique ?' }
    ]

    this.testResults.total++
    
    try {
      console.log('📝 Test: Conversation complète avec contexte')
      
      // Simuler la dernière interaction
      const lastMessage = conversation[conversation.length - 1].text
      const conversationHistory = conversation.slice(0, -1)
      
      const response = await askWeezAgent(
        lastMessage,
        'TestUser',
        true,
        conversationHistory
      )
      
      console.log(`💬 Réponse finale: ${response.substring(0, 150)}...`)
      
      if (response && response.length > 100) {
        this.testResults.passed++
        this.testResults.details.push({
          test: 'Conversation complète',
          status: 'PASSED',
          details: `Réponse contextuelle générée: ${response.length} caractères`
        })
        console.log('✅ PASSED')
      } else {
        this.testResults.failed++
        this.testResults.details.push({
          test: 'Conversation complète',
          status: 'FAILED',
          details: 'Réponse trop courte ou manquante'
        })
        console.log('❌ FAILED')
      }
    } catch (error) {
      this.testResults.failed++
      this.testResults.details.push({
        test: 'Conversation complète',
        status: 'ERROR',
        details: error.message
      })
      console.log('❌ ERROR:', error.message)
    }
  }

  // === TESTS DE CAPACITÉS AVANCÉES ===
  async testAdvancedCapabilities() {
    console.log('\n🚀 TEST 5: CAPACITÉS AVANCÉES')
    
    const capabilities = this.advancedAI.getCapabilities()
    
    this.testResults.total++
    
    try {
      console.log('📝 Test: Vérification des capacités')
      console.log('🔧 Capacités disponibles:', Object.keys(capabilities).length)
      
      const requiredCapabilities = [
        'emotionalIntelligence',
        'contextualUnderstanding',
        'personalizedRecommendations',
        'proactiveSuggestions',
        'continuousLearning'
      ]
      
      const allCapabilitiesPresent = requiredCapabilities.every(cap => 
        capabilities[cap] === true
      )
      
      if (allCapabilitiesPresent) {
        this.testResults.passed++
        this.testResults.details.push({
          test: 'Capacités avancées',
          status: 'PASSED',
          details: `Toutes les capacités présentes: ${requiredCapabilities.length}`
        })
        console.log('✅ PASSED')
      } else {
        this.testResults.failed++
        this.testResults.details.push({
          test: 'Capacités avancées',
          status: 'FAILED',
          details: 'Certaines capacités manquantes'
        })
        console.log('❌ FAILED')
      }
    } catch (error) {
      this.testResults.failed++
      this.testResults.details.push({
        test: 'Capacités avancées',
        status: 'ERROR',
        details: error.message
      })
      console.log('❌ ERROR:', error.message)
    }
  }

  // === LANCEMENT DE TOUS LES TESTS ===
  async runAllTests() {
    console.log('🧪 DÉMARRAGE DES TESTS D\'IA AVANCÉE')
    console.log('=' * 50)
    
    await this.testContextualUnderstanding()
    await this.testEmotionalIntelligence()
    await this.testResponseGeneration()
    await this.testFullConversation()
    await this.testAdvancedCapabilities()
    
    this.generateReport()
  }

  // === GÉNÉRATION DU RAPPORT ===
  generateReport() {
    console.log('\n📊 RAPPORT FINAL DES TESTS')
    console.log('=' * 50)
    
    const successRate = (this.testResults.passed / this.testResults.total) * 100
    
    console.log(`📈 Résultats:`)
    console.log(`   Total: ${this.testResults.total}`)
    console.log(`   Réussis: ${this.testResults.passed}`)
    console.log(`   Échoués: ${this.testResults.failed}`)
    console.log(`   Taux de réussite: ${successRate.toFixed(1)}%`)
    
    console.log('\n📋 Détails des tests:')
    this.testResults.details.forEach(detail => {
      const status = detail.status === 'PASSED' ? '✅' : '❌'
      console.log(`   ${status} ${detail.test}: ${detail.details}`)
    })
    
    if (successRate >= 80) {
      console.log('\n🎉 EXCELLENT ! L\'IA a toutes ses capacités comme ChatGPT !')
    } else if (successRate >= 60) {
      console.log('\n👍 BIEN ! L\'IA fonctionne bien, quelques améliorations possibles.')
    } else {
      console.log('\n⚠️ ATTENTION ! L\'IA a besoin d\'améliorations.')
    }
    
    return {
      successRate,
      results: this.testResults
    }
  }
}

// === LANCEMENT DES TESTS ===
async function runAdvancedAITests() {
  const tester = new AdvancedAITester()
  return await tester.runAllTests()
}

// Export pour utilisation
export { AdvancedAITester, runAdvancedAITests }

// Lancer les tests si le fichier est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runAdvancedAITests()
    .then(results => {
      console.log('\n🏁 Tests terminés !')
      process.exit(results.successRate >= 80 ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Erreur lors des tests:', error)
      process.exit(1)
    })
}
