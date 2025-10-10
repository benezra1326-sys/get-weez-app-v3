import fs from 'fs'
import path from 'path'

/**
 * Analyseur des résultats du test d'audit Gliitz Chat
 * Génère des insights détaillés et des recommandations d'amélioration
 */

function analyzeAuditResults() {
  console.log('🔍 Analyse des résultats du test d\'audit Gliitz Chat...\n')

  // Lire le fichier de résultats
  let results
  try {
    const resultsPath = path.join(__dirname, '..', 'audit-results.json')
    results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
  } catch (error) {
    console.error('❌ Impossible de lire le fichier audit-results.json')
    console.error('Assurez-vous d\'avoir exécuté le test d\'audit d\'abord.')
    return
  }

  // Analyse détaillée
  const analysis = {
    executiveSummary: generateExecutiveSummary(results),
    performanceAnalysis: analyzePerformance(results),
    contextAnalysis: analyzeContextUnderstanding(results),
    toneAnalysis: analyzeToneConsistency(results),
    issueAnalysis: analyzeIssues(results),
    recommendations: generateRecommendations(results),
    actionPlan: generateActionPlan(results)
  }

  // Générer le rapport d'analyse
  generateAnalysisReport(analysis)
  
  // Afficher le résumé
  displayAnalysisSummary(analysis)
}

function generateExecutiveSummary(results) {
  const { summary } = results
  
  return {
    overallHealth: summary.globalSuccessRate >= 80 ? 'EXCELLENT' : 
                  summary.globalSuccessRate >= 70 ? 'GOOD' :
                  summary.globalSuccessRate >= 60 ? 'NEEDS_IMPROVEMENT' : 'CRITICAL',
    keyStrengths: [
      `Taux de succès global de ${summary.globalSuccessRate}`,
      `Score de ton cohérent (${summary.averageScores.tone}/100)`,
      `Créativité élevée (${summary.averageScores.creativity}/100)`
    ],
    criticalIssues: [
      summary.averageScores.precision < 75 ? 'Précision des réponses à améliorer' : null,
      summary.averageScores.contextUnderstanding < 80 ? 'Compréhension contextuelle insuffisante' : null,
      summary.averageScores.adaptability < 70 ? 'Adaptabilité conversationnelle limitée' : null
    ].filter(Boolean),
    priorityActions: [
      'Renforcer la détection de contexte',
      'Structurer les réponses avec plus de détails',
      'Améliorer la gestion des conversations multi-tours'
    ]
  }
}

function analyzePerformance(results) {
  const { topicPerformance, userTypePerformance } = results.detailedAnalysis
  
  // Analyser les performances par topic
  const topicAnalysis = Object.entries(topicPerformance)
    .map(([topic, score]) => ({
      topic,
      score,
      performance: score >= 85 ? 'EXCELLENT' : 
                  score >= 75 ? 'GOOD' : 
                  score >= 65 ? 'AVERAGE' : 'POOR',
      recommendations: generateTopicRecommendations(topic, score)
    }))
    .sort((a, b) => b.score - a.score)

  // Analyser les performances par type d'utilisateur
  const userTypeAnalysis = Object.entries(userTypePerformance)
    .map(([userType, score]) => ({
      userType,
      score,
      performance: score >= 85 ? 'EXCELLENT' : 
                  score >= 75 ? 'GOOD' : 
                  score >= 65 ? 'AVERAGE' : 'POOR'
    }))
    .sort((a, b) => b.score - a.score)

  return {
    topicAnalysis,
    userTypeAnalysis,
    bestPerformingTopics: topicAnalysis.filter(t => t.performance === 'EXCELLENT').map(t => t.topic),
    worstPerformingTopics: topicAnalysis.filter(t => t.performance === 'POOR').map(t => t.topic),
    bestUserTypes: userTypeAnalysis.filter(u => u.performance === 'EXCELLENT').map(u => u.userType),
    challengingUserTypes: userTypeAnalysis.filter(u => u.performance === 'POOR').map(u => u.userType)
  }
}

