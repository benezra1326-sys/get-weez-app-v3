#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const services = [
  { name: 'Chauffeur Privé VIP', type: 'Transport', category: 'Luxe', description: 'Service de chauffeur privé disponible 24/7 pour tous vos déplacements à Marbella', price: 'À partir de 150€/jour', image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800', sponsoring: true },
  { name: 'Location Yacht de Luxe', type: 'Nautique', category: 'Prestige', description: 'Yachts de 15 à 50 mètres avec équipage professionnel', price: 'Sur devis', image_url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800', sponsoring: true },
  { name: 'Chef à Domicile', type: 'Gastronomie', category: 'Culinaire', description: 'Chef étoilé Michelin pour dîners privés dans votre villa', price: 'À partir de 500€', image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', sponsoring: true },
  { name: 'Spa Mobile Premium', type: 'Wellness', category: 'Bien-être', description: 'Soins spa et massages à domicile par thérapeutes certifiés', price: 'À partir de 120€/h', image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', sponsoring: true },
  { name: 'Personal Shopper Puerto Banús', type: 'Shopping', category: 'Luxe', description: 'Accompagnement shopping personnalisé dans les boutiques de luxe', price: '200€/session', image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', sponsoring: true },
  { name: 'Hélicoptère Privé', type: 'Transport', category: 'VIP', description: 'Transferts héliportés vers Gibraltar, Málaga, Séville', price: 'À partir de 1200€', image_url: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=800', sponsoring: true },
  { name: 'Organisation Événements', type: 'Events', category: 'Événementiel', description: 'Organisation complète de soirées, mariages, anniversaires', price: 'Sur devis', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', sponsoring: true },
  { name: 'Location Villa de Luxe', type: 'Immobilier', category: 'Prestige', description: 'Villas d\'exception avec service de conciergerie inclus', price: 'À partir de 3000€/nuit', image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', sponsoring: true },
  { name: 'Coach Sportif Personnel', type: 'Sport', category: 'Bien-être', description: 'Entraîneur personnel pour sessions privées', price: '80€/session', image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', sponsoring: false },
  { name: 'Location Voiture de Sport', type: 'Transport', category: 'Luxe', description: 'Ferrari, Lamborghini, Porsche disponibles', price: 'À partir de 500€/jour', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', sponsoring: true },
  { name: 'Photographe Professionnel', type: 'Photo', category: 'Services', description: 'Shooting photo professionnel pour événements ou portraits', price: '300€/session', image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800', sponsoring: false },
  { name: 'Sécurité Rapprochée', type: 'Sécurité', category: 'VIP', description: 'Gardes du corps professionnels discrets', price: 'Sur devis', image_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800', sponsoring: true },
  { name: 'Location Jet Privé', type: 'Aviation', category: 'Prestige', description: 'Jets privés pour destinations européennes et internationales', price: 'À partir de 5000€', image_url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800', sponsoring: true },
  { name: 'Styliste Personnel', type: 'Mode', category: 'Luxe', description: 'Conseil en image et shopping styliste', price: '250€/session', image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', sponsoring: false },
  { name: 'Organisation Anniversaire', type: 'Événementiel', category: 'Services', description: 'Organisation complète de fêtes d\'anniversaire sur mesure', price: 'À partir de 150€', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', sponsoring: false }
]

async function fillServices() {
  console.log('🚀 Remplissage de la table services...\n')
  
  let success = 0
  
  for (const service of services) {
    const { error } = await supabase.from('services').insert([service])
    if (error) {
      console.log('❌', service.name, ':', error.message)
    } else {
      console.log('✅', service.name)
      success++
    }
    await new Promise(r => setTimeout(r, 50))
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📊 ${success}/${services.length} services ajoutés`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  const { count } = await supabase.from('services').select('*', { count: 'exact', head: true })
  console.log(`✅ TOTAL: ${count} services\n`)
}

fillServices()



