import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:brightness-110 focus:ring-primary/50 shadow-sm',
    secondary: 'bg-secondary text-white hover:brightness-110 focus:ring-secondary/50 shadow-sm',
    accent: 'bg-accent text-primary hover:brightness-110 focus:ring-accent/50 shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-surface-600 hover:text-primary hover:bg-surface-50 focus:ring-surface-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50 shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <motion.button
      whileHover={{ scale: loading || disabled ? 1 : 1.05 }}
      whileTap={{ scale: loading || disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`animate-spin ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`}
          size={iconSize[size]}
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          className="mr-2" 
          size={iconSize[size]}
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          className="ml-2" 
          size={iconSize[size]}
        />
      )}
    </motion.button>
  );
};

export default Button;