require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  console.log('🔍 Test insertion basique...\n')
  
  const testEvent = {
    title: 'Test Event',
    description: 'Description test',
    date: '2025-10-15',
    location: 'Test Location'
  }
  
  const { data, error } = await supabase
    .from('events')
    .insert([testEvent])
    .select()
  
  if (error) {
    console.log('❌ Erreur:', error.message)
    console.log('\nColonnes attendues par Supabase:', error.details || 'Voir ci-dessus')
  } else {
    console.log('✅ Insertion réussie!')
    console.log('Données:', data)
    
    // Supprimer le test
    await supabase.from('events').delete().eq('title', 'Test Event')
  }
  
  // Essayer de lire un événement existant pour voir les colonnes
  console.log('\n🔍 Lecture des événements existants...\n')
  const { data: existing } = await supabase
    .from('events')
    .select('*')
    .limit(1)
  
  if (existing && existing.length > 0) {
    console.log('Colonnes disponibles:', Object.keys(existing[0]))
    console.log('Exemple:', existing[0])
  } else {
    console.log('Aucun événement existant')
  }
}

checkSchema()


