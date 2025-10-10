#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkCount() {
  const { count, error } = await supabase
    .from('establishments')
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    console.error('❌ Erreur:', error.message)
  } else {
    console.log(`\n✅ TOTAL: ${count} établissements dans Supabase\n`)
  }
}

checkCount()




