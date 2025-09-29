// Test de l'API de chat complète
const fetch = require('node-fetch')

console.log('🧪 Test de l\'API de chat Get Weez')
console.log('='.repeat(50))

async function testChatAPI() {
  try {
    console.log('📡 Test de l\'endpoint /api/chat...')
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Bonjour, peux-tu me recommander un restaurant à Marbella ?',
        userName: 'TestUser',
        isMember: false,
        conversationHistory: []
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('✅ Réponse reçue:')
    console.log('🤖 Get Weez:', data.reply)
    console.log('='.repeat(50))
    console.log('🎉 L\'API de chat fonctionne correctement !')
    
  } catch (error) {
    console.log('❌ ERREUR lors du test de l\'API:')
    console.log('📝 Message:', error.message)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('🚨 Le serveur n\'est pas démarré.')
      console.log('💡 Démarrez le serveur avec: npm run dev')
    }
    
    console.log('='.repeat(50))
  }
}

// Vérifier si le serveur est démarré avant de tester
testChatAPI()



