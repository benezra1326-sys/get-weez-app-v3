#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testFetch() {
  console.log('🔍 Test de récupération des établissements...\n')
  
  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .order('id', { ascending: true })
  
  if (error) {
    console.error('❌ Erreur:', error.message)
    return
  }
  
  console.log(`✅ ${data.length} établissements récupérés\n`)
  
  // Afficher les 10 premiers
  console.log('📋 Les 10 premiers établissements:\n')
  data.slice(0, 10).forEach((estab, i) => {
    console.log(`${i + 1}. ${estab.name} (${estab.type}) - ${estab.zone}`)
  })
  
  console.log('\n📊 Types d\'établissements:')
  const types = {}
  data.forEach(e => {
    types[e.type] = (types[e.type] || 0) + 1
  })
  Object.entries(types).forEach(([type, count]) => {
    console.log(`   • ${type}: ${count}`)
  })
}

testFetch()

