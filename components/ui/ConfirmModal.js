import React from 'react'
import { X, AlertTriangle, Trash2 } from 'lucide-react'

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmer la suppression", 
  message = "Êtes-vous sûr de vouloir supprimer cet élément ?",
  confirmText = "Supprimer",
  cancelText = "Annuler",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 className="text-red-500" size={24} />,
          iconBg: 'bg-red-500/10',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-500/20'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="text-yellow-500" size={24} />,
          iconBg: 'bg-yellow-500/10',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          borderColor: 'border-yellow-500/20'
        }
      default:
        return {
          icon: <AlertTriangle className="text-blue-500" size={24} />,
          iconBg: 'bg-blue-500/10',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-500/20'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${styles.borderColor} bg-gray-800/50`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                {styles.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl">
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${styles.confirmBg} text-white rounded-lg transition-colors font-medium`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
