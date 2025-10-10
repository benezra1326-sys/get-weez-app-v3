#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Remplissage final de Supabase...\n')

// sponsoring = boolean (true = premium, false = standard)
const establishments = [
  { name: 'Nikki Beach Marbella', type: 'Beach Club', zone: 'Elviria', ambiance: 'Exclusif VIP', sponsoring: true, photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_website: 'https://nikkibeach.com/marbella', link_whatsapp: '+34600000001' },
  { name: 'Dani García', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Étoilé Michelin', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_website: 'https://dagala.es', link_whatsapp: '+34600000002' },
  { name: 'Nobu Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Japonais Fusion', sponsoring: true, photos: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200', link_website: 'https://noburestaurants.com/marbella', link_whatsapp: '+34600000003' },
  { name: 'Ocean Club', type: 'Beach Club', zone: 'Puente Romano', ambiance: 'Beach Club Chic', sponsoring: false, photos: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200', link_whatsapp: '+34600000004' },
  { name: 'Trocadero Arena', type: 'Beach Club', zone: 'Marbella Centro', ambiance: 'Légendaire', sponsoring: true, photos: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200', link_whatsapp: '+34600000005' },
  { name: 'Olivia Valere', type: 'Club', zone: 'Nueva Andalucía', ambiance: 'Nightclub Exclusif', sponsoring: true, photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200', link_whatsapp: '+34600000006' },
  { name: 'Skina', type: 'Restaurant', zone: 'Casco Antiguo', ambiance: '2 Étoiles Michelin', sponsoring: true, photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', link_website: 'https://restauranteskina.com', link_whatsapp: '+34600000007' },
  { name: 'La Sala Puerto Banús', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Lounge Mer', sponsoring: false, photos: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200', link_whatsapp: '+34600000008' },
  { name: 'Bibo Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Andalou Créatif', sponsoring: true, photos: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200', link_whatsapp: '+34600000009' },
  { name: 'Pangea', type: 'Club', zone: 'Puerto Banús', ambiance: 'VIP Nightlife', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', link_whatsapp: '+34600000010' },
  { name: 'Puente Romano Resort', type: 'Hotel', zone: 'Golden Mile', ambiance: 'Resort 5 Étoiles', sponsoring: true, photos: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', link_website: 'https://puenteromano.com', link_whatsapp: '+34600000011' },
  { name: 'Casanis Bistrot', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Bistrot Français', sponsoring: false, photos: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200', link_whatsapp: '+34600000012' },
  { name: 'Sky Lounge', type: 'Rooftop', zone: 'Marbella Centro', ambiance: 'Vue 360°', sponsoring: false, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34600000013' },
  { name: 'Amare Beach', type: 'Lounge', zone: 'Puente Romano', ambiance: 'Méditerranéen', sponsoring: true, photos: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200', link_whatsapp: '+34600000014' },
  { name: 'Buddha Beach', type: 'Lounge', zone: 'Puerto Banús', ambiance: 'Zen Asiatique', sponsoring: false, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34600000015' },
  { name: 'COYA Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Péruvien Chic', sponsoring: true, photos: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200', link_website: 'https://coyarestaurant.com/marbella', link_whatsapp: '+34600000016' },
  { name: 'Cipriani', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Italien Élégant', sponsoring: true, photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', link_whatsapp: '+34600000017' },
  { name: 'Tikitano', type: 'Beach Club', zone: 'Guadalmina', ambiance: 'Family Beach Club', sponsoring: false, photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', link_whatsapp: '+34600000018' },
  { name: 'Puro Beach', type: 'Beach Club', zone: 'Laguna Village', ambiance: 'Chic Décontracté', sponsoring: true, photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', link_website: 'https://purobeach.com', link_whatsapp: '+34600000019' },
  { name: 'Suite Club', type: 'Club', zone: 'Puerto Banús', ambiance: 'Nightclub Moderne', sponsoring: false, photos: 'https://images.unsplash.com/photo-1571266028243-d220c6c2b8d2?w=1200', link_whatsapp: '+34600000020' }
]

async function fillSupabase() {
  try {
    console.log('📊 Nettoyage...\n')
    await supabase.from('establishments').delete().neq('name', '')
    
    console.log('📊 Insertion...\n')
    
    let success = 0
    
    for (const estab of establishments) {
      const { data, error } = await supabase
        .from('establishments')
        .insert([estab])
        .select()
      
      if (error) {
        console.log('❌', estab.name, ':', error.message)
      } else {
        console.log('✅', estab.name)
        success++
      }
      
      await new Promise(r => setTimeout(r, 50))
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📊 ${success}/20 insérés`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    const { count } = await supabase.from('establishments').select('*', { count: 'exact', head: true })
    console.log(`✅ TOTAL: ${count} établissements\n`)
    
    if (count >= 15) console.log('🎉 SUPABASE PRÊT!\n')
    
  } catch (error) {
    console.error('❌', error.message)
  }
}

fillSupabase()




