#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🚀 Remplissage complet de Supabase...\n')

// EVENTS
const events = [
  { name: 'Sunset Beach Party', date: '2025-12-15T20:00:00Z', location: 'Ocean Club Marbella', price: 85, description: 'DJ set exclusif avec vue sur mer', image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', category: 'Beach Club', sponsoring: true },
  { name: 'Wine & Tapas Night', date: '2025-12-20T19:30:00Z', location: 'La Terraza', price: 65, description: 'Dégustation de vins méditerranéens', image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800', category: 'Gastronomie', sponsoring: true },
  { name: 'Yacht VIP Night', date: '2025-12-22T21:00:00Z', location: 'Puerto Banús', price: 150, description: 'Soirée exclusive sur yacht privé', image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', category: 'VIP', sponsoring: true },
  { name: 'Rooftop DJ Session', date: '2025-12-25T22:00:00Z', location: 'Sky Lounge', price: 45, description: 'Session DJ avec vue panoramique', image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', category: 'Nightlife', sponsoring: false },
  { name: 'New Year Gala', date: '2025-12-31T20:00:00Z', location: 'Puente Romano Resort', price: 250, description: 'Réveillon de luxe avec dîner gastronomique', image_url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800', category: 'Gala', sponsoring: true },
  { name: 'Brunch & Pool Party', date: '2026-01-05T12:00:00Z', location: 'Nikki Beach', price: 75, description: 'Brunch champagne au bord de la piscine', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', category: 'Beach Club', sponsoring: true }
]

// SERVICES
const services = [
  { name: 'Chauffeur Privé VIP', type: 'Transport', category: 'Luxe', description: 'Service de chauffeur disponible 24/7', price: '150€/jour', image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800', sponsoring: true },
  { name: 'Location Yacht de Luxe', type: 'Nautique', category: 'Prestige', description: 'Yachts 15-50m avec équipage', price: 'Sur devis', image_url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800', sponsoring: true },
  { name: 'Chef à Domicile', type: 'Gastronomie', category: 'Culinaire', description: 'Chef étoilé Michelin pour dîners privés', price: '500€+', image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', sponsoring: true },
  { name: 'Spa Mobile Premium', type: 'Wellness', category: 'Bien-être', description: 'Soins spa à domicile', price: '120€/h', image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', sponsoring: true },
  { name: 'Personal Shopper', type: 'Shopping', category: 'Luxe', description: 'Shopping personnalisé Puerto Banús', price: '200€/session', image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', sponsoring: true },
  { name: 'Hélicoptère Privé', type: 'Transport', category: 'VIP', description: 'Transferts héliportés', price: '1200€+', image_url: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=800', sponsoring: true },
  { name: 'Organisation Événements', type: 'Events', category: 'Événementiel', description: 'Soirées, mariages, anniversaires', price: 'Sur devis', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', sponsoring: true },
  { name: 'Location Villa Luxe', type: 'Immobilier', category: 'Prestige', description: 'Villas d\'exception avec conciergerie', price: '3000€/nuit', image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', sponsoring: true },
  { name: 'Coach Sportif', type: 'Sport', category: 'Bien-être', description: 'Entraîneur personnel', price: '80€/session', image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', sponsoring: false },
  { name: 'Location Voiture Sport', type: 'Transport', category: 'Luxe', description: 'Ferrari, Lamborghini, Porsche', price: '500€/jour', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', sponsoring: true },
  { name: 'Photographe Pro', type: 'Photo', category: 'Services', description: 'Shooting événements ou portraits', price: '300€/session', image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800', sponsoring: false },
  { name: 'Sécurité Rapprochée', type: 'Sécurité', category: 'VIP', description: 'Gardes du corps discrets', price: 'Sur devis', image_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800', sponsoring: true },
  { name: 'Jet Privé', type: 'Aviation', category: 'Prestige', description: 'Vols européens et internationaux', price: '5000€+', image_url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800', sponsoring: true },
  { name: 'Styliste Personnel', type: 'Mode', category: 'Luxe', description: 'Conseil en image', price: '250€/session', image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', sponsoring: false },
  { name: 'Organisation Anniversaire', type: 'Événementiel', category: 'Services', description: 'Organisation complète de fêtes d\'anniversaire sur mesure', price: 'À partir de 150€', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', sponsoring: false }
]

async function fillAll() {
  let eventsCount = 0
  let servicesCount = 0
  
  // EVENTS
  console.log('📅 Événements...')
  for (const event of events) {
    const { error } = await supabase.from('events').insert([event])
    if (!error) {
      console.log('  ✅', event.name)
      eventsCount++
    }
  }
  
  // SERVICES
  console.log('\n🛎️  Services...')
  for (const service of services) {
    const { error } = await supabase.from('services').insert([service])
    if (!error) {
      console.log('  ✅', service.name)
      servicesCount++
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ ${eventsCount} événements`)
  console.log(`✅ ${servicesCount} services`)
  
  const { count: estabCount } = await supabase.from('establishments').select('*', { count: 'exact', head: true })
  console.log(`✅ ${estabCount} établissements`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n🎉 BASE DE DONNÉES COMPLÈTE!\n')
}

fillAll()



