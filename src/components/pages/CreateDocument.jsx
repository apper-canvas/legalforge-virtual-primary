import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import QuestionnaireForm from "@/components/organisms/QuestionnaireForm";
import SkeletonLoader from "@/components/organisms/SkeletonLoader";
import ErrorState from "@/components/organisms/ErrorState";
import { documentService, templateService } from "@/services";

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
    <div
    className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === "template" && <motion.div
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}>
            {/* Enhanced Header */}
            <div className="mb-10">
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-8">
                    <div className="flex items-center space-x-4 mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/templates")}
                            icon="ArrowLeft"
                            className="hover:bg-slate-100 hover:shadow-md transition-all duration-200">Back to Templates
                                              </Button>
                    </div>
                    <div className="flex items-start space-x-6">
                        <div
                            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                            <ApperIcon name={template.icon} className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1
                                className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                {template.name}
                            </h1>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                {template.description}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="default" icon="Clock" className="shadow-sm">
                                    {template.estimatedTime}
                                </Badge>
                                <Badge variant={getRiskLevelColor(template.riskLevel)} className="shadow-sm">
                                    {template.riskLevel}risk
                                                          </Badge>
                                <Badge
                                    variant="primary"
                                    icon="MapPin"
                                    className="shadow-sm bg-gradient-to-r from-blue-600 to-purple-600">
                                    {template.jurisdictions.length > 1 ? `${template.jurisdictions.length} jurisdictions` : template.jurisdictions[0]}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Enhanced Template Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Features */}
                <div
                    className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft hover:shadow-hover transition-shadow duration-300 p-8">
                    <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center">
                        <div
                            className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                            <ApperIcon name="CheckCircle" className="w-5 h-5 text-white" />
                        </div>What's Included
                                        </h3>
                    <div className="space-y-4">
                        {template.features.map((feature, index) => <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                x: -10
                            }}
                            animate={{
                                opacity: 1,
                                x: 0
                            }}
                            transition={{
                                delay: index * 0.1
                            }}
                            className="flex items-center space-x-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                            <div
                                className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <ApperIcon name="Check" className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-slate-700 font-medium">{feature}</span>
                        </motion.div>)}
                    </div>
                </div>
                {/* Quick Info */}
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft hover:shadow-hover transition-shadow duration-300 p-8">
                    <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center">
                        <div
                            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <ApperIcon name="Info" className="w-5 h-5 text-white" />
                        </div>Quick Info
                                        </h3>
                    <div className="space-y-4 text-sm">
                        <div
                            className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600 font-medium">Category:</span>
                            <span className="text-slate-900 font-semibold bg-slate-50 px-3 py-1 rounded-lg">{template.category}</span>
                        </div>
                        <div
                            className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600 font-medium">Popularity:</span>
                            <span className="text-slate-900 font-semibold">{template.popularity}%</span>
                        </div>
                        <div
                            className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600 font-medium">Risk Level:</span>
                            <Badge
                                variant={getRiskLevelColor(template.riskLevel)}
                                size="sm"
                                className="shadow-sm">
                                {template.riskLevel}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-slate-600 font-medium">Est. Time:</span>
                            <span className="text-slate-900 font-semibold">{template.estimatedTime}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Available Jurisdictions */}
            <div
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft hover:shadow-hover transition-shadow duration-300 p-8 mb-10">
                <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center">
                    <div
                        className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                        <ApperIcon name="MapPin" className="w-5 h-5 text-white" />
                    </div>Available Jurisdictions
                                  </h3>
                <div className="flex flex-wrap gap-3">
                    {template.jurisdictions.map((jurisdiction, index) => <Badge
                        key={index}
                        variant="outline"
                        className="border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                        {jurisdiction}
                    </Badge>)}
                </div>
            </div>
            {/* Enhanced Action */}
            <div className="text-center">
                <motion.div
                    whileHover={{
                        scale: 1.02
                    }}
                    whileTap={{
                        scale: 0.98
                    }}>
                    <Button
                        onClick={handleStartQuestionnaire}
                        variant="primary"
                        size="lg"
                        icon="ArrowRight"
                        iconPosition="right"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl px-12 py-4 text-lg font-semibold">Start Questionnaire
                                        </Button>
                </motion.div>
            </div>
        </motion.div>}
        {currentStep === "questionnaire" && <motion.div
            initial={{
                opacity: 0,
                x: 20
            }}
            animate={{
                opacity: 1,
                x: 0
            }}
            exit={{
                opacity: 0,
                x: -20
            }}>
            <QuestionnaireForm
                templateId={templateId}
                onComplete={handleQuestionnaireComplete}
                onCancel={handleCancel} />
        </motion.div>}
    </div></div>
  );
};

export default CreateDocument;