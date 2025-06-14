import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label,
  type = 'text',
  error,
  helpText,
  icon,
  required = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e) => {
    setFocused(false);
    setHasValue(!!e.target.value);
  };

  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <ApperIcon name={icon} className="w-4 h-4 text-surface-400" />
          </div>
        )}
        
        <input
          type={type}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 border-2 rounded-md transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-surface-300 focus:border-primary focus:ring-primary/20'
            }
            focus:outline-none focus:ring-4 bg-white text-surface-900 placeholder-transparent
          `}
          placeholder={label}
          {...props}
        />
        
        {label && (
          <motion.label
            initial={false}
            animate={{
              top: focused || hasValue ? '-8px' : '50%',
              fontSize: focused || hasValue ? '0.75rem' : '1rem',
              color: focused 
                ? (error ? '#ef4444' : '#1e3a5f')
                : '#6b7280'
            }}
            className={`
              absolute left-4 transform -translate-y-1/2 pointer-events-none
              bg-white px-1 font-medium transition-all duration-200
              ${icon ? 'left-10' : 'left-4'}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600 flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-surface-500">{helpText}</p>
      )}
    </div>
  );
};

export default Input;