function generateTopicRecommendations(topic, score) {
  const recommendations = {
    anniversaire_celebration: [
      'Ajouter plus de variété dans les suggestions d\'anniversaire',
      'Inclure des options pour différents budgets',
      'Proposer des services de décoration et animation'
    ],
    dinner_romantic: [
      'Enrichir la base de restaurants romantiques',
      'Ajouter des détails sur l\'ambiance et l\'éclairage',
      'Inclure des options de menu dégustation'
    ],
    boundary_testing: [
      'Renforcer les réponses de limitation éthique',
      'Rediriger vers des services appropriés',
      'Maintenir un ton professionnel'
    ],
    casual_chat: [
      'Améliorer les réponses conversationnelles',
      'Ajouter plus de personnalité',
      'Inclure des informations locales utiles'
    ]
  }

  if (score < 70) {
    return [
      'Score faible détecté - nécessite une attention particulière',
      'Revoir les prompts et la logique de réponse',
      ...(recommendations[topic] || ['Analyser les patterns de conversation'])
    ]
  }

  return recommendations[topic] || ['Maintenir les bonnes performances']
}

function analyzeContextUnderstanding(results) {
  const { conversationExamples } = results.detailedAnalysis
  
  // Analyser les exemples de conversation
  const contextIssues = []
  const contextSuccesses = []

  conversationExamples.forEach(example => {
    if (example.evaluation.contextUnderstanding < 70) {
      contextIssues.push({
        topic: example.topic,
        userType: example.userType,
        score: example.evaluation.contextUnderstanding,
        conversation: example.conversation.slice(0, 2) // Premier échange
      })
    } else {
      contextSuccesses.push({
        topic: example.topic,
        score: example.evaluation.contextUnderstanding
      })
    }
  })

  return {
    averageContextScore: results.summary.averageScores.contextUnderstanding,
    contextIssues,
    contextSuccesses,
    improvementAreas: [
      'Détection d\'intentions implicites',
      'Compréhension des nuances émotionnelles',
      'Gestion des changements de sujet'
    ]
  }
}

function analyzeToneConsistency(results) {
  const { conversationExamples } = results.detailedAnalysis
  
  // Analyser la cohérence du ton
  const toneAnalysis = conversationExamples.map(example => ({
    topic: example.topic,
    toneScore: example.evaluation.tone,
    hasEmojis: example.conversation.some(msg => 
      msg.role === 'assistant' && /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(msg.content)
    ),
    hasStructure: example.conversation.some(msg => 
      msg.role === 'assistant' && (msg.content.includes('**') || msg.content.includes('•'))
    )
  }))

  return {
    averageToneScore: results.summary.averageScores.tone,
    emojiUsage: toneAnalysis.filter(t => t.hasEmojis).length / toneAnalysis.length * 100,
    structuredResponses: toneAnalysis.filter(t => t.hasStructure).length / toneAnalysis.length * 100,
    recommendations: [
      'Maintenir l\'usage des emojis pour le ton Gliitz',
      'Structurer systématiquement les réponses',
      'Garder un ton bienveillant et luxueux'
    ]
  }
}

