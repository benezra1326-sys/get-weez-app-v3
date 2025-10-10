import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * API Route: /api/bookings/new
 * Crée une nouvelle réservation
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        user_id,
        type,
        sub_type,
        establishment_id,
        event_id,
        service_id,
        booking_date,
        location,
        guests_count = 1,
        special_requests,
        price,
        details = {}
      } = req.body

      // Validation
      if (!user_id || !type || !booking_date || !location) {
        return res.status(400).json({ 
          error: 'Données manquantes', 
          required: ['user_id', 'type', 'booking_date', 'location']
        })
      }

      // Créer la réservation
      const { data, error } = await supabase
        .from('gliitz_bookings')
        .insert([{
          user_id,
          type,
          sub_type,
          establishment_id,
          event_id,
          service_id,
          booking_date,
          location,
          guests_count,
          special_requests,
          price,
          status: 'confirmed',
          details,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        return res.status(500).json({ error: 'Erreur création réservation', details: error })
      }

      // Créer une notification
      await supabase
        .from('gliitz_notifications')
        .insert([{
          user_id,
          type: 'booking_confirmation',
          title: 'Réservation confirmée',
          message: `Votre réservation ${data.booking_number} a été confirmée avec succès.`,
          link: `/bookings/${data.id}`,
          created_at: new Date().toISOString()
        }])

      // Log l'activité
      await supabase
        .from('gliitz_user_activity')
        .insert([{
          user_id,
          activity_type: 'booking',
          activity_data: {
            booking_id: data.id,
            booking_number: data.booking_number,
            type,
            location
          },
          created_at: new Date().toISOString()
        }])

      return res.status(201).json({ 
        success: true, 
        booking: data,
        message: 'Réservation créée avec succès'
      })
    } catch (error) {
      console.error('Erreur création réservation:', error)
      return res.status(500).json({ error: 'Erreur serveur', details: error.message })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}

