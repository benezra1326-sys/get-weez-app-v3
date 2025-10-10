#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

console.log('🚀 Mise à jour avec Google Places API...\n')

// Fonction pour chercher un établissement sur Google Places
function searchPlace(name, location = 'Marbella, Spain') {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(`${name} ${location}`)
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}`
    
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          if (result.results && result.results[0]) {
            resolve(result.results[0])
          } else {
            resolve(null)
          }
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

// Fonction pour obtenir les détails d'un lieu
function getPlaceDetails(placeId) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,photos&key=${GOOGLE_API_KEY}`
    
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

async function updateEstablishments() {
  try {
    // 1. Corriger le nom de la pizzeria
    console.log('📊 Étape 1: Correction du nom de la pizzeria...\n')
    
    const { error: deleteError } = await supabase
      .from('establishments')
      .delete()
      .eq('name', 'Halavi Pizza')
    
    if (!deleteError) {
      console.log('🗑️  Supprimé: Halavi Pizza')
    }
    
    // Ajouter Milky Restaurant
    const { data: milkyData, error: milkyError } = await supabase
      .from('establishments')
      .insert([{
        name: 'Milky Restaurant',
        type: 'Restaurant',
        zone: 'Puerto Banús',
        ambiance: '✡️ CASHER - Restaurant Laitier',
        sponsoring: true,
        photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200',
        link_whatsapp: '+34951234001'
      }])
      .select()
    
    if (!milkyError) {
      console.log('✅ Ajouté: Milky Restaurant\n')
    }
    
    // 2. Récupérer les données Google Places pour les principaux établissements
    console.log('📊 Étape 2: Récupération des données Google Places...\n')
    
    const establishmentsToUpdate = [
      'Nikki Beach Marbella',
      'Ocean Club Marbella',
      'Nobu Marbella',
      'Dani García Marbella',
      'Puente Romano Resort',
      'Marbella Club Hotel',
      'Touch Puerto Banús Hotel',
      'Milky Restaurant Marbella',
      'Daniels Kosher Kitchen Marbella'
    ]
    
    let updated = 0
    
    for (const estabName of establishmentsToUpdate) {
      try {
        console.log(`🔍 Recherche: ${estabName}...`)
        
        const place = await searchPlace(estabName)
        
        if (place) {
          const details = await getPlaceDetails(place.place_id)
          
          if (details) {
            const photoUrl = details.photos && details.photos[0] 
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${details.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
              : null
            
            const updateData = {}
            if (details.formatted_address) updateData.zone = details.formatted_address.split(',')[0]
            if (details.formatted_phone_number) updateData.link_whatsapp = details.formatted_phone_number
            if (details.website) updateData.link_website = details.website
            if (photoUrl) updateData.photos = photoUrl
            
            // Mettre à jour dans Supabase
            const { error } = await supabase
              .from('establishments')
              .update(updateData)
              .ilike('name', `%${estabName.split(' ')[0]}%`)
            
            if (!error) {
              console.log(`✅ ${estabName} - Mis à jour`)
              updated++
            } else {
              console.log(`⚠️  ${estabName} - ${error.message}`)
            }
          }
        } else {
          console.log(`⚠️  ${estabName} - Non trouvé sur Google`)
        }
        
        await new Promise(r => setTimeout(r, 200)) // Délai pour éviter rate limit
        
      } catch (error) {
        console.log(`❌ ${estabName} - Erreur:`, error.message)
      }
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log(`📊 ${updated}/${establishmentsToUpdate.length} établissements mis à jour avec Google Places`)
    console.log('━'.repeat(60) + '\n')
    
    const { count } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ TOTAL: ${count} établissements\n`)
    console.log('🎉 BASE DE DONNÉES MISE À JOUR AVEC VRAIES DONNÉES!\n')
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message)
  }
}

updateEstablishments()




