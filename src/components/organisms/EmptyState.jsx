import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = "No items found",
  description = "Get started by creating your first item",
  actionLabel = "Create Item",
  onAction,
  icon = "FileText",
  showAction = true,
  className = ""
}) => {
return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 1, -1, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4, 
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
        className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-8 shadow-lg"
      >
        <ApperIcon name={icon} className="w-10 h-10 text-slate-400" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-8 max-w-md text-lg leading-relaxed">
        {description}
      </p>
      
      {showAction && onAction && (
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onAction}
            variant="primary"
            icon="Plus"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl px-8 py-3"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;