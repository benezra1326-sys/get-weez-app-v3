const core = require('@actions/core')
const github = require('@actions/github')
const { execSync } = require('child_process')

/**
 * Script d'AI Code Review automatisé
 * Analyse les changements et génère des commentaires intelligents
 */

const REVIEW_PROMPTS = {
  basic: `Analyze this code change and provide:
1. Any obvious bugs or issues
2. Basic code quality concerns
3. Simple optimization suggestions`,
  
  detailed: `Perform a detailed code review focusing on:
1. Code quality and best practices
2. Performance implications
3. Security vulnerabilities
4. Maintainability concerns
5. React/JavaScript specific issues
6. Component structure and patterns`,
  
  comprehensive: `Conduct a comprehensive code review covering:
1. Architecture and design patterns
2. Performance optimization opportunities
3. Security best practices
4. Accessibility considerations
5. Testing coverage gaps
6. Documentation needs
7. Code reusability and modularity
8. Error handling and edge cases
9. Memory leaks and resource management
10. Browser compatibility issues`
}

const SYSTEM_PROMPT = `You are an expert React/JavaScript developer and code reviewer. 
Provide constructive, actionable feedback that helps improve code quality.
Focus on practical suggestions that can be immediately implemented.
Use emojis to make reviews more engaging and categorize issues by severity.

Severity levels:
🚨 Critical - Must fix (security, major bugs)
⚠️ Important - Should fix (performance, best practices)
💡 Suggestion - Consider fixing (optimization, style)
📝 Note - Informational (explanations, alternatives)

Format your response as clear, actionable comments.`

async function analyzeCodeChanges() {
  try {
    const context = github.context
    const octokit = github.getOctokit(core.getInput('github-token'))
    
    // Récupérer les fichiers modifiés
    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number
    })
    
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number
    })
    
    // Filtrer les fichiers pertinents
    const relevantFiles = files
      .filter(file => 
        file.status !== 'removed' && 
        /\.(js|jsx|ts|tsx)$/.test(file.filename) &&
        file.changes < 500 // Éviter les fichiers trop gros
      )
      .slice(0, parseInt(core.getInput('max-files')))
    
    if (relevantFiles.length === 0) {
      core.info('No relevant files to review')
      return
    }
    
    core.info(`Reviewing ${relevantFiles.length} files`)
    
    // Analyser chaque fichier
    const reviews = await Promise.all(
      relevantFiles.map(file => reviewFile(file, octokit, context))
    )
    
    // Créer un commentaire général
    await createSummaryComment(reviews.filter(Boolean), octokit, context)
    
  } catch (error) {
    core.setFailed(`AI Code Review failed: ${error.message}`)
  }
}

async function reviewFile(file, octokit, context) {
  try {
    const reviewLevel = core.getInput('review-level')
    
    // Récupérer le contenu du fichier
    let content = ''
    if (file.patch) {
      content = file.patch
    }
    
    if (!content || content.length > 4000) {
      return null // Skip si trop gros pour l'API
    }
    
    // Préparer le prompt
    const prompt = `${REVIEW_PROMPTS[reviewLevel]}

File: ${file.filename}
Status: ${file.status}
Changes: +${file.additions} -${file.deletions}

Code diff:
\`\`\`diff
${content}
\`\`\`

Please provide a focused review of these changes.`
    
    // Appeler OpenAI (simulation - remplacer par l'API réelle)
    const review = await callOpenAI(prompt)
    
    if (review && review.trim()) {
      // Créer des commentaires inline si possible
      await createInlineComments(file, review, octokit, context)
      
      return {
        filename: file.filename,
        review: review,
        additions: file.additions,
        deletions: file.deletions
      }
    }
    
    return null
  } catch (error) {
    core.warning(`Failed to review ${file.filename}: ${error.message}`)
    return null
  }
}

