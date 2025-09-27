import { useState } from 'react'
import { Calendar, List, Grid } from 'lucide-react'

export default function EventDisplayToggle({ currentView, onViewChange }) {
  const displayOptions = [
    {
      id: 'banner',
      name: 'Bannière',
      icon: Grid,
      description: 'Vue en bannière horizontale'
    },
    {
      id: 'calendar',
      name: 'Calendrier',
      icon: Calendar,
      description: 'Vue calendrier avec dates'
    },
    {
      id: 'list',
      name: 'Liste',
      icon: List,
      description: 'Vue liste verticale'
    }
  ]

  return (
    <div className="flex items-center space-x-2 mb-6">
      <span className="text-sm font-medium text-text-secondary mr-4">
        Affichage :
      </span>
      <div className="flex bg-surface rounded-lg p-1">
        {displayOptions.map((option) => {
          const Icon = option.icon
          const isActive = currentView === option.id
          
          return (
            <button
              key={option.id}
              onClick={() => onViewChange(option.id)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
              title={option.description}
            >
              <Icon size={16} className="mr-2" />
              {option.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
