// Système de réservation en mode test
// Permet de tester toutes les fonctionnalités sans restrictions

// Base de données des établissements avec contacts
const establishments = {
  'ocean-club': {
    name: 'Ocean Club',
    type: 'restaurant',
    capacity: 50,
    contacts: {
      whatsapp: '+34 952 77 00 00',
      phone: '+34 952 77 00 00',
      website: 'www.oceanclubmarbella.com',
      email: 'info@oceanclubmarbella.com',
      instagram: '@oceanclubmarbella',
      facebook: 'Ocean Club Marbella'
    },
    features: ['DJ', 'Terrasse', 'Vue mer', 'Ambiance moderne'],
    availability: {
      monday: { open: '20:00', close: '02:00' },
      tuesday: { open: '20:00', close: '02:00' },
      wednesday: { open: '20:00', close: '02:00' },
      thursday: { open: '20:00', close: '02:00' },
      friday: { open: '20:00', close: '03:00' },
      saturday: { open: '20:00', close: '03:00' },
      sunday: { open: '20:00', close: '02:00' }
    }
  },
  'terraza-del-mar': {
    name: 'La Terraza del Mar',
    type: 'restaurant',
    capacity: 30,
    contacts: {
      whatsapp: '+34 952 77 11 11',
      phone: '+34 952 77 11 11',
      website: 'www.terrazadelmar.com',
      email: 'reservas@terrazadelmar.com',
      instagram: '@terrazadelmar',
      facebook: 'La Terraza del Mar'
    },
    features: ['Vue mer', 'Terrasse', 'Ambiance romantique', 'Cuisine méditerranéenne'],
    availability: {
      monday: { open: '19:00', close: '23:00' },
      tuesday: { open: '19:00', close: '23:00' },
      wednesday: { open: '19:00', close: '23:00' },
      thursday: { open: '19:00', close: '23:00' },
      friday: { open: '19:00', close: '24:00' },
      saturday: { open: '19:00', close: '24:00' },
      sunday: { open: '19:00', close: '23:00' }
    }
  },
  'casa-tua': {
    name: 'Casa Tua',
    type: 'restaurant',
    capacity: 25,
    contacts: {
      whatsapp: '+34 952 77 22 22',
      phone: '+34 952 77 22 22',
      website: 'www.casatua.com',
      email: 'info@casatua.com',
      instagram: '@casatua',
      facebook: 'Casa Tua Marbella'
    },
    features: ['Cuisine italienne', 'Cadre élégant', 'Ambiance intime', 'Terrasse'],
    availability: {
      monday: { open: '19:30', close: '23:30' },
      tuesday: { open: '19:30', close: '23:30' },
      wednesday: { open: '19:30', close: '23:30' },
      thursday: { open: '19:30', close: '23:30' },
      friday: { open: '19:30', close: '24:00' },
      saturday: { open: '19:30', close: '24:00' },
      sunday: { open: '19:30', close: '23:30' }
    }
  },
  'sake-bar': {
    name: 'Sake Bar Marbella',
    type: 'restaurant',
    capacity: 20,
    contacts: {
      whatsapp: '+34 952 77 33 33',
      phone: '+34 952 77 33 33',
      website: 'www.sakebarmarbella.com',
      email: 'reservas@sakebarmarbella.com',
      instagram: '@sakebarmarbella',
      facebook: 'Sake Bar Marbella'
    },
    features: ['Sushis', 'Saké', 'Ambiance zen', 'Cuisine japonaise'],
    availability: {
      monday: { open: '20:00', close: '24:00' },
      tuesday: { open: '20:00', close: '24:00' },
      wednesday: { open: '20:00', close: '24:00' },
      thursday: { open: '20:00', close: '24:00' },
      friday: { open: '20:00', close: '01:00' },
      saturday: { open: '20:00', close: '01:00' },
      sunday: { open: '20:00', close: '24:00' }
    }
  },
  'marbella-club': {
    name: 'Marbella Club Hotel Restaurant',
    type: 'restaurant',
    capacity: 40,
    contacts: {
      whatsapp: '+34 952 77 44 44',
      phone: '+34 952 77 44 44',
      website: 'www.marbellaclub.com',
      email: 'restaurant@marbellaclub.com',
      instagram: '@marbellaclub',
      facebook: 'Marbella Club Hotel'
    },
    features: ['Terrasse paisible', 'Vue mer', 'Cuisine raffinée', 'Ambiance luxueuse'],
    availability: {
      monday: { open: '19:00', close: '23:00' },
      tuesday: { open: '19:00', close: '23:00' },
      wednesday: { open: '19:00', close: '23:00' },
      thursday: { open: '19:00', close: '23:00' },
      friday: { open: '19:00', close: '24:00' },
      saturday: { open: '19:00', close: '24:00' },
      sunday: { open: '19:00', close: '23:00' }
    }
  }
}

// Fonction de réservation en mode test
function bookEstablishment(establishmentId, date, time, guests, userInfo) {
  const establishment = establishments[establishmentId]
  
  if (!establishment) {
    return {
      success: false,
      error: 'Établissement non trouvé',
      message: 'Désolé, cet établissement n\'existe pas.'
    }
  }
  
  // Vérifier la disponibilité (mode test - toujours disponible)
  const isAvailable = true // En mode test, toujours disponible
  
  if (!isAvailable) {
    return {
      success: false,
      error: 'Non disponible',
      message: 'Désolé, cet établissement n\'est pas disponible à cette date/heure.'
    }
  }
  
  // Créer la réservation (mode test)
  const reservation = {
    id: `RES-${Date.now()}`,
    establishment: establishment.name,
    date: date,
    time: time,
    guests: guests,
    user: userInfo,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    contacts: establishment.contacts
  }
  
  return {
    success: true,
    reservation: reservation,
    message: `Réservation confirmée ! ${establishment.name} le ${date} à ${time} pour ${guests} personnes.`,
    contacts: establishment.contacts
  }
}

// Fonction pour obtenir les contacts d'un établissement
function getEstablishmentContacts(establishmentId) {
  const establishment = establishments[establishmentId]
  
  if (!establishment) {
    return {
      success: false,
      error: 'Établissement non trouvé',
      message: 'Désolé, cet établissement n\'existe pas.'
    }
  }
  
  return {
    success: true,
    contacts: establishment.contacts,
    message: `Voici les contacts de ${establishment.name}:`
  }
}

// Fonction pour vérifier la disponibilité
function checkAvailability(establishmentId, date, time) {
  const establishment = establishments[establishmentId]
  
  if (!establishment) {
    return {
      success: false,
      error: 'Établissement non trouvé',
      message: 'Désolé, cet établissement n\'existe pas.'
    }
  }
  
  // En mode test, toujours disponible
  return {
    success: true,
    available: true,
    message: `${establishment.name} est disponible le ${date} à ${time}.`
  }
}

// Export pour utilisation
module.exports = {
  establishments,
  bookEstablishment,
  getEstablishmentContacts,
  checkAvailability
}
