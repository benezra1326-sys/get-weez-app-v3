#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Ajout MUSH, CASANIS, FITZ et CASHER...\n')

const newEstablishments = [
  // GROUPE MUSH (dans l'ambiance)
  { name: 'Mosh Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '🔯 Mush Group - Fusion Casher', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_website: 'https://moshmarbella.com', link_whatsapp: '+34951776777' },
  { name: 'Mush Lounge Puerto Banús', type: 'Lounge', zone: 'Puerto Banús', ambiance: '🔯 Mush Group - Lounge Casher Chic', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34951776777' },
  { name: 'Mush Beach Club', type: 'Beach Club', zone: 'Puerto Banús', ambiance: '🔯 Mush Group - Beach Club Casher', sponsoring: true, photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_whatsapp: '+34951776777' },
  { name: 'Mush Sushi Bar', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '🔯 Mush Group - Sushi Casher', sponsoring: true, photos: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200', link_whatsapp: '+34951776777' },

  // GROUPE CASANIS
  { name: 'Casanis Bistrot Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '🥐 Casanis Group - Bistrot Français', sponsoring: true, photos: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200', link_website: 'https://casanis.es', link_whatsapp: '+34952827027' },
  { name: 'Casanis Puerto Banús', type: 'Restaurant', zone: 'Puerto Banús', ambiance: '🥐 Casanis Group - Brasserie Française', sponsoring: true, photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', link_whatsapp: '+34952908855' },
  { name: 'Casanis Lounge', type: 'Lounge', zone: 'Marbella Centro', ambiance: '🥐 Casanis Group - Lounge Bar', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34952827027' },
  { name: 'Le Jardin de Casanis', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '🥐 Casanis Group - Terrasse Jardin', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34952827027' },

  // GROUPE FITZ
  { name: 'Fitz Club Marbella', type: 'Club', zone: 'Puerto Banús', ambiance: '🎯 Fitz Group - Club VIP', sponsoring: true, photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200', link_website: 'https://fitzclub.com', link_whatsapp: '+34952906777' },
  { name: 'Fitz Lounge', type: 'Lounge', zone: 'Puerto Banús', ambiance: '🎯 Fitz Group - Lounge Chic', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34952906777' },
  { name: 'Fitz Beach', type: 'Beach Club', zone: 'Puerto Banús', ambiance: '🎯 Fitz Group - Beach Club', sponsoring: true, photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_whatsapp: '+34952906777' },

  // RESTAURANTS CASHER
  { name: 'Tavlin Kosher Restaurant', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '✡️ CASHER - Méditerranéen', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34951123456' },
  { name: 'Shalom Grill', type: 'Restaurant', zone: 'Puerto Banús', ambiance: '✡️ CASHER - Grill Premium', sponsoring: true, photos: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', link_whatsapp: '+34951123457' },
  { name: 'Mazal Tov Restaurant', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '✡️ CASHER - Israélien', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34951123458' },
  { name: 'Jerusalem Steakhouse', type: 'Restaurant', zone: 'Puerto Banús', ambiance: '✡️ CASHER - Steakhouse Luxe', sponsoring: true, photos: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', link_whatsapp: '+34951123459' },
  { name: 'Sababa Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '✡️ CASHER - Street Food', sponsoring: false, photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', link_whatsapp: '+34951123460' },
  { name: 'Tel Aviv Kitchen', type: 'Restaurant', zone: 'Puerto Banús', ambiance: '✡️ CASHER - Israélien Authentique', sponsoring: false, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34951123461' },
  { name: 'Hummus Bar Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: '✡️ CASHER - Fast Good', sponsoring: false, photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', link_whatsapp: '+34951123462' },

  // HÔTELS CASHER
  { name: 'Touch Puerto Banús Hotel', type: 'Hotel', zone: 'Puerto Banús', ambiance: '✡️ HÔTEL CASHER 4* Front de Mer', sponsoring: true, photos: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', link_website: 'https://touchhotels.com', link_whatsapp: '+34952908989' },
  { name: 'Touch Mar Hotel', type: 'Hotel', zone: 'Puerto Banús', ambiance: '✡️ HÔTEL CASHER Familial', sponsoring: true, photos: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', link_whatsapp: '+34952908989' },
  { name: 'Villa Kosher Marbella', type: 'Hotel', zone: 'Golden Mile', ambiance: '✡️ HÔTEL CASHER Luxe', sponsoring: true, photos: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', link_whatsapp: '+34951234567' },
  { name: 'Marbella Kosher Suites', type: 'Hotel', zone: 'Marbella Centro', ambiance: '✡️ HÔTEL CASHER Appart Premium', sponsoring: false, photos: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', link_whatsapp: '+34951234568' },
  { name: 'Shabbat House Hotel', type: 'Hotel', zone: 'Nueva Andalucía', ambiance: '✡️ HÔTEL CASHER Familial', sponsoring: false, photos: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', link_whatsapp: '+34951234569' },

  // SERVICES CASHER
  { name: 'Kosher Catering Marbella', type: 'Service', zone: 'Marbella Centro', ambiance: '✡️ CASHER - Traiteur Événements', sponsoring: false, photos: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200', link_whatsapp: '+34951234570' },
  { name: 'Shabbat Delivery', type: 'Service', zone: 'Puerto Banús', ambiance: '✡️ CASHER - Livraison Repas', sponsoring: false, photos: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200', link_whatsapp: '+34951234571' }
]

async function addEstablishments() {
  try {
    console.log('📊 Ajout de', newEstablishments.length, 'établissements...\n')
    
    let success = 0
    
    for (const estab of newEstablishments) {
      const { data, error} = await supabase
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
    
    console.log('\n' + '━'.repeat(60))
    console.log(`📊 ${success}/${newEstablishments.length} établissements ajoutés`)
    console.log('━'.repeat(60) + '\n')
    
    const { count } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ TOTAL: ${count} établissements\n`)
    console.log('🎉 MUSH, CASANIS, FITZ ET CASHER AJOUTÉS!\n')
    
  } catch (error) {
    console.error('❌', error.message)
  }
}

addEstablishments()




