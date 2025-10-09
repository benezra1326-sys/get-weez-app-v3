const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Données SANS id (laissons Supabase générer automatiquement)
const establishments = [
  {
    name: "Nikki Beach Marbella",
    type: "Beach Club",
    description: "Beach club emblématique connu pour ses fêtes exclusives en bord de mer",
    location: "Elviria, Marbella",
    zone: "Elviria",
    rating: 4.8,
    ambiance: "Exclusif VIP",
    image_url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200",
    instagram_url: "https://instagram.com/nikkibeachmarbella",
    website_url: "https://www.nikkibeach.com/marbella"
  },
  {
    name: "Dani García Restaurante",
    type: "Restaurant",
    description: "Restaurant étoilé Michelin du célèbre chef Dani García",
    location: "Marbella Centro",
    zone: "Marbella Centro",
    rating: 4.9,
    ambiance: "Gastronomique Étoilé",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
    website_url: "https://dagala.es"
  },
  {
    name: "Nobu Marbella",
    type: "Restaurant",
    description: "Cuisine japonaise fusion de renommée mondiale",
    location: "Puente Romano, Marbella",
    zone: "Puente Romano",
    rating: 4.8,
    ambiance: "Japonais Fusion Luxe",
    image_url: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200",
    website_url: "https://noburestaurants.com/marbella"
  },
  {
    name: "Ocean Club Marbella",
    type: "Beach Club",
    description: "Beach club exclusif avec piscine infinity et service VIP",
    location: "Puente Romano",
    zone: "Golden Mile",
    rating: 4.7,
    ambiance: "Beach Club Chic",
    image_url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200"
  },
  {
    name: "Trocadero Arena",
    type: "Beach Club",
    description: "Institution marbellie, vue mer exceptionnelle",
    location: "Marbella Centro",
    zone: "Marbella Centro",
    rating: 4.6,
    ambiance: "Légendaire",
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200"
  },
  {
    name: "Olivia Valere",
    type: "Club",
    description: "Nightclub emblématique de Marbella, décor mauresque",
    location: "Nueva Andalucía",
    zone: "Nueva Andalucía",
    rating: 4.7,
    ambiance: "Nightlife Exclusif",
    image_url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200"
  },
  {
    name: "Skina Restaurant",
    type: "Restaurant",
    description: "2 étoiles Michelin, cuisine créative exceptionnelle",
    location: "Casco Antiguo, Marbella",
    zone: "Casco Antiguo",
    rating: 4.9,
    ambiance: "Fine Dining Étoilé",
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200"
  },
  {
    name: "La Sala Puerto Banús",
    type: "Restaurant",
    description: "Restaurant et lounge chic en bord de mer",
    location: "Puerto Banús",
    zone: "Puerto Banús",
    rating: 4.6,
    ambiance: "Lounge Méditerranéen",
    image_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200"
  },
  {
    name: "Bibo Marbella",
    type: "Restaurant",
    description: "Cuisine andalouse moderne du groupe Dani García",
    location: "Puente Romano",
    zone: "Puente Romano",
    rating: 4.7,
    ambiance: "Andalou Créatif",
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"
  },
  {
    name: "Pangea Club",
    type: "Club",
    description: "Nightclub VIP avec ambiance exclusive",
    location: "Puerto Banús",
    zone: "Puerto Banús",
    rating: 4.6,
    ambiance: "VIP Nightlife",
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200"
  }
]

async function insertEstablishments() {
  console.log('🚀 Insertion des établissements dans Supabase...\n')
  
  let success = 0
  let errors = 0
  
  for (const estab of establishments) {
    const { data, error } = await supabase
      .from('establishments')
      .insert([estab])
      .select()
    
    if (error) {
      console.log(`❌ ${estab.name}:`, error.message)
      errors++
    } else {
      console.log(`✅ ${estab.name} (ID: ${data[0].id})`)
      success++
    }
    
    // Petit délai pour éviter rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n📊 Résultat: ${success} succès, ${errors} erreurs`)
  
  // Vérification finale
  const { count } = await supabase
    .from('establishments')
    .select('*', { count: 'exact', head: true })
  
  console.log(`\n✅ Total dans Supabase: ${count} établissements`)
}

insertEstablishments().catch(console.error)

