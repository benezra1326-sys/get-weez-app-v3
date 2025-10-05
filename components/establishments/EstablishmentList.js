import { Search, Filter, MapPin } from 'lucide-react'
import EstablishmentCard from './EstablishmentCard'
import { useTheme } from '../../contexts/ThemeContextSimple'

export default function EstablishmentList({ establishments, user, onReserve, onSendMessage, isLoading }) {
  const { isDarkMode } = useTheme()
  
  const sortedEstablishments = [...establishments].sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1
    if (!a.sponsored && b.sponsored) return 1
    return 0
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!establishments || establishments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Aucun établissement trouvé</p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Veuillez réessayer plus tard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedEstablishments.map(est => (
        <EstablishmentCard 
          key={est.id}
          establishment={est} 
          user={user} 
          onReserve={onReserve}
          onSendMessage={onSendMessage}
        />
      ))}
    </div>
  )
}