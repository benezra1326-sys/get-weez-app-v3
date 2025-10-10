import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * API Route: /api/users/[user_id]
 * Récupère les informations d'un utilisateur
 */
export default async function handler(req, res) {
  const { user_id } = req.query

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('gliitz_users')
        .select('*')
        .eq('id', user_id)
        .single()

      if (error) {
        return res.status(404).json({ error: 'Utilisateur non trouvé', details: error })
      }

      return res.status(200).json({ success: true, user: data })
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur', details: error.message })
    }
  }

  if (req.method === 'PUT') {
    try {
      const updates = req.body

      const { data, error } = await supabase
        .from('gliitz_users')
        .update(updates)
        .eq('id', user_id)
        .select()
        .single()

      if (error) {
        return res.status(400).json({ error: 'Erreur de mise à jour', details: error })
      }

      return res.status(200).json({ success: true, user: data })
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur', details: error.message })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}

