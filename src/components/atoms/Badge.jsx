import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-primary',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    draft: 'bg-surface-100 text-surface-600',
    review: 'bg-yellow-100 text-yellow-700',
    signed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const iconSize = {
    sm: 10,
    md: 12,
    lg: 14
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          className="mr-1" 
          size={iconSize[size]}
        />
      )}
      {children}
    </motion.span>
  );
};

export default Badge;