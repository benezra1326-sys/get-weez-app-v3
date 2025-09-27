import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} user={null} setUser={() => {}} />
}

export default appWithTranslation(MyApp)
