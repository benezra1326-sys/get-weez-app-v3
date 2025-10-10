import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkData() {
  console.log('📊 VÉRIFICATION DES DONNÉES SUPABASE\n')
  
  // Establishments
  const { data: establishments } = await supabase
    .from('establishments')
    .select('id, name, zone, rating')
    .order('id')
  
  console.log(`✅ ESTABLISHMENTS: ${establishments?.length || 0}`)
  if (establishments) {
    establishments.forEach(e => {
      console.log(`   ${e.id}. ${e.name} (${e.zone}) - ⭐ ${e.rating || 'N/A'}`)
    })
  }
  
  // Events
  const today = new Date().toISOString().split('T')[0]
  const { data: events } = await supabase
    .from('events')
    .select('id, title, date, location')
    .gte('date', today)
    .order('date')
  
  console.log(`\n✅ EVENTS (futurs): ${events?.length || 0}`)
  if (events) {
    events.slice(0, 10).forEach(e => {
      console.log(`   ${e.id}. ${e.title} - ${e.date} (${e.location})`)
    })
  }
  
  // Services
  const { data: services } = await supabase
    .from('services')
    .select('id, name, category')
    .order('id')
  
  console.log(`\n✅ SERVICES: ${services?.length || 0}`)
  if (services) {
    services.forEach(s => {
      console.log(`   ${s.id}. ${s.name} (${s.category})`)
    })
  }
}

checkData().catch(console.error)
