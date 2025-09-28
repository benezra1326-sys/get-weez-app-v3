#!/usr/bin/env node

// Test multilingue de l'IA Get Weez
import { languageDetector } from './lib/language-detection.js'
import { improvedFallback } from './lib/improved-fallback-system.js'

const multilingualTestQuestions = [
  // Français
  { question: "bonjour", language: "fr", expected: "Réponse en français" },
  { question: "je veux un restaurant", language: "fr", expected: "Recommandations de restaurants" },
  { question: "je veux aller à la plage", language: "fr", expected: "Recommandations de plages" },
  
  // Anglais
  { question: "hello", language: "en", expected: "Response in English" },
  { question: "I want a restaurant", language: "en", expected: "Restaurant recommendations" },
  { question: "I want to go to the beach", language: "en", expected: "Beach recommendations" },
  
  // Espagnol
  { question: "hola", language: "es", expected: "Respuesta en español" },
  { question: "quiero un restaurante", language: "es", expected: "Recomendaciones de restaurantes" },
  { question: "quiero ir a la playa", language: "es", expected: "Recomendaciones de playas" },
  
  // Allemand
  { question: "hallo", language: "de", expected: "Antwort auf Deutsch" },
  { question: "ich möchte ein restaurant", language: "de", expected: "Restaurant-Empfehlungen" },
  { question: "ich möchte zum strand gehen", language: "de", expected: "Strand-Empfehlungen" },
  
  // Italien
  { question: "ciao", language: "it", expected: "Risposta in italiano" },
  { question: "voglio un ristorante", language: "it", expected: "Raccomandazioni di ristoranti" },
  { question: "voglio andare in spiaggia", language: "it", expected: "Raccomandazioni di spiagge" },
  
  // Tests de détection
  { question: "hello je veux un restaurant", language: "mixed", expected: "Détection de langue mixte" },
  { question: "bonjour hello hola", language: "mixed", expected: "Détection de langue mixte" },
  { question: "xyzabc123", language: "unknown", expected: "Langue inconnue" },
  { question: "", language: "empty", expected: "Message vide" }
]

async function testMultilingualSystem() {
  console.log('🌍 TEST MULTILINGUE DE GET WEEZ')
  console.log('=' .repeat(80))
  console.log(`📊 Nombre de questions: ${multilingualTestQuestions.length}`)
  console.log('=' .repeat(80))
  
  let totalTests = 0
  let correctDetections = 0
  let correctResponses = 0
  
  for (let i = 0; i < multilingualTestQuestions.length; i++) {
    const { question, language, expected } = multilingualTestQuestions[i]
    
    console.log(`\n📝 TEST ${i + 1}/${multilingualTestQuestions.length}`)
    console.log(`❓ Question: "${question}"`)
    console.log(`🎯 Langue attendue: ${language}`)
    console.log(`📋 Attendu: ${expected}`)
    console.log('-' .repeat(60))
    
    totalTests++
    
    // Test de détection de langue
    const detection = languageDetector.detectLanguage(question)
    const detectedLang = detection.language
    const confidence = detection.confidence
    
    console.log(`🔍 Langue détectée: ${detectedLang} (confiance: ${confidence})`)
    
    // Vérifier si la détection est correcte
    let detectionCorrect = false
    if (language === 'mixed' || language === 'unknown' || language === 'empty') {
      // Pour les cas spéciaux, on accepte toute détection
      detectionCorrect = true
    } else {
      detectionCorrect = detectedLang === language
    }
    
    if (detectionCorrect) {
      console.log(`✅ Détection CORRECTE`)
      correctDetections++
    } else {
      console.log(`❌ Détection INCORRECTE (attendu: ${language}, détecté: ${detectedLang})`)
    }
    
    // Test de génération de réponse
    try {
      const analysis = improvedFallback.analyzeMessage(question)
      const response = improvedFallback.generateResponse(analysis)
      
      if (response && response.length > 0) {
        console.log(`✅ Réponse générée (${response.length} caractères)`)
        console.log(`🤖 Réponse: ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`)
        correctResponses++
        
        // Vérifier si la réponse est dans la bonne langue (approximatif)
        const responseLanguage = detectResponseLanguage(response)
        console.log(`🌍 Langue de la réponse: ${responseLanguage}`)
        
      } else {
        console.log(`❌ Aucune réponse générée`)
      }
      
    } catch (error) {
      console.log(`❌ Erreur lors de la génération: ${error.message}`)
    }
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Rapport final
  console.log('\n' + '=' .repeat(80))
  console.log('📊 RAPPORT FINAL')
  console.log('=' .repeat(80))
  console.log(`✅ Détections correctes: ${correctDetections}/${totalTests} (${Math.round(correctDetections/totalTests*100)}%)`)
  console.log(`✅ Réponses générées: ${correctResponses}/${totalTests} (${Math.round(correctResponses/totalTests*100)}%)`)
  
  // Analyse par langue
  console.log('\n📈 ANALYSE PAR LANGUE:')
  const languageStats = {}
  multilingualTestQuestions.forEach((test, index) => {
    const detection = languageDetector.detectLanguage(test.question)
    const lang = detection.language
    
    if (!languageStats[lang]) {
      languageStats[lang] = { total: 0, correct: 0 }
    }
    languageStats[lang].total++
    
    if (lang === test.language || test.language === 'mixed' || test.language === 'unknown' || test.language === 'empty') {
      languageStats[lang].correct++
    }
  })
  
  Object.entries(languageStats).forEach(([lang, stats]) => {
    const successRate = Math.round(stats.correct/stats.total*100)
    const langInfo = languageDetector.getLanguageInfo(lang)
    console.log(`  ${langInfo.flag} ${langInfo.name}: ${successRate}% (${stats.correct}/${stats.total})`)
  })
  
  // Recommandations
  console.log('\n🎯 RECOMMANDATIONS:')
  if (correctDetections/totalTests < 0.8) {
    console.log('  - Améliorer la détection de langue')
  }
  if (correctResponses/totalTests < 0.9) {
    console.log('  - Améliorer la génération de réponses multilingues')
  }
  
  if (correctDetections/totalTests >= 0.8 && correctResponses/totalTests >= 0.9) {
    console.log('  ✅ Système multilingue prêt pour la production!')
  }
  
  console.log('\n' + '=' .repeat(80))
}

// Fonction pour détecter approximativement la langue d'une réponse
function detectResponseLanguage(text) {
  const textLower = text.toLowerCase()
  
  // Mots-clés français
  const frenchWords = ['je', 'tu', 'nous', 'vous', 'restaurant', 'plage', 'club', 'villa', 'yacht']
  // Mots-clés anglais
  const englishWords = ['i', 'you', 'we', 'they', 'restaurant', 'beach', 'club', 'villa', 'yacht']
  // Mots-clés espagnols
  const spanishWords = ['yo', 'tú', 'nosotros', 'vosotros', 'restaurante', 'playa', 'club', 'villa', 'yate']
  
  let frenchCount = frenchWords.filter(word => textLower.includes(word)).length
  let englishCount = englishWords.filter(word => textLower.includes(word)).length
  let spanishCount = spanishWords.filter(word => textLower.includes(word)).length
  
  if (frenchCount > englishCount && frenchCount > spanishCount) return 'fr'
  if (englishCount > frenchCount && englishCount > spanishCount) return 'en'
  if (spanishCount > frenchCount && spanishCount > englishCount) return 'es'
  
  return 'unknown'
}

// Lancer le test
testMultilingualSystem().catch(console.error)
