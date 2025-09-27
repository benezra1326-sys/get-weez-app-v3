// 🎯 SYSTÈME DE RÉSERVATION INTELLIGENT
// Objectif : L'IA peut prendre et gérer les réservations directement

export class ReservationSystem {
  constructor() {
    this.reservations = new Map()
    this.availability = new Map()
    this.establishments = new Map()
    this.reservationCounter = 0
  }

  // === INITIALISATION DU SYSTÈME ===
  initializeSystem() {
    // Créneaux disponibles par établissement
    this.availability.set('la-terraza-del-mar', {
      slots: [
        { time: '19:00', available: true, capacity: 30 },
        { time: '19:30', available: true, capacity: 30 },
        { time: '20:00', available: true, capacity: 30 },
        { time: '20:30', available: true, capacity: 30 },
        { time: '21:00', available: true, capacity: 30 },
        { time: '21:30', available: true, capacity: 30 },
        { time: '22:00', available: true, capacity: 30 }
      ],
      maxCapacity: 30,
      minPartySize: 1,
      maxPartySize: 8
    })

    this.availability.set('ocean-club', {
      slots: [
        { time: '20:00', available: true, capacity: 50 },
        { time: '20:30', available: true, capacity: 50 },
        { time: '21:00', available: true, capacity: 50 },
        { time: '21:30', available: true, capacity: 50 },
        { time: '22:00', available: true, capacity: 50 },
        { time: '22:30', available: true, capacity: 50 },
        { time: '23:00', available: true, capacity: 50 }
      ],
      maxCapacity: 50,
      minPartySize: 1,
      maxPartySize: 12
    })

    this.availability.set('casa-tua', {
      slots: [
        { time: '19:30', available: true, capacity: 40 },
        { time: '20:00', available: true, capacity: 40 },
        { time: '20:30', available: true, capacity: 40 },
        { time: '21:00', available: true, capacity: 40 },
        { time: '21:30', available: true, capacity: 40 },
        { time: '22:00', available: true, capacity: 40 }
      ],
      maxCapacity: 40,
      minPartySize: 1,
      maxPartySize: 10
    })
  }

  // === CRÉER UNE RÉSERVATION ===
  createReservation(establishmentId, reservationData) {
    const reservation = {
      id: `RES-${++this.reservationCounter}`,
      establishmentId,
      customerName: reservationData.customerName,
      customerPhone: reservationData.customerPhone,
      customerEmail: reservationData.customerEmail,
      partySize: reservationData.partySize,
      date: reservationData.date,
      time: reservationData.time,
      specialRequests: reservationData.specialRequests || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      confirmationCode: this.generateConfirmationCode()
    }

    // Vérifier la disponibilité
    if (!this.checkAvailability(establishmentId, reservationData.date, reservationData.time, reservationData.partySize)) {
      return {
        success: false,
        message: 'Désolé, ce créneau n\'est plus disponible.',
        alternativeSlots: this.getAlternativeSlots(establishmentId, reservationData.date)
      }
    }

    // Créer la réservation
    this.reservations.set(reservation.id, reservation)
    
    // Mettre à jour la disponibilité
    this.updateAvailability(establishmentId, reservationData.date, reservationData.time, reservationData.partySize)

    return {
      success: true,
      reservation,
      message: 'Réservation confirmée !'
    }
  }

  // === VÉRIFIER LA DISPONIBILITÉ ===
  checkAvailability(establishmentId, date, time, partySize) {
    const availability = this.availability.get(establishmentId)
    if (!availability) return false

    const slot = availability.slots.find(s => s.time === time)
    if (!slot) return false

    return slot.available && slot.capacity >= partySize
  }

  // === OBTENIR LES CRÉNEAUX DISPONIBLES ===
  getAvailableSlots(establishmentId, date) {
    const availability = this.availability.get(establishmentId)
    if (!availability) return []

    return availability.slots.filter(slot => slot.available)
  }

  // === OBTENIR DES CRÉNEAUX ALTERNATIFS ===
  getAlternativeSlots(establishmentId, date) {
    const availability = this.availability.get(establishmentId)
    if (!availability) return []

    return availability.slots
      .filter(slot => slot.available)
      .slice(0, 3) // Proposer 3 alternatives
      .map(slot => ({
        time: slot.time,
        capacity: slot.capacity
      }))
  }

  // === METTRE À JOUR LA DISPONIBILITÉ ===
  updateAvailability(establishmentId, date, time, partySize) {
    const availability = this.availability.get(establishmentId)
    if (!availability) return

    const slot = availability.slots.find(s => s.time === time)
    if (slot) {
      slot.capacity -= partySize
      if (slot.capacity <= 0) {
        slot.available = false
      }
    }
  }

  // === GÉNÉRER UN CODE DE CONFIRMATION ===
  generateConfirmationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // === OBTENIR UNE RÉSERVATION ===
  getReservation(reservationId) {
    return this.reservations.get(reservationId)
  }

  // === ANNULER UNE RÉSERVATION ===
  cancelReservation(reservationId) {
    const reservation = this.reservations.get(reservationId)
    if (!reservation) {
      return {
        success: false,
        message: 'Réservation non trouvée.'
      }
    }

    // Libérer le créneau
    this.releaseSlot(reservation.establishmentId, reservation.date, reservation.time, reservation.partySize)
    
    // Marquer comme annulée
    reservation.status = 'cancelled'
    reservation.cancelledAt = new Date().toISOString()

    return {
      success: true,
      message: 'Réservation annulée avec succès.'
    }
  }

