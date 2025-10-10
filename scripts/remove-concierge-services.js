#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Suppression des services de conciergerie...\n')

async function removeConciergeServices() {
  try {
    // Supprimer tous les services contenant "conciergerie", "concierge", "catering", "delivery"
    const { data: allServices, error: fetchError } = await supabase
      .from('establishments')
      .select('*')
      .eq('type', 'Service')
    
    if (fetchError) {
      console.error('❌ Erreur:', fetchError.message)
      return
    }
    
    console.log(`📊 ${allServices.length} services trouvés\n`)
    
    let deleted = 0
    
    for (const service of allServices) {
      const name = service.name.toLowerCase()
      
      // Vérifier si c'est un service de conciergerie
      if (name.includes('concierge') || 
          name.includes('conciergerie') ||
          name.includes('catering') ||
          name.includes('delivery')) {
        
        const { error } = await supabase
          .from('establishments')
          .delete()
          .eq('id', service.id)
        
        if (!error) {
          console.log(`🗑️  ${service.name}`)
          deleted++
        }
      }
    }
    
    console.log('\n' + '━'.repeat(60))
    console.log(`✅ ${deleted} services supprimés`)
    console.log('━'.repeat(60) + '\n')
    
    const { count } = await supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ TOTAL RESTANT: ${count} établissements\n`)
    console.log('🎉 SERVICES DE CONCIERGERIE SUPPRIMÉS!\n')
    
  } catch (error) {
    console.error('❌', error.message)
  }
}

removeConciergeServices()

