#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const events = [
  { name: 'Sunset Beach Party', date: '2025-12-15', location: 'Ocean Club Marbella', price: 85, description: 'DJ set exclusif avec vue mer' },
  { name: 'Wine & Tapas Night', date: '2025-12-20', location: 'La Terraza', price: 65, description: 'Dégustation vins méditerranéens' },
  { name: 'Yacht VIP Night', date: '2025-12-22', location: 'Puerto Banús', price: 150, description: 'Soirée exclusive sur yacht privé' },
  { name: 'Rooftop DJ Session', date: '2025-12-25', location: 'Sky Lounge', price: 45, description: 'Session DJ vue panoramique' },
  { name: 'New Year Gala', date: '2025-12-31', location: 'Puente Romano', price: 250, description: 'Réveillon de luxe' }
]

const services = [
  { name: 'Chauffeur Privé VIP', type: 'Transport', description: 'Service de chauffeur disponible 24/7' },
  { name: 'Location Yacht', type: 'Nautique', description: 'Yachts de luxe avec équipage' },
  { name: 'Chef à Domicile', type: 'Gastronomie', description: 'Chef étoilé à votre villa' },
  { name: 'Spa Mobile', type: 'Wellness', description: 'Soins spa à domicile' },
  { name: 'Shopping Personal Shopper', type: 'Luxe', description: 'Accompagnement shopping Puerto Banús' }
]

async function fill() {
  console.log('🚀 Remplissage événements et services...\n')
  
  // Events
  for (const event of events) {
    const { error } = await supabase.from('events').insert([event])
    if (!error) console.log('✅', event.name)
  }
  
  // Services
  for (const service of services) {
    const { error } = await supabase.from('establishments').insert([{ ...service, type: 'Service' }])
    if (!error) console.log('✅', service.name)
  }
  
  console.log('\n🎉 TERMINÉ!')
}

fill()





