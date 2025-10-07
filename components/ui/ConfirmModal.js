import React, { useEffect, useState } from 'react'
import { X, AlertTriangle, Trash2, CheckCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContextSimple'

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmer la suppression", 
  message = "Êtes-vous sûr de vouloir supprimer cet élément ?",
  confirmText = "Supprimer",
  cancelText = "Annuler",
  type = "danger" // danger, warning, info, success
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Vérification de sécurité pour useTheme
  let isDarkMode = true
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
  } catch (error) {
    console.warn('ThemeProvider not available, using dark mode as default')
  }

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      setTimeout(() => setIsVisible(false), 300)
    }
  }, [isOpen])

  if (!isVisible) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getTypeStyles = () => {
    const baseStyles = {
      danger: {
        icon: <Trash2 size={28} className="animate-pulse" />,
        iconColor: isDarkMode ? 'text-red-400' : 'text-red-500',
        iconBg: isDarkMode 
          ? 'bg-gradient-to-br from-red-500/20 to-red-600/10' 
          : 'bg-gradient-to-br from-red-50 to-red-100',
        confirmBg: isDarkMode
          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
        borderColor: isDarkMode ? 'border-red-500/30' : 'border-red-200',
        glowColor: 'shadow-red-500/20'
      },
      warning: {
        icon: <AlertTriangle size={28} className="animate-pulse" />,
        iconColor: isDarkMode ? 'text-amber-400' : 'text-amber-500',
        iconBg: isDarkMode 
          ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10' 
          : 'bg-gradient-to-br from-amber-50 to-amber-100',
        confirmBg: isDarkMode
          ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
        borderColor: isDarkMode ? 'border-amber-500/30' : 'border-amber-200',
        glowColor: 'shadow-amber-500/20'
      },
      success: {
        icon: <CheckCircle size={28} className="animate-pulse" />,
        iconColor: isDarkMode ? 'text-green-400' : 'text-green-500',
        iconBg: isDarkMode 
          ? 'bg-gradient-to-br from-green-500/20 to-green-600/10' 
          : 'bg-gradient-to-br from-green-50 to-green-100',
        confirmBg: isDarkMode
          ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        borderColor: isDarkMode ? 'border-green-500/30' : 'border-green-200',
        glowColor: 'shadow-green-500/20'
      },
      default: {
        icon: <AlertTriangle size={28} className="animate-pulse" />,
        iconColor: isDarkMode ? 'text-gray-400' : 'text-gray-500',
        iconBg: isDarkMode 
          ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10' 
          : 'bg-gradient-to-br from-blue-50 to-blue-100',
        confirmBg: isDarkMode
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        borderColor: isDarkMode ? 'border-blue-500/30' : 'border-blue-200',
        glowColor: 'shadow-gray-500/20'
      }
    }
    return baseStyles[type] || baseStyles.default
  }

  const styles = getTypeStyles()

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop amélioré */}
      <div 
        className={`absolute inset-0 transition-all duration-300 ${
          isAnimating ? 'backdrop-blur-md' : 'backdrop-blur-none'
        }`}
        style={{
          background: isDarkMode 
            ? 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)'
            : 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)'
        }}
      />
      
      {/* Modal moderne */}
      <div 
        className={`relative max-w-md w-full transform transition-all duration-300 ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
          border: `1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)'}`,
          borderRadius: '24px',
          boxShadow: isDarkMode 
            ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)'
        }}
      >
        {/* Header élégant */}
        <div 
          className={`px-8 py-6 border-b ${styles.borderColor}`}
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)'
              : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px'
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className={`p-4 rounded-2xl ${styles.iconBg} ${styles.glowColor} shadow-lg`}
                style={{
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
                }}
              >
                <div className={styles.iconColor}>
                {styles.icon}
                </div>
              </div>
              <div>
                <h3 
                  className={`text-xl font-bold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                {title}
              </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cette action est irréversible
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="px-8 py-8">
          <p 
            className={`text-base leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {message}
          </p>
        </div>

        {/* Footer moderne */}
        <div 
          className={`px-8 py-6 border-t ${styles.borderColor}`}
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.4) 100%)'
              : 'linear-gradient(135deg, rgba(248, 250, 252, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px'
          }}
        >
          <div className="flex space-x-4 justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                isDarkMode
                  ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white border border-gray-600/50'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-3 ${styles.confirmBg} text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${styles.glowColor} shadow-lg hover:shadow-xl`}
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
