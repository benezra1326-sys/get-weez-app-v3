export const serviceCategories = {
  gastronomie: {
    name: 'Gastronomie',
    icon: '🍽️',
    count: 8,
    color: '#EF4444'
  },
  vie_nocturne: {
    name: 'Vie nocturne',
    icon: '🍾',
    count: 6,
    color: '#EC4899'
  },
  luxe: {
    name: 'Luxe',
    icon: '👑',
    count: 8,
    color: '#F59E0B'
  },
  bien_etre: {
    name: 'Bien-être',
    icon: '🧘',
    count: 6,
    color: '#10B981'
  },
  experiences: {
    name: 'Expériences',
    icon: '✨',
    count: 8,
    color: '#8B5CF6'
  },
  sports: {
    name: 'Sports',
    icon: '🏃',
    count: 7,
    color: '#06B6D4'
  },
  culture: {
    name: 'Culture',
    icon: '🎨',
    count: 5,
    color: '#0EA5E9'
  }
}

export const services = [
  // Gastronomie
  {
    id: 1,
    name: 'Réservation de restaurant',
    description: 'Réservation dans les meilleurs restaurants de Marbella',
    category: 'gastronomie',
    image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80',
    icon: '🍽️',
    sponsored: true,
    duration: '2-4 heures',
    rating: 4.9
  },
  {
    id: 2,
    name: 'Réservation de beach club',
    description: 'Accès VIP aux beach clubs les plus exclusifs',
    category: 'gastronomie',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '🏖️',
    sponsored: false,
    duration: 'Journée complète',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Dîner en rooftop',
    description: 'Expérience gastronomique avec vue panoramique',
    category: 'gastronomie',
    image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&q=80',
    icon: '🏙️',
    sponsored: false,
    duration: '3-4 heures',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Chef privé à la villa',
    description: 'Chef personnel pour préparer vos repas à domicile',
    category: 'gastronomie',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80',
    icon: '👨‍🍳',
    sponsored: true,
    duration: '2-6 heures',
    rating: 4.9
  },
  {
    id: 5,
    name: 'Dégustation de vin privée',
    description: 'Découverte des meilleurs vins espagnols',
    category: 'gastronomie',
    image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80',
    icon: '🍷',
    sponsored: false,
    duration: '2-3 heures',
    rating: 4.6
  },
  {
    id: 6,
    name: 'Expérience gastronomique étoilée Michelin',
    description: 'Menu dégustation dans un restaurant étoilé',
    category: 'gastronomie',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '⭐',
    sponsored: true,
    duration: '3-4 heures',
    rating: 5.0
  },
  {
    id: 7,
    name: 'Tour gastronomique de tapas',
    description: 'Découverte des meilleures tapas de la région',
    category: 'gastronomie',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&q=80',
    icon: '🥘',
    sponsored: false,
    duration: '3-5 heures',
    rating: 4.5
  },
  {
    id: 8,
    name: 'Réservation de spectacle flamenco',
    description: 'Soirée flamenco avec dîner traditionnel',
    category: 'gastronomie',
    image_url: 'https://images.unsplash.com/photo-1571266028243-e4733b4a8c2e?w=800&h=600&fit=crop&q=80',
    icon: '💃',
    sponsored: false,
    duration: '2-3 heures',
    rating: 4.7
  },

  // Vie nocturne
  {
    id: 9,
    name: 'Table en discothèque',
    description: 'Réservation de table VIP en discothèque',
    category: 'vie_nocturne',
    image_url: 'https://images.unsplash.com/photo-1571266028243-e4733b4a8c2e?w=800&h=600&fit=crop&q=80',
    icon: '🎵',
    sponsored: true,
    duration: 'Soirée',
    rating: 4.8
  },
  {
    id: 10,
    name: 'Accès VIP en club',
    description: 'Accès prioritaire aux clubs les plus exclusifs',
    category: 'vie_nocturne',
    image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&q=80',
    icon: '🥂',
    sponsored: false,
    duration: 'Soirée',
    rating: 4.6
  },
  {
    id: 11,
    name: 'Billets de concert',
    description: 'Billets premium pour concerts et spectacles',
    category: 'vie_nocturne',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '🎤',
    sponsored: false,
    duration: '2-4 heures',
    rating: 4.5
  },
  {
    id: 12,
    name: 'Accès à un festival',
    description: 'Pass VIP pour festivals de musique',
    category: 'vie_nocturne',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🎪',
    sponsored: false,
    duration: 'Weekend',
    rating: 4.7
  },
  {
    id: 13,
    name: 'Soirée privée en bateau',
    description: 'Fête privée sur yacht avec DJ',
    category: 'vie_nocturne',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
    icon: '🛥️',
    sponsored: true,
    duration: '4-8 heures',
    rating: 4.9
  },
  {
    id: 14,
    name: 'Réservation de DJ',
    description: 'DJ privé pour vos événements',
    category: 'vie_nocturne',
    image_url: 'https://images.unsplash.com/photo-1571266028243-e4733b4a8c2e?w=800&h=600&fit=crop&q=80',
    icon: '🎧',
    sponsored: false,
    duration: '3-6 heures',
    rating: 4.6
  },

  // Luxe
  {
    id: 15,
    name: 'Location de yacht',
    description: 'Yacht privé pour la journée ou la soirée',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
    icon: '⛵',
    sponsored: true,
    duration: '4-12 heures',
    rating: 4.9
  },
  {
    id: 16,
    name: 'Location de villa',
    description: 'Villas de luxe avec vue sur mer',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80',
    icon: '🏰',
    sponsored: false,
    duration: 'Séjour',
    rating: 4.8
  },
  {
    id: 17,
    name: 'Service de majordome',
    description: 'Majordome personnel pour votre séjour',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '🤵',
    sponsored: true,
    duration: 'Séjour complet',
    rating: 4.9
  },
  {
    id: 18,
    name: 'Chauffeur privé',
    description: 'Chauffeur VIP avec véhicule de luxe',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80',
    icon: '🚗',
    sponsored: false,
    duration: 'Selon besoin',
    rating: 4.7
  },
  {
    id: 19,
    name: 'Location de voiture de luxe',
    description: 'Ferrari, Lamborghini, Rolls-Royce...',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80',
    icon: '🏎️',
    sponsored: false,
    duration: 'Journée/Semaine',
    rating: 4.8
  },
  {
    id: 20,
    name: 'Tour en hélicoptère',
    description: 'Vol privé au-dessus de la Costa del Sol',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80',
    icon: '🚁',
    sponsored: true,
    duration: '30-60 minutes',
    rating: 4.9
  },
  {
    id: 21,
    name: 'Jet privé',
    description: 'Avion privé pour vos déplacements',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80',
    icon: '✈️',
    sponsored: false,
    duration: 'Selon destination',
    rating: 5.0
  },
  {
    id: 22,
    name: 'Personal shopper',
    description: 'Shopping VIP avec conseiller personnel',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80',
    icon: '🛍️',
    sponsored: false,
    duration: '3-6 heures',
    rating: 4.6
  },

  // Bien-être
  {
    id: 23,
    name: 'Soins spa et bien-être',
    description: 'Spa de luxe avec soins personnalisés',
    category: 'bien_etre',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '🧖‍♀️',
    sponsored: true,
    duration: '2-4 heures',
    rating: 4.8
  },
  {
    id: 24,
    name: 'Massage à domicile',
    description: 'Massage relaxant dans votre villa',
    category: 'bien_etre',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '💆‍♀️',
    sponsored: false,
    duration: '1-2 heures',
    rating: 4.7
  },
  {
    id: 25,
    name: 'Cours privé de pilates',
    description: 'Séance de pilates personnalisée',
    category: 'bien_etre',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '🤸‍♀️',
    sponsored: false,
    duration: '1 heure',
    rating: 4.6
  },
  {
    id: 26,
    name: 'Séance de yoga',
    description: 'Yoga sur la plage ou dans votre villa',
    category: 'bien_etre',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '🧘‍♀️',
    sponsored: false,
    duration: '1-2 heures',
    rating: 4.5
  },
  {
    id: 27,
    name: 'Coach sportif personnel',
    description: 'Entraînement personnalisé avec coach',
    category: 'bien_etre',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '💪',
    sponsored: false,
    duration: '1-2 heures',
    rating: 4.7
  },
  {
    id: 28,
    name: 'Consultation nutritionniste',
    description: 'Conseils nutrition personnalisés',
    category: 'bien_etre',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
    icon: '🥗',
    sponsored: false,
    duration: '1-2 heures',
    rating: 4.6
  },

  // Expériences
  {
    id: 29,
    name: 'Séance photo professionnelle',
    description: 'Photographe professionnel pour vos souvenirs',
    category: 'experiences',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '📸',
    sponsored: true,
    duration: '2-4 heures',
    rating: 4.8
  },
  {
    id: 30,
    name: 'Vidéaste privé',
    description: 'Vidéaste pour documenter votre séjour',
    category: 'experiences',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '🎥',
    sponsored: false,
    duration: 'Journée/Séjour',
    rating: 4.7
  },
  {
    id: 31,
    name: 'Organisation d\'événement',
    description: 'Organisation complète de vos événements',
    category: 'experiences',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '🎉',
    sponsored: false,
    duration: 'Selon événement',
    rating: 4.8
  },
  {
    id: 32,
    name: 'Forfait anniversaire',
    description: 'Célébration d\'anniversaire inoubliable',
    category: 'experiences',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '🎂',
    sponsored: false,
    duration: 'Journée complète',
    rating: 4.7
  },
  {
    id: 33,
    name: 'Mise en scène romantique',
    description: 'Déclaration d\'amour ou demande en mariage',
    category: 'experiences',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '💕',
    sponsored: true,
    duration: '2-6 heures',
    rating: 4.9
  },
  {
    id: 34,
    name: 'Coiffeur à domicile',
    description: 'Service de coiffure à votre villa',
    category: 'experiences',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '💇‍♀️',
    sponsored: false,
    duration: '1-3 heures',
    rating: 4.6
  },
  {
    id: 35,
    name: 'Maquilleur professionnel',
    description: 'Maquillage professionnel pour vos événements',
    category: 'experiences',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '💄',
    sponsored: false,
    duration: '1-2 heures',
    rating: 4.7
  },
  {
    id: 36,
    name: 'Tour shopping VIP',
    description: 'Shopping VIP à Puerto Banús',
    category: 'experiences',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80',
    icon: '🛒',
    sponsored: false,
    duration: '3-6 heures',
    rating: 4.6
  },

  // Sports
  {
    id: 37,
    name: 'Réservation de golf',
    description: 'Tee-time dans les meilleurs parcours',
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '⛳',
    sponsored: true,
    duration: '4-6 heures',
    rating: 4.8
  },
  {
    id: 38,
    name: 'Cours de tennis',
    description: 'Cours privé avec professeur professionnel',
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🎾',
    sponsored: false,
    duration: '1-2 heures',
    rating: 4.6
  },
  {
    id: 39,
    name: 'Location de paddle',
    description: 'Stand-up paddle sur la Méditerranée',
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🏄‍♀️',
    sponsored: false,
    duration: '1-3 heures',
    rating: 4.5
  },
  {
    id: 40,
    name: 'Sports nautiques',
    description: 'Jet ski, flyboard, wakeboard...',
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🌊',
    sponsored: false,
    duration: '2-4 heures',
    rating: 4.7
  },
  {
    id: 41,
    name: 'Expérience de plongée',
    description: 'Plongée sous-marine avec instructeur',
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🤿',
    sponsored: false,
    duration: '3-6 heures',
    rating: 4.8
  },
  {
    id: 42,
    name: 'Balade à cheval',
    description: 'Randonnée équestre le long de la plage',
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🐎',
    sponsored: false,
    duration: '2-3 heures',
    rating: 4.6
  },
  {
    id: 43,
    name: 'Excursion de randonnée',
    description: 'Randonnée guidée dans les montagnes',
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🥾',
    sponsored: false,
    duration: '4-8 heures',
    rating: 4.5
  },

  // Culture
  {
    id: 44,
    name: 'Visite de musée',
    description: 'Visite privée des musées de la région',
    category: 'culture',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🏛️',
    sponsored: false,
    duration: '2-4 heures',
    rating: 4.4
  },
  {
    id: 45,
    name: 'Visite privée de galerie d\'art',
    description: 'Découverte de l\'art contemporain local',
    category: 'culture',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&q=80',
    icon: '🎨',
    sponsored: false,
    duration: '1-3 heures',
    rating: 4.5
  },
  // Services de luxe VIP
  {
    id: 46,
    name: 'Yacht Charter Premium',
    description: 'Location de yachts de luxe avec équipage complet',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=400&fit=crop&q=80',
    icon: '🛥️',
    price_level: 5,
    tags: ['luxe', 'premium', 'vip', 'yacht'],
    sponsored: true,
    duration: 'À la journée ou demi-journée',
    rating: 4.9,
    priceRange: '€€€€€'
  },
  {
    id: 47,
    name: 'Spa Privé VIP',
    description: 'Spa privé avec thérapeutes personnels et soins exclusifs',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop&q=80',
    icon: '💆',
    price_level: 4,
    tags: ['luxe', 'premium', 'spa', 'wellness'],
    sponsored: true,
    duration: '2-4 heures',
    rating: 4.8,
    priceRange: '€€€€'
  },
  {
    id: 48,
    name: 'Concierge VIP 24/7',
    description: 'Service de concierge personnel disponible 24/7 pour toutes vos demandes',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop&q=80',
    icon: '🎩',
    price_level: 5,
    tags: ['luxe', 'premium', 'vip', 'concierge'],
    sponsored: true,
    duration: 'Service continu',
    rating: 4.9,
    priceRange: '€€€€€'
  },
  {
    id: 49,
    name: 'Jet Privé & Hélicoptère',
    description: 'Transport VIP en jet privé ou hélicoptère',
    category: 'luxe',
    image_url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop&q=80',
    icon: '🚁',
    price_level: 5,
    tags: ['luxe', 'premium', 'vip', 'transport'],
    sponsored: true,
    duration: 'Variable selon destination',
    rating: 5.0,
    priceRange: '€€€€€'
  }
]
