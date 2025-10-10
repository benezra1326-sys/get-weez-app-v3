import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Fonction pour générer une date aléatoire dans les 6 prochains mois
function getRandomDate() {
  const today = new Date('2025-10-10') // Aujourd'hui
  const sixMonthsLater = new Date('2026-04-10') // Dans 6 mois
  const randomTime = today.getTime() + Math.random() * (sixMonthsLater.getTime() - today.getTime())
  return new Date(randomTime)
}

// Fonction pour formater la date
function formatDate(date) {
  return date.toISOString().split('T')[0]
}

// Clubs et lieux réels de Marbella
const venues = [
  { name: 'Olivia Valere', zone: 'Nueva Andalucía', type: 'Nightclub' },
  { name: 'Sala Beach', zone: 'Puerto Banús', type: 'Beach Club' },
  { name: 'Nikki Beach', zone: 'Elviria', type: 'Beach Club' },
  { name: 'Tibu Marbella', zone: 'Puerto Banús', type: 'Nightclub' },
  { name: 'Ocean Club', zone: 'Puerto Banús', type: 'Beach Club' },
  { name: 'Pangea', zone: 'Marbella Centro', type: 'Nightclub' },
  { name: 'Suite Del Mar', zone: 'Puerto Banús', type: 'Lounge' },
  { name: 'Momento', zone: 'Puerto Banús', type: 'Restaurant & Club' },
  { name: 'La Sala', zone: 'Puerto Banús', type: 'Restaurant & Bar' },
  { name: 'Funky Buddha', zone: 'Puerto Banús', type: 'Nightclub' }
]

// DJs et artistes internationaux
const djs = [
  'David Guetta', 'Calvin Harris', 'Martin Garrix', 'Tiesto', 'Armin van Buuren',
  'Afrojack', 'Steve Aoki', 'Dimitri Vegas & Like Mike', 'Hardwell', 'Alesso',
  'Don Diablo', 'Oliver Heldens', 'Nicky Romero', 'Axwell', 'Solomun',
  'Black Coffee', 'Dixon', 'Tale Of Us', 'Maceo Plex', 'Adam Beyer'
]

// Types d'événements
const eventTypes = [
  { type: 'DJ Set', emoji: '🎧' },
  { type: 'Live Performance', emoji: '🎤' },
  { type: 'Beach Party', emoji: '🏖️' },
  { type: 'Sunset Session', emoji: '🌅' },
  { type: 'Night Experience', emoji: '🌙' },
  { type: 'White Party', emoji: '🤍' },
  { type: 'Pool Party', emoji: '🏊' },
  { type: 'Rooftop Night', emoji: '🌃' },
  { type: 'VIP Experience', emoji: '✨' },
  { type: 'Festival Night', emoji: '🎊' }
]

// Générer 50 événements
function generateEvents() {
  const events = []
  
  for (let i = 0; i < 50; i++) {
    const venue = venues[Math.floor(Math.random() * venues.length)]
    const dj = djs[Math.floor(Math.random() * djs.length)]
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const date = getRandomDate()
    const hour = 20 + Math.floor(Math.random() * 5) // Entre 20h et 00h
    
    // Générer un prix aléatoire
    const prices = [
      { level: '€€', min: 25, max: 40 },
      { level: '€€€', min: 40, max: 80 },
      { level: '€€€€', min: 80, max: 150 }
    ]
    const priceRange = prices[Math.floor(Math.random() * prices.length)]
    const price = Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min)
    
    const highlights = [
      `DJ Set par ${dj}`,
      'Open Bar disponible',
      'VIP Tables',
      'Terrasse privée'
    ].join(' • ')
    
    events.push({
      title: `${eventType.emoji} ${eventType.type} avec ${dj}`,
      description: `Soirée exclusive au ${venue.name} avec le DJ international ${dj}. ${eventType.type} inoubliable dans l'un des lieux les plus prestigieux de Marbella. ${highlights}. 21+. Réservation conseillée.`,
      date: formatDate(date),
      location: venue.name,
      image_url: null,
      source: 'gliitz_generated',
      member_only: false
    })
  }
  
  // Trier par date
  return events.sort((a, b) => new Date(a.date) - new Date(b.date))
}

async function insertEvents() {
  console.log('🎉 Génération de 50 événements...\n')
  
  const events = generateEvents()
  
  // Supprimer les anciens événements
  console.log('🗑️  Suppression des anciens événements...')
  await supabase.from('events').delete().neq('id', 0)
  
  console.log('📝 Insertion des nouveaux événements...\n')
  
  let success = 0
  let failed = 0
  
  for (const event of events) {
    const { error } = await supabase
      .from('events')
      .insert([event])
    
    if (error) {
      console.log(`❌ ${event.name}: ${error.message}`)
      failed++
    } else {
      console.log(`✅ ${event.date} - ${event.name}`)
      success++
    }
  }
  
  console.log(`\n✅ ${success} événements créés, ${failed} échoués`)
}

insertEvents()

