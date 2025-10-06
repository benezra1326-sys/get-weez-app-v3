import { useState, useEffect } from 'react'
import ChatFloatingButton from '../components/ui/ChatFloatingButton'

const TestChatButton = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsMobile(width < 1024)
      setWindowSize({ width, height })
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🧪 TEST BOUTON CHAT - AUDIT COMPLET
        </h1>
        
        {/* Informations de debug */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Informations de Debug</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Largeur d'écran :</strong> {windowSize.width}px</p>
              <p><strong>Hauteur d'écran :</strong> {windowSize.height}px</p>
              <p><strong>Détection mobile :</strong> {isMobile ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>Breakpoint :</strong> {windowSize.width < 768 ? 'Mobile' : windowSize.width < 1024 ? 'Tablet' : 'Desktop'}</p>
            </div>
            <div>
              <p><strong>User Agent :</strong> {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
              <p><strong>Touch support :</strong> {typeof window !== 'undefined' && 'ontouchstart' in window ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>Timestamp :</strong> {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-3 text-blue-800">📋 Instructions de Test</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Le bouton de chat doit être visible en bas à droite</li>
            <li>Il doit rester fixe même en scrollant</li>
            <li>Il doit être cliquable et fonctionnel</li>
            <li>Sur mobile : doit ouvrir le chat mobile</li>
            <li>Sur desktop : doit scroller vers le chat</li>
          </ol>
        </div>

        {/* Contenu pour forcer le scroll */}
        <div className="space-y-6">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold mb-2">Section de test {i + 1}</h3>
              <p className="text-gray-600">
                Ce contenu est là pour forcer le scroll et tester que le bouton de chat 
                reste bien fixe en bas à droite de l'écran. 
                Le bouton doit rester visible même quand vous scrollez vers le bas.
                Testez sur différentes tailles d'écran pour vérifier le comportement responsive.
              </p>
            </div>
          ))}
        </div>

        {/* Zone de test du chat */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3 text-green-800">💬 Zone de Test Chat</h3>
          <p className="text-green-700 mb-4">
            Cliquez sur le bouton de chat en bas à droite pour tester son fonctionnement.
          </p>
          <div className="bg-white rounded p-4">
            <p className="text-sm text-gray-600">
              <strong>Comportement attendu :</strong><br/>
              • Sur mobile : Ouvre la chatbox mobile<br/>
              • Sur desktop : Scroll vers le chat principal<br/>
              • Position : Fixe en bas à droite<br/>
              • Z-index : Au-dessus de tout le contenu
            </p>
          </div>
        </div>
      </div>

      {/* Le bouton de chat sera rendu par ChatFloatingButton */}
    </div>
  )
}

export default TestChatButton