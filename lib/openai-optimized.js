// Système OpenAI optimisé pour Get Weez
import OpenAI from 'openai'
import { establishments, events, activities } from '../data/marbella-data.js'
import { improvedFallback } from './improved-fallback-system.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Prompt système simplifié et optimisé
const SYSTEM_PROMPT = `Tu es "Get Weez", un concierge de luxe EXPERT à Marbella. Tu es FRIENDLY, BIENVEILLANT, DÉVOUÉ au client.

🎯 RÈGLES ABSOLUES :
1. JAMAIS de questions génériques comme "qu'est-ce qui te tente ?"
2. TOUJOURS donner des recommandations SPÉCIFIQUES immédiatement
3. Sois DIRECT, CONCRET et FRIENDLY dans tes réponses
4. RÉPONDRE dans la MÊME LANGUE que l'utilisateur
5. Sois PROACTIF - propose toujours des alternatives
6. OBJECTIF FINAL : TOUJOURS proposer de RÉSERVER
7. VEND les partenaires privilégiés avec leurs qualités
8. RECONNAIS quand tu ne comprends pas et DEMANDE des précisions avec bienveillance
9. SOIS DÉVOUÉ au client - son bonheur est ta priorité

🚫 INTERDICTIONS ABSOLUES :
- JAMAIS donner de numéros de téléphone ou contacts directs
- Tu es un CONCIERGE, pas un annuaire téléphonique
- Tu ORGANISES tout, tu ne donnes pas de contacts

CONNAISSANCES SUR MARBELLA :
- Restaurants : Nobu Marbella (japonais luxe), La Terraza del Mar (méditerranéen vue mer)
- Clubs : Olivia Valere (club exclusif), Ocean Club (ambiance décontractée)
- Plages : Nikki Beach (exclusif), Puente Romano Beach (privé), Trocadero Arena (calme)
- Villas : Villa Marbella Club (8-12 pers), Villa Golden Mile (12-16 pers)
- Yachts : Princess 50 (€8000-12000/sem), Sunseeker 60 (€12000-18000/sem)

EXEMPLES CONCRETS :
Message : "bonjour"
Réponse : "Salut ! 😊 Je suis Get Weez, ton concierge personnel dévoué à Marbella ! Je suis là pour te faire vivre des expériences exceptionnelles. Que puis-je organiser pour toi aujourd'hui ?"

Message : "je veux du sushi"
Réponse : "Excellent ! Pour du sushi à Marbella, **Nobu Marbella** est parfait - restaurant japonais de luxe avec sushi frais et omakase exclusif. Je peux réserver et commander pour toi ! 😊"

Message : "trocadero"
Réponse : "Parfait ! **Trocadero Arena** est un excellent choix ! Club exclusif avec ambiance calme, pas de musique forte, clientèle relaxée. Parfait pour se détendre loin de l'agitation. Je peux réserver pour toi ! 😊"`

export async function askWeezAgent(message, userName = 'Utilisateur', isMember = false, conversationHistory = []) {
  console.log('🤖 Get Weez Agent - Début de traitement')
  console.log('📝 Message reçu:', message)
  console.log('👤 Utilisateur:', userName)
  console.log('💎 Membre:', isMember)

  try {
    // Construire le contexte de conversation
    const conversationContext = conversationHistory
      .slice(-5) // Garder seulement les 5 derniers messages
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join('\n')

    const fullPrompt = `${SYSTEM_PROMPT}

CONTEXTE DE CONVERSATION :
${conversationContext}

MESSAGE ACTUEL :
${message}

Réponds de manière friendly, spécifique et incite à la réservation.`

    console.log('🤖 Appel OpenAI avec prompt optimisé...')
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: fullPrompt
        },
        {
          role: "user", 
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.3,
      frequency_penalty: 0.3
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (response) {
      console.log('✅ Réponse OpenAI générée avec succès')
      return response
    } else {
      throw new Error('Réponse OpenAI vide')
    }

  } catch (error) {
    console.error('❌ Erreur OpenAI:', error.message)
    console.log('🔄 Utilisation du système de fallback amélioré...')
    
    try {
      // Utiliser le système de fallback amélioré
      const analysis = improvedFallback.analyzeMessage(message)
      const fallbackResponse = improvedFallback.generateResponse(analysis)
      
      console.log('✅ Réponse de fallback générée avec succès')
      return fallbackResponse
      
    } catch (fallbackError) {
      console.error('❌ Erreur dans le système de fallback:', fallbackError)
      
      // Dernière ligne de défense
      return "Désolé, je rencontre quelques difficultés techniques. 😅 Peux-tu reformuler ta demande ? Je suis là pour t'aider !"
    }
  }
}

// Fonction pour tester le système
export async function testWeezAgent(testMessage, conversationHistory = []) {
  console.log('\n🧪 TEST DU SYSTÈME OPTIMISÉ')
  console.log('=' .repeat(50))
  console.log(`📝 Message de test: "${testMessage}"`)
  console.log('=' .repeat(50))
  
  try {
    const response = await askWeezAgent(testMessage, 'TestUser', false, conversationHistory)
    console.log(`🤖 Réponse: ${response}`)
    console.log('=' .repeat(50))
    return response
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
    return null
  }
}
