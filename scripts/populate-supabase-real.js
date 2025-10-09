// Script pour remplir Supabase avec des données réelles
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Données réelles d'établissements à Marbella
const realEstablishments = [
  {
    name: 'Dani García',
    category: 'Restaurant Gastronomique',
    description: 'Restaurant étoilé Michelin du chef Dani García, cuisine andalouse moderne',
    zone: 'Marbella Centro',
    price_level: '€€€€',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    phone: '+34 952 764 252',
    opening_hours: '13h-16h, 20h-23h',
    website: 'https://dagala.es'
  },
  {
    name: 'El Lago',
    category: 'Restaurant Méditerranéen',
    description: 'Vue panoramique sur le lac, cuisine méditerranéenne raffinée',
    zone: 'Elviria Hills',
    price_level: '€€€',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    phone: '+34 952 832 371',
    opening_hours: '13h-16h, 19h30-23h30'
  },
  {
    name: 'Casanis Bistrot',
    category: 'Bistrot Français',
    description: 'Bistrot français authentique au cœur de Marbella',
    zone: 'Marbella Centro',
    price_level: '€€',
    image_url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
    phone: '+34 952 824 354',
    opening_hours: '12h-24h'
  },
  {
    name: 'Nikki Beach',
    category: 'Beach Club',
    description: 'Beach club iconique, DJ sets et cuisine fusion',
    zone: 'Elviria',
    price_level: '€€€',
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
    phone: '+34 952 831 184',
    opening_hours: '10h-23h',
    website: 'https://nikkibeach.com/destinations/marbella'
  },
  {
    name: 'La Sala by the Sea',
    category: 'Restaurant & Lounge',
    description: 'Restaurant élégant en bord de mer avec terrasse',
    zone: 'Puerto Banús',
    price_level: '€€€',
    image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    phone: '+34 952 811 295',
    opening_hours: '12h-24h'
  },
  {
    name: 'Nobu Marbella',
    category: 'Restaurant Japonais',
    description: 'Cuisine japonaise fusion, brand international de luxe',
    zone: 'Puente Romano',
    price_level: '€€€€',
    image_url: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800',
    phone: '+34 952 820 900',
    opening_hours: '19h-23h30',
    website: 'https://noburestaurants.com/marbella'
  },
  {
    name: 'Trocadero Arena',
    category: 'Beach Club & Restaurant',
    description: 'Beach club légendaire avec vue mer exceptionnelle',
    zone: 'Marbella Centro',
    price_level: '€€€',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    phone: '+34 952 824 836',
    opening_hours: '10h-2h'
  },
  {
    name: 'Restaurante Skina',
    category: 'Restaurant Étoilé',
    description: '2 étoiles Michelin, cuisine créative exceptionnelle',
    zone: 'Casco Antiguo',
    price_level: '€€€€',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    phone: '+34 952 765 277',
    opening_hours: '13h-15h30, 20h-22h30'
  },
  {
    name: 'Buddha Beach',
    category: 'Lounge & Restaurant',
    description: 'Ambiance zen, cuisine asiatique et méditerranéenne',
    zone: 'Puerto Banús',
    price_level: '€€',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    phone: '+34 952 816 240',
    opening_hours: '10h-1h'
  },
  {
    name: 'Olivia Valere',
    category: 'Club',
    description: 'Nightclub emblématique de Marbella, ambiance exclusive',
    zone: 'Nueva Andalucía',
    price_level: '€€€',
    image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800',
    phone: '+34 952 828 861',
    opening_hours: '23h-6h'
  }
]

// Événements réels
const realEvents = [
  {
    name: 'Starlite Festival',
    description: 'Festival de musique estival avec artistes internationaux',
    date: '2025-07-15T21:00:00',
    location: 'Cantera de Nagüeles',
    price: 'À partir de 60€',
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
  },
  {
    name: 'White Party Nikki Beach',
    description: 'Soirée blanche exclusive au bord de la mer',
    date: '2025-08-20T20:00:00',
    location: 'Nikki Beach Marbella',
    price: 'À partir de 80€',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'
  },
  {
    name: 'Sunset Jazz Session',
    description: 'Concert de jazz intimiste avec vue sur le coucher de soleil',
    date: '2025-06-28T19:00:00',
    location: 'La Sala Puerto Banús',
    price: 'Gratuit',
    image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'
  }
]

async function populateSupabase() {
  console.log('🚀 Démarrage du remplissage Supabase...\n')

  // 1. Insérer les établissements
  console.log('📍 Insertion des établissements...')
  const { data: estabData, error: estabError } = await supabase
    .from('establishments')
    .upsert(realEstablishments, { onConflict: 'name' })

  if (estabError) {
    console.error('❌ Erreur establishments:', estabError)
  } else {
    console.log(`✅ ${realEstablishments.length} établissements insérés\n`)
  }

  // 2. Insérer les événements
  console.log('🎉 Insertion des événements...')
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .upsert(realEvents, { onConflict: 'name' })

  if (eventError) {
    console.error('❌ Erreur events:', eventError)
  } else {
    console.log(`✅ ${realEvents.length} événements insérés\n`)
  }

  // 3. Vérification
  console.log('🔍 Vérification des données...')
  const { count: estabCount } = await supabase
    .from('establishments')
    .select('*', { count: 'exact', head: true })

  const { count: eventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })

  console.log('\n📊 Résultat final:')
  console.log(`   Établissements: ${estabCount || 0}`)
  console.log(`   Événements: ${eventCount || 0}`)
  console.log('\n✅ Supabase rempli avec succès! 🎉')
}

// Exécuter
populateSupabase().catch(console.error)

