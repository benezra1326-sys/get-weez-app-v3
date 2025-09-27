import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Filter } from 'lucide-react'

export default function SearchBar({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  showFilters = false,
  className = ""
}) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const handleSearch = (value) => {
    setQuery(value)
    onSearch?.(value)
  }

  const handleClear = () => {
    setQuery('')
    onClear?.()
    inputRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`flex items-center rounded-2xl border transition-all duration-300 ${
          isFocused 
            ? 'border-primary shadow-glow' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: isFocused ? 'var(--color-primary)' : 'var(--color-border)',
          boxShadow: isFocused ? 'var(--shadow-glow)' : 'none'
        }}
      >
        <div className="pl-4 pr-2">
          <Search 
            size={20} 
            style={{ color: 'var(--color-text-muted)' }}
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 py-4 px-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          style={{ color: 'var(--color-text-primary)' }}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="p-2 mr-2 rounded-lg hover:bg-gray-700 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={16} />
          </button>
        )}
        
        {showFilters && (
          <button
            className="p-2 mr-2 rounded-lg hover:bg-gray-700 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Filter size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

// Variante pour la recherche d'établissements
export function EstablishmentSearchBar({ onSearch, onFilter }) {
  return (
    <SearchBar
      placeholder="Search restaurants, bars, clubs..."
      onSearch={onSearch}
      showFilters={true}
      className="w-full max-w-2xl mx-auto"
    />
  )
}

// Variante pour la recherche d'événements
export function EventSearchBar({ onSearch, onFilter }) {
  return (
    <SearchBar
      placeholder="Search events, parties, shows..."
      onSearch={onSearch}
      showFilters={true}
      className="w-full max-w-2xl mx-auto"
    />
  )
}
