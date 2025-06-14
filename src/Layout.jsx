import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { routes } from "@/config/routes";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = Object.values(routes).filter(route => route.showInNav);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 z-40 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <NavLink to="/templates" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <ApperIcon name="Scale" className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LegalForge AI
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:shadow-md'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                  {!location.pathname.includes(item.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 hover:shadow-md transition-all duration-200"
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                className="w-6 h-6" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 z-40 md:hidden"
                onClick={toggleMobileMenu}
              />
              
{/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl z-50 md:hidden overflow-hidden"
              >
                <div className="p-6 space-y-3">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} className="w-6 h-6" />
                      <span>{item.label}</span>
                    </NavLink>
))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;