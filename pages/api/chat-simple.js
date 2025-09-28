export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message } = req.body

  try {
    // Réponse simple pour tester
    const reply = `Bonjour ! Je suis Get Weez, votre concierge virtuel à Marbella. Vous avez dit : "${message}". Comment puis-je vous aider ?`
    
    res.status(200).json({ reply })
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      reply: "Désolé, une erreur s'est produite. Veuillez réessayer."
    })
  }
}

