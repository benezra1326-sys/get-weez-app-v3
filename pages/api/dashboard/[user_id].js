import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * API Route: /api/dashboard/[user_id]
 * Récupère toutes les données du dashboard utilisateur
 */
export default async function handler(req, res) {
  const { user_id } = req.query

  if (req.method === 'GET') {
    try {
      // Récupérer les informations utilisateur
      const { data: user, error: userError } = await supabase
        .from('gliitz_users')
        .select('*')
        .eq('id', user_id)
        .single()

      if (userError) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' })
      }

      // Récupérer les statistiques de réservations
      const { data: bookings, error: bookingsError } = await supabase
        .from('gliitz_bookings')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })

      const bookingsStats = {
        total: bookings?.length || 0,
        confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
        pending: bookings?.filter(b => b.status === 'pending').length || 0,
        completed: bookings?.filter(b => b.status === 'completed').length || 0,
        cancelled: bookings?.filter(b => b.status === 'cancelled').length || 0,
        recent: bookings?.slice(0, 5) || []
      }

      // Récupérer les événements à venir
      const { data: upcomingEvents, error: eventsError } = await supabase
        .from('gliitz_user_events')
        .select(`
          *,
          events (*)
        `)
        .eq('user_id', user_id)
        .eq('status', 'registered')
        .order('created_at', { ascending: false })
        .limit(5)

      // Récupérer les préférences
      const { data: preferences, error: preferencesError } = await supabase
        .from('gliitz_user_preferences')
        .select('*')
        .eq('user_id', user_id)
        .order('priority', { ascending: false })

      // Récupérer les notifications non lues
      const { data: notifications, error: notificationsError } = await supabase
        .from('gliitz_notifications')
        .select('*')
        .eq('user_id', user_id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(10)

      // Récupérer les favoris
      const { data: favorites, error: favoritesError } = await supabase
        .from('gliitz_user_favorites')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })

      // Récupérer les feedbacks
      const { data: feedbacks, error: feedbacksError } = await supabase
        .from('gliitz_feedback')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })

      const averageRating = feedbacks?.length > 0
        ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        : null

      // Construire le dashboard complet
      const dashboard = {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          avatar_url: user.avatar_url,
          city_preference: user.city_preference,
          budget_preference: user.budget_preference,
          style_preference: user.style_preference,
          subscription_tier: user.subscription_tier,
          created_at: user.created_at,
          last_login: user.last_login
        },
        stats: {
          bookings: bookingsStats,
          upcomingEventsCount: upcomingEvents?.length || 0,
          preferencesCount: preferences?.length || 0,
          unreadNotifications: notifications?.length || 0,
          favoritesCount: favorites?.length || 0,
          averageRating: averageRating ? averageRating.toFixed(1) : null
        },
        recentBookings: bookingsStats.recent,
        upcomingEvents: upcomingEvents || [],
        preferences: preferences || [],
        notifications: notifications || [],
        favorites: favorites || [],
        recentFeedback: feedbacks?.slice(0, 3) || []
      }

      return res.status(200).json({ 
        success: true, 
        dashboard 
      })
    } catch (error) {
      console.error('Erreur récupération dashboard:', error)
      return res.status(500).json({ error: 'Erreur serveur', details: error.message })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}


