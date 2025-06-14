import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '',
  hoverable = false,
  padding = 'md',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border border-surface-200 shadow-sm';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const motionProps = hoverable ? {
    whileHover: { 
      scale: 1.02,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      className={`${baseClasses} ${paddings[padding]} ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;