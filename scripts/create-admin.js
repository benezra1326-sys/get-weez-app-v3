const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminAccount() {
  try {
    console.log('🔍 Création du compte admin...')
    
    // Créer le compte utilisateur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@admin.com',
      password: 'admin123',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        }
      }
    })

    if (authError) {
      console.error('❌ Erreur lors de la création du compte:', authError.message)
      return
    }

    if (authData.user) {
      console.log('✅ Compte admin créé avec succès!')
      console.log('📧 Email:', authData.user.email)
      console.log('🆔 User ID:', authData.user.id)
      
      // Mettre à jour le profil utilisateur
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          is_member: true
        })
        .eq('id', authData.user.id)

      if (updateError) {
        console.log('⚠️ Compte créé mais erreur lors de la mise à jour du profil:', updateError.message)
      } else {
        console.log('✅ Profil admin mis à jour avec succès!')
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

createAdminAccount()
