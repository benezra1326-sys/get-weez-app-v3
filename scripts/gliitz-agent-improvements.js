import fs from "fs"
import chalk from "chalk"

export async function generateAgentImprovements(audit, intelligence) {
  console.log(chalk.yellow("\n🔧 Génération du plan d'amélioration de l'agent..."))

  const avg = audit.summary.averageScores
  const lowPrecision = avg.precision < 70
  const lowContext = avg.contextUnderstanding < 75
  const lowTone = avg.tone < 85

  const improvements = []

  if (lowContext)
    improvements.push({
      action: "Optimiser le moteur de détection d'intentions (LLM + contexte Supabase)",
      reason: "Mauvaise compréhension conversationnelle",
      priority: "CRITICAL",
      implementation: "Enrichir les prompts avec plus d'exemples contextuels et améliorer la classification sémantique"
    })

  if (lowPrecision)
    improvements.push({
      action: "Renforcer les réponses avec données Supabase (prix, lieux, horaires)",
      reason: "Manque de précision des réponses",
      priority: "HIGH",
      implementation: "Structurer les réponses avec des templates et inclure systématiquement des détails concrets"
    })

  if (lowTone)
    improvements.push({
      action: "Ajouter filtre ton Gliitz (élégant, empathique, luxueux)",
      reason: "Ton incohérent avec la marque",
      priority: "MEDIUM",
      implementation: "Créer des templates de réponse avec le ton Gliitz et valider la cohérence"
    })

  // Analyser les résultats d'intelligence pour des améliorations spécifiques
  if (intelligence && intelligence.categoryScores) {
    Object.entries(intelligence.categoryScores).forEach(([category, score]) => {
      if (score < 70) {
        improvements.push({
          action: `Améliorer ${category.toLowerCase()}`,
          reason: `Score insuffisant: ${score}/100`,
          priority: "MEDIUM",
          implementation: `Développer des algorithmes spécialisés pour ${category.toLowerCase()}`
        })
      }
    })
  }

  // Nouveau prompt système basé sur les observations
  const newPrompt = `Tu es Gliitz, l'assistant de conciergerie de luxe pour Marbella et ses environs.

IDENTITÉ ET TON :
- Personnalité : Élégant, attentionné, proactif, bienveillant
- Style : Luxueux sans être prétentieux, empathique, créatif
- Communication : Structurée, détaillée, avec emojis appropriés

MISSIONS PRINCIPALES :
1. Comprendre parfaitement le contexte utilisateur (émotions, préférences, contraintes)
2. Utiliser la géolocalisation et les préférences stockées dans Supabase
3. Répondre de manière structurée avec titres, puces et emojis
4. Toujours proposer 3 options concrètes + un conseil personnalisé
5. Ne jamais confondre événements passés et à venir
6. Maintenir la cohérence conversationnelle entre les messages

STRUCTURE DE RÉPONSE :
- Titre principal avec emoji
- 3 options détaillées avec **gras** et emojis
- Informations pratiques (prix, horaires, localisation)
- Conseil personnalisé selon le contexte
- Ton chaleureux et professionnel

EXEMPLES DE CONTEXTE :
- Anniversaire → Célébration, romantique, spécial
- Stress → Relaxation, spa, bien-être
- Business → Professionnel, élégant, impressionnant
- Famille → Adapté enfants, sécurisé, convivial

NE JAMAIS :
- Proposer des services inappropriés au contexte
- Oublier les préférences mentionnées précédemment
- Donner des informations imprécises ou vagues
- Perdre le fil de la conversation`

  // Générer le plan d'amélioration détaillé
  const improvementPlan = `# Plan d'Amélioration Gliitz Chat

## 🎯 Objectifs Prioritaires

### Actions Immédiates (1-2 semaines)
${improvements.filter(i => i.priority === 'CRITICAL').map(i => 
  `- **${i.action}**\n  Raison: ${i.reason}\n  Implémentation: ${i.implementation}`
).join('\n\n')}

### Actions Importantes (2-4 semaines)
${improvements.filter(i => i.priority === 'HIGH').map(i => 
  `- **${i.action}**\n  Raison: ${i.reason}\n  Implémentation: ${i.implementation}`
).join('\n\n')}

### Actions Moyennes (1-2 mois)
${improvements.filter(i => i.priority === 'MEDIUM').map(i => 
  `- **${i.action}**\n  Raison: ${i.reason}\n  Implémentation: ${i.implementation}`
).join('\n\n')}

## 📊 Métriques de Succès

### Objectifs à Court Terme
- [ ] Score de compréhension contextuelle > 85/100
- [ ] Score de précision > 80/100
- [ ] Score de ton > 90/100
- [ ] Réduction des erreurs de 50%

### Objectifs à Moyen Terme
- [ ] Taux de succès global > 90%
- [ ] Personnalisation avancée fonctionnelle
- [ ] Intelligence émotionnelle opérationnelle
- [ ] Géolocalisation précise

## 🔧 Implémentation Technique

### 1. Amélioration des Prompts
- Enrichir la base d'exemples contextuels
- Ajouter des patterns de détection émotionnelle
- Implémenter la mémoire conversationnelle

### 2. Optimisation des Réponses
- Créer des templates structurés
- Intégrer systématiquement les données Supabase
- Valider la cohérence du ton

### 3. Tests et Validation
- Tests automatisés sur 1000 conversations
- Validation manuelle des cas complexes
- Monitoring continu des performances

*Généré automatiquement le ${new Date().toLocaleString('fr-FR')}*`

  // Sauvegarder les fichiers
  fs.writeFileSync("improve-agent-actions.md", improvementPlan)
  fs.writeFileSync("updated-system-prompt.txt", newPrompt)

  console.log(chalk.green("✅ Améliorations générées :"))
  console.log(" - improve-agent-actions.md")
  console.log(" - updated-system-prompt.txt")
  
  // Afficher le résumé
  console.log(chalk.cyan("\n📋 Résumé des améliorations :"))
  improvements.forEach(imp => {
    const color = imp.priority === 'CRITICAL' ? 'red' : 
                  imp.priority === 'HIGH' ? 'yellow' : 'white'
    console.log(chalk[color](`  [${imp.priority}] ${imp.action}`))
  })
}


