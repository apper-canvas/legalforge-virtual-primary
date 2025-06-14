import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import DocumentRenderer from '@/components/organisms/DocumentRenderer';
import SignatureModal from '@/components/organisms/SignatureModal';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { documentService, signatureService } from '@/services';
import { format } from 'date-fns';

const DocumentPreview = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('document'); // 'document' or 'explanations'

  useEffect(() => {
    loadDocument();
    loadSignatures();
  }, [documentId]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const documentData = await documentService.getById(documentId);
      setDocument(documentData);
    } catch (err) {
      setError(err.message || 'Failed to load document');
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const loadSignatures = async () => {
    try {
      const signaturesData = await signatureService.getByDocumentId(documentId);
      setSignatures(signaturesData);
    } catch (err) {
      console.error('Failed to load signatures:', err);
    }
  };

  const handleSignature = () => {
    setShowSignatureModal(true);
  };

  const handleSignatureComplete = async (signature) => {
    try {
      // Update document status if needed
      if (document.status === 'draft') {
        await documentService.update(documentId, { status: 'signed' });
        setDocument(prev => ({ ...prev, status: 'signed' }));
      }
      
      // Reload signatures
      await loadSignatures();
      toast.success('Document signed successfully');
    } catch (error) {
      toast.error('Failed to update document status');
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      const documentElement = document.getElementById('document-content');
      if (!documentElement) {
        throw new Error('Document content not found');
      }

      const canvas = await html2canvas(documentElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${document.title}.pdf`);
      toast.success('Document exported successfully');
    } catch (error) {
      toast.error('Failed to export document');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return 'FileText';
      case 'review': return 'Eye';
      case 'signed': return 'CheckCircle';
      case 'completed': return 'Archive';
      default: return 'FileText';
    }
  };

  const getExplanations = () => {
    if (!document?.content?.sections) return [];
    
    return document.content.sections.map(section => ({
      title: section.title,
      explanation: getPlainLanguageExplanation(section.title, section.content)
    }));
  };

  const getPlainLanguageExplanation = (title, content) => {
    const explanations = {
      'PARTIES': 'This section identifies who is involved in the agreement. It establishes the legal names and roles of each party, making it clear who has rights and responsibilities under this contract.',
      'PROPERTY': 'This describes the specific property or subject matter of the agreement. It provides the exact location, description, or details of what is being contracted for.',
      'TERM': 'This sets the time period for the agreement. It specifies when the contract begins, when it ends, and any important dates or deadlines.',
      'RENT': 'This outlines the payment obligations. It specifies how much money is owed, when payments are due, and any additional fees or charges.',
      'CONFIDENTIAL INFORMATION': 'This defines what information must be kept secret. It protects sensitive business information, trade secrets, and other proprietary data.',
      'OBLIGATIONS': 'This lists what each party must do or refrain from doing. It creates binding duties that must be followed to comply with the agreement.',
      'SERVICES': 'This describes the work or services to be performed. It sets expectations for deliverables, quality standards, and performance requirements.',
      'COMPENSATION': 'This explains how payment will be made. It includes amounts, timing, methods of payment, and any conditions for payment.',
      'SIGNATURES': 'This section makes the agreement legally binding. When all required parties sign, they agree to be bound by all terms and conditions.'
    };
    
    return explanations[title] || 'This section contains important legal terms and conditions that govern this agreement. Please review carefully and consult with a legal professional if you have questions.';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader count={1} type="document" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          title="Failed to Load Document"
          message={error}
          onRetry={loadDocument}
        />
      </div>
    );
  }

  const explanations = getExplanations();

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/my-documents')}
                  icon="ArrowLeft"
                  className="hover:bg-slate-100 hover:shadow-md transition-all duration-200"
                >
                  Back to Documents
                </Button>
                
                <div className="flex items-center space-x-4">
                  <Badge variant={document.status} icon={getStatusIcon(document.status)} className="shadow-sm">
                    {document.status}
                  </Badge>
                  
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                  
                  <span className="text-sm text-slate-600 font-medium">
                    Created {format(new Date(document.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSignature}
                  icon="PenTool"
                  className="border-slate-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Add Signature
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleExportPDF}
                  loading={isExporting}
                  icon="Download"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                >
                  Export PDF
                </Button>
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {document.title}
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                {document.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {document.jurisdiction}
              </p>
            </div>
          </div>
        </motion.div>

{/* Mobile Tab Selector */}
        <div className="lg:hidden mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft overflow-hidden">
            <div className="flex">
              <button
                onClick={() => setActiveTab('document')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'document'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ApperIcon name="FileText" className="w-5 h-5 inline mr-2" />
                Document
              </button>
              <button
                onClick={() => setActiveTab('explanations')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'explanations'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ApperIcon name="MessageCircle" className="w-5 h-5 inline mr-2" />
                Explanations
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document */}
          <div className={`lg:col-span-2 ${activeTab === 'document' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft hover:shadow-hover transition-shadow duration-300 p-8 min-h-[800px]">
              <div id="document-content">
                <DocumentRenderer 
                  document={document} 
                  showSignatures={signatures.length > 0}
                />
              </div>
            </div>
          </div>

{/* Sidebar */}
          <div className={`space-y-8 ${activeTab === 'explanations' ? 'block' : 'hidden lg:block'}`}>
            {/* Plain Language Explanations */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft hover:shadow-hover transition-shadow duration-300 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="MessageCircle" className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Plain Language Guide</h3>
              </div>
              
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {explanations.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-gradient-to-b from-blue-400 to-purple-500 pl-6 py-2 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-r-xl"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 mb-3">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {item.explanation}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

{/* Document Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft hover:shadow-hover transition-shadow duration-300 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Info" className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Document Details</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Type:</span>
                  <span className="text-slate-900 font-semibold capitalize bg-slate-50 px-3 py-1 rounded-lg">
                    {document.type.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Status:</span>
                  <Badge variant={document.status} size="sm" className="shadow-sm">
                    {document.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Risk Level:</span>
                  <Badge 
                    variant={document.riskLevel === 'low' ? 'success' : document.riskLevel === 'medium' ? 'warning' : 'error'} 
                    size="sm"
                    className="shadow-sm"
                  >
                    {document.riskLevel}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Jurisdiction:</span>
                  <span className="text-slate-900 font-semibold">{document.jurisdiction}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Created:</span>
                  <span className="text-slate-900 font-semibold">
                    {format(new Date(document.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600 font-medium">Last Updated:</span>
                  <span className="text-slate-900 font-semibold">
                    {format(new Date(document.updatedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>

{/* Signatures */}
            {signatures.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft hover:shadow-hover transition-shadow duration-300 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="PenTool" className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Signatures</h3>
                </div>
                
                <div className="space-y-4">
                  {signatures.map((signature, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <ApperIcon name="Check" className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {signature.name}
                        </p>
                        <p className="text-xs text-slate-600 font-medium">
                          {signature.role} • {format(new Date(signature.signedAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
        </div>
</div>
        </div>

        {/* Signature Modal */}
        <SignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          onSignatureComplete={handleSignatureComplete}
          documentId={documentId}
        />
      </div>
  );
};

export default DocumentPreview;