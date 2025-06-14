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
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
      >
        <ApperIcon name={icon} className="w-10 h-10 text-red-600" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-8 max-w-md text-lg leading-relaxed">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={onRetry}
            variant="primary"
            icon="RefreshCw"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl px-8 py-3"
          >
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;