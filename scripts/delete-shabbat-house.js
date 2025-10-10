import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteShabbatHouse() {
  console.log('🗑️  Suppression de Shabbat House Hotel...\n')

  // Supprimer par nom
  const { data, error } = await supabase
    .from('establishments')
    .delete()
    .ilike('name', '%shabbat%house%')
    .select()

  if (error) {
    console.error('❌ Erreur:', error)
    return
  }

  if (data && data.length > 0) {
    console.log(`✅ ${data.length} établissement(s) supprimé(s):`)
    data.forEach(item => {
      console.log(`   - ${item.name} (ID: ${item.id})`)
    })
  } else {
    console.log('⚠️  Aucun établissement trouvé avec "Shabbat House"')
  }
}

deleteShabbatHouse().catch(console.error)