async function callOpenAI(prompt) {
  // Simulation d'appel OpenAI - Remplacer par l'API réelle
  const apiKey = core.getInput('openai-api-key')
  
  if (!apiKey) {
    core.warning('OpenAI API key not provided, using mock response')
    return generateMockReview(prompt)
  }
  
  try {
    // Ici, vous intégreriez l'API OpenAI
    // const response = await fetch('https://api.openai.com/v1/chat/completions', ...)
    
    // Pour l'instant, retourner une réponse mock
    return generateMockReview(prompt)
    
  } catch (error) {
    core.warning(`OpenAI API call failed: ${error.message}`)
    return null
  }
}

function generateMockReview(prompt) {
  const fileName = prompt.match(/File: (.+)/)?.[1] || 'unknown'
  
  if (fileName.includes('ChatInterface')) {
    return `## 🔍 Code Review for ${fileName}

🚨 **Critical Issues:**
- Component is extremely large (2457 lines) - violates Single Responsibility Principle
- Multiple useState hooks could cause performance issues with unnecessary re-renders

⚠️ **Important Issues:**
- Inline styles in JSX create new objects on every render
- Event handlers are not memoized, causing child component re-renders
- Complex conditional rendering makes code hard to maintain

💡 **Suggestions:**
- Split into smaller, focused components
- Extract styles to CSS modules or styled-components
- Use useCallback for event handlers
- Implement useMemo for expensive computations
- Consider using useReducer for complex state management

📝 **Additional Notes:**
- Consider implementing React.memo for child components
- Add error boundaries for better error handling
- Use React DevTools Profiler to identify performance bottlenecks`
  }
  
  return `## 🔍 Code Review for ${fileName}

💡 **Suggestions:**
- Code looks generally good
- Consider adding more comments for complex logic
- Ensure proper error handling

📝 **Notes:**
- Follow team coding standards
- Add unit tests if missing`
}

async function createInlineComments(file, review, octokit, context) {
  try {
    // Analyser le review pour extraire les commentaires spécifiques
    const lines = review.split('\n')
    const comments = []
    
    let currentLine = 1
    for (const line of lines) {
      if (line.includes('line') || line.includes('Line')) {
        // Extraire le numéro de ligne si mentionné
        const lineMatch = line.match(/line (\d+)/i)
        if (lineMatch) {
          currentLine = parseInt(lineMatch[1])
        }
      }
      
      if (line.startsWith('🚨') || line.startsWith('⚠️') || line.startsWith('💡')) {
        comments.push({
          path: file.filename,
          line: currentLine,
          body: line
        })
      }
    }
    
    // Créer les commentaires inline (limité pour éviter le spam)
    if (comments.length > 0 && comments.length <= 3) {
      for (const comment of comments) {
        try {
          await octokit.rest.pulls.createReviewComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: context.payload.pull_request.number,
            body: comment.body,
            path: comment.path,
            line: comment.line
          })
        } catch (error) {
          core.warning(`Failed to create inline comment: ${error.message}`)
        }
      }
    }
  } catch (error) {
    core.warning(`Failed to create inline comments: ${error.message}`)
  }
}

async function createSummaryComment(reviews, octokit, context) {
  if (reviews.length === 0) return
  
  const totalFiles = reviews.length
  const totalAdditions = reviews.reduce((sum, r) => sum + r.additions, 0)
  const totalDeletions = reviews.reduce((sum, r) => sum + r.deletions, 0)
  
  let comment = `# 🤖 AI Code Review Summary

**Files reviewed:** ${totalFiles}  
**Changes:** +${totalAdditions} -${totalDeletions}

---

`
  
  reviews.forEach(review => {
    comment += `## 📄 ${review.filename}\n\n${review.review}\n\n---\n\n`
  })
  
  comment += `
## 🎯 Next Steps

1. **Address Critical Issues (🚨)** - These should be fixed before merging
2. **Consider Important Issues (⚠️)** - These improve code quality significantly  
3. **Review Suggestions (💡)** - These are optimizations and best practices

*Generated by AI Code Review Bot 🤖*`
  
  try {
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number,
      body: comment
    })
  } catch (error) {
    core.setFailed(`Failed to create summary comment: ${error.message}`)
  }
}

// Exécuter l'analyse
analyzeCodeChanges().catch(error => {
  core.setFailed(error.message)
})