  // === LIBÉRER UN CRÉNEAU ===
  releaseSlot(establishmentId, date, time, partySize) {
    const availability = this.availability.get(establishmentId)
    if (!availability) return

    const slot = availability.slots.find(s => s.time === time)
    if (slot) {
      slot.capacity += partySize
      if (slot.capacity > 0) {
        slot.available = true
      }
    }
  }

  // === GÉNÉRER UNE RÉPONSE IA POUR RÉSERVATION ===
  generateReservationResponse(establishmentId, reservationData, userType = 'guest') {
    const establishment = this.getEstablishment(establishmentId)
    if (!establishment) {
      return {
        success: false,
        message: 'Établissement non trouvé.'
      }
    }

    // Créer la réservation
    const result = this.createReservation(establishmentId, reservationData)
    
    if (!result.success) {
      return result
    }

    const reservation = result.reservation

    // Générer la réponse IA
    let aiResponse = `🎉 **RÉSERVATION CONFIRMÉE !**\n\n`
    aiResponse += `🍽️ **${establishment.name}**\n`
    aiResponse += `📍 ${establishment.location}\n`
    aiResponse += `👤 **Nom** : ${reservation.customerName}\n`
    aiResponse += `📅 **Date** : ${reservation.date}\n`
    aiResponse += `⏰ **Heure** : ${reservation.time}\n`
    aiResponse += `👥 **Personnes** : ${reservation.partySize}\n`
    aiResponse += `🔢 **Code de confirmation** : ${reservation.confirmationCode}\n\n`

    if (reservation.specialRequests) {
      aiResponse += `📝 **Demandes spéciales** : ${reservation.specialRequests}\n\n`
    }

    aiResponse += `**Contact de l'établissement** :\n`
    aiResponse += `📱 WhatsApp : ${establishment.contact.whatsapp}\n`
    aiResponse += `📞 Téléphone : ${establishment.contact.phone}\n`
    aiResponse += `📧 Email : ${establishment.contact.email}\n\n`

    if (userType === 'member') {
      aiResponse += `🎯 **Avantages membre** :\n`
      aiResponse += `• Table préférée réservée\n`
      aiResponse += `• Menu dégustation offert\n`
      aiResponse += `• Service prioritaire\n\n`
    }

    aiResponse += `**Prochaines étapes** :\n`
    aiResponse += `1. Présentez-vous à l'établissement\n`
    aiResponse += `2. Mentionnez votre code de confirmation\n`
    aiResponse += `3. Profitez de votre expérience !\n\n`
    aiResponse += `🍽️✨ Bon appétit !`

    return {
      success: true,
      message: aiResponse,
      reservation: reservation
    }
  }

  // === OBTENIR UN ÉTABLISSEMENT ===
  getEstablishment(establishmentId) {
    // Cette fonction devrait récupérer depuis la base de données
    // Pour l'instant, retourner des données statiques
    const establishments = {
      'la-terraza-del-mar': {
        name: 'La Terraza del Mar',
        location: 'Puerto Banús, Marbella',
        contact: {
          whatsapp: '+34 952 77 11 11',
          phone: '+34 952 77 11 11',
          email: 'reservas@terrazadelmar.com'
        }
      },
      'ocean-club': {
        name: 'Ocean Club',
        location: 'Puerto Banús, Marbella',
        contact: {
          whatsapp: '+34 952 77 00 00',
          phone: '+34 952 77 00 00',
          email: 'info@oceanclubmarbella.com'
        }
      },
      'casa-tua': {
        name: 'Casa Tua',
        location: 'Marbella Centro',
        contact: {
          whatsapp: '+34 952 77 22 22',
          phone: '+34 952 77 22 22',
          email: 'info@casatuamarbella.com'
        }
      }
    }

    return establishments[establishmentId]
  }

  // === GÉRER LES RÉSERVATIONS MULTIPLES ===
  createMultipleReservations(reservations) {
    const results = []
    const errors = []

    for (const reservation of reservations) {
      try {
        const result = this.createReservation(reservation.establishmentId, reservation.data)
        if (result.success) {
          results.push(result.reservation)
        } else {
          errors.push({
            establishment: reservation.establishmentId,
            error: result.message
          })
        }
      } catch (error) {
        errors.push({
          establishment: reservation.establishmentId,
          error: error.message
        })
      }
    }

    return {
      success: results.length > 0,
      reservations: results,
      errors: errors,
      message: `${results.length} réservation(s) créée(s), ${errors.length} erreur(s)`
    }
  }

  // === OBTENIR LES RÉSERVATIONS D'UN CLIENT ===
  getCustomerReservations(customerPhone) {
    const customerReservations = []
    
    for (const [id, reservation] of this.reservations) {
      if (reservation.customerPhone === customerPhone) {
        customerReservations.push(reservation)
      }
    }

    return customerReservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // === STATISTIQUES DE RÉSERVATIONS ===
  getReservationStats() {
    const stats = {
      total: this.reservations.size,
      confirmed: 0,
      cancelled: 0,
      byEstablishment: {}
    }

    for (const [id, reservation] of this.reservations) {
      if (reservation.status === 'confirmed') {
        stats.confirmed++
      } else if (reservation.status === 'cancelled') {
        stats.cancelled++
      }

      if (!stats.byEstablishment[reservation.establishmentId]) {
        stats.byEstablishment[reservation.establishmentId] = 0
      }
      stats.byEstablishment[reservation.establishmentId]++
    }

    return stats
  }
}

// === EXPORT POUR UTILISATION ===
export const reservationSystem = new ReservationSystem()
