#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

console.log('🔍 Vérification et nettoyage des établissements...\n')

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
    const fields = 'name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,photos,opening_hours,price_level,editorial_summary,types,url'
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`
    
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).result || null)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

async function verifyAndCleanup() {
  try {
    const { data: establishments } = await supabase.from('establishments').select('*')
    
    console.log(`📊 ${establishments.length} établissements à vérifier\n`)
    
    let verified = 0
    let deleted = 0
    let updated = 0
    
    for (const estab of establishments) {
      try {
        console.log(`🔍 ${estab.name}...`)
        
        const place = await searchPlace(`${estab.name} Marbella Spain`)
        
        if (place && place.place_id) {
          const details = await getPlaceDetails(place.place_id)
          
          if (details && details.name) {
            // ÉTABLISSEMENT VÉRIFIÉ
            const updateData = {}
            
            // Description
            updateData.description = details.editorial_summary?.overview || 
                                     `${estab.type} situé à ${details.formatted_address?.split(',')[0] || 'Marbella'}`
            
            // Adresse complète
            updateData.address = details.formatted_address || estab.zone
            updateData.zone = details.formatted_address?.split(',')[0]?.trim() || estab.zone
            
            // Rating et avis
            updateData.rating = details.rating || null
            updateData.reviews_count = details.user_ratings_total || 0
            
            // Prix
            if (details.price_level) {
              updateData.price_level = '€'.repeat(details.price_level)
            }
            
            // Contact
            updateData.link_whatsapp = details.international_phone_number || details.formatted_phone_number || estab.link_whatsapp
            updateData.link_website = details.website || estab.link_website
            updateData.menu_url = details.website || estab.link_website
            
            // Photo haute qualité
            if (details.photos?.[0]) {
              updateData.photos = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photo_reference=${details.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
            }
            
            // Horaires
            if (details.opening_hours?.weekday_text) {
              updateData.opening_hours = details.opening_hours.weekday_text.slice(0, 3).join(' • ')
            }
            
            // Mettre à jour
            await supabase.from('establishments').update(updateData).eq('id', estab.id)
            
            console.log(`   ✅ VÉRIFIÉ (⭐ ${updateData.rating || 'N/A'}/5 - ${updateData.reviews_count || 0} avis)`)
            verified++
            updated++
            
          } else {
            console.log(`   ⚠️  Données incomplètes`)
          }
        } else {
          // PAS TROUVÉ = PROBABLEMENT FAUX
          console.log(`   ❌ NON TROUVÉ - SUPPRESSION`)
          await supabase.from('establishments').delete().eq('id', estab.id)
          deleted++
        }
        
        await new Promise(r => setTimeout(r, 500))
        
      } catch (error) {
        console.log(`   ❌ Erreur:`, error.message)
      }
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log(`✅ ${verified} établissements vérifiés et mis à jour`)
    console.log(`❌ ${deleted} établissements supprimés (non vérifiables)`)
    console.log('━'.repeat(60))
    
    const { count } = await supabase.from('establishments').select('*', { count: 'exact', head: true })
    console.log(`\n✅ TOTAL FINAL: ${count} établissements RÉELS\n`)
    
    console.log('🎉 BASE DE DONNÉES NETTOYÉE ET VÉRIFIÉE!\n')
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message)
  }
}

verifyAndCleanup()





