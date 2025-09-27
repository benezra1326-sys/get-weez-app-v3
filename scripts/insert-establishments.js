const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const establishments = [
  {
    "id": 1,
    "name": "Nikki Beach Marbella",
    "type": "plage",
    "description": "Beach club emblématique connu pour ses fêtes exclusives en bord de mer.",
    "location": "Elviria, Marbella",
    "instagram_url": "https://instagram.com/nikkibeachmarbella",
    "website_url": "https://www.nikkibeach.com/marbella",
    "sponsored": true,
    "rating": 4.8,
    "zone": "Elviria",
    "ambiance": "Exclusif",
    "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
  },
  {
    "id": 2,
    "name": "Puente Romano Beach Resort",
    "type": "hôtel",
    "description": "Resort de luxe avec restaurants étoilés, spa et accès direct à la plage.",
    "location": "Golden Mile, Marbella",
    "instagram_url": "https://instagram.com/puenteromanoresort",
    "website_url": "https://www.puenteromano.com",
    "sponsored": true,
    "rating": 4.9,
    "zone": "Golden Mile",
    "ambiance": "Luxe",
    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
  },
  {
    "id": 3,
    "name": "La Sala by the Sea",
    "type": "plage",
    "description": "Ambiance chic et décontractée avec DJ sets et cocktails exotiques.",
    "location": "Puerto Banús, Marbella",
    "instagram_url": "https://instagram.com/lasalabythesea",
    "website_url": "https://www.lasalabythesea.com",
    "sponsored": false,
    "rating": 4.6,
    "zone": "Puerto Banús",
    "ambiance": "Chic",
    "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
  },
  {
    "id": 4,
    "name": "Ocean Club Marbella",
    "type": "club",
    "description": "Célèbre pour ses piscines XXL, ses DJs et ses soirées champagne.",
    "location": "Puerto Banús, Marbella",
    "instagram_url": "https://instagram.com/oceanclubmarbella",
    "website_url": "https://www.oceanclub.es",
    "sponsored": true,
    "rating": 4.7,
    "zone": "Puerto Banús",
    "ambiance": "Festif",
    "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
  },
  {
    "id": 5,
    "name": "Breathe Marbella",
    "type": "restaurant",
    "description": "Concept éco-chic avec rooftop, gastronomie méditerranéenne et cocktails.",
    "location": "Puerto Banús, Marbella",
    "instagram_url": "https://instagram.com/breathemarbella",
    "website_url": "https://www.breathemarbella.com",
    "sponsored": false,
    "rating": 4.5,
    "zone": "Puerto Banús",
    "ambiance": "Éco-chic",
    "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
  },
  {
    "id": 6,
    "name": "Mamzel Marbella",
    "type": "restaurant",
    "description": "Dîner-spectacle glamour avec ambiance festive et gastronomie internationale.",
    "location": "Sierra Blanca, Marbella",
    "instagram_url": "https://instagram.com/mamzelmarbella",
    "website_url": "https://www.mamzelmarbella.com",
    "sponsored": true,
    "rating": 4.8,
    "zone": "Sierra Blanca",
    "ambiance": "Glamour",
    "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
  },
  {
    "id": 7,
    "name": "El Chiringuito Marbella",
    "type": "restaurant",
    "description": "Cuisine méditerranéenne raffinée les pieds dans le sable.",
    "location": "Puente Romano Beach Resort",
    "instagram_url": "https://instagram.com/elchiringuitomarbella",
    "website_url": "https://www.elchiringuitomarbella.com",
    "sponsored": false,
    "rating": 4.4,
    "zone": "Golden Mile",
    "ambiance": "Décontracté",
    "image_url": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop"
  },
  {
    "id": 8,
    "name": "Olivia Valere",
    "type": "club",
    "description": "Discothèque mythique de Marbella, fréquentée par célébrités et jet-set.",
    "location": "Golden Mile, Marbella",
    "instagram_url": "https://instagram.com/oliviavalereclub",
    "website_url": "https://www.oliviavalere.com",
    "sponsored": true,
    "rating": 4.9,
    "zone": "Golden Mile",
    "ambiance": "Exclusif",
    "image_url": "https://images.unsplash.com/photo-1571266028243-e68f9520bb97?w=800&h=600&fit=crop"
  },
  {
    "id": 9,
    "name": "Ambrosía Gourmet Market",
    "type": "restaurant",
    "description": "Marché gastronomique chic avec une sélection de cuisines du monde.",
    "location": "Nueva Andalucía, Marbella",
    "instagram_url": "https://instagram.com/ambrosiamarket",
    "website_url": "https://www.ambrosiamarketmarbella.com",
    "sponsored": false,
    "rating": 4.3,
    "zone": "Nueva Andalucía",
    "ambiance": "Gourmet",
    "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
  },
  {
    "id": 10,
    "name": "Trocadero Playa",
    "type": "plage",
    "description": "Beach club élégant avec service haut de gamme et ambiance cosy.",
    "location": "Playa de Santa Petronila, Marbella",
    "instagram_url": "https://instagram.com/trocaderoplaya",
    "website_url": "https://www.trocaderoplaya.com",
    "sponsored": false,
    "rating": 4.6,
    "zone": "Santa Petronila",
    "ambiance": "Élégant",
    "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
  }
]

async function insertEstablishments() {
  try {
    console.log('🚀 Ajout des établissements Get Weez...')
    
    // Vérifier si la table existe
    const { data: existingData, error: checkError } = await supabase
      .from('establishments')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Table establishments n\'existe pas encore')
      console.log('📝 Veuillez d\'abord créer la table establishments dans Supabase')
      return false
    }
    
    // Insérer les établissements
    const { data, error } = await supabase
      .from('establishments')
      .upsert(establishments, { onConflict: 'id' })
    
    if (error) {
      console.error('❌ Erreur lors de l\'insertion:', error)
      return false
    }
    
    console.log('✅ Établissements ajoutés avec succès!')
    
    // Vérifier l'insertion
    const { data: insertedData, error: fetchError } = await supabase
      .from('establishments')
      .select('*')
      .order('id')
    
    if (!fetchError && insertedData) {
      console.log(`\n📋 ${insertedData.length} établissements disponibles:`)
      insertedData.forEach(est => {
        const sponsored = est.sponsored ? '⭐' : '  '
        console.log(`${sponsored} ${est.name} (${est.type}) - ${est.zone}`)
      })
    }
    
    return true
  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return false
  }
}

// Exécution
async function main() {
  console.log('🎯 Ajout des établissements Get Weez')
  console.log('📊 URL Supabase:', supabaseUrl)
  
  const success = await insertEstablishments()
  
  if (success) {
    console.log('\n🎉 Établissements ajoutés avec succès!')
    console.log('🌐 Vous pouvez maintenant voir les établissements sur http://localhost:3000/establishments')
  } else {
    console.log('\n⚠️  Veuillez d\'abord créer la table establishments dans Supabase')
  }
}

main().catch(console.error)