function analyzeIssues(results) {
  const { commonIssues } = results.summary
  
  const issueCategories = {
    LOW_RELEVANCE: {
      description: 'Réponses non pertinentes au contexte',
      impact: 'HIGH',
      solutions: [
        'Améliorer la détection de contexte',
        'Enrichir la base de connaissances',
        'Affiner les prompts de classification'
      ]
    },
    CONTEXT_MISUNDERSTANDING: {
      description: 'Mauvaise compréhension du contexte',
      impact: 'HIGH',
      solutions: [
        'Renforcer l\'analyse sémantique',
        'Ajouter des exemples de contexte',
        'Améliorer la formation des modèles'
      ]
    },
    TONE_INCONSISTENCY: {
      description: 'Incohérence dans le ton',
      impact: 'MEDIUM',
      solutions: [
        'Standardiser le style de réponse',
        'Ajouter des templates de ton',
        'Former sur l\'identité Gliitz'
      ]
    },
    LOW_PRECISION: {
      description: 'Manque de détails dans les réponses',
      impact: 'MEDIUM',
      solutions: [
        'Structurer les réponses avec des détails',
        'Ajouter des informations concrètes',
        'Inclure des données spécifiques'
      ]
    },
    API_ERROR: {
      description: 'Erreurs techniques',
      impact: 'HIGH',
      solutions: [
        'Améliorer la gestion d\'erreurs',
        'Ajouter des fallbacks',
        'Monitorer les performances API'
      ]
    }
  }

  const analyzedIssues = Object.entries(commonIssues).map(([issue, count]) => ({
    issue,
    count,
    category: issueCategories[issue] || {
      description: 'Problème non catégorisé',
      impact: 'MEDIUM',
      solutions: ['Analyser et catégoriser ce problème']
    }
  })).sort((a, b) => b.count - a.count)

  return {
    totalIssues: Object.values(commonIssues).reduce((a, b) => a + b, 0),
    criticalIssues: analyzedIssues.filter(i => i.category.impact === 'HIGH'),
    mediumIssues: analyzedIssues.filter(i => i.category.impact === 'MEDIUM'),
    issueCategories
  }
}

function generateRecommendations(results) {
  const recommendations = {
    immediate: [],
    shortTerm: [],
    longTerm: []
  }

  const { summary } = results

  // Recommandations immédiates (critiques)
  if (summary.averageScores.contextUnderstanding < 70) {
    recommendations.immediate.push({
      priority: 'CRITICAL',
      action: 'Améliorer la compréhension contextuelle',
      description: 'Le chatbot ne comprend pas correctement le contexte des conversations',
      implementation: 'Revoir les prompts et la logique de classification'
    })
  }

  if (summary.averageScores.precision < 70) {
    recommendations.immediate.push({
      priority: 'HIGH',
      action: 'Structurer les réponses avec plus de détails',
      description: 'Les réponses manquent de précision et de détails concrets',
      implementation: 'Créer des templates de réponse structurés'
    })
  }

  // Recommandations à court terme
  recommendations.shortTerm.push({
    priority: 'MEDIUM',
    action: 'Enrichir la base de connaissances',
    description: 'Ajouter plus de variété dans les suggestions et services',
    implementation: 'Intégrer de nouvelles données et services'
  })

  recommendations.shortTerm.push({
    priority: 'MEDIUM',
    action: 'Améliorer la gestion des conversations multi-tours',
    description: 'Le chatbot doit mieux maintenir le contexte entre les messages',
    implementation: 'Implémenter une mémoire conversationnelle plus robuste'
  })

  // Recommandations à long terme
  recommendations.longTerm.push({
    priority: 'LOW',
    action: 'Personnalisation avancée',
    description: 'Adapter les réponses aux préférences utilisateur',
    implementation: 'Système de profils utilisateur et d\'apprentissage'
  })

  recommendations.longTerm.push({
    priority: 'LOW',
    action: 'Intégration multi-langues',
    description: 'Support natif pour plusieurs langues',
    implementation: 'Traduction contextuelle et culturelle'
  })

  return recommendations
}

