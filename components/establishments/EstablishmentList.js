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
    <div 
      style={{ 
        background: isDarkMode ? '#0D0D0D' : '#FFFFFF',
        maxHeight: 'calc(100vh - 20rem)',
        overflowY: 'auto',
        padding: '1rem 0',
        width: '100%',
        minHeight: '400px'
      }}
    >
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          width: '100%',
          visibility: 'visible',
          opacity: 1,
          padding: '1rem'
        }}
      >
        {sortedEstablishments.map(est => (
          <div key={est.id} style={{ 
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            width: '100%',
            minHeight: '300px',
            margin: '0.5rem 0'
          }}>
            <EstablishmentCard 
              establishment={est} 
              user={user} 
              onReserve={onReserve}
              onSendMessage={onSendMessage}
            />
          </div>
        ))}
      </div>
    </div>
  )
}