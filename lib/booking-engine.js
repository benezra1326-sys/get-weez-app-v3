/**
 * Gliitz Booking Engine v7.2
 * Moteur de réservation complet avec écritures DB réelles
 */

import { createClient } from '@supabase/supabase-js'
import { generateBookingVoiceConfirmation } from './elevenlabs-voice'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * Analyse une demande de réservation depuis le chat
 */
export function analyzeBookingRequest(message) {
  const messageLower = message.toLowerCase()
  
  // Détection du type de réservation
  let type = null
  let subType = null
  
  // Restaurant
  if (messageLower.includes('restaurant') || messageLower.includes('table') || messageLower.includes('dîner') || messageLower.includes('déjeuner')) {
    type = 'restaurant'
    
    if (messageLower.includes('japonais') || messageLower.includes('sushi')) subType = 'japonais'
    else if (messageLower.includes('italien') || messageLower.includes('pizza')) subType = 'italien'
    else if (messageLower.includes('français') || messageLower.includes('gastronomique')) subType = 'français'
    else if (messageLower.includes('méditerranéen')) subType = 'méditerranéen'
  }
  
  // Service
  else if (messageLower.includes('yacht') || messageLower.includes('bateau')) {
    type = 'service'
    subType = 'yacht'
  }
  else if (messageLower.includes('spa') || messageLower.includes('massage')) {
    type = 'service'
    subType = 'spa'
  }
  else if (messageLower.includes('chauffeur') || messageLower.includes('voiture') || messageLower.includes('transport')) {
    type = 'service'
    subType = 'transport'
  }
  else if (messageLower.includes('chef') && (messageLower.includes('domicile') || messageLower.includes('privé'))) {
    type = 'service'
    subType = 'chef_domicile'
  }
  
  // Hébergement
  else if (messageLower.includes('villa') || messageLower.includes('maison')) {
    type = 'accommodation'
    subType = 'villa'
  }
  else if (messageLower.includes('hôtel') || messageLower.includes('chambre')) {
    type = 'accommodation'
    subType = 'hotel'
  }
  
  // Événement
  else if (messageLower.includes('événement') || messageLower.includes('soirée') || messageLower.includes('concert') || messageLower.includes('spectacle')) {
    type = 'event'
    subType = 'concert'
  }

  // Détection de la localisation
  let location = 'Marbella' // Par défaut
  if (messageLower.includes('puerto banús') || messageLower.includes('puerto banus')) location = 'Puerto Banús'
  else if (messageLower.includes('nueva andalucía') || messageLower.includes('nueva andalucia')) location = 'Nueva Andalucía'
  else if (messageLower.includes('san pedro')) location = 'San Pedro'
  else if (messageLower.includes('estepona')) location = 'Estepona'

  // Détection de la date
  let bookingDate = null
  if (messageLower.includes('ce soir')) {
    bookingDate = new Date()
    bookingDate.setHours(20, 0, 0, 0)
  } else if (messageLower.includes('demain')) {
    bookingDate = new Date()
    bookingDate.setDate(bookingDate.getDate() + 1)
    bookingDate.setHours(20, 0, 0, 0)
  } else if (messageLower.includes('après-demain')) {
    bookingDate = new Date()
    bookingDate.setDate(bookingDate.getDate() + 2)
    bookingDate.setHours(20, 0, 0, 0)
  } else if (messageLower.includes('week-end') || messageLower.includes('weekend')) {
    bookingDate = new Date()
    const daysUntilSaturday = (6 - bookingDate.getDay() + 7) % 7
    bookingDate.setDate(bookingDate.getDate() + daysUntilSaturday)
    bookingDate.setHours(19, 0, 0, 0)
  } else {
    // Date par défaut : demain soir
    bookingDate = new Date()
    bookingDate.setDate(bookingDate.getDate() + 1)
    bookingDate.setHours(20, 0, 0, 0)
  }

  // Détection du nombre de personnes
  let guestsCount = 2 // Par défaut
  const numberMatch = message.match(/(\d+)\s*(personne|guest|gens|convive)/i)
  if (numberMatch) {
    guestsCount = parseInt(numberMatch[1])
  }

  return {
    type,
    subType,
    location,
    bookingDate: bookingDate.toISOString(),
    guestsCount,
    isBookingRequest: type !== null,
    confidence: type !== null ? 0.85 : 0.3
  }
}

/**
 * Vérifie la disponibilité (simulation pour v7.2)
 */
export async function checkAvailability(type, location, date) {
  // Dans une vraie implémentation, on interrogerait les API des partenaires
  // Pour v7.2, on simule une disponibilité à 90%
  const available = Math.random() > 0.1
  
  return {
    available,
    alternatives: available ? [] : [
      new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(),
      new Date(new Date(date).getTime() + 120 * 60 * 1000).toISOString()
    ]
  }
}

/**
 * Crée une réservation dans la base de données
 */
