#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🔑 Configuration OpenAI pour Get Weez')
console.log('='.repeat(50))
console.log('')
console.log('Ce script va vous aider à configurer votre clé API OpenAI.')
console.log('')
console.log('📋 Étapes:')
console.log('1. Allez sur https://platform.openai.com/')
console.log('2. Connectez-vous ou créez un compte')
console.log('3. Allez dans "API Keys"')
console.log('4. Cliquez sur "Create new secret key"')
console.log('5. Copiez la clé (elle commence par sk-)')
console.log('')

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupOpenAI() {
  try {
    const apiKey = await question('🔑 Entrez votre clé API OpenAI (commence par sk-): ')
    
    if (!apiKey || !apiKey.startsWith('sk-')) {
      console.log('❌ Clé API invalide. Elle doit commencer par "sk-"')
      rl.close()
      return
    }
    
    // Créer le contenu du fichier .env.local
    const envContent = `# Configuration OpenAI pour Get Weez
OPENAI_API_KEY=${apiKey}

# Configuration Supabase (si nécessaire)
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
`
    
    // Écrire le fichier .env.local
    const envPath = path.join(__dirname, '.env.local')
    fs.writeFileSync(envPath, envContent)
    
    console.log('')
    console.log('✅ Fichier .env.local créé avec succès !')
    console.log('')
    console.log('🔄 Pour appliquer la configuration:')
    console.log('1. Redémarrez votre serveur de développement:')
    console.log('   npm run dev')
    console.log('')
    console.log('2. Testez l\'API avec:')
    console.log('   node test-openai.js')
    console.log('')
    console.log('🎉 Configuration terminée !')
    
  } catch (error) {
    console.log('❌ Erreur lors de la configuration:', error.message)
  } finally {
    rl.close()
  }
}

setupOpenAI()



