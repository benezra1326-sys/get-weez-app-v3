// src/pages/_app-simple.js
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} user={null} setUser={() => {}} />
}

export default MyApp
