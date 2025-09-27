// src/pages/_app.js
import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Erreur Supabase auth:', error)
          setLoading(false)
          return
        }

        const session = data?.session
        if (session?.user) {
          try {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()
            if (userData) setUser(userData)
          } catch (dbError) {
            console.error('Erreur base de données:', dbError)
            // Continue même si la DB échoue
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error)
      } finally {
        setLoading(false)
      }
    }

    // Timeout de sécurité pour éviter que l'app reste bloquée
    const timeout = setTimeout(() => {
      console.log('Timeout atteint, arrêt du loading')
      setLoading(false)
    }, 3000)

    checkUser()

    return () => clearTimeout(timeout)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (userData) setUser(userData)
        } catch (dbError) {
          console.error('Erreur base de données:', dbError)
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    )
  }

  return <Component {...pageProps} user={user} setUser={setUser} />
}

export default MyApp