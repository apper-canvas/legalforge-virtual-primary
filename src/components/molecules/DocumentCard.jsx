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
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name={getTypeIcon(document.type)} className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-surface-900 truncate">
                {document.title}
              </h3>
              <p className="text-sm text-surface-500 capitalize">
                {document.type.replace('-', ' ')}
              </p>
            </div>
          </div>
          
          <Badge variant={document.status} icon={getStatusIcon(document.status)}>
            {document.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-500">Created:</span>
            <span className="text-surface-700">
              {format(new Date(document.createdAt), 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-500">Jurisdiction:</span>
            <span className="text-surface-700">{document.jurisdiction}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-500">Risk Level:</span>
            <Badge variant={document.riskLevel === 'low' ? 'success' : document.riskLevel === 'medium' ? 'warning' : 'error'} size="sm">
              {document.riskLevel}
            </Badge>
          </div>

          {document.signatures && document.signatures.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">Signatures:</span>
              <span className="text-surface-700">{document.signatures.length}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleView}
            variant="primary" 
            size="sm" 
            className="flex-1"
            icon="Eye"
          >
            View
          </Button>
          
          <Button 
            onClick={handleDuplicate}
            variant="outline" 
            size="sm"
            icon="Copy"
          >
            Copy
          </Button>
          
          <Button 
            onClick={handleDelete}
            variant="ghost" 
            size="sm"
            icon="Trash2"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;