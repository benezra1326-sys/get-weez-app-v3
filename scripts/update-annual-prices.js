const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateAnnualPrices() {
  console.log('🔄 Mise à jour des prix annuels avec 30% de réduction...')
  
  try {
    // Mise à jour Premium : 39.99 * 12 * 0.7 = 335.99
    const { error: premiumError } = await supabase
      .from('abonnements')
      .update({ prix_annuel: 335.99 })
      .eq('nom', 'Premium')
    
    if (premiumError) {
      console.error('❌ Erreur mise à jour Premium:', premiumError)
    } else {
      console.log('✅ Prix annuel Premium mis à jour: 335.99€ (30% de réduction)')
    }

    // Mise à jour VIP : 99.99 * 12 * 0.7 = 839.99
    const { error: vipError } = await supabase
      .from('abonnements')
      .update({ prix_annuel: 839.99 })
      .eq('nom', 'VIP')
    
    if (vipError) {
      console.error('❌ Erreur mise à jour VIP:', vipError)
    } else {
      console.log('✅ Prix annuel VIP mis à jour: 839.99€ (30% de réduction)')
    }

    // Vérification des prix mis à jour
    const { data: subscriptions, error: fetchError } = await supabase
      .from('abonnements')
      .select('nom, prix_mensuel, prix_annuel')
      .order('ordre_affichage')

    if (fetchError) {
      console.error('❌ Erreur lors de la vérification:', fetchError)
    } else {
      console.log('\n📊 Prix mis à jour:')
      subscriptions.forEach(sub => {
        if (sub.prix_mensuel > 0) {
          const monthlyTotal = sub.prix_mensuel * 12
          const discount = Math.round((1 - sub.prix_annuel / monthlyTotal) * 100)
          console.log(`${sub.nom}: ${sub.prix_mensuel}€/mois → ${sub.prix_annuel}€/an (${discount}% de réduction)`)
        } else {
          console.log(`${sub.nom}: Gratuit`)
        }
      })
    }

    console.log('\n✅ Mise à jour terminée avec succès!')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

updateAnnualPrices()
