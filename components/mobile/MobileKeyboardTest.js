import React, { useState, useRef } from 'react'
import { useVirtualKeyboard } from '../../hooks/useVirtualKeyboard'
import MobileKeyboardHandler from './MobileKeyboardHandler'

/**
 * Composant de test pour vérifier le fonctionnement du clavier virtuel
 */
const MobileKeyboardTest = () => {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  
  const { 
    isKeyboardOpen, 
    viewportHeight, 
    keyboardHeight, 
    initialHeight 
  } = useVirtualKeyboard()

  const handleKeyboardToggle = (isOpen) => {
    console.log('Clavier virtuel:', isOpen ? 'ouvert' : 'fermé')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <MobileKeyboardHandler 
        inputRef={inputRef}
        onKeyboardToggle={handleKeyboardToggle}
        enabled={true}
      />
      
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">État du clavier virtuel :</h3>
        <p>Ouvert : {isKeyboardOpen ? 'Oui' : 'Non'}</p>
        <p>Hauteur viewport : {viewportHeight}px</p>
        <p>Hauteur clavier : {keyboardHeight}px</p>
        <p>Hauteur initiale : {initialHeight}px</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Test de saisie :
          </label>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez quelque chose pour tester le clavier..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
          />
        </div>

        <div className="text-sm text-gray-600">
          <p>Instructions :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Appuyez sur le champ de saisie</li>
            <li>Le clavier virtuel devrait s'ouvrir</li>
            <li>La zone de saisie devrait s'adapter</li>
            <li>Les informations ci-dessus devraient se mettre à jour</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MobileKeyboardTest
