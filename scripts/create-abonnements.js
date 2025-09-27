const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAbonnementsTable() {
  try {
    console.log('🚀 Création de la table abonnements...')
    
    // Lecture du fichier SQL
    const fs = require('fs')
    const sqlContent = fs.readFileSync('./supabase-schema.sql', 'utf8')
    
    // Exécution du SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      console.error('❌ Erreur lors de la création:', error)
      return false
    }
    
    console.log('✅ Table abonnements créée avec succès!')
    
    // Vérification que la table existe
    const { data: tables, error: tablesError } = await supabase
      .from('abonnements')
      .select('*')
      .limit(1)
    
    if (tablesError) {
      console.error('❌ Erreur lors de la vérification:', tablesError)
      return false
    }
    
    console.log('✅ Table vérifiée -', tables.length, 'enregistrement(s) trouvé(s)')
    
    // Affichage des abonnements créés
    const { data: abonnements, error: abonnementsError } = await supabase
      .from('abonnements')
      .select('*')
      .order('ordre_affichage')
    
    if (!abonnementsError && abonnements) {
      console.log('\n📋 Abonnements disponibles:')
      abonnements.forEach(abonnement => {
        console.log(`- ${abonnement.nom}: ${abonnement.prix_mensuel}€/mois ou ${abonnement.prix_annuel}€/an`)
      })
    }
    
    return true
  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return false
  }
}

// Alternative: Création manuelle si exec_sql n'est pas disponible
async function createAbonnementsManually() {
  try {
    console.log('🔧 Création manuelle de la table abonnements...')
    
    // Note: Cette méthode nécessite des permissions admin
    // Pour l'instant, on va juste vérifier si la table existe
    const { data, error } = await supabase
      .from('abonnements')
      .select('*')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      console.log('❌ Table abonnements n\'existe pas encore')
      console.log('📝 Veuillez exécuter le SQL suivant dans votre dashboard Supabase:')
      console.log('\n' + '='.repeat(50))
      
      const fs = require('fs')
      const sqlContent = fs.readFileSync('./supabase-schema.sql', 'utf8')
      console.log(sqlContent)
      console.log('='.repeat(50))
      
      return false
    }
    
    if (error) {
      console.error('❌ Erreur:', error)
      return false
    }
    
    console.log('✅ Table abonnements existe déjà!')
    return true
  } catch (error) {
    console.error('❌ Erreur:', error)
    return false
  }
}

// Exécution
async function main() {
  console.log('🎯 Configuration de la table abonnements Get Weez')
  console.log('📊 URL Supabase:', supabaseUrl)
  
  const success = await createAbonnementsManually()
  
  if (success) {
    console.log('\n🎉 Configuration terminée avec succès!')
  } else {
    console.log('\n⚠️  Veuillez exécuter le SQL dans votre dashboard Supabase')
  }
}

main().catch(console.error)
