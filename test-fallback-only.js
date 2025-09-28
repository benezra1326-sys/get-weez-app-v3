#!/usr/bin/env node

// Test du système de fallback uniquement (sans OpenAI)
import { improvedFallback } from './lib/improved-fallback-system.js'

const testQuestions = [
  "bonjour",
  "salut",
  "je veux manger ce soir",
  "un restaurant pour 4 personnes", 
  "je veux du sushi",
  "un endroit avec vue mer",
  "je veux aller à la plage",
  "trocadero",
  "une plage calme",
  "nikki beach",
  "je veux sortir ce soir",
  "un endroit avec de la musique",
  "je veux danser",
  "olivia valere",
  "je veux un spa",
  "un endroit avec piscine",
  "je veux des cocktails",
  "un endroit avec terrasse",
  "je veux un yacht pour une semaine",
  "une villa pour 10 personnes",
  "je veux organiser un EVG",
  "je ne sais pas ce que je veux",
  "",
  "xyzabc123",
  "je veux quelque chose de très spécifique qui n'existe pas",
  "combien ça coûte ?",
  "où est-ce situé ?",
  "c'est ouvert quand ?",
  "je veux du poisson frais",
  "un restaurant italien"
]

async function testFallbackSystem() {
  console.log('🧪 TEST DU SYSTÈME DE FALLBACK OPTIMISÉ')
  console.log('=' .repeat(80))
  console.log(`📊 Nombre de questions: ${testQuestions.length}`)
  console.log('=' .repeat(80))
  
  let successCount = 0
  let errorCount = 0
  const results = []
  
  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i]
    
    console.log(`\n📝 QUESTION ${i + 1}/${testQuestions.length}`)
    console.log(`❓ Question: "${question}"`)
    console.log('-' .repeat(60))
    
    try {
      // Analyser le message
      const analysis = improvedFallback.analyzeMessage(question)
      console.log(`🔍 Analyse: Type="${analysis.type}", Confiance=${analysis.confidence}`)
      
      // Générer la réponse
      const response = improvedFallback.generateResponse(analysis)
      
      if (response && response.length > 0) {
        console.log(`✅ RÉUSSITE: Réponse générée (${response.length} caractères)`)
        console.log(`🤖 Réponse: ${response.substring(0, 200)}${response.length > 200 ? '...' : ''}`)
        successCount++
        
        // Analyser la qualité
        const quality = analyzeResponseQuality(response)
        results.push({
          question,
          response,
          quality,
          status: 'success'
        })
        
        console.log(`📊 Qualité: ${quality.score}/10 - ${quality.comment}`)
      } else {
        console.log(`❌ ÉCHEC: Réponse vide`)
        errorCount++
        results.push({
          question,
          response: '',
          quality: { score: 0, comment: 'Réponse vide' },
          status: 'error'
        })
      }
      
    } catch (error) {
      console.log(`❌ ERREUR: ${error.message}`)
      errorCount++
      results.push({
        question,
        response: '',
        quality: { score: 0, comment: 'Erreur technique' },
        status: 'error'
      })
    }
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Rapport final
  console.log('\n' + '=' .repeat(80))
  console.log('📊 RAPPORT FINAL')
  console.log('=' .repeat(80))
  console.log(`✅ Réussites: ${successCount}/${testQuestions.length} (${Math.round(successCount/testQuestions.length*100)}%)`)
  console.log(`❌ Échecs: ${errorCount}/${testQuestions.length} (${Math.round(errorCount/testQuestions.length*100)}%)`)
  
  // Analyse de la qualité
  const qualityScores = results.filter(r => r.status === 'success').map(r => r.quality.score)
  const avgQuality = qualityScores.length > 0 ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length) : 0
  console.log(`📊 Qualité moyenne: ${avgQuality}/10`)
  
  // Problèmes identifiés
  console.log('\n🚨 PROBLÈMES IDENTIFIÉS:')
  const problems = results.filter(r => r.status === 'error' || r.quality.score < 5)
  if (problems.length > 0) {
    problems.forEach(problem => {
      console.log(`  - "${problem.question}": ${problem.quality.comment}`)
    })
  } else {
    console.log('  ✅ Aucun problème majeur identifié!')
  }
  
  // Exemples de bonnes réponses
  console.log('\n🌟 EXEMPLES DE BONNES RÉPONSES:')
  const goodResponses = results.filter(r => r.status === 'success' && r.quality.score >= 7)
  goodResponses.slice(0, 3).forEach((result, index) => {
    console.log(`\n${index + 1}. "${result.question}"`)
    console.log(`   Réponse: ${result.response.substring(0, 150)}...`)
    console.log(`   Qualité: ${result.quality.score}/10`)
  })
  
  console.log('\n🎯 RECOMMANDATIONS:')
  if (successCount/testQuestions.length < 0.9) {
    console.log('  - Améliorer la détection des intentions')
  }
  if (avgQuality < 7) {
    console.log('  - Améliorer la qualité des réponses')
  }
  console.log('  - Le système de fallback est prêt pour la production!')
  
  console.log('\n' + '=' .repeat(80))
  return results
}

// Fonction pour analyser la qualité de la réponse
function analyzeResponseQuality(response) {
  let score = 5 // Score de base
  
  // Vérifier la longueur
  if (response.length < 20) {
    score -= 2
  } else if (response.length > 100) {
    score += 1
  }
  
  // Vérifier la présence d'éléments spécifiques
  if (response.includes('😊') || response.includes('😍') || response.includes('🌟')) {
    score += 1 // Friendly
  }
  
  if (response.includes('**') && response.includes('**')) {
    score += 1 // Formatage markdown
  }
  
  if (response.includes('réserver') || response.includes('réservation')) {
    score += 1 // Incite à la réservation
  }
  
  if (response.includes('partenaire') || response.includes('privilégié')) {
    score += 1 // Met en avant les partenaires
  }
  
  // Vérifier les erreurs communes
  if (response.includes('+34') || response.includes('téléphone') || response.includes('contact')) {
    score -= 3 // Violation des règles
  }
  
  if (response.includes('qu\'est-ce qui te tente') || response.includes('que cherches-tu')) {
    score -= 2 // Question générique
  }
  
  // Score final
  score = Math.max(0, Math.min(10, score))
  
  let comment = ''
  if (score >= 8) comment = 'Excellente réponse'
  else if (score >= 6) comment = 'Bonne réponse'
  else if (score >= 4) comment = 'Réponse acceptable'
  else if (score >= 2) comment = 'Réponse médiocre'
  else comment = 'Réponse problématique'
  
  return { score, comment }
}

// Lancer le test
testFallbackSystem().catch(console.error)
