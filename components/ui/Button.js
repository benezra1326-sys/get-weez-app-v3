export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '',
  ...props 
}) {
  const baseClasses = 'rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-105 hover:shadow-lg active:scale-95'
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500 hover:shadow-purple-500/25',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 hover:shadow-gray-500/25',
    outline: 'border border-purple-500 text-purple-400 hover:bg-purple-500/10 focus:ring-purple-500 hover:shadow-purple-500/25'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}