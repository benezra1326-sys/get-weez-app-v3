import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'
import '../styles/fonts.css'
import '../styles/animations.css'
import '../styles/mobile-chat.css'
import '../lib/i18n'
import { MobileTouchEnhancer } from '../components/mobile/MobileTouchEnhancements'
import CookieBanner from '../components/ui/CookieBanner'
import TipsPopup from '../components/ui/TipsPopup'
import FloatingChatButtonSimple from '../components/ui/FloatingChatButtonSimple'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ThemeProvider } from '../contexts/ThemeContextSimple'

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({
    id: 'demo-user',
    email: 'demo@getweez.com',
    first_name: 'Demo',
    last_name: 'User',
    is_member: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Vérifier la session existante
    const checkSession = async () => {
      try {
        // Vérifier que les variables d'environnement sont définies
        if (!supabaseUrl || !supabaseKey) {
          console.warn('Variables d\'environnement Supabase manquantes - mode démo')
          setLoading(false)
          return
        }
        
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
            // Utilisateur connecté mais pas de données en base
            setUser({
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || 'Utilisateur',
              last_name: session.user.user_metadata?.last_name || '',
              is_member: false
            })
          }
        } else {
          // Pas de session, utiliser l'utilisateur de démo
          setUser({
            id: 'demo-user',
            email: 'demo@getweez.com',
            first_name: 'Demo',
            last_name: 'User',
            is_member: true
          })
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error)
        // En cas d'erreur, utiliser l'utilisateur de démo
        setUser({
          id: 'demo-user',
          email: 'demo@getweez.com',
          first_name: 'Demo',
          last_name: 'User',
          is_member: true
        })
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Timeout de sécurité pour s'assurer que le chargement se termine
    const timeout = setTimeout(() => {
      console.log('Timeout de sécurité - fin du chargement')
      setLoading(false)
    }, 2000) // Timeout de 2 secondes

    // Écouter les changements d'authentification SEULEMENT si Supabase est configuré
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
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
            // Retourner à l'utilisateur de démo
            setUser({
              id: 'demo-user',
              email: 'demo@getweez.com',
              first_name: 'Demo',
              last_name: 'User',
              is_member: true
            })
          }
        } catch (error) {
          console.error('Erreur lors du changement d\'authentification:', error)
          // En cas d'erreur, utiliser l'utilisateur de démo
          setUser({
            id: 'demo-user',
            email: 'demo@getweez.com',
            first_name: 'Demo',
            last_name: 'User',
            is_member: true
          })
        }
      })

      return () => {
        subscription?.unsubscribe()
        clearTimeout(timeout)
      }
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // Écran de chargement supprimé pour permettre l'affichage immédiat

  // Écran de chargement supprimé pour permettre l'affichage immédiat

  return (
    <>
      <ThemeProvider>
        <MobileTouchEnhancer enableHaptics={true}>
          <Component {...pageProps} user={user} setUser={setUser} />
          <TipsPopup />
          <FloatingChatButtonSimple />
        </MobileTouchEnhancer>
      </ThemeProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
