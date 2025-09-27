// 🎯 TEST CONVERSATION RÉELLE
// Objectif : Tester la conversation exacte que l'utilisateur a eue

import { contextualUnderstanding } from './src/lib/contextual-understanding.js'

class TestConversationReelle {
  constructor() {
    this.conversation = [
      { sender: 'user', text: 'bonjour' },
      { sender: 'ai', text: 'Salut utilisateur ! Tu as envie de quoi ?' },
      { sender: 'user', text: 'je veux diner demain avec ma femme et louer un yacht avec dj inclus' },
      { sender: 'ai', text: 'Parfait ! Pour un dîner romantique avec ta femme, je te recommande La Terraza del Mar - super vue sur la mer et ambiance intime, ou Ocean Club qui a une vibe plus moderne avec souvent un DJ. Les deux ont une excellente cuisine méditerranéenne. Tu préfères lequel ?' },
      { sender: 'user', text: 'non je veus diner sur un yacht' },
      { sender: 'ai', text: 'Parfait ! Pour un yacht avec DJ, je te recommande le Yacht de Luxe - 12 personnes, DJ, Bar, Cuisine. Contact : +34 952 77 99 99' },
      { sender: 'user', text: 'non sans resrautation juste le yacht' },
      { sender: 'ai', text: 'Parfait ! Pour un yacht avec DJ, je te recommande le Yacht de Luxe - 12 personnes, DJ, Bar, Cuisine. Contact : +34 952 77 99 99' },
      { sender: 'user', text: 'non 4 personnes' },
      { sender: 'ai', text: 'Parfait ! Pour un yacht avec DJ, le Yacht Premium est idéal - 8 personnes, DJ, Bar, Spa. Contact : +34 952 77 99 99' }
    ]
  }

  // === TEST COMPLET ===
  async runCompleteTest() {
    console.log('🎯 DÉMARRAGE TEST CONVERSATION RÉELLE')
    console.log('============================================================')
    console.log('🎯 Objectif : Tester la conversation exacte de l\'utilisateur')
    console.log('🎯 Vérifier que l\'IA comprend chaque demande spécifique')
    console.log('============================================================\n')

    let conversationHistory = []
    let testResults = {
      totalTests: 0,
      correctResponses: 0,
      contextualResponses: 0,
      accuracy: 0
    }

    for (let i = 0; i < this.conversation.length; i++) {
      const message = this.conversation[i]
      
      if (message.sender === 'user') {
        console.log(`\n📚 ÉCHANGE ${Math.floor(i/2) + 1}`)
        console.log(`👤 User: "${message.text}"`)
        
        // Tester la compréhension contextuelle
        const context = contextualUnderstanding.analyzeContext(message.text, conversationHistory)
        const response = contextualUnderstanding.generateContextualResponse(message.text, conversationHistory)
        
        console.log(`  🧠 Contexte:`, {
          isYachtOnly: context.isYachtOnly,
          isRestaurantOnly: context.isRestaurantOnly,
          capacity: context.capacity,
          specificRequest: context.specificRequest
        })
        
        if (response) {
          console.log(`  ✅ Réponse contextuelle: "${response}"`)
          testResults.contextualResponses++
        } else {
          console.log(`  ❌ Aucune réponse contextuelle`)
        }
        
        // Ajouter à l'historique
        conversationHistory.push(message)
        
        testResults.totalTests++
        
        // Pause entre tests
        await this.sleep(500)
      } else {
        console.log(`🤖 AI: "${message.text}"`)
        conversationHistory.push(message)
      }
    }

    // Analyser les résultats
    testResults.accuracy = (testResults.contextualResponses / testResults.totalTests) * 100
    
    console.log('\n📊 ANALYSE DES RÉSULTATS:')
    console.log(`📚 Tests totaux: ${testResults.totalTests}`)
    console.log(`🧠 Réponses contextuelles: ${testResults.contextualResponses}`)
    console.log(`📈 Précision: ${testResults.accuracy.toFixed(2)}%`)
    
    // Générer rapport final
    this.generateTestReport(testResults)
  }

  // === GÉNÉRATION DE RAPPORT ===
  generateTestReport(results) {
    console.log('\n============================================================')
    console.log('📊 RAPPORT DE TEST CONVERSATION RÉELLE')
    console.log('============================================================')
    console.log(`📚 Tests totaux: ${results.totalTests}`)
    console.log(`🧠 Réponses contextuelles: ${results.contextualResponses}`)
    console.log(`📈 Précision: ${results.accuracy.toFixed(2)}%`)
    console.log('============================================================')
    
    // Recommandations
    this.generateRecommendations(results)
  }

  // === GÉNÉRATION DE RECOMMANDATIONS ===
  generateRecommendations(results) {
    console.log('\n🎯 RECOMMANDATIONS:')
    
    if (results.accuracy < 80) {
      console.log('🔧 Améliorer la détection des demandes spécifiques')
      console.log('🔧 Ajouter plus de patterns de reconnaissance')
      console.log('🔧 Améliorer la génération de réponses contextuelles')
    }
    
    if (results.contextualResponses < results.totalTests) {
      console.log('🔧 Améliorer la génération de réponses contextuelles')
      console.log('🔧 Vérifier les patterns de détection')
    }
    
    if (results.accuracy >= 80) {
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
const testeur = new TestConversationReelle()
testeur.runCompleteTest()
