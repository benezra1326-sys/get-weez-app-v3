import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * API Route: /api/bookings/user/[user_id]
 * Récupère toutes les réservations d'un utilisateur
 */
export default async function handler(req, res) {
  const { user_id } = req.query

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('gliitz_bookings')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })

      if (error) {
        return res.status(500).json({ error: 'Erreur récupération réservations', details: error })
      }

      return res.status(200).json({ 
        success: true, 
        bookings: data,
        count: data.length 
      })
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur', details: error.message })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}