function generateActionPlan(results) {
  const actionPlan = {
    phase1: {
      duration: '1-2 semaines',
      objectives: [
        'Corriger les problèmes critiques identifiés',
        'Améliorer la compréhension contextuelle',
        'Structurer les réponses de base'
      ],
      tasks: [
        'Revoir les prompts de classification',
        'Créer des templates de réponse standardisés',
        'Tester les améliorations sur un échantillon'
      ]
    },
    phase2: {
      duration: '3-4 semaines',
      objectives: [
        'Enrichir la base de connaissances',
        'Améliorer la variété des suggestions',
        'Optimiser les performances par topic'
      ],
      tasks: [
        'Ajouter de nouveaux services et établissements',
        'Créer des réponses spécialisées par catégorie',
        'Implémenter une meilleure gestion d\'erreurs'
      ]
    },
    phase3: {
      duration: '2-3 mois',
      objectives: [
        'Personnalisation avancée',
        'Intégration de nouvelles fonctionnalités',
        'Optimisation continue'
      ],
      tasks: [
        'Système de profils utilisateur',
        'Analytics et monitoring avancés',
        'Intégration d\'APIs externes'
      ]
    }
  }

  return actionPlan
}

function generateAnalysisReport(analysis) {
  const report = {
    timestamp: new Date().toISOString(),
    analysis: analysis
  }

  // Sauvegarder le rapport d'analyse
  fs.writeFileSync('audit-analysis.json', JSON.stringify(report, null, 2))
  console.log('📄 Rapport d\'analyse généré : audit-analysis.json\n')
}

function displayAnalysisSummary(analysis) {
  console.log('📊 RAPPORT D\'ANALYSE DÉTAILLÉ - GLIITZ CHAT AUDIT')
  console.log('=' * 60)
  
  // Résumé exécutif
  console.log('\n🎯 RÉSUMÉ EXÉCUTIF')
  console.log(`État général : ${analysis.executiveSummary.overallHealth}`)
  console.log('\n✅ Points forts :')
  analysis.executiveSummary.keyStrengths.forEach(strength => {
    console.log(`  • ${strength}`)
  })
  
  if (analysis.executiveSummary.criticalIssues.length > 0) {
    console.log('\n⚠️ Problèmes critiques :')
    analysis.executiveSummary.criticalIssues.forEach(issue => {
      console.log(`  • ${issue}`)
    })
  }

  // Analyse de performance
  console.log('\n📈 ANALYSE DE PERFORMANCE')
  console.log('\n🏆 Topics les mieux performants :')
  analysis.performanceAnalysis.bestPerformingTopics.forEach(topic => {
    console.log(`  • ${topic}`)
  })
  
  if (analysis.performanceAnalysis.worstPerformingTopics.length > 0) {
    console.log('\n⚠️ Topics à améliorer :')
    analysis.performanceAnalysis.worstPerformingTopics.forEach(topic => {
      console.log(`  • ${topic}`)
    })
  }

  // Analyse des problèmes
  console.log('\n🔍 ANALYSE DES PROBLÈMES')
  if (analysis.issueAnalysis.criticalIssues.length > 0) {
    console.log('\n🚨 Problèmes critiques :')
    analysis.issueAnalysis.criticalIssues.forEach(issue => {
      console.log(`  • ${issue.issue}: ${issue.count} occurrences`)
      console.log(`    Description: ${issue.category.description}`)
    })
  }

  // Recommandations
  console.log('\n💡 RECOMMANDATIONS PRIORITAIRES')
  console.log('\n⚡ Actions immédiates :')
  analysis.recommendations.immediate.forEach(rec => {
    console.log(`  • [${rec.priority}] ${rec.action}`)
    console.log(`    ${rec.description}`)
  })

  console.log('\n📅 Actions à court terme :')
  analysis.recommendations.shortTerm.forEach(rec => {
    console.log(`  • [${rec.priority}] ${rec.action}`)
  })

  console.log('\n🎯 Plan d\'action - Phase 1 (1-2 semaines) :')
  analysis.actionPlan.phase1.tasks.forEach(task => {
    console.log(`  • ${task}`)
  })

  console.log('\n✨ Analyse terminée ! Consultez audit-analysis.json pour plus de détails.')
}

// Lancer l'analyse
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeAuditResults()
}

export { analyzeAuditResults }
