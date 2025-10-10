require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkEstablishments() {
  console.log('🔍 Vérification des établissements avec Google Places...\n')
  
  const { data: establishments, error } = await supabase
    .from('establishments')
    .select('name, rating, address, reviews_count')
    .limit(10)
  
  if (error) {
    console.error('❌ Erreur:', error.message)
    return
  }

  console.log('📊 Échantillon d\'établissements:')
  establishments.forEach(est => {
    const rating = est.rating ? `⭐ ${est.rating}/5 (${est.reviews_count || 0} avis)` : '❌ Pas de rating'
    const address = est.address || '❌ Pas d\'adresse'
    console.log(`- ${est.name}: ${rating}`)
    console.log(`  📍 ${address}`)
    console.log('')
  })

  // Compter ceux avec Google Places
  const { data: withGoogle, error: countError } = await supabase
    .from('establishments')
    .select('id', { count: 'exact', head: true })
    .not('rating', 'is', null)
  
  if (!countError) {
    console.log(`✅ ${withGoogle?.length || 0} établissements ont des données Google Places`)
  }
}

checkEstablishments()


