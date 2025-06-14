import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  title = "Something went wrong",
  message = "We encountered an error. Please try again.",
  onRetry,
  showRetry = true,
  icon = "AlertCircle",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name={icon} className="w-8 h-8 text-red-600" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;