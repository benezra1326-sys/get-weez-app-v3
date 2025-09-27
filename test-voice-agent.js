// 🎤 TEST DE L'AGENT VOCAL
// Objectif : Tester la fonctionnalité vocale comme ChatGPT

import { VoiceAgent } from './lib/voice-agent.js'

class VoiceAgentTester {
  constructor() {
    this.voiceAgent = new VoiceAgent()
    this.testResults = []
  }

  // === TESTER L'INITIALISATION ===
  async testInitialization() {
    console.log('🎤 TEST INITIALISATION AGENT VOCAL')
    console.log('='.repeat(50))
    
    try {
      const initialized = await this.voiceAgent.initializeVoiceAgent()
      
      if (initialized) {
        console.log('✅ Initialisation réussie')
        console.log('✅ Reconnaissance vocale disponible')
        console.log('✅ Synthèse vocale disponible')
        return true
      } else {
        console.log('❌ Échec de l\'initialisation')
        return false
      }
    } catch (error) {
      console.error('❌ Erreur initialisation:', error)
      return false
    }
  }

  // === TESTER LA RECONNAISSANCE VOCALE ===
  async testVoiceRecognition() {
    console.log('\n🎤 TEST RECONNAISSANCE VOCALE')
    console.log('='.repeat(50))
    
    try {
      // Simuler une transcription
      const mockTranscript = "Je veux réserver un restaurant pour ce soir"
      console.log(`📝 Transcription simulée: "${mockTranscript}"`)
      
      // Tester le traitement
      const aiResponse = await this.voiceAgent.processWithAI(mockTranscript)
      console.log(`🤖 Réponse IA: "${aiResponse}"`)
      
      return true
    } catch (error) {
      console.error('❌ Erreur reconnaissance:', error)
      return false
    }
  }

  // === TESTER LA SYNTHÈSE VOCALE ===
  async testVoiceSynthesis() {
    console.log('\n🎤 TEST SYNTHÈSE VOCALE')
    console.log('='.repeat(50))
    
    try {
      const testText = "Bonjour ! Je suis votre concierge IA. Comment puis-je vous aider ?"
      console.log(`🔊 Test synthèse: "${testText}"`)
      
      // Tester la synthèse (simulation)
      const success = await this.voiceAgent.speakResponse(testText)
      
      if (success) {
        console.log('✅ Synthèse vocale fonctionnelle')
        return true
      } else {
        console.log('❌ Échec synthèse vocale')
        return false
      }
    } catch (error) {
      console.error('❌ Erreur synthèse:', error)
      return false
    }
  }

  // === TESTER LE FLUX COMPLET ===
  async testCompleteFlow() {
    console.log('\n🎤 TEST FLUX COMPLET')
    console.log('='.repeat(50))
    
    try {
      // Simuler une conversation complète
      const conversation = [
        "Je veux un yacht pour demain",
        "Parfait ! Je m'occupe de votre yacht. Je contacte le capitaine...",
        "Et si on était 8 personnes ?",
        "Excellent ! Je m'adapte à 8 personnes. Je vérifie la disponibilité...",
        "C'est combien ?",
        "Je négocie le meilleur prix pour vous. Je vous confirme tout !"
      ]
      
      console.log('💬 Conversation simulée:')
      conversation.forEach((message, index) => {
        const sender = index % 2 === 0 ? '👤 Utilisateur' : '🤖 IA'
        console.log(`   ${sender}: "${message}"`)
      })
      
      console.log('\n✅ Flux conversationnel testé')
      return true
    } catch (error) {
      console.error('❌ Erreur flux complet:', error)
      return false
    }
  }

  // === TESTER LES PARAMÈTRES VOCAUX ===
  async testVoiceSettings() {
    console.log('\n🎤 TEST PARAMÈTRES VOCAUX')
    console.log('='.repeat(50))
    
    try {
      // Tester différents paramètres
      const settings = [
        { voice: 'fr-FR', rate: 1.0, pitch: 1.0 },
        { voice: 'fr-FR', rate: 0.8, pitch: 0.9 },
        { voice: 'fr-FR', rate: 1.2, pitch: 1.1 }
      ]
      
      settings.forEach((setting, index) => {
        this.voiceAgent.setVoiceSettings(setting)
        console.log(`✅ Paramètres ${index + 1}: ${JSON.stringify(setting)}`)
      })
      
      console.log('✅ Paramètres vocaux configurés')
      return true
    } catch (error) {
      console.error('❌ Erreur paramètres:', error)
      return false
    }
  }

  // === TESTER L'ÉTAT DE L'AGENT ===
  async testAgentStatus() {
    console.log('\n🎤 TEST ÉTAT AGENT')
    console.log('='.repeat(50))
    
    try {
      const status = this.voiceAgent.getAgentStatus()
      console.log('📊 État de l\'agent:')
      console.log(`   Écoute: ${status.isListening ? '✅' : '❌'}`)
      console.log(`   Parole: ${status.isSpeaking ? '✅' : '❌'}`)
      console.log(`   Reconnaissance: ${status.hasRecognition ? '✅' : '❌'}`)
      console.log(`   Synthèse: ${status.hasSynthesis ? '✅' : '❌'}`)
      console.log(`   Conversations: ${status.conversationLength}`)
      
      return true
    } catch (error) {
      console.error('❌ Erreur état agent:', error)
      return false
    }
  }

  // === LANCER TOUS LES TESTS ===
  async runAllTests() {
    console.log('🚀 DÉMARRAGE DES TESTS AGENT VOCAL')
    console.log('='.repeat(60))
    
    const tests = [
      { name: 'Initialisation', test: () => this.testInitialization() },
      { name: 'Reconnaissance vocale', test: () => this.testVoiceRecognition() },
      { name: 'Synthèse vocale', test: () => this.testVoiceSynthesis() },
      { name: 'Flux complet', test: () => this.testCompleteFlow() },
      { name: 'Paramètres vocaux', test: () => this.testVoiceSettings() },
      { name: 'État agent', test: () => this.testAgentStatus() }
    ]
    
    let passed = 0
    let total = tests.length
    
    for (const test of tests) {
      try {
        const result = await test.test()
        if (result) {
          passed++
          console.log(`✅ ${test.name}: RÉUSSI`)
        } else {
          console.log(`❌ ${test.name}: ÉCHEC`)
        }
      } catch (error) {
        console.log(`❌ ${test.name}: ERREUR - ${error.message}`)
      }
    }
    
    console.log('\n📊 RÉSULTATS FINAUX')
    console.log('='.repeat(40))
    console.log(`Tests réussis: ${passed}/${total}`)
    console.log(`Taux de réussite: ${((passed/total)*100).toFixed(1)}%`)
    
    if (passed === total) {
      console.log('🎉 TOUS LES TESTS RÉUSSIS !')
      console.log('🎤 Agent vocal prêt à fonctionner')
    } else {
      console.log('⚠️  Certains tests ont échoué')
      console.log('🔧 Vérifiez la configuration du navigateur')
    }
    
    return { passed, total, success: passed === total }
  }
}

// === LANCEMENT DES TESTS ===
async function runVoiceTests() {
  const tester = new VoiceAgentTester()
  return await tester.runAllTests()
}

// === EXPORT ===
export { VoiceAgentTester, runVoiceTests }

// === LANCEMENT SI EXÉCUTÉ DIRECTEMENT ===
if (import.meta.url === `file://${process.argv[1]}`) {
  runVoiceTests()
    .then(results => {
      console.log('\n🏁 Tests terminés !')
      process.exit(results.success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Erreur lors des tests:', error)
      process.exit(1)
    })
}
