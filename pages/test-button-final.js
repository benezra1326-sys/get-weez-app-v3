import { useState, useEffect } from 'react'

const TestButtonFinal = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [buttonVisible, setButtonVisible] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsMobile(width < 1024)
      setWindowSize({ width, height })
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Vérifier si le bouton est visible
    const checkButton = () => {
      const button = document.querySelector('.chat-floating-button')
      if (button) {
        const rect = button.getBoundingClientRect()
        const styles = window.getComputedStyle(button)
        setButtonVisible(rect.width > 0 && rect.height > 0 && styles.display !== 'none')
        console.log('🔍 Bouton détecté:', {
          visible: rect.width > 0 && rect.height > 0,
          display: styles.display,
          position: styles.position,
          zIndex: styles.zIndex,
          bottom: styles.bottom,
          right: styles.right,
          width: rect.width,
          height: rect.height
        })
      } else {
        setButtonVisible(false)
        console.log('❌ Bouton non trouvé')
      }
    }
    
    // Vérifier après un délai pour laisser le temps au bouton de se rendre
    setTimeout(checkButton, 1000)
    setTimeout(checkButton, 3000)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-600">
          🔥 TEST FINAL - BOUTON CHAT ULTRA Z-INDEX
        </h1>
        
        {/* Informations de debug */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">📊 État du Bouton</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Largeur d'écran :</strong> {windowSize.width}px</p>
              <p><strong>Hauteur d'écran :</strong> {windowSize.height}px</p>
              <p><strong>Détection mobile :</strong> {isMobile ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>Bouton visible :</strong> {buttonVisible ? '✅ Oui' : '❌ Non'}</p>
            </div>
            <div>
              <p><strong>Breakpoint :</strong> {windowSize.width < 768 ? 'Mobile' : windowSize.width < 1024 ? 'Tablet' : 'Desktop'}</p>
              <p><strong>Timestamp :</strong> {new Date().toLocaleTimeString()}</p>
              <p><strong>Z-index attendu :</strong> 2147483647</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-3 text-green-800">✅ Corrections Appliquées</h3>
          <ul className="list-disc list-inside space-y-2 text-green-700">
            <li>Z-index augmenté à 2147483647 (maximum possible)</li>
            <li>Position fixed garantie</li>
            <li>Styles inline + CSS cohérents</li>
            <li>Au-dessus de .chat-box-container (z-index: 2147483646)</li>
          </ul>
        </div>

        {/* Contenu pour forcer le scroll */}
        <div className="space-y-6">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold mb-2">Section de test {i + 1}</h3>
              <p className="text-gray-600">
                Le bouton de chat devrait maintenant être visible en bas à droite avec un z-index ultra élevé (2147483647).
                Il devrait être au-dessus de tous les autres éléments, y compris la chatbox mobile.
              </p>
            </div>
          ))}
        </div>

        {/* Zone de test */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3 text-blue-800">🧪 Test du Bouton</h3>
          <p className="text-blue-700 mb-4">
            Le bouton de chat devrait être visible en bas à droite avec un z-index de 2147483647.
          </p>
          <div className="bg-white rounded p-4">
            <p className="text-sm text-gray-600">
              <strong>Vérifications :</strong><br/>
              • Bouton visible : {buttonVisible ? '✅' : '❌'}<br/>
              • Position : Fixed en bas à droite<br/>
              • Z-index : 2147483647 (maximum)<br/>
              • Au-dessus de tout le contenu
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestButtonFinal