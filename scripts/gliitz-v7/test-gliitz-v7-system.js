#!/usr/bin/env node
/**
 * Test du système Gliitz Intelligence Core v7.0
 * Script de test complet pour valider tous les modules
 */

import { GliitzIntelligenceOrchestrator } from './gliitz-intelligence-orchestrator.js'
import chalk from 'chalk'

async function testGliitzV7System() {
  console.log(chalk.bold.cyan('\n🧪 TEST COMPLET - GLIITZ INTELLIGENCE CORE v7.0'))
  console.log(chalk.cyan('=' * 70))
  
  const orchestrator = new GliitzIntelligenceOrchestrator()
  
  try {
    // Démarrage du système
    await orchestrator.start()
    
    // Tests de conversation variés
    const testConversations = [
      {
        message: "Bonjour, je cherche un restaurant gastronomique pour ce soir",
        context: { userId: 'user_1', sessionId: 'session_1' },
        expected: { classification: 'gastronomie', intent: 'recherche_restaurant' }
      },
      {
        message: "Je suis stressé par mon travail, j'ai besoin de me détendre",
        context: { userId: 'user_2', sessionId: 'session_2' },
        expected: { emotion: 'stress', intent: 'aide' }
      },
      {
        message: "Organisez-moi une soirée romantique pour mon anniversaire de mariage",
        context: { userId: 'user_3', sessionId: 'session_3' },
        expected: { emotion: 'joie', classification: 'événement', intent: 'réservation' }
      },
      {
        message: "Trouvez-moi une villa de luxe à Puerto Banús pour mes vacances",
        context: { userId: 'user_4', sessionId: 'session_4' },
        expected: { classification: 'voyage', intent: 'recherche_hébergement' }
      },
      {
        message: "J'ai besoin d'informations sur les activités culturelles à Marbella",
        context: { userId: 'user_5', sessionId: 'session_5' },
        expected: { intent: 'information', classification: 'concierge' }
      }
    ]
    
    console.log(chalk.blue('\n📋 Exécution des tests de conversation...'))
    
    const results = []
    for (let i = 0; i < testConversations.length; i++) {
      const test = testConversations[i]
      console.log(chalk.yellow(`\n  Test ${i + 1}/${testConversations.length}: "${test.message.substring(0, 50)}..."`))
      
      try {
        const startTime = Date.now()
        const result = await orchestrator.processConversation(test.message, test.context)
        const processingTime = Date.now() - startTime
        
        const testResult = {
          testNumber: i + 1,
          message: test.message,
          success: true,
          processingTime,
          metrics: result.performanceMetrics,
          analysis: {
            classification: result.conversation.classification.primary,
            emotion: result.emotionAnalysis.dominant,
            intent: result.conversation.userMessage.intent.intent,
            intelligenceScore: result.semanticAnalysis.overall
          }
        }
        
        results.push(testResult)
        
        console.log(chalk.green(`    ✅ Succès - ${processingTime}ms`))
        console.log(chalk.white(`       Classification: ${testResult.analysis.classification}`))
        console.log(chalk.white(`       Émotion: ${testResult.analysis.emotion}`))
        console.log(chalk.white(`       Intent: ${testResult.analysis.intent}`))
        console.log(chalk.white(`       Score intelligence: ${testResult.analysis.intelligenceScore}/100`))
        
      } catch (error) {
        console.log(chalk.red(`    ❌ Échec: ${error.message}`))
        results.push({
          testNumber: i + 1,
          message: test.message,
          success: false,
          error: error.message
        })
      }
    }
    
    // Test des auto-diagnostics
    console.log(chalk.blue('\n🔍 Test des auto-diagnostics...'))
    try {
      const diagnostics = await orchestrator.runSelfDiagnostics()
      console.log(chalk.green(`✅ Diagnostics exécutés: ${diagnostics.checks.length} vérifications`))
      
      if (diagnostics.issues.length > 0) {
        console.log(chalk.yellow(`⚠️  ${diagnostics.issues.length} issues détectées`))
        diagnostics.issues.forEach(issue => {
          console.log(chalk.yellow(`   - ${issue.name}: ${issue.message}`))
        })
      }
      
      if (diagnostics.repairs.length > 0) {
        console.log(chalk.blue(`🔧 ${diagnostics.repairs.length} réparations effectuées`))
        diagnostics.repairs.forEach(repair => {
          console.log(chalk.blue(`   - ${repair.issue}: ${repair.action}`))
        })
      }
    } catch (error) {
      console.log(chalk.red(`❌ Erreur diagnostics: ${error.message}`))
    }
    
    // Test de génération de rapport de performance
    console.log(chalk.blue('\n📊 Test de génération de rapport de performance...'))
    try {
      const report = await orchestrator.generatePerformanceReport()
      console.log(chalk.green('✅ Rapport de performance généré'))
      
      console.log(chalk.white('\n📈 Métriques de performance actuelles:'))
      console.log(chalk.white(`   Taux de succès: ${report.performance.current.success_rate}%`))
      console.log(chalk.white(`   Score d'intelligence: ${report.performance.current.intelligence_score}/100`))
      console.log(chalk.white(`   Intelligence émotionnelle: ${report.performance.current.emotional_intelligence}/100`))
      console.log(chalk.white(`   Compréhension contextuelle: ${report.performance.current.context_understanding}/100`))
      console.log(chalk.white(`   Précision: ${report.performance.current.precision}/100`))
      console.log(chalk.white(`   Temps de réponse: ${report.performance.current.response_time_ms}ms`))
      
      if (report.recommendations.length > 0) {
        console.log(chalk.yellow('\n💡 Recommandations:'))
        report.recommendations.forEach(rec => {
          console.log(chalk.yellow(`   [${rec.priority.toUpperCase()}] ${rec.recommendation}`))
        })
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Erreur rapport: ${error.message}`))
    }
    
    // Résumé des tests
    console.log(chalk.blue('\n📋 Résumé des tests:'))
    const successfulTests = results.filter(r => r.success).length
    const totalTests = results.length
    const successRate = (successfulTests / totalTests) * 100
    
    console.log(chalk.white(`   Tests exécutés: ${totalTests}`))
    console.log(chalk.green(`   Tests réussis: ${successfulTests}`))
    console.log(chalk.red(`   Tests échoués: ${totalTests - successfulTests}`))
    console.log(chalk.blue(`   Taux de succès: ${successRate.toFixed(1)}%`))
    
    if (successfulTests > 0) {
      const avgProcessingTime = results
        .filter(r => r.success && r.processingTime)
        .reduce((sum, r) => sum + r.processingTime, 0) / successfulTests
      
      console.log(chalk.white(`   Temps de traitement moyen: ${avgProcessingTime.toFixed(0)}ms`))
      
      const avgIntelligenceScore = results
        .filter(r => r.success && r.analysis.intelligenceScore)
        .reduce((sum, r) => sum + r.analysis.intelligenceScore, 0) / successfulTests
      
      console.log(chalk.white(`   Score d'intelligence moyen: ${avgIntelligenceScore.toFixed(1)}/100`))
    }
    
    // Évaluation globale
    console.log(chalk.blue('\n🎯 Évaluation globale du système:'))
    
    if (successRate >= 90 && orchestrator.performanceMetrics.success_rate >= 90) {
      console.log(chalk.bold.green('🏆 EXCELLENT - Système opérationnel à 100%'))
    } else if (successRate >= 80 && orchestrator.performanceMetrics.success_rate >= 80) {
      console.log(chalk.bold.yellow('✅ BON - Système fonctionnel avec quelques améliorations possibles'))
    } else if (successRate >= 70) {
      console.log(chalk.bold.orange('⚠️  MOYEN - Système fonctionnel mais nécessite des améliorations'))
    } else {
      console.log(chalk.bold.red('❌ CRITIQUE - Système nécessite des corrections importantes'))
    }
    
    // Arrêt propre du système
    await orchestrator.stop()
    
    console.log(chalk.bold.green('\n🎉 Tests terminés avec succès !'))
    
  } catch (error) {
    console.error(chalk.red('\n❌ Erreur critique lors des tests:'))
    console.error(chalk.red(error.message))
    console.error(chalk.red(error.stack))
    
    try {
      await orchestrator.stop()
    } catch (stopError) {
      console.error(chalk.red('❌ Erreur lors de l\'arrêt:', stopError.message))
    }
    
    process.exit(1)
  }
}

// Exécution des tests
testGliitzV7System().catch(console.error)


