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
          background: linear-gradient(135deg, #8B5CF6, #3B82F6);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          color: white;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <span className="mr-3">🎨</span>
          Mode d'Affichage
        </h2>
        
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onModeChange('banner')}
              className={`toggle-button flex items-center justify-center px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                displayMode === 'banner' ? 'active' : 'text-white'
              }`}
            >
              <Image size={20} className="mr-3" />
              <div className="text-left">
                <div className="font-semibold">Vue Bannières</div>
                <div className="text-sm opacity-80">Images et détails complets</div>
              </div>
            </button>
            
            <button
              onClick={() => onModeChange('calendar')}
              className={`toggle-button flex items-center justify-center px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                displayMode === 'calendar' ? 'active' : 'text-white'
              }`}
            >
              <Calendar size={20} className="mr-3" />
              <div className="text-left">
                <div className="font-semibold">Vue Calendrier</div>
                <div className="text-sm opacity-80">Vue chronologique des événements</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}