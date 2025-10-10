import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY

if (!supabaseUrl || !supabaseKey || !googleApiKey) {
  console.error('❌ Variables manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Chercher un établissement sur Google Places
 */
async function searchGooglePlace(name, zone) {
  try {
    const query = `${name} ${zone} Marbella Spain`
    const url = `https://places.googleapis.com/v1/places:searchText`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleApiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.internationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.photos,places.editorialSummary,places.primaryType,places.servesBreakfast,places.servesBrunch,places.servesLunch,places.servesDinner,places.servesBeer,places.servesWine'
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'fr'
      })
    })

    if (!response.ok) {
      console.error(`❌ Erreur Google Places API: ${response.status}`)
      return null
    }

    const data = await response.json()
    
    if (data.places && data.places.length > 0) {
      const place = data.places[0]
      
      return {
        name: place.displayName?.text || name,
        description: place.editorialSummary?.text || 'Restaurant à Marbella',
        address: place.formattedAddress || `${zone}, Marbella`,
        rating: place.rating || null,
        reviews_count: place.userRatingCount || 0,
        price_level: place.priceLevel || 'PRICE_LEVEL_UNSPECIFIED',
        phone: place.internationalPhoneNumber || null,
        website: place.websiteUri || null,
        opening_hours: place.regularOpeningHours?.weekdayDescriptions || null,
        image_url: place.photos?.[0] ? 
          `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${googleApiKey}&maxHeightPx=800&maxWidthPx=800` 
          : null,
        serves_breakfast: place.servesBreakfast || false,
        serves_brunch: place.servesBrunch || false,
        serves_lunch: place.servesLunch || false,
        serves_dinner: place.servesDinner || false,
        primary_type: place.primaryType || 'restaurant'
      }
    }

    return null
  } catch (error) {
    console.error(`❌ Exception Google Places:`, error.message)
    return null
  }
}

/**
 * Mettre à jour tous les établissements
 */
async function updateAllEstablishments() {
  console.log('🔄 Mise à jour de tous les établissements avec Google Places...\n')

  // Récupérer tous les établissements
  const { data: establishments, error } = await supabase
    .from('establishments')
    .select('id, name, zone')
    .order('id')

  if (error) {
    console.error('❌ Erreur Supabase:', error)
    return
  }

  console.log(`📊 ${establishments.length} établissements à mettre à jour\n`)

  let updated = 0
  let failed = 0

  for (const establishment of establishments) {
    console.log(`🔍 ${establishment.name} (${establishment.zone})...`)
    
    const googleData = await searchGooglePlace(establishment.name, establishment.zone)
    
    if (googleData) {
      // Mettre à jour dans Supabase
      const { error: updateError } = await supabase
        .from('establishments')
        .update({
          description: googleData.description,
          address: googleData.address,
          rating: googleData.rating,
          reviews_count: googleData.reviews_count,
          price_level: googleData.price_level,
          phone: googleData.phone,
          website: googleData.website,
          opening_hours: googleData.opening_hours,
          image_url: googleData.image_url,
          serves_breakfast: googleData.serves_breakfast,
          serves_brunch: googleData.serves_brunch,
          serves_lunch: googleData.serves_lunch,
          serves_dinner: googleData.serves_dinner,
          primary_type: googleData.primary_type
        })
        .eq('id', establishment.id)

      if (updateError) {
        console.error(`   ❌ Erreur mise à jour: ${updateError.message}`)
        failed++
      } else {
        console.log(`   ✅ Mis à jour - Rating: ${googleData.rating || 'N/A'} - Brunch: ${googleData.serves_brunch ? 'Oui' : 'Non'}`)
        updated++
      }
    } else {
      console.log(`   ⚠️  Pas trouvé sur Google Places`)
      failed++
    }

    // Pause pour ne pas saturer l'API
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n✅ Terminé: ${updated} mis à jour, ${failed} échoués`)
}

updateAllEstablishments().catch(console.error)
