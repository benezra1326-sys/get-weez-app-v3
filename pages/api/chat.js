import { askWeezAgent } from '../../lib/openai'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, userName, isMember, conversationHistory } = req.body

  try {
    // Appeler l'agent Get Weez avec l'historique de conversation
    const reply = await askWeezAgent(message, userName, isMember, conversationHistory)

    res.status(200).json({ reply })
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      reply: "Désolé, une erreur s'est produite avec Get Weez. Veuillez réessayer plus tard."
    })
  }
}