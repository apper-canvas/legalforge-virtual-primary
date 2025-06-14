import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import TemplateCard from '@/components/molecules/TemplateCard';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { templateService } from '@/services';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [templates, searchQuery, filters]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError(err.message || 'Failed to load templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...templates];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(template => template.category === filters.category);
    }

    // Apply risk level filter
    if (filters.riskLevel) {
      filtered = filtered.filter(template => template.riskLevel === filters.riskLevel);
    }

    // Apply popularity filter
    if (filters.popularity) {
      switch (filters.popularity) {
        case 'high':
          filtered = filtered.filter(template => template.popularity >= 90);
          break;
        case 'medium':
          filtered = filtered.filter(template => template.popularity >= 70 && template.popularity < 90);
          break;
        case 'low':
          filtered = filtered.filter(template => template.popularity < 70);
          break;
      }
    }

    // Sort by popularity by default
    filtered.sort((a, b) => b.popularity - a.popularity);

    setFilteredTemplates(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded animate-pulse w-1/3 mb-4" />
          <div className="h-4 bg-surface-200 rounded animate-pulse w-2/3 mb-6" />
          <div className="h-12 bg-surface-200 rounded animate-pulse" />
        </div>
        <SkeletonLoader count={6} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          title="Failed to Load Templates"
          message={error}
          onRetry={loadTemplates}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">
              Legal Document Templates
            </h1>
            <p className="text-surface-600 mt-1">
              Choose from our collection of AI-powered legal document templates
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-surface-900">{templates.length}</p>
                <p className="text-sm text-surface-500">Total Templates</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {templates.filter(t => t.popularity >= 90).length}
                </p>
                <p className="text-sm text-surface-500">Most Popular</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Shield" className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-surface-900">
                  {templates.filter(t => t.riskLevel === 'low').length}
                </p>
                <p className="text-sm text-surface-500">Low Risk</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-surface-200 p-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold text-surface-900">15</p>
                <p className="text-sm text-surface-500">Avg Minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search templates by name, category, or description..."
          showFilters={true}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </motion.div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <EmptyState
          title="No Templates Found"
          description={
            searchQuery || Object.keys(filters).length > 0
              ? "Try adjusting your search or filters to find more templates"
              : "We're working on adding more templates. Check back soon!"
          }
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setFilters({});
          }}
          icon="Search"
          showAction={searchQuery || Object.keys(filters).length > 0}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Templates;