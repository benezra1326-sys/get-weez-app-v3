require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('🔍 Vérification des tables...\n')
  
  // Establishments
  console.log('📊 TABLE ESTABLISHMENTS:')
  const { data: est, error: estErr } = await supabase
    .from('establishments')
    .select('*')
    .limit(1)
  
  if (est && est.length > 0) {
    console.log('Colonnes:', Object.keys(est[0]).join(', '))
    console.log('Total:', (await supabase.from('establishments').select('id', { count: 'exact', head: true })).count, 'établissements\n')
  } else {
    console.log('Erreur ou vide:', estErr?.message || 'Aucune donnée\n')
  }
  
  // Events
  console.log('📊 TABLE EVENTS:')
  const { data: evt, error: evtErr } = await supabase
    .from('events')
    .select('*')
    .limit(1)
  
  if (evt && evt.length > 0) {
    console.log('Colonnes:', Object.keys(evt[0]).join(', '))
    console.log('Total:', (await supabase.from('events').select('id', { count: 'exact', head: true })).count, 'événements\n')
  } else {
    console.log('Erreur ou vide:', evtErr?.message || 'Aucune donnée\n')
  }
  
  // Services
  console.log('📊 TABLE SERVICES:')
  const { data: svc, error: svcErr } = await supabase
    .from('services')
    .select('*')
    .limit(1)
  
  if (svc && svc.length > 0) {
    console.log('Colonnes:', Object.keys(svc[0]).join(', '))
    console.log('Total:', (await supabase.from('services').select('id', { count: 'exact', head: true })).count, 'services\n')
  } else {
    console.log('Erreur ou vide:', svcErr?.message || 'Aucune donnée\n')
  }
}

checkTables()



