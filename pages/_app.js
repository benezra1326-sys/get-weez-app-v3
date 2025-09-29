import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ThemeProvider } from '../contexts/ThemeContext'

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier la session existante
    const checkSession = async () => {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Récupérer les données utilisateur complètes
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userData && !error) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              ...userData
            })
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || 'Utilisateur',
              last_name: session.user.user_metadata?.last_name || '',
              is_member: false
            })
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Écouter les changements d'authentification
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Récupérer les données utilisateur complètes
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userData && !error) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            ...userData
          })
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name || 'Utilisateur',
            last_name: session.user.user_metadata?.last_name || '',
            is_member: false
          })
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Component {...pageProps} user={user} setUser={setUser} />
    </ThemeProvider>
  )
}

export default appWithTranslation(MyApp)
