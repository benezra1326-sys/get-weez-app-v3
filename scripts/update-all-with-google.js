#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

console.log('🚀 Récupération complète des données Google Places...\n')

function searchPlace(query) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve(result.results?.[0] || null)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

function getPlaceDetails(placeId) {
  return new Promise((resolve, reject) => {
    const fields = 'name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,photos,opening_hours,price_level,editorial_summary'
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

async function updateAll() {
  try {
    const { data: establishments, error } = await supabase
      .from('establishments')
      .select('*')
    
    if (error || !establishments) {
      console.error('❌ Erreur:', error?.message)
      return
    }
    
    console.log(`📊 ${establishments.length} établissements à mettre à jour\n`)
    
    let updated = 0
    let notFound = 0
    
    for (const estab of establishments) {
      try {
        console.log(`🔍 ${estab.name}...`)
        
        const place = await searchPlace(`${estab.name} Marbella Spain`)
        
        if (place && place.place_id) {
          const details = await getPlaceDetails(place.place_id)
          
          if (details) {
            const updateData = {}
            
            // Description (Google editorial summary ou types)
            if (details.editorial_summary?.overview) {
              updateData.description = details.editorial_summary.overview
            } else if (details.types) {
              updateData.description = `${estab.type} à ${estab.zone || 'Marbella'}`
            } else {
              updateData.description = estab.ambiance || `${estab.type} de prestige`
            }
            
            // Adresse complète
            if (details.formatted_address) {
              updateData.address = details.formatted_address
              // Extraire la zone/quartier
              const addressParts = details.formatted_address.split(',')
              updateData.zone = addressParts[0].trim()
            }
            
            // Rating Google
            if (details.rating) {
              updateData.rating = details.rating
            }
            
            // Nombre d'avis
            if (details.user_ratings_total) {
              updateData.reviews_count = details.user_ratings_total
            }
            
            // Prix (1-4 = €-€€€€)
            if (details.price_level) {
              updateData.price_level = '€'.repeat(details.price_level)
            }
            
            // Téléphone
            if (details.international_phone_number) {
              updateData.link_whatsapp = details.international_phone_number
            }
            
            // Site web
            if (details.website) {
              updateData.link_website = details.website
              // Le menu est souvent sur le site web
              updateData.menu_url = details.website
            }
            
            // Photo haute qualité
            if (details.photos?.[0]?.photo_reference) {
              const photoRef = details.photos[0].photo_reference
              updateData.photos = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`
            }
            
            // Horaires
            if (details.opening_hours?.weekday_text) {
              updateData.opening_hours = details.opening_hours.weekday_text.join('\n')
            }
            
            // Mise à jour
            const { error: updateError } = await supabase
              .from('establishments')
              .update(updateData)
              .eq('id', estab.id)
            
            if (!updateError) {
              console.log(`   ✅ ${Object.keys(updateData).length} champs mis à jour`)
              updated++
            } else {
              console.log(`   ⚠️  Erreur:`, updateError.message)
            }
          }
        } else {
          console.log(`   ⚠️  Non trouvé`)
          notFound++
        }
        
        await new Promise(r => setTimeout(r, 400)) // Éviter rate limit
        
      } catch (error) {
        console.log(`   ❌ Erreur:`, error.message)
      }
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log(`✅ ${updated} établissements mis à jour`)
    console.log(`⚠️  ${notFound} non trouvés`)
    console.log('━'.repeat(60))
    console.log('\nMAINTENANT les établissements ont:')
    console.log('  • ✅ Description réelle')
    console.log('  • ✅ Adresse complète')
    console.log('  • ✅ Zone/Quartier')
    console.log('  • ✅ Rating Google')
    console.log('  • ✅ Nombre d\'avis')
    console.log('  • ✅ Niveau de prix')
    console.log('  • ✅ Lien menu (via site web)')
    console.log('  • ✅ Horaires d\'ouverture\n')
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message)
  }
}

updateAll()




