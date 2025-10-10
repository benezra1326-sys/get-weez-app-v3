require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes')
  process.exit(1)
}

if (!googleApiKey) {
  console.error('❌ Clé Google Places manquante')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Fonction pour chercher un établissement sur Google Places
async function searchGooglePlace(name, location = 'Marbella, Spain') {
  try {
    const query = `${name} ${location}`
    const url = `https://places.googleapis.com/v1/places:searchText`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleApiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.photos,places.internationalPhoneNumber,places.websiteUri,places.regularOpeningHours'
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'fr'
      })
    })

    if (!response.ok) {
      console.log(`⚠️  API error for ${name}: ${response.status}`)
      return null
    }

    const data = await response.json()
    
    if (!data.places || data.places.length === 0) {
      console.log(`⚠️  Pas de résultats Google pour: ${name}`)
      return null
    }

    const place = data.places[0]
    
    // Construire l'URL de la photo
    let photoUrl = null
    if (place.photos && place.photos.length > 0) {
      const photoName = place.photos[0].name
      photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${googleApiKey}`
    }

    return {
      address: place.formattedAddress || null,
      rating: place.rating || null,
      reviews_count: place.userRatingCount || null,
      price_level: place.priceLevel ? '€'.repeat(place.priceLevel.replace('PRICE_LEVEL_', '')) : null,
      image_url: photoUrl,
      phone: place.internationalPhoneNumber || null,
      website: place.websiteUri || null,
      opening_hours: place.regularOpeningHours?.weekdayDescriptions?.join('\n') || null
    }
  } catch (error) {
    console.error(`Erreur recherche ${name}:`, error.message)
    return null
  }
}

async function updateAllEstablishments() {
  console.log('🔄 Récupération des établissements...')
  
  // Récupérer tous les établissements
  const { data: establishments, error } = await supabase
    .from('establishments')
    .select('id, name, zone')
  
  if (error) {
    console.error('❌ Erreur Supabase:', error)
    return
  }

  console.log(`📊 ${establishments.length} établissements à traiter\n`)

  let updated = 0
  let failed = 0

  for (const est of establishments) {
    console.log(`🔍 Recherche: ${est.name}...`)
    
    // Attendre 200ms entre chaque requête (limite API Google)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const googleData = await searchGooglePlace(est.name, est.zone || 'Marbella')
    
    if (googleData) {
      // Mettre à jour l'établissement
      const { error: updateError } = await supabase
        .from('establishments')
        .update({
          description: googleData.address ? `Situé à ${googleData.address.split(',')[0]}` : null,
          address: googleData.address,
          rating: googleData.rating,
          reviews_count: googleData.reviews_count,
          price_level: googleData.price_level,
          image_url: googleData.image_url,
          phone: googleData.phone,
          website: googleData.website,
          opening_hours: googleData.opening_hours
        })
        .eq('id', est.id)
      
      if (updateError) {
        console.log(`   ❌ Erreur mise à jour: ${updateError.message}`)
        failed++
      } else {
        console.log(`   ✅ Mis à jour avec ⭐ ${googleData.rating}/5 (${googleData.reviews_count} avis)`)
        updated++
      }
    } else {
      console.log(`   ⚠️  Pas de données Google Places`)
      failed++
    }
  }

  console.log(`\n✅ Terminé: ${updated} mis à jour, ${failed} échoués`)
}

updateAllEstablishments()

