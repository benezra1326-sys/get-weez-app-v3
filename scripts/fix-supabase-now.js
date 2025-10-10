#!/usr/bin/env node

/**
 * Script final - Utilise EXACTEMENT les colonnes de votre Supabase
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 Connexion à Supabase...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables manquantes dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// DONNÉES AVEC SEULEMENT LES COLONNES QUI EXISTENT
const establishments = [
  { name: 'Nikki Beach Marbella', type: 'Beach Club', zone: 'Elviria', ambiance: 'Exclusif VIP', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_website: 'https://nikkibeach.com/marbella' },
  { name: 'Dani García', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Étoilé Michelin', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_website: 'https://dagala.es' },
  { name: 'Nobu Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Japonais Fusion', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200' },
  { name: 'Ocean Club', type: 'Beach Club', zone: 'Puente Romano', ambiance: 'Beach Club Chic', sponsoring: 'standard', photos: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200' },
  { name: 'Trocadero Arena', type: 'Beach Club', zone: 'Marbella Centro', ambiance: 'Légendaire', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200' },
  { name: 'Olivia Valere', type: 'Club', zone: 'Nueva Andalucía', ambiance: 'Nightclub Exclusif', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200' },
  { name: 'Skina', type: 'Restaurant', zone: 'Casco Antiguo', ambiance: '2 Étoiles Michelin', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200' },
  { name: 'La Sala Puerto Banús', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Lounge Mer', sponsoring: 'standard', photos: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200' },
  { name: 'Bibo Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Andalou Créatif', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' },
  { name: 'Pangea', type: 'Club', zone: 'Puerto Banús', ambiance: 'VIP Nightlife', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200' },
  { name: 'Puente Romano Resort', type: 'Hotel', zone: 'Golden Mile', ambiance: 'Resort 5 Étoiles', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', link_website: 'https://puenteromano.com' },
  { name: 'Casanis Bistrot', type: 'Restaurant', zone: 'Marbella Centro', ambiance: 'Bistrot Français', sponsoring: 'standard', photos: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200' },
  { name: 'Sky Lounge', type: 'Rooftop', zone: 'Marbella Centro', ambiance: 'Vue 360°', sponsoring: 'standard', photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200' },
  { name: 'Amare Beach', type: 'Lounge', zone: 'Puente Romano', ambiance: 'Méditerranéen', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200' },
  { name: 'Buddha Beach', type: 'Lounge', zone: 'Puerto Banús', ambiance: 'Zen Asiatique', sponsoring: 'standard', photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  { name: 'COYA Marbella', type: 'Restaurant', zone: 'Puente Romano', ambiance: 'Péruvien Chic', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200' },
  { name: 'Cipriani', type: 'Restaurant', zone: 'Puerto Banús', ambiance: 'Italien Élégant', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200' },
  { name: 'Tikitano', type: 'Beach Club', zone: 'Guadalmina', ambiance: 'Family Beach Club', sponsoring: 'standard', photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { name: 'Puro Beach', type: 'Beach Club', zone: 'Laguna Village', ambiance: 'Chic Décontracté', sponsoring: 'premium', photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { name: 'Suite Club', type: 'Club', zone: 'Puerto Banús', ambiance: 'Nightclub Moderne', sponsoring: 'standard', photos: 'https://images.unsplash.com/photo-1571266028243-d220c6c2b8d2?w=1200' }
]

async function fillSupabase() {
  try {
    console.log('📊 Nettoyage...\n')
    await supabase.from('establishments').delete().neq('name', '')
    
    console.log('📊 Insertion de 20 établissements...\n')
    
    let success = 0
    
    for (const estab of establishments) {
      const { data, error } = await supabase
        .from('establishments')
        .insert([estab])
        .select()
      
      if (error) {
        console.log('❌', estab.name + ':', error.message)
      } else if (data && data[0]) {
        console.log('✅', estab.name)
        success++
      }
      
      await new Promise(r => setTimeout(r, 50))
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📊 ${success}/20 insérés`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    const { count } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ TOTAL: ${count} établissements\n`)
    
    if (count >= 15) {
      console.log('🎉 SUPABASE EST PRÊT!\n')
    }
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message)
  }
}

fillSupabase()





