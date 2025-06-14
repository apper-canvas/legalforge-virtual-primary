import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress = 0, 
  showPercentage = false,
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-surface-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${sizes[size]} ${colors[color]} rounded-full`}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-sm text-surface-600 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;