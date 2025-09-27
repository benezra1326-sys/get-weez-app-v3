import { Search, Filter, MapPin } from 'lucide-react'
import EstablishmentCard from './EstablishmentCard'

export default function EstablishmentList({ establishments, user, onReserve }) {
  const sortedEstablishments = [...establishments].sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1
    if (!a.sponsored && b.sponsored) return 1
    return 0
  })

  return (
    <div className="p-4 md:p-6" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Établissements à Marbella</h1>
          <p className="text-gray-400">Découvrez tous nos partenaires à Marbella</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher à Marbella..."
              className="input-premium rounded-2xl py-2 pl-10 pr-4 w-full md:w-64"
            />
          </div>
          <button className="btn-premium rounded-2xl p-2">
            <Filter size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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