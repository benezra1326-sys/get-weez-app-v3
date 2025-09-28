#!/usr/bin/env node

// Test complet de l'IA Get Weez avec 30 questions variées
import { testWeezAgent } from './lib/openai-optimized.js'

const testQuestions = [
  // Questions de base
  { question: "bonjour", category: "Salutation", expected: "Réponse friendly avec présentation" },
  { question: "salut", category: "Salutation", expected: "Réponse décontractée" },
  { question: "hello", category: "Salutation", expected: "Réponse en anglais" },
  
  // Questions sur les restaurants
  { question: "je veux manger ce soir", category: "Restaurant", expected: "Recommandations spécifiques de restaurants" },
  { question: "un restaurant pour 4 personnes", category: "Restaurant", expected: "Restaurants avec capacité" },
  { question: "je veux du sushi", category: "Restaurant/Plat", expected: "Nobu Marbella ou restaurants japonais" },
  { question: "un endroit avec vue mer", category: "Restaurant/Service", expected: "Restaurants avec vue mer" },
  { question: "je veux du poisson frais", category: "Restaurant/Plat", expected: "Restaurants spécialisés poisson" },
  { question: "un restaurant italien", category: "Restaurant/Cuisine", expected: "Restaurants italiens" },
  
  // Questions sur les plages
  { question: "je veux aller à la plage", category: "Plage", expected: "Recommandations de plages" },
  { question: "trocadero", category: "Plage spécifique", expected: "Description de Trocadero Arena" },
  { question: "une plage calme", category: "Plage/Ambiance", expected: "Plages tranquilles" },
  { question: "nikki beach", category: "Plage spécifique", expected: "Description de Nikki Beach" },
  { question: "je veux des transats", category: "Plage/Service", expected: "Plages avec transats" },
  
  // Questions sur les clubs
  { question: "je veux sortir ce soir", category: "Club", expected: "Recommandations de clubs" },
  { question: "un endroit avec de la musique", category: "Club/Service", expected: "Clubs avec musique" },
  { question: "je veux danser", category: "Club/Activité", expected: "Clubs avec piste de danse" },
  { question: "olivia valere", category: "Club spécifique", expected: "Description d'Olivia Valere" },
  
  // Questions sur les services
  { question: "je veux un spa", category: "Service/Spa", expected: "Endroits avec spa" },
  { question: "un endroit avec piscine", category: "Service/Piscine", expected: "Endroits avec piscine" },
  { question: "je veux des cocktails", category: "Service/Bar", expected: "Endroits avec cocktails" },
  { question: "un endroit avec terrasse", category: "Service/Terrasse", expected: "Endroits avec terrasse" },
  
  // Questions complexes
  { question: "je veux un yacht pour une semaine", category: "Yacht", expected: "Recommandations de yachts" },
  { question: "une villa pour 10 personnes", category: "Villa", expected: "Villas avec capacité" },
  { question: "je veux organiser un EVG", category: "Événement", expected: "Services pour EVG" },
  { question: "je ne sais pas ce que je veux", category: "Général", expected: "Suggestions variées" },
  
  // Questions d'erreur/cas limites
  { question: "", category: "Erreur", expected: "Gestion du message vide" },
  { question: "xyzabc123", category: "Erreur", expected: "Gestion de l'incompréhension" },
  { question: "je veux quelque chose de très spécifique qui n'existe pas", category: "Erreur", expected: "Demande de précisions" },
  { question: "combien ça coûte ?", category: "Prix", expected: "Informations tarifaires" },
  { question: "où est-ce situé ?", category: "Localisation", expected: "Informations géographiques" },
  { question: "c'est ouvert quand ?", category: "Horaires", expected: "Informations horaires" }
]

async function runCompleteTest() {
  console.log('🧪 TEST COMPLET DE L\'IA GET WEEZ')
  console.log('=' .repeat(80))
  console.log(`📊 Nombre de questions: ${testQuestions.length}`)
  console.log('=' .repeat(80))
  
  const results = []
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < testQuestions.length; i++) {
    const { question, category, expected } = testQuestions[i]
    
    console.log(`\n📝 QUESTION ${i + 1}/${testQuestions.length}`)
    console.log(`📂 Catégorie: ${category}`)
    console.log(`❓ Question: "${question}"`)
    console.log(`🎯 Attendu: ${expected}`)
    console.log('-' .repeat(60))
    
    try {
      const response = await testWeezAgent(question)
      
      if (response && response.length > 0) {
        console.log(`✅ RÉUSSITE: Réponse générée (${response.length} caractères)`)
        successCount++
        
        // Analyser la qualité de la réponse
        const quality = analyzeResponseQuality(response, expected, category)
        results.push({
          question,
          category,
          expected,
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
          category,
          expected,
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
        category,
        expected,
        response: '',
        quality: { score: 0, comment: 'Erreur technique' },
        status: 'error'
      })
    }
    
    // Pause entre les tests pour éviter la surcharge
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Rapport final
  console.log('\n' + '=' .repeat(80))
  console.log('📊 RAPPORT FINAL')
  console.log('=' .repeat(80))
  console.log(`✅ Réussites: ${successCount}/${testQuestions.length} (${Math.round(successCount/testQuestions.length*100)}%)`)
  console.log(`❌ Échecs: ${errorCount}/${testQuestions.length} (${Math.round(errorCount/testQuestions.length*100)}%)`)
  
  // Analyse par catégorie
  const categoryStats = {}
  results.forEach(result => {
    if (!categoryStats[result.category]) {
      categoryStats[result.category] = { total: 0, success: 0, avgQuality: 0 }
    }
    categoryStats[result.category].total++
    if (result.status === 'success') {
      categoryStats[result.category].success++
      categoryStats[result.category].avgQuality += result.quality.score
    }
  })
  
  console.log('\n📈 STATISTIQUES PAR CATÉGORIE:')
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const successRate = Math.round(stats.success/stats.total*100)
    const avgQuality = stats.success > 0 ? Math.round(stats.avgQuality/stats.success) : 0
    console.log(`  ${category}: ${successRate}% réussite, qualité moyenne: ${avgQuality}/10`)
  })
  
  // Problèmes identifiés
  console.log('\n🚨 PROBLÈMES IDENTIFIÉS:')
  const problems = results.filter(r => r.status === 'error' || r.quality.score < 5)
  if (problems.length > 0) {
    problems.forEach(problem => {
      console.log(`  - "${problem.question}" (${problem.category}): ${problem.quality.comment}`)
    })
  } else {
    console.log('  ✅ Aucun problème majeur identifié!')
  }
  
  console.log('\n🎯 RECOMMANDATIONS:')
  if (successCount/testQuestions.length < 0.8) {
    console.log('  - Améliorer le système de fallback')
  }
  if (errorCount > 0) {
    console.log('  - Corriger les erreurs techniques')
  }
  console.log('  - Continuer les tests avec des questions réelles d\'utilisateurs')
  
  console.log('\n' + '=' .repeat(80))
  return results
}

// Fonction pour analyser la qualité de la réponse
function analyzeResponseQuality(response, expected, category) {
  let score = 5 // Score de base
  
  // Vérifier la longueur
  if (response.length < 20) {
    score -= 2
  } else if (response.length > 200) {
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
runCompleteTest().catch(console.error)
