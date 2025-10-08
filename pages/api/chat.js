import { askGliitzAgent } from '../../lib/openai-enhanced'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, userId } = req.body

  try {
    let reply
    
    if (messages && Array.isArray(messages)) {
      // Format avec historique complet
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()
      
      reply = await askGliitzAgent(
        lastUserMessage?.content || '',
        messages, // Passer tout l'historique
        userId // Passer l'ID utilisateur pour les préférences
      )
    } else {
      reply = await askGliitzAgent('Bonjour', [], userId)
    }

    res.status(200).json({ 
      reply,
      message: reply // For compatibility
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: "Je rencontre un problème technique. Peux-tu reformuler ta demande ? 🔧",
      reply: "Je rencontre un problème technique. Peux-tu reformuler ta demande ? 🔧"
    })
  }
}