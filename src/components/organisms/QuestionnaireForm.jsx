import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import FormField from '@/components/molecules/FormField';
import { questionService } from '@/services';

const QuestionnaireForm = ({ 
  templateId, 
  onComplete, 
  onCancel,
  initialAnswers = {},
  className = "" 
}) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsPerStep = 3;
  const totalSteps = Math.ceil(questions.length / questionsPerStep);
  const progress = questions.length > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  useEffect(() => {
    loadQuestions();
  }, [templateId]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const questionsData = await questionService.getByTemplateId(templateId);
      setQuestions(questionsData);
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error for this field
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = async () => {
    setValidating(true);
    const currentQuestions = getCurrentStepQuestions();
    const stepAnswers = {};
    
    currentQuestions.forEach(q => {
      stepAnswers[q.id] = answers[q.id];
    });

    try {
      const validation = await questionService.validateAnswers(templateId, stepAnswers);
      const stepErrors = {};
      
      validation.errors.forEach(error => {
        if (currentQuestions.find(q => q.id === error.questionId)) {
          stepErrors[error.questionId] = error.message;
        }
      });
      
      setErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    } catch (error) {
      toast.error('Validation failed');
      return false;
    } finally {
      setValidating(false);
    }
  };

  const getCurrentStepQuestions = () => {
    const startIdx = currentStep * questionsPerStep;
    const endIdx = startIdx + questionsPerStep;
    return questions.slice(startIdx, endIdx);
  };

  const getVisibleQuestions = () => {
    return getCurrentStepQuestions().filter(question => {
      if (!question.dependsOn) return true;
      
      const dependencyAnswer = answers[question.dependsOn.questionId];
      return dependencyAnswer === question.dependsOn.value;
    });
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const validation = await questionService.validateAnswers(templateId, answers);
      
      if (!validation.isValid) {
        const allErrors = {};
        validation.errors.forEach(error => {
          allErrors[error.questionId] = error.message;
        });
        setErrors(allErrors);
        toast.error('Please fix the highlighted errors');
        return;
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
          toast.warn(warning.message);
        });
      }

      await onComplete(answers);
      toast.success('Questionnaire completed successfully');
    } catch (error) {
      toast.error('Failed to submit questionnaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-surface-200 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-surface-200 rounded animate-pulse w-16" />
        </div>
        <div className="h-2 bg-surface-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-surface-200 rounded animate-pulse w-1/4" />
              <div className="h-12 bg-surface-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visibleQuestions = getVisibleQuestions();
  const isLastStep = currentStep === totalSteps - 1;

return (
    <div className={`max-w-3xl mx-auto ${className}`}>
      {/* Enhanced Header */}
      <div className="mb-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Document Questionnaire
            </h2>
            <span className="text-sm text-slate-600 font-semibold bg-slate-100 px-3 py-1 rounded-lg">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          
          <ProgressBar 
            progress={progress} 
            showPercentage 
            className="mb-2" 
          />
        </div>
      </div>

      {/* Questions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8 mb-8"
        >
          {visibleQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FormField
                question={question}
                value={answers[question.id]}
                onChange={handleAnswerChange}
                error={errors[question.id]}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

{/* Enhanced Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <Button 
              variant="ghost"
              onClick={onCancel}
              icon="X"
              className="border border-slate-300 hover:bg-slate-100 hover:shadow-md"
            >
              Cancel
            </Button>
            
            {currentStep > 0 && (
              <Button 
                variant="outline"
                onClick={handlePrevious}
                icon="ChevronLeft"
                className="border-slate-300 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
              >
                Previous
              </Button>
            )}
          </div>
        
<div className="flex space-x-3">
            {!isLastStep ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="primary"
                  onClick={handleNext}
                  loading={validating}
                  icon="ChevronRight"
                  iconPosition="right"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                >
                  Next
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  icon="Check"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                >
                  Complete
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;