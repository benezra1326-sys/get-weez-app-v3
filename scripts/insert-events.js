const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Mapping des établissements avec leurs IDs
const establishmentMapping = {
  'Ocean Club Marbella': 4,
  'La Terraza del Mar': 11, // Nouveau établissement
  'Playa Serena Wellness Club': 12, // Nouveau établissement
  'Tablao Andaluz': 13, // Nouveau établissement
  'Puerto Banús Marina': 14, // Nouveau établissement
  'Marbella Art Lounge': 15, // Nouveau établissement
  'El Patio Andaluz': 16, // Nouveau établissement
  'SkyBar Marbella': 17, // Nouveau établissement
  'Marbella Wellness Spa': 18, // Nouveau établissement
  'Pangea Nightclub': 19 // Nouveau établissement
}

const events = [
  {
    name: "Sunset Beach Party",
    description: "DJ set exclusif, cocktails premium et feu au coucher du soleil. Une soirée inoubliable sur la plage d'Ocean Club Marbella.",
    date: "2024-10-15T20:00:00Z",
    establishment_id: 4, // Ocean Club Marbella
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80",
    location: "Ocean Club Marbella, Puerto Banús",
    price: 85,
    capacity: 200,
    type: "party"
  },
  {
    name: "Mediterranean Wine & Tapas Night",
    description: "Dégustation de vins méditerranéens et tapas authentiques avec guitare live. Une expérience gastronomique andalouse.",
    date: "2024-10-20T19:30:00Z",
    establishment_id: 11, // La Terraza del Mar
    image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80",
    location: "La Terraza del Mar, Marbella",
    price: 65,
    capacity: 80,
    type: "gastronomy"
  },
  {
    name: "Full Moon Yoga & Brunch",
    description: "Séance de yoga sur la plage au lever du soleil, suivie d'un brunch healthy avec produits locaux.",
    date: "2024-10-25T07:00:00Z",
    establishment_id: 12, // Playa Serena Wellness Club
    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&q=80",
    location: "Playa Serena Wellness Club, Marbella",
    price: 45,
    capacity: 30,
    type: "wellness"
  },
  {
    name: "Flamenco Nights",
    description: "Dîner spectacle flamenco avec danseurs professionnels, guitare espagnole et cuisine andalouse traditionnelle.",
    date: "2024-10-28T21:00:00Z",
    establishment_id: 13, // Tablao Andaluz
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80",
    location: "Tablao Andaluz, Marbella",
    price: 95,
    capacity: 60,
    type: "show"
  },
  {
    name: "Luxury Boat Experience",
    description: "Sortie en catamaran de luxe avec champagne, DJ et vue panoramique sur la côte de Marbella.",
    date: "2024-11-02T16:00:00Z",
    establishment_id: 14, // Puerto Banús Marina
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80",
    location: "Puerto Banús Marina, Marbella",
    price: 150,
    capacity: 50,
    type: "experience"
  },
  {
    name: "Art & Jazz Evening",
    description: "Exposition d'art contemporain avec trio de jazz en live. Cocktails créatifs et ambiance sophistiquée.",
    date: "2024-11-05T20:00:00Z",
    establishment_id: 15, // Marbella Art Lounge
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80",
    location: "Marbella Art Lounge, Marbella",
    price: 75,
    capacity: 100,
    type: "cultural"
  },
  {
    name: "Gourmet Paella Experience",
    description: "Démonstration et dégustation de paella traditionnelle par un chef espagnol. Vin et ambiance andalouse.",
    date: "2024-11-08T19:00:00Z",
    establishment_id: 16, // El Patio Andaluz
    image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80",
    location: "El Patio Andaluz, Marbella",
    price: 55,
    capacity: 40,
    type: "gastronomy"
  },
  {
    name: "Cocktail Masterclass",
    description: "Atelier cocktails sur rooftop avec barman professionnel. Apprenez les techniques des grands bars de Marbella.",
    date: "2024-11-12T18:30:00Z",
    establishment_id: 17, // SkyBar Marbella
    image_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&q=80",
    location: "SkyBar Marbella, Marbella",
    price: 70,
    capacity: 25,
    type: "workshop"
  },
  {
    name: "Wellness Day Retreat",
    description: "Journée complète de bien-être : soins spa, méditation, repas detox et activités de relaxation.",
    date: "2024-11-15T09:00:00Z",
    establishment_id: 18, // Marbella Wellness Spa
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80",
    location: "Marbella Wellness Spa, Marbella",
    price: 120,
    capacity: 20,
    type: "wellness"
  },
  {
    name: "VIP Club Night",
    description: "Soirée VIP avec DJ internationaux et lounge exclusif. Champagne, canapés et ambiance électrisante.",
    date: "2024-11-18T23:00:00Z",
    establishment_id: 19, // Pangea Nightclub
    image_url: "https://images.unsplash.com/photo-1571266028243-e68f9520bb97?w=800&h=600&fit=crop&q=80",
    location: "Pangea Nightclub, Marbella",
    price: 100,
    capacity: 150,
    type: "party"
  }
]

async function insertEvents() {
  try {
    console.log('🚀 Ajout des événements Get Weez...')
    
    // Vérifier si la table events existe
    const { data: existingData, error: checkError } = await supabase
      .from('events')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Table events n\'existe pas encore')
      console.log('📝 Veuillez d\'abord créer la table events dans Supabase')
      return false
    }
    
    // Vérifier les établissements existants
    const { data: establishments, error: estError } = await supabase
      .from('establishments')
      .select('id, name')
    
    if (estError) {
      console.error('❌ Erreur lors de la récupération des établissements:', estError)
      return false
    }
    
    console.log('📋 Établissements disponibles:')
    establishments?.forEach(est => {
      console.log(`- ${est.id}: ${est.name}`)
    })
    
    // Insérer les événements
    const { data, error } = await supabase
      .from('events')
      .insert(events)
    
    if (error) {
      console.error('❌ Erreur lors de l\'insertion:', error)
      return false
    }
    
    console.log('✅ Événements ajoutés avec succès!')
    
    // Vérifier l'insertion
    const { data: insertedData, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .order('date')
    
    if (!fetchError && insertedData) {
      console.log(`\n📅 ${insertedData.length} événements disponibles:`)
      insertedData.forEach(event => {
        const date = new Date(event.date).toLocaleDateString('fr-FR')
        console.log(`- ${event.name} (${date}) - ${event.price}€`)
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
  console.log('🎯 Ajout des événements Get Weez')
  console.log('📊 URL Supabase:', supabaseUrl)
  
  const success = await insertEvents()
  
  if (success) {
    console.log('\n🎉 Événements ajoutés avec succès!')
    console.log('🌐 Vous pouvez maintenant voir les événements sur http://localhost:3000/events')
  } else {
    console.log('\n⚠️  Veuillez d\'abord créer la table events dans Supabase')
  }
}

main().catch(console.error)
