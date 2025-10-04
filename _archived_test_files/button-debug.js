import ButtonDebug from '../components/mobile/ButtonDebug'

const ButtonDebugPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Debug Bouton d'Envoi</h1>
          <p className="text-gray-600 mb-4">
            Identifions le problème avec des bordures colorées
          </p>
        </div>

        <ButtonDebug />
      </div>
    </div>
  )
}

export default ButtonDebugPage
