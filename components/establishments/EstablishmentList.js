import { Search, Filter, MapPin } from 'lucide-react'
import EstablishmentCard from './EstablishmentCard'

export default function EstablishmentList({ establishments, user, onReserve, isLoading }) {
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

  return (
    <div 
      style={{ 
        background: 'var(--color-bg-primary)',
        maxHeight: 'calc(100vh - 20rem)',
        overflowY: 'auto'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {sortedEstablishments.map(est => (
          <EstablishmentCard 
            key={est.id} 
            establishment={est} 
            user={user} 
            onReserve={onReserve}
          />
        ))}
      </div>
    </div>
  )
}