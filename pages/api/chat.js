import { askWeezAgent } from '../../lib/openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, userName, isMember, conversationHistory } = req.body

  try {
    // Vérifier si OpenAI est configuré
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI non configuré - utilisation de réponses de démonstration')
      
      // Réponse de démonstration intelligente
      const demoResponses = [
        "✨ Bienvenue sur Get Weez ! Je suis votre concierge IA pour Marbella. Malheureusement, l'API OpenAI n'est pas encore configurée, mais je peux quand même vous aider avec des suggestions !",
        "🏖️ Pour une expérience authentique à Marbella, je vous recommande le Puente Romano Beach Resort et La Sala Puerto Banús pour dîner.",
        "🍾 Voulez-vous que je vous aide à réserver une table dans un restaurant exclusif ? (Note: OpenAI API nécessaire pour des réponses personnalisées)",
        "🎯 Mode démonstration actif. Configurez votre clé OpenAI pour débloquer toutes les fonctionnalités IA !"
      ]
      
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
      return res.status(200).json({ reply: randomResponse })
    }

    // Appeler l'agent Get Weez avec l'historique de conversation
    const reply = await askWeezAgent(message, userName, isMember, conversationHistory)

    res.status(200).json({ reply })
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      reply: "Désolé, une erreur s'est produite avec Get Weez. En mode démonstration, toutes les fonctionnalités ne sont pas disponibles. Veuillez réessayer plus tard."
    })
  }
}