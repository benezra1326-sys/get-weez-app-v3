const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Remplissage de Supabase avec les VRAIES colonnes...\n')

// UTILISER LES COLONNES EXACTES: name, type, zone, ambiance, sponsoring, photos, link_whatsapp, link_website
const establishments = [
  { name: 'Nikki Beach Marbella', type: 'beach_club', zone: 'Elviria', ambiance: 'Exclusif VIP', photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_website: 'https://nikkibeach.com/marbella' },
  { name: 'Dani García', type: 'restaurant', zone: 'Marbella Centro', ambiance: 'Étoilé Michelin', photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_website: 'https://dagala.es' },
  { name: 'Nobu Marbella', type: 'restaurant', zone: 'Puente Romano', ambiance: 'Japonais Fusion', photos: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200', link_website: 'https://noburestaurants.com/marbella' },
  { name: 'Ocean Club', type: 'beach_club', zone: 'Puente Romano', ambiance: 'Beach Club Chic', photos: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200' },
  { name: 'Trocadero Arena', type: 'beach_club', zone: 'Marbella Centro', ambiance: 'Légendaire', photos: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200' },
  { name: 'Olivia Valere', type: 'club', zone: 'Nueva Andalucía', ambiance: 'Nightclub Exclusif', photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200' },
  { name: 'Skina', type: 'restaurant', zone: 'Casco Antiguo', ambiance: '2 Étoiles Michelin', photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200' },
  { name: 'La Sala Puerto Banús', type: 'restaurant', zone: 'Puerto Banús', ambiance: 'Lounge Mer', photos: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200' },
  { name: 'Bibo Marbella', type: 'restaurant', zone: 'Puente Romano', ambiance: 'Andalou Créatif', photos: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' },
  { name: 'Pangea', type: 'club', zone: 'Puerto Banús', ambiance: 'VIP Nightlife', photos: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200' },
  { name: 'Puente Romano Resort', type: 'hotel', zone: 'Golden Mile', ambiance: 'Resort 5 Étoiles', photos: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', link_website: 'https://puenteromano.com' },
  { name: 'Casanis Bistrot', type: 'restaurant', zone: 'Marbella Centro', ambiance: 'Bistrot Français', photos: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200' },
  { name: 'Sky Lounge', type: 'rooftop', zone: 'Marbella Centro', ambiance: 'Vue 360°', photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200' },
  { name: 'Amare Beach', type: 'lounge', zone: 'Puente Romano', ambiance: 'Méditerranéen', photos: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200' },
  { name: 'Buddha Beach', type: 'lounge', zone: 'Puerto Banús', ambiance: 'Zen Asiatique', photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  { name: 'COYA Marbella', type: 'restaurant', zone: 'Puente Romano', ambiance: 'Péruvien Chic', photos: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200' },
  { name: 'Cipriani', type: 'restaurant', zone: 'Puerto Banús', ambiance: 'Italien Élégant', photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200' },
  { name: 'Tikitano', type: 'beach_club', zone: 'Guadalmina', ambiance: 'Family Beach Club', photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { name: 'Puro Beach', type: 'beach_club', zone: 'Laguna Village', ambiance: 'Chic Décontracté', photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { name: 'Suite Club', type: 'club', zone: 'Puerto Banús', ambiance: 'Nightclub Moderne', photos: 'https://images.unsplash.com/photo-1571266028243-d220c6c2b8d2?w=1200' }
]

async function fillSupabase() {
  console.log('📊 Nettoyage des anciennes données...\n')
  await supabase.from('establishments').delete().neq('id', 0)
  
  let success = 0
  
  console.log('📍 Insertion des établissements...\n')
  
  for (const estab of establishments) {
    const { data, error } = await supabase.from('establishments').insert([estab]).select()
    
    if (error) {
      console.log('❌', estab.name + ':', error.message)
    } else {
      console.log('✅', estab.name, '(ID:', data[0].id + ')')
      success++
    }
    
    await new Promise(r => setTimeout(r, 100))
  }
  
  console.log('\n📊 RÉSULTAT:', success + '/' + establishments.length, 'établissements insérés\n')
  
  const { count: finalCount } = await supabase.from('establishments').select('*', { count: 'exact', head: true })
  console.log('✅ TOTAL DANS SUPABASE:', finalCount, 'établissements\n')
  
  if (finalCount >= 10) {
    console.log('🎉🎉🎉 SUPABASE REMPLI AVEC SUCCÈS! 🎉🎉🎉\n')
  }
}

fillSupabase().catch(console.error)
