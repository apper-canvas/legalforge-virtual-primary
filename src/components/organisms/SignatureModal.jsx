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
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
          
          {/* Enhanced Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/50">
              {/* Enhanced Header */}
              <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <ApperIcon name="PenTool" className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-slate-900">
                      Add Signature
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/60 transition-all duration-200"
                  >
                    <ApperIcon name="X" className="w-6 h-6" />
                  </button>
                </div>
              </div>

{/* Enhanced Content */}
              <div className="p-8 space-y-8">
                {/* Enhanced Signer Information */}
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name="User" className="w-4 h-4 text-white" />
                    </div>
                    Signer Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      error={errors.name}
                      required
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      value={signerEmail}
                      onChange={(e) => setSignerEmail(e.target.value)}
                      error={errors.email}
                      required
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                    />
                  </div>
                </div>
{/* Enhanced Signature Type Selection */}
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name="Settings" className="w-4 h-4 text-white" />
                    </div>
                    Signature Method
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSignatureType('draw')}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        signatureType === 'draw'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <ApperIcon name="Edit3" className="w-8 h-8 mx-auto mb-3" />
                      <p className="font-semibold">Draw Signature</p>
                      <p className="text-sm opacity-75 mt-1">Use mouse or touch</p>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSignatureType('type')}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        signatureType === 'type'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <ApperIcon name="Type" className="w-8 h-8 mx-auto mb-3" />
                      <p className="font-semibold">Type Signature</p>
                      <p className="text-sm opacity-75 mt-1">Type your name</p>
                    </motion.button>
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
                    <div className="border-2 border-slate-300 rounded-xl overflow-hidden shadow-inner">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full h-48 cursor-crosshair bg-white"
                      />
                    </div>
                  ) : (
<div className="space-y-3">
                      <input
                        type="text"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-6 py-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none text-2xl font-cursive text-center bg-white shadow-inner"
                        style={{ fontFamily: 'cursive' }}
                      />
                      <p className="text-sm text-slate-500 text-center font-medium">
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

{/* Enhanced Legal Notice */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="AlertTriangle" className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm text-slate-700">
                      <p className="font-bold mb-2 text-slate-900">Legal Notice</p>
                      <p className="leading-relaxed">
                        By signing this document, you agree to be legally bound by its terms and conditions. 
                        Your signature has the same legal effect as a handwritten signature.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

{/* Enhanced Footer */}
              <div className="p-8 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100 flex justify-end space-x-4">
                <Button 
                  variant="ghost"
                  onClick={handleClose}
                  className="border border-slate-300 hover:bg-slate-100 hover:shadow-md"
                >
                  Cancel
                </Button>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="primary"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    icon="Check"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl px-8"
                  >
                    Sign Document
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SignatureModal;