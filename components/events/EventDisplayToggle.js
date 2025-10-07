import { Grid, Calendar, Image } from 'lucide-react'

export default function EventDisplayToggle({ displayMode, onModeChange }) {
  return (
    <>
      <style jsx>{`
        .toggle-button {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .toggle-button:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
          transform: translateY(-2px);
        }
        
        .toggle-button.active {
          background: linear-gradient(135deg, #E5E5E5, #C0C0C0);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          color: white;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-3 p-4">
          <button
            onClick={() => onModeChange('banner')}
            className={`toggle-button flex items-center justify-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
              displayMode === 'banner' ? 'active' : 'text-white'
            }`}
            style={{
              background: displayMode === 'banner' 
                ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              boxShadow: displayMode === 'banner' 
                ? '0 8px 25px rgba(139, 92, 246, 0.4)'
                : '0 4px 12px rgba(139, 92, 246, 0.2)',
            }}
            title="Vue bannières"
          >
            <Image size={20} />
          </button>
          
          <button
            onClick={() => onModeChange('calendar')}
            className={`toggle-button flex items-center justify-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
              displayMode === 'calendar' ? 'active' : 'text-white'
            }`}
            style={{
              background: displayMode === 'calendar' 
                ? 'linear-gradient(135deg, #E5E5E5, #C0C0C0)'
                : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              boxShadow: displayMode === 'calendar' 
                ? '0 8px 25px rgba(139, 92, 246, 0.4)'
                : '0 4px 12px rgba(139, 92, 246, 0.2)',
            }}
            title="Vue calendrier"
          >
            <Calendar size={20} />
          </button>
        </div>
      </div>
    </>
  )
}