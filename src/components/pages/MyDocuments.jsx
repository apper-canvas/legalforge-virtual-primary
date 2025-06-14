import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import DocumentCard from "@/components/molecules/DocumentCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SkeletonLoader from "@/components/organisms/SkeletonLoader";
import ErrorState from "@/components/organisms/ErrorState";
import EmptyState from "@/components/organisms/EmptyState";
import { documentService } from "@/services";

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [documents, searchQuery, statusFilter]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await documentService.getAll();
      setDocuments(data);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.type.toLowerCase().includes(query) ||
        doc.jurisdiction.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Sort by updated date (most recent first)
    filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    setFilteredDocuments(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getStatusCounts = () => {
    return {
      all: documents.length,
      draft: documents.filter(d => d.status === 'draft').length,
      review: documents.filter(d => d.status === 'review').length,
      signed: documents.filter(d => d.status === 'signed').length,
      completed: documents.filter(d => d.status === 'completed').length
    };
  };

  const handleCreateNew = () => {
    navigate('/templates');
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
          title="Failed to Load Documents"
          message={error}
          onRetry={loadDocuments}
        />
      </div>
    );
  }

  const statusCounts = getStatusCounts();
return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <ApperIcon name="Folder" className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Documents
                  </h1>
                  <p className="text-lg text-slate-600 mt-2 font-medium">
                    Manage and track your legal documents
                  </p>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleCreateNew}
                  variant="primary"
                  icon="Plus"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl px-6 py-3"
                >
                  Create New
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Status Filter Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-6 mb-8">
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All Documents', icon: 'FileText' },
                { key: 'draft', label: 'Drafts', icon: 'Edit3' },
                { key: 'review', label: 'In Review', icon: 'Eye' },
                { key: 'signed', label: 'Signed', icon: 'CheckCircle' },
                { key: 'completed', label: 'Completed', icon: 'Archive' }
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    statusFilter === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:shadow-md'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <Badge
                    variant={statusFilter === tab.key ? 'accent' : 'default'}
                    size="sm"
                    className="shadow-sm"
                  >
                    {statusCounts[tab.key]}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </div>
{/* Enhanced Search */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search documents by title, type, or jurisdiction..."
            />
          </div>
        </motion.div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          title={documents.length === 0 ? "No Documents Yet" : "No Documents Found"}
          description={
            documents.length === 0
              ? "Start by creating your first legal document from our template library"
              : searchQuery || statusFilter !== 'all'
              ? "Try adjusting your search or filter to find more documents"
              : "No documents match your current criteria"
          }
          actionLabel={documents.length === 0 ? "Browse Templates" : "Clear Filters"}
          onAction={() => {
            if (documents.length === 0) {
              handleCreateNew();
            } else {
              setSearchQuery('');
              setStatusFilter('all');
            }
          }}
          icon={documents.length === 0 ? "FileText" : "Search"}
        />
      ) : (
<motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredDocuments.map((document, index) => (
              <DocumentCard
                key={document.id}
                document={document}
                onUpdate={loadDocuments}
                index={index}
              />
))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;