export async function createBooking(userId, bookingData) {
  try {
    // Vérifier la disponibilité
    const availability = await checkAvailability(
      bookingData.type,
      bookingData.location,
      bookingData.booking_date
    )

    if (!availability.available) {
      return {
        success: false,
        error: 'Aucune disponibilité pour cette date',
        alternatives: availability.alternatives
      }
    }

    // Créer la réservation
    const { data: booking, error: bookingError } = await supabase
      .from('gliitz_bookings')
      .insert([{
        user_id: userId,
        type: bookingData.type,
        sub_type: bookingData.subType,
        establishment_id: bookingData.establishment_id,
        event_id: bookingData.event_id,
        service_id: bookingData.service_id,
        booking_date: bookingData.booking_date,
        location: bookingData.location,
        guests_count: bookingData.guestsCount || 2,
        special_requests: bookingData.special_requests,
        price: bookingData.price,
        status: 'confirmed',
        details: bookingData.details || {},
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (bookingError) {
      console.error('Erreur création réservation:', bookingError)
      return {
        success: false,
        error: 'Erreur lors de la création de la réservation',
        details: bookingError
      }
    }

    // Créer une notification
    await supabase
      .from('gliitz_notifications')
      .insert([{
        user_id: userId,
        type: 'booking_confirmation',
        title: 'Réservation confirmée ✨',
        message: `Votre réservation ${booking.booking_number} a été confirmée avec succès.`,
        link: `/bookings/${booking.id}`,
        created_at: new Date().toISOString()
      }])

    // Logger l'activité
    await supabase
      .from('gliitz_user_activity')
      .insert([{
        user_id: userId,
        activity_type: 'booking',
        activity_data: {
          booking_id: booking.id,
          booking_number: booking.booking_number,
          type: booking.type,
          location: booking.location
        },
        created_at: new Date().toISOString()
      }])

    // Générer la confirmation vocale (async, ne bloque pas)
    generateBookingVoiceConfirmation(booking).catch(error => {
      console.error('Erreur génération vocale:', error)
    })

    return {
      success: true,
      booking,
      message: `Parfait ! Votre réservation ${booking.booking_number} est confirmée. Je vous envoie les détails immédiatement.`
    }
  } catch (error) {
    console.error('Exception création réservation:', error)
    return {
      success: false,
      error: 'Erreur système lors de la réservation',
      details: error.message
    }
  }
}

/**
 * Récupère les détails d'une réservation
 */
export async function getBookingDetails(bookingId) {
  try {
    const { data, error } = await supabase
      .from('gliitz_bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (error) {
      return { success: false, error: 'Réservation non trouvée' }
    }

    return { success: true, booking: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Annule une réservation
 */
export async function cancelBooking(bookingId, userId, reason = '') {
  try {
    const { data, error } = await supabase
      .from('gliitz_bookings')
      .update({
        status: 'cancelled',
        details: {
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString()
        }
      })
      .eq('id', bookingId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: 'Impossible d\'annuler la réservation' }
    }

    // Créer une notification d'annulation
    await supabase
      .from('gliitz_notifications')
      .insert([{
        user_id: userId,
        type: 'booking_cancellation',
        title: 'Réservation annulée',
        message: `Votre réservation ${data.booking_number} a été annulée.`,
        created_at: new Date().toISOString()
      }])

    return {
      success: true,
      booking: data,
      message: `Votre réservation ${data.booking_number} a été annulée avec succès.`
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Génère un message de confirmation formaté
 */
export function generateConfirmationMessage(booking) {
  const date = new Date(booking.booking_date)
  const dateStr = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })

  let message = `✨ **Réservation confirmée !**\n\n`
  message += `**Numéro de réservation:** ${booking.booking_number}\n`
  message += `**Type:** ${booking.type}${booking.sub_type ? ` - ${booking.sub_type}` : ''}\n`
  message += `**Date:** ${dateStr}\n`
  message += `**Lieu:** ${booking.location}\n`
  
  if (booking.guests_count) {
    message += `**Nombre de personnes:** ${booking.guests_count}\n`
  }
  
  if (booking.price) {
    message += `**Prix:** ${booking.price}€\n`
  }
  
  message += `\n🎉 Tout est prêt ! Je vous envoie une confirmation détaillée par email.\n`
  message += `\nSouhaitez-vous que je vous envoie également les détails par WhatsApp ?`

  return message
}

/**
 * Processus complet de réservation depuis le chat
 */
export async function processBookingFromChat(userId, message, context = {}) {
  // 1. Analyser la demande
  const analysis = analyzeBookingRequest(message)
  
  if (!analysis.isBookingRequest || analysis.confidence < 0.7) {
    return {
      success: false,
      needsMoreInfo: true,
      message: 'Je peux vous aider à faire une réservation. Pouvez-vous préciser ce que vous recherchez ? (restaurant, service, hébergement, événement)'
    }
  }

  // 2. Créer la réservation
  const bookingData = {
    type: analysis.type,
    subType: analysis.subType,
    location: analysis.location,
    booking_date: analysis.bookingDate,
    guestsCount: analysis.guestsCount,
    details: {
      source: 'chat',
      original_message: message,
      ...context
    }
  }

  const result = await createBooking(userId, bookingData)

  if (result.success) {
    // 3. Générer le message de confirmation
    const confirmationMessage = generateConfirmationMessage(result.booking)
    
    return {
      success: true,
      booking: result.booking,
      message: confirmationMessage,
      voice_confirmation: true
    }
  }

  return result
}

export default {
  analyzeBookingRequest,
  checkAvailability,
  createBooking,
  getBookingDetails,
  cancelBooking,
  generateConfirmationMessage,
  processBookingFromChat
}

