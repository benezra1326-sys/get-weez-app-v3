import { Search } from 'lucide-react'

export const ServiceSearchBar = ({ onSearch, className = "" }) => {
  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const query = formData.get('search')
    onSearch(query)
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          name="search"
          placeholder="Rechercher un service..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onFocus={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
            e.target.style.borderColor = 'rgba(192, 192, 192, 0.5)'
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
          }}
        />
      </div>
    </form>
  )
}

export const EstablishmentSearchBar = ({ onSearch, className = "" }) => {
  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const query = formData.get('search')
    onSearch(query)
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          name="search"
          placeholder="Rechercher un établissement..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onFocus={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
            e.target.style.borderColor = 'rgba(192, 192, 192, 0.5)'
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
          }}
        />
      </div>
    </form>
  )
}