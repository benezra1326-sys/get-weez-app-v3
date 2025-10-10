import React, { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

export default function EventsCalendar({ events = [], onEventClick, isDarkMode = false }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Obtenir les événements pour un mois donné
  const getEventsForMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  }
  
  // Obtenir les événements pour un jour donné
  const getEventsForDay = (date) => {
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year
    })
  }
  
  // Générer les jours du mois
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDay = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }
  
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  
  const days = generateCalendarDays()
  const currentMonthEvents = getEventsForMonth(currentDate)
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }
  
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }
  
  return (
    <div 
      className="rounded-2xl p-6"
      style={{
        background: isDarkMode 
          ? 'rgba(192, 192, 192, 0.08)' 
          : 'rgba(192, 192, 192, 0.12)',
        border: isDarkMode 
          ? '1px solid rgba(192, 192, 192, 0.2)' 
          : '1px solid rgba(192, 192, 192, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header du calendrier */}
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-xl font-bold flex items-center gap-2"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: isDarkMode ? '#FFFFFF' : '#0B0B0C'
          }}
        >
          <CalendarIcon size={20} />
          Calendrier des événements
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-opacity-20 transition-all"
            style={{
              color: isDarkMode ? '#C0C0C0' : '#666666',
              background: isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(0, 0, 0, 0.05)'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <span 
            className="font-semibold px-4"
            style={{
              color: isDarkMode ? '#C0C0C0' : '#0B0B0C',
              minWidth: '150px',
              textAlign: 'center'
            }}
          >
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-opacity-20 transition-all"
            style={{
              color: isDarkMode ? '#C0C0C0' : '#666666',
              background: isDarkMode ? 'rgba(192, 192, 192, 0.1)' : 'rgba(0, 0, 0, 0.05)'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* En-têtes des jours */}
        {dayNames.map(day => (
          <div 
            key={day}
            className="p-2 text-center text-sm font-semibold"
            style={{
              color: isDarkMode ? '#C0C0C0' : '#666666'
            }}
          >
            {day}
          </div>
        ))}
        
        {/* Jours du mois */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonthDay = isCurrentMonth(day)
          const isTodayDate = isToday(day)
          
          return (
            <div
              key={index}
              className={`p-2 text-center text-sm cursor-pointer rounded-lg relative min-h-[40px] flex flex-col items-center justify-center transition-all hover:scale-105 ${
                !isCurrentMonthDay ? 'opacity-30' : ''
              }`}
              style={{
                background: isTodayDate 
                  ? (isDarkMode ? '#C0C0C0' : '#0B0B0C')
                  : (isDarkMode ? 'rgba(192, 192, 192, 0.05)' : 'rgba(0, 0, 0, 0.02)'),
                color: isTodayDate 
                  ? (isDarkMode ? '#0B0B0C' : '#FFFFFF')
                  : (isDarkMode ? '#C0C0C0' : '#666666'),
                border: dayEvents.length > 0 
                  ? `2px solid ${isDarkMode ? '#C0C0C0' : '#0B0B0C'}`
                  : 'none'
              }}
              onClick={() => {
                if (dayEvents.length > 0 && onEventClick) {
                  onEventClick(dayEvents[0])
                }
              }}
            >
              <span className="font-semibold">{day.getDate()}</span>
              
              {/* Indicateur d'événements */}
              {dayEvents.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {dayEvents.slice(0, 3).map((_, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="w-1 h-1 rounded-full"
                      style={{
                        background: isDarkMode ? '#0B0B0C' : '#FFFFFF'
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span 
                      className="text-xs"
                      style={{
                        color: isDarkMode ? '#0B0B0C' : '#FFFFFF'
                      }}
                    >
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Légende */}
      {currentMonthEvents.length > 0 && (
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{
            background: isDarkMode 
              ? 'rgba(192, 192, 192, 0.05)' 
              : 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <p 
            className="text-sm"
            style={{
              color: isDarkMode ? '#C0C0C0' : '#666666'
            }}
          >
            {currentMonthEvents.length} événement{currentMonthEvents.length > 1 ? 's' : ''} ce mois-ci
          </p>
        </div>
      )}
    </div>
  )
}
