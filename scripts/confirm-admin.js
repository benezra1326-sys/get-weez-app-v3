import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erreur: Les variables d\'environnement Supabase ne sont pas configurées.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function confirmAdmin() {
  console.log('🔍 Tentative de connexion avec le compte admin...')
  
  try {
    // Essayer de se connecter
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'avishay@outlook.fr',
      password: 'admin123456'
    })
    
    if (signInData.user) {
      console.log('✅ Connexion réussie!')
      console.log('📧 Email: avishay@outlook.fr')
      console.log('🔑 Mot de passe: admin123456')
      console.log('🆔 User ID:', signInData.user.id)
      console.log('✅ Email confirmé:', signInData.user.email_confirmed_at ? 'Oui' : 'Non')
      
      if (signInData.user.email_confirmed_at) {
        console.log('🎉 Compte admin prêt à utiliser!')
      } else {
        console.log('⚠️ Email non confirmé mais connexion possible')
      }
    } else {
      console.error('❌ Erreur de connexion:', signInError.message)
      
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('🔄 Tentative de création d\'un nouveau compte...')
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'avishay@outlook.fr',
          password: 'admin123456',
          options: {
            data: {
              first_name: 'Admin',
              role: 'admin'
            }
          }
        })
        
        if (signUpError) {
          console.error('❌ Erreur lors de la création:', signUpError.message)
        } else {
          console.log('✅ Nouveau compte créé!')
          console.log('📧 Email: avishay@outlook.fr')
          console.log('🔑 Mot de passe: admin123456')
          console.log('🆔 User ID:', signUpData.user?.id)
          
          if (signUpData.user && !signUpData.user.email_confirmed_at) {
            console.log('⚠️ Email non confirmé. Solutions:')
            console.log('1. Vérifiez votre boîte mail pour le lien de confirmation')
            console.log('2. Ou allez dans Supabase Dashboard > Authentication > Users')
            console.log('3. Trouvez l\'utilisateur et cliquez sur "Confirm user"')
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message)
  }
}

confirmAdmin()
