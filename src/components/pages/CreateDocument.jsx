import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import QuestionnaireForm from '@/components/organisms/QuestionnaireForm';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { templateService, documentService } from '@/services';

const CreateDocument = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('template'); // 'template', 'questionnaire', 'processing'

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const templateData = await templateService.getById(templateId);
      setTemplate(templateData);
    } catch (err) {
      setError(err.message || 'Failed to load template');
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuestionnaire = () => {
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = async (answers) => {
    setCreating(true);
    setCurrentStep('processing');
    
    try {
      // Generate document content using AI
      const generatedContent = await documentService.generateContent(templateId, answers);
      
      // Create the document
      const document = await documentService.create({
        type: templateId,
        title: `${template.name} - ${new Date().toLocaleDateString()}`,
        templateId: templateId,
        jurisdiction: answers.jurisdiction || 'California',
        riskLevel: template.riskLevel,
        content: generatedContent,
        answers: answers
      });

      toast.success('Document created successfully');
      navigate(`/preview/${document.id}`);
    } catch (error) {
      toast.error('Failed to create document');
      setCurrentStep('questionnaire');
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    if (currentStep === 'questionnaire') {
      setCurrentStep('template');
    } else {
      navigate('/templates');
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader count={1} type="form" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          title="Failed to Load Template"
          message={error}
          onRetry={loadTemplate}
        />
      </div>
    );
  }

  if (currentStep === 'processing') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="Loader2" className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h2 className="text-2xl font-display font-semibold text-surface-900 mb-4">
            Generating Your Document
          </h2>
          
          <p className="text-surface-600 mb-8 max-w-md mx-auto">
            Our AI is analyzing your responses and generating a customized legal document. 
            This usually takes 30-60 seconds.
          </p>
          
          <div className="space-y-3 text-sm text-surface-500">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
              <span>Processing questionnaire responses</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
              className="flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-primary" />
              <span>Generating legal clauses</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5 }}
              className="flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Clock" className="w-4 h-4 text-surface-400" />
              <span>Finalizing document structure</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentStep === 'template' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/templates')}
                icon="ArrowLeft"
              >
                Back to Templates
              </Button>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ApperIcon name={template.icon} className="w-8 h-8 text-primary" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
                  {template.name}
                </h1>
                <p className="text-surface-600 text-lg mb-4">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default" icon="Clock">
                    {template.estimatedTime}
                  </Badge>
                  <Badge variant={getRiskLevelColor(template.riskLevel)}>
                    {template.riskLevel} risk
                  </Badge>
                  <Badge variant="primary" icon="MapPin">
                    {template.jurisdictions.length > 1 
                      ? `${template.jurisdictions.length} jurisdictions`
                      : template.jurisdictions[0]
                    }
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Template Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Features */}
            <Card className="lg:col-span-2">
              <h3 className="font-semibold text-surface-900 mb-4 flex items-center">
                <ApperIcon name="CheckCircle" className="w-5 h-5 text-primary mr-2" />
                What's Included
              </h3>
              
              <div className="space-y-3">
                {template.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <ApperIcon name="Check" className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-surface-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quick Info */}
            <Card>
              <h3 className="font-semibold text-surface-900 mb-4 flex items-center">
                <ApperIcon name="Info" className="w-5 h-5 text-primary mr-2" />
                Quick Info
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-500">Category:</span>
                  <span className="text-surface-900 font-medium">{template.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-surface-500">Popularity:</span>
                  <span className="text-surface-900 font-medium">{template.popularity}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-surface-500">Risk Level:</span>
                  <Badge variant={getRiskLevelColor(template.riskLevel)} size="sm">
                    {template.riskLevel}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-surface-500">Est. Time:</span>
                  <span className="text-surface-900 font-medium">{template.estimatedTime}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Available Jurisdictions */}
          <Card className="mb-8">
            <h3 className="font-semibold text-surface-900 mb-4 flex items-center">
              <ApperIcon name="MapPin" className="w-5 h-5 text-primary mr-2" />
              Available Jurisdictions
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {template.jurisdictions.map((jurisdiction, index) => (
                <Badge key={index} variant="outline">
                  {jurisdiction}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Action */}
          <div className="flex justify-end">
            <Button
              onClick={handleStartQuestionnaire}
              variant="primary"
              size="lg"
              icon="ArrowRight"
              iconPosition="right"
            >
              Start Questionnaire
            </Button>
          </div>
        </motion.div>
      )}

      {currentStep === 'questionnaire' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <QuestionnaireForm
            templateId={templateId}
            onComplete={handleQuestionnaireComplete}
            onCancel={handleCancel}
          />
        </motion.div>
      )}
    </div>
  );
};

export default CreateDocument;