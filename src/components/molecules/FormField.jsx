import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const FormField = ({ 
  question, 
  value, 
  onChange, 
  error,
  className = '' 
}) => {
  const handleChange = (e) => {
    let newValue = e.target.value;
    
    if (question.type === 'checkbox') {
      const currentValues = Array.isArray(value) ? value : [];
      if (e.target.checked) {
        newValue = [...currentValues, e.target.value];
      } else {
        newValue = currentValues.filter(v => v !== e.target.value);
      }
    }
    
    onChange(question.id, newValue);
  };

  const renderField = () => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <Input
            type={question.type}
            label={question.text}
            value={value || ''}
            onChange={handleChange}
            required={question.required}
            error={error}
            helpText={question.helpText}
          />
        );

      case 'textarea':
        return (
          <div className="relative">
            <textarea
              value={value || ''}
              onChange={handleChange}
              rows={4}
              className={`
                w-full px-4 py-3 border-2 rounded-md transition-all duration-200
                ${error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-surface-300 focus:border-primary focus:ring-primary/20'
                }
                focus:outline-none focus:ring-4 bg-white text-surface-900 resize-none
              `}
              placeholder={question.text}
            />
            
            <motion.label
              initial={false}
              animate={{
                top: value ? '-8px' : '12px',
                fontSize: value ? '0.75rem' : '1rem',
                color: error ? '#ef4444' : '#1e3a5f'
              }}
              className="absolute left-4 bg-white px-1 font-medium transition-all duration-200 pointer-events-none"
            >
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </motion.label>
            
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
            
            {question.helpText && !error && (
              <p className="mt-1 text-sm text-surface-500">{question.helpText}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="relative">
            <select
              value={value || ''}
              onChange={handleChange}
              className={`
                w-full px-4 py-3 border-2 rounded-md transition-all duration-200 appearance-none bg-white
                ${error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-surface-300 focus:border-primary focus:ring-primary/20'
                }
                focus:outline-none focus:ring-4 text-surface-900
              `}
            >
              <option value="">{question.text}</option>
              {question.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            
            <ApperIcon 
              name="ChevronDown" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" 
            />
            
            <motion.label
              initial={false}
              animate={{
                top: value ? '-8px' : '50%',
                fontSize: value ? '0.75rem' : '1rem',
                color: error ? '#ef4444' : '#1e3a5f'
              }}
              className="absolute left-4 transform -translate-y-1/2 bg-white px-1 font-medium transition-all duration-200 pointer-events-none"
            >
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </motion.label>
            
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
            
            {question.helpText && !error && (
              <p className="mt-1 text-sm text-surface-500">{question.helpText}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.options?.map((option, idx) => (
              <motion.label
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-surface-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-150"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary/50 border-surface-300"
                />
                <span className="text-surface-700">{option}</span>
              </motion.label>
            ))}
            
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
            
            {question.helpText && !error && (
              <p className="text-sm text-surface-500">{question.helpText}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.options?.map((option, idx) => (
              <motion.label
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-surface-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-150"
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary/50 border-surface-300 rounded"
                />
                <span className="text-surface-700">{option}</span>
              </motion.label>
            ))}
            
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
            
            {question.helpText && !error && (
              <p className="text-sm text-surface-500">{question.helpText}</p>
            )}
          </div>
        );

      default:
        return (
          <Input
            label={question.text}
            value={value || ''}
            onChange={handleChange}
            required={question.required}
            error={error}
            helpText={question.helpText}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${className}`}
    >
      {renderField()}
    </motion.div>
  );
};

export default FormField;