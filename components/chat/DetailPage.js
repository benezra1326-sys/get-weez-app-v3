// Composant DetailPage extrait pour éviter les problèmes de structure JSX
const DetailPage = ({ item, onClose, isDarkMode }) => {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4" style={{ paddingTop: '60px' }}>
      <div className={`w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl ${
        isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{item.tags[0]}</div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Description
            </h2>
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {item.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Informations
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prix:</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lieu:</span>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {item.location}
                  </span>
                </div>
                {item.capacity && (
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Capacité:</span>
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.capacity}
                    </span>
                  </div>
                )}
                {item.hours && (
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Horaires:</span>
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.hours}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bouton de réservation */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Fermer
            </button>
            <button
              onClick={() => {
                alert(`Réservation pour ${item.title} - Fonctionnalité à venir !`)
                onClose()
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}