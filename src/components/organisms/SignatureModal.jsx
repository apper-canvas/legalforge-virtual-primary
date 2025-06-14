import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SignaturePad from 'signature_pad';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { signatureService } from '@/services';

const SignatureModal = ({ 
  isOpen, 
  onClose, 
  onSignatureComplete,
  documentId,
  signerRole = "Signer" 
}) => {
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signatureType, setSignatureType] = useState('draw'); // 'draw' or 'type'
  const [typedSignature, setTypedSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (isOpen && signatureType === 'draw' && canvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(30, 58, 95)',
        minWidth: 2,
        maxWidth: 4,
        throttle: 16
      });
    }
  }, [isOpen, signatureType]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!signerName.trim()) newErrors.name = 'Name is required';
    if (!signerEmail.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signerEmail)) newErrors.email = 'Valid email is required';
    
    if (signatureType === 'draw') {
      if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
        newErrors.signature = 'Signature is required';
      }
    } else if (signatureType === 'type') {
      if (!typedSignature.trim()) newErrors.signature = 'Typed signature is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let signatureData;
      
      if (signatureType === 'draw') {
        signatureData = signaturePadRef.current.toDataURL();
      } else {
        // Create a simple text signature image
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#1e3a5f';
        ctx.font = '32px cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
        
        signatureData = canvas.toDataURL();
      }

      const signature = await signatureService.create({
        documentId,
        signerId: Date.now().toString(),
        name: signerName.trim(),
        email: signerEmail.trim(),
        role: signerRole,
        signatureData
      });

      toast.success('Document signed successfully');
      onSignatureComplete(signature);
      handleClose();
    } catch (error) {
      toast.error('Failed to save signature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSignerName('');
    setSignerEmail('');
    setTypedSignature('');
    setSignatureType('draw');
    setErrors({});
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    onClose();
  };

  const clearSignature = () => {
    if (signatureType === 'draw' && signaturePadRef.current) {
      signaturePadRef.current.clear();
    } else if (signatureType === 'type') {
      setTypedSignature('');
    }
    if (errors.signature) {
      setErrors(prev => ({ ...prev, signature: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-semibold text-surface-900">
                    Add Signature
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Signer Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-surface-900">Signer Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      error={errors.name}
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      value={signerEmail}
                      onChange={(e) => setSignerEmail(e.target.value)}
                      error={errors.email}
                      required
                    />
                  </div>
                </div>

                {/* Signature Type Selection */}
                <div className="space-y-4">
                  <h3 className="font-medium text-surface-900">Signature Method</h3>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSignatureType('draw')}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all duration-150 ${
                        signatureType === 'draw'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <ApperIcon name="Edit3" className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-sm font-medium">Draw Signature</p>
                    </button>
                    
                    <button
                      onClick={() => setSignatureType('type')}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all duration-150 ${
                        signatureType === 'type'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <ApperIcon name="Type" className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-sm font-medium">Type Signature</p>
                    </button>
                  </div>
                </div>

                {/* Signature Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-surface-900">
                      {signatureType === 'draw' ? 'Draw Your Signature' : 'Type Your Signature'}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearSignature}
                      icon="RotateCcw"
                    >
                      Clear
                    </Button>
                  </div>

                  {signatureType === 'draw' ? (
                    <div className="border-2 border-surface-300 rounded-lg overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full h-48 cursor-crosshair bg-white"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border-2 border-surface-300 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none text-2xl font-cursive text-center"
                        style={{ fontFamily: 'cursive' }}
                      />
                      <p className="text-sm text-surface-500 text-center">
                        This will be your legal signature
                      </p>
                    </div>
                  )}
                  
                  {errors.signature && (
                    <p className="text-sm text-red-600 flex items-center">
                      <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                      {errors.signature}
                    </p>
                  )}
                </div>

                {/* Legal Notice */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-surface-700">
                      <p className="font-medium mb-1">Legal Notice</p>
                      <p>
                        By signing this document, you agree to be legally bound by its terms and conditions. 
                        Your signature has the same legal effect as a handwritten signature.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-surface-200 flex justify-end space-x-3">
                <Button 
                  variant="ghost"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                
                <Button 
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  icon="Check"
                >
                  Sign Document
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SignatureModal;