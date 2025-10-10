#!/usr/bin/env node

/**
 * Script automatique pour configurer Supabase
 * Exécute le SQL et insère les données
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERREUR: Variables Supabase manquantes dans .env.local')
  console.log('\n📝 Créez un fichier .env.local avec:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=votre_url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Configuration automatique de Supabase...\n')

// SQL pour configurer l'AUTO_INCREMENT
const setupSQL = `
-- 1. CONFIGURER L'AUTO-INCREMENT POUR ESTABLISHMENTS
DROP SEQUENCE IF EXISTS establishments_id_seq CASCADE;
CREATE SEQUENCE establishments_id_seq;
ALTER TABLE establishments ALTER COLUMN id SET DEFAULT nextval('establishments_id_seq');
ALTER SEQUENCE establishments_id_seq OWNED BY establishments.id;
SELECT setval('establishments_id_seq', COALESCE((SELECT MAX(id) FROM establishments), 0) + 1, false);

-- 2. PAREIL POUR EVENTS
DROP SEQUENCE IF EXISTS events_id_seq CASCADE;
CREATE SEQUENCE events_id_seq;
ALTER TABLE events ALTER COLUMN id SET DEFAULT nextval('events_id_seq');
ALTER SEQUENCE events_id_seq OWNED BY events.id;
SELECT setval('events_id_seq', COALESCE((SELECT MAX(id) FROM events), 0) + 1, false);
`

// Données à insérer
const establishments = [
  { name: 'Nikki Beach Marbella', type: 'beach_club', zone: 'Elviria', ambiance: 'Exclusif VIP', photos: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200', link_website: 'https://nikkibeach.com/marbella' },
  { name: 'Dani García', type: 'restaurant', zone: 'Marbella Centro', ambiance: 'Étoilé Michelin', photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', link_website: 'https://dagala.es' },
  { name: 'Nobu Marbella', type: 'restaurant', zone: 'Puente Romano', ambiance: 'Japonais Fusion', photos: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1200', link_website: 'https://noburestaurants.com/marbella' },
  { name: 'Ocean Club', type: 'beach_club', zone: 'Puente Romano', ambiance: 'Beach Club Chic', photos: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200' },
  { name: 'Trocadero Arena', type: 'beach_club', zone: 'Marbella Centro', ambiance: 'Légendaire', photos: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200' },
  { name: 'Olivia Valere', type: 'club', zone: 'Nueva Andalucía', ambiance: 'Nightclub Exclusif', photos: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1200' },
  { name: 'Skina', type: 'restaurant', zone: 'Casco Antiguo', ambiance: '2 Étoiles Michelin', photos: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200' },
  { name: 'La Sala Puerto Banús', type: 'restaurant', zone: 'Puerto Banús', ambiance: 'Lounge Mer', photos: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200' },
  { name: 'Bibo Marbella', type: 'restaurant', zone: 'Puente Romano', ambiance: 'Andalou Créatif', photos: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' },
  { name: 'Pangea', type: 'club', zone: 'Puerto Banús', ambiance: 'VIP Nightlife', photos: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200' },
  { name: 'Puente Romano Resort', type: 'hotel', zone: 'Golden Mile', ambiance: 'Resort 5 Étoiles', photos: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', link_website: 'https://puenteromano.com' },
  { name: 'Casanis Bistrot', type: 'restaurant', zone: 'Marbella Centro', ambiance: 'Bistrot Français', photos: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200' },
  { name: 'Sky Lounge', type: 'rooftop', zone: 'Marbella Centro', ambiance: 'Vue 360°', photos: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200' },
  { name: 'Amare Beach', type: 'lounge', zone: 'Puente Romano', ambiance: 'Méditerranéen', photos: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200' },
  { name: 'Buddha Beach', type: 'lounge', zone: 'Puerto Banús', ambiance: 'Zen Asiatique', photos: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' },
  { name: 'COYA Marbella', type: 'restaurant', zone: 'Puente Romano', ambiance: 'Péruvien Chic', photos: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200' },
  { name: 'Cipriani', type: 'restaurant', zone: 'Puerto Banús', ambiance: 'Italien Élégant', photos: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200' },
  { name: 'Tikitano', type: 'beach_club', zone: 'Guadalmina', ambiance: 'Family Beach Club', photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { name: 'Puro Beach', type: 'beach_club', zone: 'Laguna Village', ambiance: 'Chic Décontracté', photos: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200' },
  { name: 'Suite Club', type: 'club', zone: 'Puerto Banús', ambiance: 'Nightclub Moderne', photos: 'https://images.unsplash.com/photo-1571266028243-d220c6c2b8d2?w=1200' }
]

async function setupSupabase() {
  try {
    console.log('📊 Étape 1/3 : Configuration des séquences AUTO_INCREMENT...')
    
    // Exécuter le SQL via RPC ou directement si possible
    // Note: Supabase JS ne supporte pas l'exécution de SQL brut directement
    // Il faut utiliser la REST API ou le SQL Editor
    
    console.log('⚠️  Pour l\'AUTO_INCREMENT, veuillez exécuter ce SQL dans Supabase SQL Editor:')
    console.log('─'.repeat(60))
    console.log(setupSQL)
    console.log('─'.repeat(60))
    console.log('\nAppuyez sur Entrée une fois le SQL exécuté...')
    
    // Attendre que l'utilisateur confirme
    await new Promise(resolve => {
      process.stdin.once('data', resolve)
    })
    
    console.log('\n📊 Étape 2/3 : Nettoyage des anciennes données...')
    const { error: deleteError } = await supabase
      .from('establishments')
      .delete()
      .neq('id', 0)
    
    if (deleteError && !deleteError.message.includes('no rows')) {
      console.log('⚠️  Avertissement lors du nettoyage:', deleteError.message)
    }
    
    console.log('📊 Étape 3/3 : Insertion de 20 établissements...\n')
    
    let success = 0
    
    for (const estab of establishments) {
      const { data, error } = await supabase
        .from('establishments')
        .insert([estab])
        .select()
      
      if (error) {
        console.log('❌', estab.name + ':', error.message)
      } else {
        console.log('✅', estab.name, '(ID:', data[0].id + ')')
        success++
      }
      
      await new Promise(r => setTimeout(r, 100))
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log('📊 RÉSULTAT:', success + '/' + establishments.length, 'établissements insérés')
    console.log('━'.repeat(60))
    
    const { count: finalCount } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log('\n✅ TOTAL DANS SUPABASE:', finalCount, 'établissements')
    
    if (finalCount >= 10) {
      console.log('\n🎉🎉🎉 SUPABASE CONFIGURÉ AVEC SUCCÈS! 🎉🎉🎉\n')
    } else {
      console.log('\n⚠️  Attention: Moins de 10 établissements dans la base\n')
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message)
    process.exit(1)
  }
}

setupSupabase()





