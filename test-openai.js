// Script de test pour OpenAI
const OpenAI = require('openai')

// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: '.env.local' })

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

console.log('🧪 Test de l\'API OpenAI pour Get Weez')
console.log('='.repeat(50))

// Vérifier si la clé API est configurée
if (!OPENAI_API_KEY) {
  console.log('❌ ERREUR: OPENAI_API_KEY n\'est pas configurée')
  console.log('📝 Veuillez créer un fichier .env.local avec:')
  console.log('OPENAI_API_KEY=sk-votre-cle-api-ici')
  console.log('='.repeat(50))
  process.exit(1)
}

if (!OPENAI_API_KEY.startsWith('sk-')) {
  console.log('❌ ERREUR: La clé API ne semble pas valide (doit commencer par sk-)')
  console.log('🔑 Clé actuelle:', OPENAI_API_KEY.substring(0, 10) + '...')
  console.log('='.repeat(50))
  process.exit(1)
}

console.log('✅ Clé API détectée:', OPENAI_API_KEY.substring(0, 10) + '...')

// Initialiser OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

async function testOpenAI() {
  try {
    console.log('🤖 Test de connexion à OpenAI...')
    console.log('⏳ Attente de 2 secondes pour éviter les limites de taux...')
    
    // Attendre 2 secondes pour éviter les rate limits
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es Get Weez, un concierge virtuel à Marbella. Réponds brièvement avec des icônes."
        },
        {
          role: "user",
          content: "Bonjour, peux-tu me recommander un restaurant ?"
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (response) {
      console.log('✅ Test réussi !')
      console.log('🤖 Réponse OpenAI:', response)
      console.log('='.repeat(50))
      console.log('🎉 L\'API OpenAI est correctement configurée !')
    } else {
      console.log('❌ Réponse vide d\'OpenAI')
    }
    
  } catch (error) {
    console.log('❌ ERREUR lors du test OpenAI:')
    console.log('📝 Message:', error.message)
    
    if (error.status === 401) {
      console.log('🔑 Problème d\'authentification - vérifiez votre clé API')
    } else if (error.status === 429) {
      console.log('💰 Limite de quota atteinte - vérifiez votre solde')
    } else if (error.status === 500) {
      console.log('🚨 Erreur serveur OpenAI')
    }
    
    console.log('='.repeat(50))
  }
}

// Lancer le test
testOpenAI()
