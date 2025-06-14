import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';

const TemplateCard = ({ template, index = 0 }) => {
  const navigate = useNavigate();

  const handleCreateDocument = () => {
    navigate(`/create/${template.id}`);
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getPopularityIcon = (popularity) => {
    if (popularity >= 90) return 'TrendingUp';
    if (popularity >= 70) return 'Star';
    return 'FileText';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card hoverable className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={template.icon} className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-surface-900">
                {template.name}
              </h3>
              <p className="text-sm text-surface-500">{template.category}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ApperIcon 
              name={getPopularityIcon(template.popularity)} 
              className="w-4 h-4 text-accent" 
            />
            <span className="text-sm font-medium text-surface-600">
              {template.popularity}%
            </span>
          </div>
        </div>

        <p className="text-surface-600 mb-4 flex-1 leading-relaxed">
          {template.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-4 h-4 text-surface-400" />
              <span className="text-surface-600">{template.estimatedTime}</span>
            </div>
            <Badge variant={getRiskLevelColor(template.riskLevel)} size="sm">
              {template.riskLevel} risk
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="default" size="sm">
                {feature}
              </Badge>
            ))}
            {template.features.length > 3 && (
              <Badge variant="default" size="sm">
                +{template.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Button 
          onClick={handleCreateDocument}
          variant="primary" 
          className="w-full"
          icon="Plus"
        >
          Create Document
        </Button>
      </Card>
    </motion.div>
  );
};

export default TemplateCard;