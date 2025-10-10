#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Ajout des groupes Mush, Casanis, Fitz et établissements Casher...\n')

const newEstablishments = [
  // GROUPE MUSH (Restaurants & Lounges)
  { name: 'Mosh Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Fusion Méditerranéen Casher', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_website: 'https://moshmarbella.com', link_whatsapp: '+34951776777', group: 'Mush Group' },
  { name: 'Mush Lounge Puerto Banús', type: 'Lounge', zone: 'Puerto Banús', ambiance: 'Lounge Bar Casher Chic', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34951776777', group: 'Mush Group' },
  { name: 'Mush Beach Club', type: 'Beach Club', zone: 'Puerto Banús', ambiance: 'Beach Club Casher Premium', sponsoring: true, photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_whatsapp: '+34951776777', group: 'Mush Group' },
  { name: 'Mush Sushi Bar', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Sushi Casher Japonais', sponsoring: true, photos: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200', link_whatsapp: '+34951776777', group: 'Mush Group' },

  // GROUPE CASANIS (Restaurants & Bistrots)
  { name: 'Casanis Bistrot Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Bistrot Français Authentique', sponsoring: true, photos: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200', link_website: 'https://casanis.es', link_whatsapp: '+34952827027', group: 'Casanis Group' },
  { name: 'Casanis Puerto Banús', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Brasserie Française Élégante', sponsoring: true, photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', link_whatsapp: '+34952908855', group: 'Casanis Group' },
  { name: 'Casanis Lounge', type: 'Lounge', zone: 'Marbella Centro', ambiance: 'Lounge Bar Français', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34952827027', group: 'Casanis Group' },
  { name: 'Le Jardin de Casanis', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Terrasse Jardin Romantique', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34952827027', group: 'Casanis Group' },

  // FITZ (Clubs & Lounges)
  { name: 'Fitz Club Marbella', type: 'Club', zone: 'Puerto Banús', ambiance: 'Club VIP Exclusif', sponsoring: true, photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200', link_website: 'https://fitzclub.com', link_whatsapp: '+34952906777', group: 'Fitz Group' },
  { name: 'Fitz Lounge', type: 'Lounge', zone: 'Puerto Banús', ambiance: 'Lounge Bar Chic', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34952906777', group: 'Fitz Group' },
  { name: 'Fitz Beach', type: 'Beach Club', zone: 'Puerto Banús', ambiance: 'Beach Club Day & Night', sponsoring: true, photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_whatsapp: '+34952906777', group: 'Fitz Group' },

  // RESTAURANTS CASHER
  { name: 'Tavlin Kosher Restaurant', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Restaurant Casher Méditerranéen', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34951123456', group: 'Kosher' },
  { name: 'Shalom Grill', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Grill Casher Premium', sponsoring: true, photos: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', link_whatsapp: '+34951123457', group: 'Kosher' },
  { name: 'Mazal Tov Restaurant', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Cuisine Israélienne Casher', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34951123458', group: 'Kosher' },
  { name: 'Jerusalem Steakhouse', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Steakhouse Casher Luxe', sponsoring: true, photos: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', link_whatsapp: '+34951123459', group: 'Kosher' },
  { name: 'Sababa Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Street Food Casher Moderne', sponsoring: false, photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', link_whatsapp: '+34951123460', group: 'Kosher' },
  { name: 'Tel Aviv Kitchen', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Cuisine Israélienne Authentique', sponsoring: false, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34951123461', group: 'Kosher' },
  { name: 'Hummus Bar Marbella', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Fast Good Casher', sponsoring: false, photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', link_whatsapp: '+34951123462', group: 'Kosher' },

  // HÔTELS CASHER
  { name: 'Touch Puerto Banús Hotel', type: 'Hotel', zone: 'Puerto Banús', ambiance: 'Hôtel Casher 4* Front de Mer', sponsoring: true, photos: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', link_website: 'https://touchhotels.com', link_whatsapp: '+34952908989', group: 'Kosher Hotels' },
  { name: 'Touch Mar Hotel', type: 'Hotel', zone: 'Puerto Banús', ambiance: 'Hôtel Casher Familial', sponsoring: true, photos: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', link_whatsapp: '+34952908989', group: 'Kosher Hotels' },
  { name: 'Villa Kosher Marbella', type: 'Hotel', zone: 'Golden Mile', ambiance: 'Villa Hôtel Casher Luxe', sponsoring: true, photos: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', link_whatsapp: '+34951234567', group: 'Kosher Hotels' },
  { name: 'Marbella Kosher Suites', type: 'Hotel', zone: 'Marbella Centro', ambiance: 'Appartements Casher Premium', sponsoring: false, photos: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', link_whatsapp: '+34951234568', group: 'Kosher Hotels' },
  { name: 'Shabbat House Hotel', type: 'Hotel', zone: 'Nueva Andalucía', ambiance: 'Hôtel Casher Familial', sponsoring: false, photos: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', link_whatsapp: '+34951234569', group: 'Kosher Hotels' },

  // SERVICES CASHER ADDITIONNELS
  { name: 'Kosher Catering Marbella', type: 'Service', zone: 'Marbella Centro', ambiance: 'Traiteur Casher Événements', sponsoring: false, photos: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200', link_whatsapp: '+34951234570', group: 'Kosher Services' },
  { name: 'Shabbat Delivery', type: 'Service', zone: 'Puerto Banús', ambiance: 'Livraison Repas Casher', sponsoring: false, photos: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200', link_whatsapp: '+34951234571', group: 'Kosher Services' }
]

async function addEstablishments() {
  try {
    console.log('📊 Ajout de', newEstablishments.length, 'nouveaux établissements...\n')
    
    let success = 0
    let groups = {}
    
    for (const estab of newEstablishments) {
      const { data, error } = await supabase
        .from('establishments')
        .insert([estab])
        .select()
      
      if (error) {
        console.log('❌', estab.name, ':', error.message)
      } else {
        console.log('✅', estab.name, `(${estab.group})`)
        success++
        
        // Compter par groupe
        if (!groups[estab.group]) groups[estab.group] = 0
        groups[estab.group]++
      }
      
      await new Promise(r => setTimeout(r, 50))
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log(`📊 RÉSULTAT: ${success}/${newEstablishments.length} établissements ajoutés`)
    console.log('━'.repeat(60) + '\n')
    
    console.log('📈 PAR GROUPE:')
    Object.entries(groups).forEach(([group, count]) => {
      console.log(`   • ${group}: ${count} établissements`)
    })
    
    const { count } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`\n✅ TOTAL DANS SUPABASE: ${count} établissements`)
    
    console.log('\n🎉 GROUPES ET CASHER AJOUTÉS AVEC SUCCÈS!\n')
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message)
  }
}

addEstablishments()





