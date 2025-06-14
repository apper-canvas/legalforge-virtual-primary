import { motion } from "framer-motion";
import React from "react";

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-3/4" />
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-1/2" />
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-5/6" />
            </div>
            <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse" />
          </div>
        );

      case 'list':
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-soft p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-2/3" />
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-1/2" />
              </div>
              <div className="w-20 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-1/4" />
              <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-1/3" />
              <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-1/5" />
              <div className="h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse" />
            </div>
          </div>
        );

      case 'document':
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-soft p-8 space-y-6">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-3/4" />
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-5/6" />
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-4/5" />
            </div>
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-1/2" />
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse w-3/4" />
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl animate-pulse h-20" />
        );
    }
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;