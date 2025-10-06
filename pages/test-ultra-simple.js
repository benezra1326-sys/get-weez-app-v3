import { useState, useEffect } from 'react'

const TestUltraSimple = () => {
  const [buttonInfo, setButtonInfo] = useState(null)

  useEffect(() => {
    const checkButton = () => {
      const button = document.querySelector('button[style*="position: fixed"]')
      if (button) {
        const rect = button.getBoundingClientRect()
        const styles = window.getComputedStyle(button)
        setButtonInfo({
          found: true,
          position: styles.position,
          bottom: styles.bottom,
          right: styles.right,
          zIndex: styles.zIndex,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        })
      } else {
        setButtonInfo({ found: false })
      }
    }

    // Vérifier immédiatement et après un délai
    checkButton()
    setTimeout(checkButton, 1000)
    setTimeout(checkButton, 3000)

    const interval = setInterval(checkButton, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-600">
          🚀 TEST ULTRA SIMPLE - BOUTON CHAT
        </h1>

        {/* Informations du bouton */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">📊 État du Bouton</h2>
          {buttonInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Bouton trouvé :</strong> {buttonInfo.found ? '✅ Oui' : '❌ Non'}</p>
                <p><strong>Position :</strong> {buttonInfo.position || 'N/A'}</p>
                <p><strong>Bottom :</strong> {buttonInfo.bottom || 'N/A'}</p>
                <p><strong>Right :</strong> {buttonInfo.right || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Z-index :</strong> {buttonInfo.zIndex || 'N/A'}</p>
                <p><strong>Largeur :</strong> {buttonInfo.width || 'N/A'}px</p>
                <p><strong>Hauteur :</strong> {buttonInfo.height || 'N/A'}px</p>
                <p><strong>Visible :</strong> {buttonInfo.visible ? '✅ Oui' : '❌ Non'}</p>
              </div>
            </div>
          ) : (
            <p>Vérification en cours...</p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-3 text-green-800">✅ Corrections Appliquées</h3>
          <ul className="list-disc list-inside space-y-2 text-green-700">
            <li>Supprimé toutes les manipulations de document.body</li>
            <li>Unifié tous les z-index à des valeurs cohérentes</li>
            <li>Créé un bouton ULTRA SIMPLE avec createPortal</li>
            <li>Z-index maximum : 9999999</li>
            <li>Position fixed garantie</li>
            <li>Pas de conflits CSS</li>
          </ul>
        </div>

        {/* Contenu pour tester le scroll */}
        <div className="space-y-6">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-bold mb-2">Section de test {i + 1}</h3>
              <p className="text-gray-600">
                Le bouton de chat devrait maintenant être visible en bas à droite avec un z-index de 9999999.
                Il devrait être au-dessus de tous les autres éléments et ne plus être bloqué.
              </p>
            </div>
          ))}
        </div>

        {/* Zone de test */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3 text-blue-800">🧪 Test du Bouton</h3>
          <p className="text-blue-700 mb-4">
            Le bouton de chat devrait être visible en bas à droite avec un z-index de 9999999.
          </p>
          <div className="bg-white rounded p-4">
            <p className="text-sm text-gray-600">
              <strong>Vérifications :</strong><br/>
              • Bouton trouvé : {buttonInfo?.found ? '✅' : '❌'}<br/>
              • Position : Fixed en bas à droite<br/>
              • Z-index : 9999999 (maximum)<br/>
              • Au-dessus de tout le contenu
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestUltraSimple