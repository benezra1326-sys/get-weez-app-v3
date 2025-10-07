const { askWeezAgent } = require('./lib/openai')

async function testOpenAI() {
  console.log('🧪 Test OpenAI API pour Gliitz V3...\n')
  console.log('─'.repeat(60))
  
  try {
    console.log('📤 Envoi du message test...')
    
    const response = await askWeezAgent(
      'Bonjour Gliitz, quels sont les meilleurs restaurants gastronomiques à Marbella ?',
      'Test User V3',
      true,
      ''
    )
    
    console.log('\n✅ Réponse reçue !')
    console.log('─'.repeat(60))
    console.log(response)
    console.log('─'.repeat(60))
    console.log('\n🎉 OpenAI fonctionne parfaitement !')
    console.log('✨ Gliitz V3 est prêt à répondre à vos questions !')
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:')
    console.error(error.message)
    
    console.log('\n⚠️  Vérifiez les points suivants:')
    console.log('   1. Fichier .env.local existe avec NEXT_PUBLIC_OPENAI_API_KEY')
    console.log('   2. Clé API OpenAI valide et active')
    console.log('   3. Crédits OpenAI disponibles')
    console.log('   4. Connexion internet active')
    
    console.log('\n💡 Pour configurer OpenAI:')
    console.log('   - Créez .env.local à la racine')
    console.log('   - Ajoutez: NEXT_PUBLIC_OPENAI_API_KEY=sk-...')
    console.log('   - Obtenez une clé sur: https://platform.openai.com/api-keys')
  }
}

// Exécuter le test
testOpenAI()

