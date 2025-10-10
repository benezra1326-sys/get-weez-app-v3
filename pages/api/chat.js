import { askGliitzAgent } from '../../lib/openai-enhanced'
import { fetchAllDataForAI } from '../../lib/supabaseData'
import { enrichDataWithMenus } from '../../lib/openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, userId } = req.body

  try {
    // Récupérer les données réelles depuis Supabase
    const realData = await fetchAllDataForAI()
    console.log('📊 Données Supabase chargées:', {
      establishments: realData.establishments?.length || 0,
      events: realData.events?.length || 0,
      services: realData.services?.length || 0
    })
    
    // Enrichir les données avec les menus
    const enrichedData = enrichDataWithMenus(realData)
    console.log('🍽️ Données enrichies avec les menus')
    
    let reply
    
    if (messages && Array.isArray(messages)) {
      // Format avec historique complet + données Supabase
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()
      
      reply = await askGliitzAgent(
        lastUserMessage?.content || '',
        messages, // Passer tout l'historique
        userId, // Passer l'ID utilisateur pour les préférences
        enrichedData // Passer les données enrichies avec les menus
      )
    } else {
      reply = await askGliitzAgent('Bonjour', [], userId, enrichedData)
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