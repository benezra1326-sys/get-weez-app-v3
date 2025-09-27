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

async function resetAdminAccount() {
  console.log('🔍 Création du compte admin avec email confirmé...')
  
  try {
    // Essayer de se connecter d'abord pour voir si le compte existe
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: 'admin123'
    })
    
    if (signInData.user) {
      console.log('✅ Compte admin existe déjà et fonctionne!')
      console.log('📧 Email: admin@admin.com')
      console.log('🔑 Mot de passe: admin123')
      console.log('🆔 User ID:', signInData.user.id)
      return
    }
    
    // Si la connexion échoue, créer un nouveau compte
    console.log('⚠️ Compte non trouvé ou mot de passe incorrect, création d\'un nouveau compte...')
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@admin.com',
      password: 'admin123',
      options: {
        data: {
          first_name: 'Admin',
          role: 'admin'
        }
      }
    })
    
    if (signUpError) {
      console.error('❌ Erreur lors de la création du compte:', signUpError.message)
      
      // Si le compte existe déjà, essayer de réinitialiser le mot de passe
      if (signUpError.message.includes('already registered')) {
        console.log('🔄 Tentative de réinitialisation du mot de passe...')
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail('admin@admin.com', {
          redirectTo: 'http://localhost:3000/reset-password'
        })
        
        if (resetError) {
          console.error('❌ Erreur lors de la réinitialisation:', resetError.message)
        } else {
          console.log('✅ Email de réinitialisation envoyé! Vérifiez votre boîte mail.')
        }
      }
    } else {
      console.log('✅ Compte admin créé avec succès!')
      console.log('📧 Email: admin@admin.com')
      console.log('🔑 Mot de passe: admin123')
      console.log('🆔 User ID:', signUpData.user?.id)
      
      if (signUpData.user && !signUpData.user.email_confirmed_at) {
        console.log('⚠️ Email non confirmé. Vérifiez votre boîte mail pour confirmer l\'email.')
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message)
  }
}

resetAdminAccount()
