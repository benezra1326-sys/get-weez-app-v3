const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.log('📋 Vérifiez que votre fichier .env.local contient:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAvishayAccount() {
  try {
    console.log('🔍 Création du compte avishay@outlook.fr...')
    
    // Créer le compte utilisateur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'avishay@outlook.fr',
      password: 'admin123456',
      options: {
        data: {
          first_name: 'Avishay',
          last_name: 'Admin',
          role: 'admin'
        }
      }
    })

    if (authError) {
      console.error('❌ Erreur lors de la création du compte:', authError.message)
      
      // Si l'utilisateur existe déjà, on essaie de se connecter
      if (authError.message.includes('already registered')) {
        console.log('🔄 L\'utilisateur existe déjà, test de connexion...')
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'avishay@outlook.fr',
          password: 'admin123456'
        })

        if (signInError) {
          console.error('❌ Erreur de connexion:', signInError.message)
          console.log('💡 Le mot de passe pourrait être incorrect ou le compte pourrait avoir des restrictions')
        } else {
          console.log('✅ Connexion réussie!')
          console.log('📧 Email:', signInData.user.email)
          console.log('🆔 User ID:', signInData.user.id)
        }
      }
      return
    }

    if (authData.user) {
      console.log('✅ Compte avishay@outlook.fr créé avec succès!')
      console.log('📧 Email:', authData.user.email)
      console.log('🆔 User ID:', authData.user.id)
      
      // Vérifier si la confirmation par email est nécessaire
      if (authData.user.email_confirmed_at) {
        console.log('✅ Email confirmé automatiquement')
      } else {
        console.log('📧 Un email de confirmation a été envoyé')
        console.log('⚠️ L\'utilisateur devra confirmer son email avant de pouvoir se connecter')
      }
      
      // Mettre à jour le profil utilisateur dans la table users
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: 'Avishay',
          last_name: 'Admin',
          role: 'admin',
          is_member: true
        })
        .eq('id', authData.user.id)

      if (updateError) {
        console.log('⚠️ Compte créé mais erreur lors de la mise à jour du profil:', updateError.message)
        console.log('💡 Vous pouvez mettre à jour le profil manuellement dans Supabase')
      } else {
        console.log('✅ Profil admin mis à jour avec succès!')
      }

      console.log('\n🎉 Compte créé avec succès!')
      console.log('📋 Informations de connexion:')
      console.log('   Email: avishay@outlook.fr')
      console.log('   Mot de passe: admin123456')
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

// Fonction pour tester la connexion
async function testLogin() {
  try {
    console.log('\n🧪 Test de connexion...')
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'avishay@outlook.fr',
      password: 'admin123456'
    })

    if (signInError) {
      console.error('❌ Test de connexion échoué:', signInError.message)
    } else {
      console.log('✅ Test de connexion réussi!')
      console.log('📧 Email:', signInData.user.email)
      console.log('🆔 User ID:', signInData.user.id)
      console.log('👤 Nom:', signInData.user.user_metadata.first_name, signInData.user.user_metadata.last_name)
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message)
  }
}

// Exécuter le script
async function main() {
  await createAvishayAccount()
  await testLogin()
}

main()
