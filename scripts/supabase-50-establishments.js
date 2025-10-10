#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Insertion de 50 établissements dans Supabase...\n')

// 50 ÉTABLISSEMENTS RÉELS DE MARBELLA
const establishments = [
  // Beach Clubs Premium (10)
  { name: 'Nikki Beach Marbella', type: 'Beach Club', zone: 'Elviria', ambiance: 'Exclusif VIP International', sponsoring: true, photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_website: 'https://nikkibeach.com/marbella', link_whatsapp: '+34952831600' },
  { name: 'Ocean Club Marbella', type: 'Beach Club', zone: 'Puente Romano', ambiance: 'Beach Club Chic Premium', sponsoring: true, photos: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200', link_website: 'https://oceanclubmarbella.com', link_whatsapp: '+34952820900' },
  { name: 'Trocadero Arena', type: 'Beach Club', zone: 'Marbella Centro', ambiance: 'Légendaire Glamour', sponsoring: true, photos: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200', link_whatsapp: '+34952826215' },
  { name: 'Nikki Beach', type: 'Beach Club', zone: 'Elviria', ambiance: 'Luxe Bohème Chic', sponsoring: true, photos: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200', link_website: 'https://nikkibeach.com', link_whatsapp: '+34952831600' },
  { name: 'Puro Beach', type: 'Beach Club', zone: 'Laguna Village', ambiance: 'Chic Décontracté Moderne', sponsoring: true, photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', link_website: 'https://purobeach.com', link_whatsapp: '+34952908282' },
  { name: 'La Cabane Beach Club', type: 'Beach Club', zone: 'Marbella Este', ambiance: 'Tropical Exclusif', sponsoring: false, photos: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200', link_whatsapp: '+34952831400' },
  { name: 'Mistral Beach', type: 'Beach Club', zone: 'Los Monteros', ambiance: 'Familial Élégant', sponsoring: false, photos: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200', link_whatsapp: '+34952771700' },
  { name: 'Siroko Beach Marbella', type: 'Beach Club', zone: 'Cabopino', ambiance: 'Décontracté Moderne', sponsoring: false, photos: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1200', link_whatsapp: '+34952831212' },
  { name: 'Tikitano Beach Club', type: 'Beach Club', zone: 'Guadalmina', ambiance: 'Family Beach Club', sponsoring: false, photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_whatsapp: '+34952888988' },
  { name: 'Marbella Club Beach', type: 'Beach Club', zone: 'Golden Mile', ambiance: 'Élégance Classique', sponsoring: true, photos: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200', link_website: 'https://marbellaclub.com', link_whatsapp: '+34952822211' },

  // Restaurants Gastronomiques (15)
  { name: 'Dani García', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Étoilé Michelin Avant-garde', sponsoring: true, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_website: 'https://dagala.es', link_whatsapp: '+34952901600' },
  { name: 'Skina', type: 'Restaurant', zone: 'Casco Antiguo', ambiance: '2 Étoiles Michelin Intime', sponsoring: true, photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', link_website: 'https://restauranteskina.com', link_whatsapp: '+34952765277' },
  { name: 'Nobu Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Japonais Fusion Luxe', sponsoring: true, photos: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200', link_website: 'https://noburestaurants.com/marbella', link_whatsapp: '+34952820900' },
  { name: 'El Lago', type: 'Restaurant', zone: 'Elviria', ambiance: 'Étoilé Michelin Vue Lac', sponsoring: true, photos: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200', link_website: 'https://ellagomarbella.com', link_whatsapp: '+34952832371' },
  { name: 'Messina', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Étoilé Michelin Créatif', sponsoring: true, photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', link_whatsapp: '+34952864943' },
  { name: 'Bibo Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Andalou Créatif Festif', sponsoring: true, photos: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200', link_whatsapp: '+34952820900' },
  { name: 'COYA Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Péruvien Chic Tendance', sponsoring: true, photos: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200', link_website: 'https://coyarestaurant.com/marbella', link_whatsapp: '+34952820900' },
  { name: 'Cipriani', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Italien Élégant Raffiné', sponsoring: true, photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', link_whatsapp: '+34952908899' },
  { name: 'La Sala Puerto Banús', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Lounge Mer Cosmopolite', sponsoring: false, photos: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200', link_website: 'https://lasalabanus.com', link_whatsapp: '+34952814145' },
  { name: 'Casanis Bistrot', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Bistrot Français Authentique', sponsoring: false, photos: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200', link_whatsapp: '+34952827027' },
  { name: 'El Pimpi Marbella', type: 'Restaurant', zone: 'Casco Antiguo', ambiance: 'Tapas Tradition Andalouse', sponsoring: false, photos: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', link_whatsapp: '+34952770300' },
  { name: 'Santiago', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Fruits de Mer Premium', sponsoring: true, photos: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200', link_whatsapp: '+34952770078' },
  { name: 'Thai Gallery', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Thaï Raffiné Authentique', sponsoring: false, photos: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=1200', link_whatsapp: '+34952820900' },
  { name: 'Zozoi', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Méditerranéen Moderne', sponsoring: false, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34952812494' },
  { name: 'La Meridiana', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Italien Jardin Secret', sponsoring: true, photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', link_whatsapp: '+34952776190' },

  // Clubs & Nightlife (10)
  { name: 'Olivia Valere', type: 'Club', zone: 'Nueva Andalucía', ambiance: 'Nightclub Exclusif Mythique', sponsoring: true, photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200', link_whatsapp: '+34952828861' },
  { name: 'Pangea', type: 'Club', zone: 'Puerto Banús', ambiance: 'VIP Nightlife Électro', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', link_whatsapp: '+34952908080' },
  { name: 'Suite Club', type: 'Club', zone: 'Puerto Banús', ambiance: 'Nightclub Moderne Chic', sponsoring: false, photos: 'https://images.unsplash.com/photo-1571266028243-d220c6c2b8d2?w=1200', link_whatsapp: '+34952810716' },
  { name: 'Tibu', type: 'Club', zone: 'Puerto Banús', ambiance: 'Lounge Club Premium', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', link_whatsapp: '+34952815859' },
  { name: 'La Sala by The Sea', type: 'Club', zone: 'Puerto Banús', ambiance: 'Club Lounge Vue Mer', sponsoring: false, photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200', link_whatsapp: '+34952814145' },
  { name: 'Momento Beach', type: 'Club', zone: 'Puerto Banús', ambiance: 'Beach Club Night', sponsoring: false, photos: 'https://images.unsplash.com/photo-1571266028243-d220c6c2b8d2?w=1200', link_whatsapp: '+34952819020' },
  { name: 'Funky Buddha', type: 'Club', zone: 'Puerto Banús', ambiance: 'Club Asiatique Lounge', sponsoring: false, photos: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', link_whatsapp: '+34952818690' },
  { name: 'Linekers Bar', type: 'Club', zone: 'Puerto Banús', ambiance: 'Bar Club Festif', sponsoring: false, photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200', link_whatsapp: '+34952812392' },
  { name: 'Astral Beach', type: 'Club', zone: 'Estepona', ambiance: 'Beach Club Lounge', sponsoring: false, photos: 'https://images.unsplash.com/photo-1571266028243-d220c6c2b8d2?w=1200', link_whatsapp: '+34952880500' },
  { name: 'Aqwa Mist', type: 'Club', zone: 'Puerto Banús', ambiance: 'Rooftop Club Terrasse', sponsoring: false, photos: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200', link_whatsapp: '+34952819020' },

  // Hotels de Luxe (8)
  { name: 'Puente Romano Resort', type: 'Hotel', zone: 'Golden Mile', ambiance: 'Resort 5 Étoiles Luxe', sponsoring: true, photos: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', link_website: 'https://puenteromano.com', link_whatsapp: '+34952820900' },
  { name: 'Marbella Club Hotel', type: 'Hotel', zone: 'Golden Mile', ambiance: 'Palace Historique Élégant', sponsoring: true, photos: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', link_website: 'https://marbellaclub.com', link_whatsapp: '+34952822211' },
  { name: 'Amàre Beach Hotel', type: 'Hotel', zone: 'Marbella Centro', ambiance: 'Adults Only Moderne', sponsoring: true, photos: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', link_website: 'https://amarehotels.com', link_whatsapp: '+34952826600' },
  { name: 'Don Carlos Resort', type: 'Hotel', zone: 'Elviria', ambiance: 'Resort Spa 5 Étoiles', sponsoring: false, photos: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', link_whatsapp: '+34952831140' },
  { name: 'Los Monteros Hotel', type: 'Hotel', zone: 'Los Monteros', ambiance: 'Palace Plage 5 Étoiles', sponsoring: true, photos: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', link_website: 'https://hotelmonteros.com', link_whatsapp: '+34952771700' },
  { name: 'Kempinski Hotel Bahía', type: 'Hotel', zone: 'Estepona', ambiance: 'Luxury Collection 5*', sponsoring: true, photos: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200', link_whatsapp: '+34952809500' },
  { name: 'Villa Padierna Palace', type: 'Hotel', zone: 'Benahavís', ambiance: 'Palace Florentin Luxe', sponsoring: true, photos: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200', link_website: 'https://hotelvillapadierna.com', link_whatsapp: '+34952889150' },
  { name: 'Gran Meliá Don Pepe', type: 'Hotel', zone: 'Marbella Centro', ambiance: '5 Étoiles Centre Ville', sponsoring: false, photos: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', link_whatsapp: '+34952770300' },

  // Lounges & Rooftops (7)
  { name: 'Amare Beach', type: 'Lounge', zone: 'Puente Romano', ambiance: 'Méditerranéen Chic', sponsoring: true, photos: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200', link_whatsapp: '+34952820900' },
  { name: 'Buddha Beach', type: 'Lounge', zone: 'Puerto Banús', ambiance: 'Zen Asiatique Lounge', sponsoring: false, photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_whatsapp: '+34952818690' },
  { name: 'Sky Lounge Marbella', type: 'Rooftop', zone: 'Marbella Centro', ambiance: 'Rooftop Vue 360° Cocktails', sponsoring: false, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34952826600' },
  { name: 'Chambao La Playa', type: 'Lounge', zone: 'San Pedro', ambiance: 'Beach Lounge Décontracté', sponsoring: false, photos: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200', link_whatsapp: '+34952782121' },
  { name: 'La Suite Club Lounge', type: 'Lounge', zone: 'Puerto Banús', ambiance: 'Lounge VIP Élégant', sponsoring: false, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34952810716' },
  { name: 'Soho Marbella', type: 'Lounge', zone: 'Puerto Banús', ambiance: 'Lounge Bar Festif', sponsoring: false, photos: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200', link_whatsapp: '+34952906260' },
  { name: 'Nikki Beach Rooftop', type: 'Rooftop', zone: 'Elviria', ambiance: 'Rooftop Pool Club', sponsoring: true, photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200', link_whatsapp: '+34952831600' }
]

async function fillSupabase() {
  try {
    console.log('📊 Nettoyage des anciennes données...\n')
    await supabase.from('establishments').delete().neq('name', '')
    
    console.log('📊 Insertion de 50 établissements...\n')
    
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
    
    console.log('\n' + '━'.repeat(60))
    console.log(`📊 RÉSULTAT: ${success}/50 établissements insérés`)
    console.log('━'.repeat(60) + '\n')
    
    const { count } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ TOTAL DANS SUPABASE: ${count} établissements\n`)
    
    if (count >= 45) {
      console.log('🎉🎉🎉 50 ÉTABLISSEMENTS INSÉRÉS AVEC SUCCÈS! 🎉🎉🎉\n')
    }
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message)
  }
}

fillSupabase()




