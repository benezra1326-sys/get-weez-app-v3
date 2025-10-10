#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

console.log('🚀 Récupération des VRAIES données depuis Google Places...\n')

function searchPlace(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query)
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${GOOGLE_API_KEY}`
    
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve(result.results || [])
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

function getPlaceDetails(placeId) {
  return new Promise((resolve, reject) => {
    const fields = 'name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,photos,opening_hours,price_level'
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`
    
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve(result.result || null)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

async function updateAllEstablishments() {
  try {
    // Récupérer tous les établissements de Supabase
    const { data: establishments, error } = await supabase
      .from('establishments')
      .select('*')
    
    if (error) {
      console.error('❌ Erreur Supabase:', error.message)
      return
    }
    
    console.log(`📊 ${establishments.length} établissements à mettre à jour\n`)
    
    let updated = 0
    let notFound = 0
    
    for (const estab of establishments) {
      try {
        const searchQuery = `${estab.name} Marbella Spain`
        console.log(`🔍 ${estab.name}...`)
        
        const results = await searchPlace(searchQuery)
        
        if (results.length > 0) {
          const place = results[0]
          const details = await getPlaceDetails(place.place_id)
          
          if (details) {
            const updateData = {}
            
            // Adresse
            if (details.formatted_address) {
              const addressParts = details.formatted_address.split(',')
              updateData.zone = addressParts[0].trim()
            }
            
            // Téléphone (international format)
            if (details.international_phone_number) {
              updateData.link_whatsapp = details.international_phone_number
            } else if (details.formatted_phone_number) {
              updateData.link_whatsapp = details.formatted_phone_number
            }
            
            // Site web
            if (details.website) {
              updateData.link_website = details.website
            }
            
            // Photo
            if (details.photos && details.photos[0]) {
              const photoRef = details.photos[0].photo_reference
              updateData.photos = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`
            }
            
            // Note Google
            if (details.rating) {
              // Stocker dans ambiance pour l'instant
              const ratingInfo = `⭐ ${details.rating}/5 (${details.user_ratings_total || 0} avis)`
              if (estab.ambiance && !estab.ambiance.includes('⭐')) {
                updateData.ambiance = `${estab.ambiance} ${ratingInfo}`
              }
            }
            
            // Mettre à jour dans Supabase
            const { error: updateError } = await supabase
              .from('establishments')
              .update(updateData)
              .eq('id', estab.id)
            
            if (!updateError) {
              console.log(`   ✅ Mis à jour (${Object.keys(updateData).length} champs)`)
              updated++
            } else {
              console.log(`   ⚠️  Erreur mise à jour:`, updateError.message)
            }
          }
        } else {
          console.log(`   ⚠️  Non trouvé sur Google`)
          notFound++
        }
        
        // Délai pour éviter rate limit
        await new Promise(r => setTimeout(r, 300))
        
      } catch (error) {
        console.log(`   ❌ Erreur:`, error.message)
      }
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log(`✅ ${updated} établissements mis à jour`)
    console.log(`⚠️  ${notFound} non trouvés sur Google`)
    console.log(`📊 ${establishments.length - updated - notFound} erreurs`)
    console.log('━'.repeat(60) + '\n')
    
    console.log('🎉 MISE À JOUR TERMINÉE!\n')
    console.log('Les établissements ont maintenant:')
    console.log('  • Vraies adresses')
    console.log('  • Vrais numéros de téléphone')
    console.log('  • Vraies photos Google')
    console.log('  • Sites web officiels')
    console.log('  • Notes Google\n')
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message)
  }
}

updateAllEstablishments()




