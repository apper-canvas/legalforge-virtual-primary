import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import { documentService } from '@/services';
import { format } from 'date-fns';

const DocumentCard = ({ document, onUpdate, index = 0 }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/preview/${document.id}`);
  };

  const handleDuplicate = async () => {
    try {
      const duplicated = await documentService.duplicate(document.id);
      toast.success('Document duplicated successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to duplicate document');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentService.delete(document.id);
      toast.success('Document deleted successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to delete document');
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'rental-agreement': return 'Home';
      case 'nda': return 'Shield';
      case 'service-contract': return 'Briefcase';
      case 'partnership-deed': return 'Users';
      case 'employment-contract': return 'UserCheck';
      default: return 'FileText';
    }
  };

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden group">
        {/* Card Header with Gradient */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 border-b border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ApperIcon name={getTypeIcon(document.type)} className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg text-slate-900 truncate mb-1">
                  {document.title}
                </h3>
                <p className="text-sm text-slate-600 capitalize font-medium">
                  {document.type.replace('-', ' ')}
                </p>
              </div>
            </div>
            
            <Badge variant={document.status} icon={getStatusIcon(document.status)} className="shadow-sm">
              {document.status}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 font-medium block mb-1">Created</span>
              <span className="text-slate-900 font-semibold">
                {format(new Date(document.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
            
            <div>
              <span className="text-slate-500 font-medium block mb-1">Jurisdiction</span>
              <span className="text-slate-900 font-semibold">{document.jurisdiction}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Risk Level</span>
            <Badge 
              variant={document.riskLevel === 'low' ? 'success' : document.riskLevel === 'medium' ? 'warning' : 'error'} 
              size="sm"
              className="shadow-sm"
            >
              {document.riskLevel}
            </Badge>
          </div>

          {document.signatures && document.signatures.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Signatures</span>
              <span className="text-slate-900 font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm">
                {document.signatures.length}
              </span>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="p-6 pt-0 flex space-x-3">
          <Button 
            onClick={handleView}
            variant="primary" 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
            icon="Eye"
          >
            View
          </Button>
          
          <Button 
            onClick={handleDuplicate}
            variant="outline" 
            size="sm"
            icon="Copy"
            className="border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          >
            Copy
          </Button>
          
          <Button 
            onClick={handleDelete}
            variant="ghost" 
            size="sm"
            icon="Trash2"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:shadow-md"
          >
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;