#!/usr/bin/env node

/**
 * Script 100% automatique pour Supabase
 * Utilise l'API REST de Supabase pour exécuter le SQL
 */

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 Configuration AUTOMATIQUE de Supabase...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes!')
  console.log('\nCréez .env.local avec:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const establishments = [
  { name: 'Nikki Beach Marbella', type: 'Beach Club', zone: 'Elviria', description: 'Beach club emblématique', sponsoring: 'premium' },
  { name: 'Dani García', type: 'Restaurant', zone: 'Marbella Centro', description: 'Restaurant étoilé Michelin', sponsoring: 'premium' },
  { name: 'Nobu Marbella', type: 'Restaurant', zone: 'Puente Romano', description: 'Cuisine japonaise fusion', sponsoring: 'premium' },
  { name: 'Ocean Club', type: 'Beach Club', zone: 'Puente Romano', description: 'Beach club chic et élégant', sponsoring: 'standard' },
  { name: 'Trocadero Arena', type: 'Beach Club', zone: 'Marbella Centro', description: 'Beach club légendaire', sponsoring: 'premium' },
  { name: 'Olivia Valere', type: 'Club', zone: 'Nueva Andalucía', description: 'Nightclub exclusif', sponsoring: 'premium' },
  { name: 'Skina', type: 'Restaurant', zone: 'Casco Antiguo', description: '2 étoiles Michelin', sponsoring: 'premium' },
  { name: 'La Sala Puerto Banús', type: 'Restaurant', zone: 'Puerto Banús', description: 'Restaurant lounge vue mer', sponsoring: 'standard' },
  { name: 'Bibo Marbella', type: 'Restaurant', zone: 'Puente Romano', description: 'Cuisine andalouse créative', sponsoring: 'premium' },
  { name: 'Pangea', type: 'Club', zone: 'Puerto Banús', description: 'Club VIP nightlife', sponsoring: 'premium' },
  { name: 'Puente Romano Resort', type: 'Hotel', zone: 'Golden Mile', description: 'Resort 5 étoiles luxueux', sponsoring: 'premium' },
  { name: 'Casanis Bistrot', type: 'Restaurant', zone: 'Marbella Centro', description: 'Bistrot français authentique', sponsoring: 'standard' },
  { name: 'Sky Lounge', type: 'Rooftop', zone: 'Marbella Centro', description: 'Rooftop bar vue panoramique', sponsoring: 'standard' },
  { name: 'Amare Beach', type: 'Lounge', zone: 'Puente Romano', description: 'Restaurant méditerranéen', sponsoring: 'premium' },
  { name: 'Buddha Beach', type: 'Lounge', zone: 'Puerto Banús', description: 'Lounge asiatique zen', sponsoring: 'standard' },
  { name: 'COYA Marbella', type: 'Restaurant', zone: 'Puente Romano', description: 'Restaurant péruvien chic', sponsoring: 'premium' },
  { name: 'Cipriani', type: 'Restaurant', zone: 'Puerto Banús', description: 'Restaurant italien élégant', sponsoring: 'premium' },
  { name: 'Tikitano', type: 'Beach Club', zone: 'Guadalmina', description: 'Beach club familial', sponsoring: 'standard' },
  { name: 'Puro Beach', type: 'Beach Club', zone: 'Laguna Village', description: 'Beach club chic décontracté', sponsoring: 'premium' },
  { name: 'Suite Club', type: 'Club', zone: 'Puerto Banús', description: 'Nightclub moderne', sponsoring: 'standard' }
]

async function insertEstablishments() {
  try {
    console.log('📊 Nettoyage des anciennes données...\n')
    
    // Supprimer toutes les données existantes
    await supabase.from('establishments').delete().neq('name', '')
    
    console.log('📊 Insertion de 20 établissements...\n')
    
    let success = 0
    const insertedIds = []
    
    // Insérer un par un pour éviter les problèmes d'ID
    for (const estab of establishments) {
      const { data, error } = await supabase
        .from('establishments')
        .insert([estab])
        .select()
      
      if (error) {
        console.log('❌', estab.name + ':', error.message)
      } else if (data && data[0]) {
        console.log('✅', estab.name, `(ID: ${data[0].id})`)
        success++
        insertedIds.push(data[0].id)
      } else {
        console.log('⚠️ ', estab.name + ': Inséré mais pas de données retournées')
      }
      
      // Petit délai entre chaque insertion
      await new Promise(r => setTimeout(r, 50))
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log(`📊 RÉSULTAT: ${success}/${establishments.length} établissements insérés`)
    console.log('━'.repeat(60))
    
    // Vérification finale
    const { data: finalData, count, error: countError } = await supabase
      .from('establishments')
      .select('*', { count: 'exact' })
    
    if (countError) {
      console.log('\n⚠️  Impossible de vérifier le total:', countError.message)
    } else {
      console.log(`\n✅ TOTAL DANS SUPABASE: ${count} établissements`)
      
      if (count >= 10) {
        console.log('\n🎉🎉🎉 SUPABASE EST PRÊT! 🎉🎉🎉')
        console.log('\n✨ Vous pouvez maintenant utiliser l\'application!')
      } else {
        console.log('\n⚠️  Attention: Moins de 10 établissements insérés')
      }
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message)
    console.error(error)
    process.exit(1)
  }
}

insertEstablishments()




