import { askWeezAgent } from '../../lib/openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, messages, userName, isMember, conversationHistory } = req.body

  try {
    let reply
    
    // Support both old and new format
    if (messages && Array.isArray(messages)) {
      // New format with full conversation
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()
      const conversationContext = messages.map(m => `${m.role}: ${m.content}`).join('\n')
      
      reply = await askWeezAgent(
        lastUserMessage?.content || message,
        userName || 'Utilisateur',
        isMember !== false,
        conversationContext
      )
    } else {
      // Old format with single message
      reply = await askWeezAgent(message, userName, isMember, conversationHistory)
    }

    res.status(200).json({ 
      reply,
      message: reply // For compatibility
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: "Désolé, je rencontre un problème technique. Comment puis-je vous aider autrement ?",
      reply: "Désolé, je rencontre un problème technique. Comment puis-je vous aider autrement?"
    })
  }
}