import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search templates...",
  showFilters = false,
  filters = {},
  onFilterChange,
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounced search
    if (onSearch) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, 300);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 z-10" 
          />
          
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border-2 border-surface-300 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none bg-white text-surface-900 transition-all duration-200"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          )}

          {showFilters && (
            <button
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 transition-colors ${
                showFilterPanel ? 'text-primary' : 'text-surface-400 hover:text-surface-600'
              }`}
            >
              <ApperIcon name="Filter" className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: showFilterPanel ? 1 : 0, 
            height: showFilterPanel ? 'auto' : 0 
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden mt-3"
        >
          <div className="bg-white border border-surface-200 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => onFilterChange?.({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">All Categories</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Business">Business</option>
                  <option value="Employment">Employment</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Risk Level
                </label>
                <select
                  value={filters.riskLevel || ''}
                  onChange={(e) => onFilterChange?.({ ...filters, riskLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Popularity
                </label>
                <select
                  value={filters.popularity || ''}
                  onChange={(e) => onFilterChange?.({ ...filters, popularity: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">All Templates</option>
                  <option value="high">Most Popular (90%+)</option>
                  <option value="medium">Popular (70%+)</option>
                  <option value="low">Less Popular (&lt;70%)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onFilterChange?.({});
                  setShowFilterPanel(false);
                }}
              >
                Clear Filters
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowFilterPanel(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;