import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react'

export default function EventCalendarView({ events }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Ajouter les jours vides du début du mois
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }
  
  const getEventsForDate = (date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }
  
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }
  
  const days = getDaysInMonth(currentMonth)
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  
  return (
    <div className="bg-surface rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-text-secondary" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-text-secondary" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date)
          const isToday = date && date.toDateString() === new Date().toDateString()
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-border rounded-lg ${
                date ? 'bg-surface' : 'bg-transparent'
              } ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs bg-primary/20 text-primary p-1 rounded truncate"
                        title={event.name}
                      >
                        {event.name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-text-muted">
                        +{dayEvents.length - 2} autres
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Liste des événements du mois */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Événements de {monthNames[currentMonth.getMonth()]}
        </h3>
        <div className="space-y-3">
          {events
            .filter(event => {
              const eventDate = new Date(event.date)
              return eventDate.getMonth() === currentMonth.getMonth() && 
                     eventDate.getFullYear() === currentMonth.getFullYear()
            })
            .map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <div className="font-medium text-text-primary">{event.name}</div>
                    <div className="text-sm text-text-secondary flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {event.date} à {event.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {event.location}
                      </span>
                      <span className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {event.capacity} places
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{event.price}€</div>
                  <button className="text-xs text-primary hover:text-primary-light">
                    Réserver
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
