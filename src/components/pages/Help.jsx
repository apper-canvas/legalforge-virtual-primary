import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      label: 'Getting Started',
      icon: 'Play',
      color: 'primary'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: 'FileText',
      color: 'secondary'
    },
    {
      id: 'documents',
      label: 'Document Creation',
      icon: 'Edit3',
      color: 'accent'
    },
    {
      id: 'signatures',
      label: 'E-Signatures',
      icon: 'PenTool',
      color: 'success'
    },
    {
      id: 'legal',
      label: 'Legal Questions',
      icon: 'Scale',
      color: 'warning'
    }
  ];

  const helpContent = {
    'getting-started': {
      title: 'Getting Started with LegalForge AI',
      sections: [
        {
          title: 'Welcome to LegalForge AI',
          content: 'LegalForge AI simplifies the creation of legal documents by using artificial intelligence to generate customized contracts, agreements, and other legal documents based on your specific needs.'
        },
        {
          title: 'How It Works',
          content: '1. Choose a template from our library\n2. Answer a guided questionnaire\n3. Review your AI-generated document\n4. Add signatures and export\n\nOur AI analyzes your responses and generates legally compliant documents tailored to your jurisdiction and requirements.'
        },
        {
          title: 'Getting Started Checklist',
          content: '✓ Browse our template library\n✓ Select a document type that matches your needs\n✓ Complete the questionnaire thoroughly\n✓ Review the generated document carefully\n✓ Consult with a legal professional if needed'
        }
      ]
    },
    'templates': {
      title: 'Understanding Templates',
      sections: [
        {
          title: 'Template Categories',
          content: 'Our templates are organized into categories:\n• Real Estate: Rental agreements, property contracts\n• Business: Partnership deeds, service contracts\n• Employment: Employment contracts, NDAs\n• Commerce: Sales agreements, purchase contracts\n• Finance: Loan agreements, payment terms'
        },
        {
          title: 'Risk Levels',
          content: 'Each template has a risk level indicator:\n• Low Risk: Simple, standard agreements\n• Medium Risk: Moderate complexity, some legal considerations\n• High Risk: Complex agreements requiring careful review\n\nHigher risk documents may require legal consultation.'
        },
        {
          title: 'Jurisdiction Support',
          content: 'Templates are designed to comply with specific jurisdictions. Always select the correct jurisdiction for your agreement. Our AI will adjust clauses and legal language accordingly.'
        }
      ]
    },
    'documents': {
      title: 'Creating Documents',
      sections: [
        {
          title: 'The Questionnaire Process',
          content: 'Our questionnaire adapts based on your answers. Some questions may appear or disappear based on previous responses. Take your time to provide accurate information for the best results.'
        },
        {
          title: 'AI Content Generation',
          content: 'After completing the questionnaire, our AI:\n• Analyzes your responses\n• Selects appropriate legal clauses\n• Customizes language for your jurisdiction\n• Generates a complete, formatted document\n\nThis process typically takes 30-60 seconds.'
        },
        {
          title: 'Document Review',
          content: 'Always review your generated document carefully:\n• Check all details for accuracy\n• Verify names, dates, and amounts\n• Read the plain-language explanations\n• Consider legal consultation for complex matters'
        }
      ]
    },
    'signatures': {
      title: 'Electronic Signatures',
      sections: [
        {
          title: 'How E-Signatures Work',
          content: 'Our e-signature system allows you to:\n• Draw your signature with a mouse or touch screen\n• Type your signature in a stylized font\n• Add multiple signers to a document\n• Track signature status and timestamps\n\nAll signatures are legally binding and include verification details.'
        },
        {
          title: 'Legal Validity',
          content: 'Electronic signatures created through LegalForge AI are legally valid under the Electronic Signatures in Global and National Commerce Act (E-SIGN) and similar laws in most jurisdictions.'
        },
        {
          title: 'Security Features',
          content: 'Our signature system includes:\n• Timestamp recording\n• IP address logging\n• Signer identity verification\n• Tamper-evident document sealing\n• Audit trail maintenance'
        }
      ]
    },
    'legal': {
      title: 'Legal Considerations',
      sections: [
        {
          title: 'When to Consult a Lawyer',
          content: 'Consider consulting with a qualified attorney when:\n• Dealing with high-value transactions\n• Creating complex business arrangements\n• Uncertain about legal implications\n• Document involves significant risk\n• Local laws may have special requirements'
        },
        {
          title: 'Limitations of AI-Generated Documents',
          content: 'While our AI is sophisticated, it cannot:\n• Provide legal advice\n• Account for all unique circumstances\n• Replace professional legal counsel\n• Guarantee outcomes in legal disputes\n\nAlways review documents carefully and seek professional advice when needed.'
        },
        {
          title: 'Document Validity',
          content: 'AI-generated documents are legally valid when:\n• Properly executed by all parties\n• Compliant with applicable laws\n• Free from errors or ambiguities\n• Signed by parties with legal capacity\n\nThe quality of your input directly affects the quality of the output.'
        }
      ]
    }
  };

  const faqs = [
    {
      question: 'Are AI-generated documents legally binding?',
      answer: 'Yes, when properly executed, AI-generated documents have the same legal validity as traditionally drafted documents. The key is ensuring accuracy and proper execution by all parties.',
      category: 'legal'
    },
    {
      question: 'How long does it take to create a document?',
      answer: 'Most documents can be created in 15-30 minutes. The questionnaire takes 5-20 minutes depending on complexity, and AI generation takes 30-60 seconds.',
      category: 'getting-started'
    },
    {
      question: 'Can I modify the generated document?',
      answer: 'Currently, documents are generated as final PDFs. For modifications, you would need to create a new document or edit the PDF using external tools. Custom editing features are planned for future releases.',
      category: 'documents'
    },
    {
      question: 'What jurisdictions are supported?',
      answer: 'We support all US states and are expanding to international jurisdictions. Each template specifies which jurisdictions it covers.',
      category: 'templates'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all data is encrypted in transit and at rest. We follow industry-standard security practices and do not share your information with third parties.',
      category: 'getting-started'
    },
    {
      question: 'Can multiple people sign the same document?',
      answer: 'Yes, our e-signature system supports multiple signers. Each signer receives their own signing link and can sign independently.',
      category: 'signatures'
    }
  ];

  const activeContent = helpContent[activeCategory];
  const categoryFaqs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="HelpCircle" className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-surface-900 mb-4">
          Help & Support
        </h1>
        
        <p className="text-xl text-surface-600 max-w-2xl mx-auto">
          Get the most out of LegalForge AI with our comprehensive guide and frequently asked questions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Categories */}
        <div className="lg:col-span-1">
          <Card padding="sm" className="sticky top-4">
            <h3 className="font-semibold text-surface-900 mb-4 px-2">Categories</h3>
            
            <nav className="space-y-1">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-150 ${
                    activeCategory === category.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                  }`}
                >
                  <ApperIcon name={category.icon} className="w-5 h-5" />
                  <span className="font-medium">{category.label}</span>
                </motion.button>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-surface-200">
              <div className="text-center">
                <ApperIcon name="MessageCircle" className="w-8 h-8 text-surface-300 mx-auto mb-3" />
                <p className="text-sm text-surface-600 mb-4">
                  Need more help?
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Content Sections */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="lg">
              <h2 className="text-3xl font-display font-bold text-surface-900 mb-8">
                {activeContent.title}
              </h2>
              
              <div className="space-y-8">
                {activeContent.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-surface-900 mb-4">
                      {section.title}
                    </h3>
                    
                    <div className="prose prose-surface max-w-none">
                      {section.content.split('\n').map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-surface-700 leading-relaxed mb-3">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Category-specific FAQs */}
          {categoryFaqs.length > 0 && (
            <Card padding="lg">
              <h3 className="text-2xl font-semibold text-surface-900 mb-6">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                {categoryFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-surface-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === `${activeCategory}-${index}` ? null : `${activeCategory}-${index}`)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface-50 transition-colors"
                    >
                      <span className="font-medium text-surface-900">
                        {faq.question}
                      </span>
                      <ApperIcon 
                        name={expandedFaq === `${activeCategory}-${index}` ? "ChevronUp" : "ChevronDown"} 
                        className="w-5 h-5 text-surface-400" 
                      />
                    </button>
                    
                    {expandedFaq === `${activeCategory}-${index}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-4 border-t border-surface-200 bg-surface-50"
                      >
                        <p className="text-surface-700 leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Links */}
          <Card padding="lg">
            <h3 className="text-xl font-semibold text-surface-900 mb-6">
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-surface-200 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <ApperIcon name="FileText" className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-medium text-surface-900 mb-2">Browse Templates</h4>
                <p className="text-sm text-surface-600">
                  Explore our library of legal document templates
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-surface-200 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <ApperIcon name="Folder" className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-medium text-surface-900 mb-2">My Documents</h4>
                <p className="text-sm text-surface-600">
                  View and manage your created documents
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-surface-200 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <ApperIcon name="MessageCircle" className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-medium text-surface-900 mb-2">Contact Support</h4>
                <p className="text-sm text-surface-600">
                  Get help from our support team
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-surface-200 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <ApperIcon name="BookOpen" className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-medium text-surface-900 mb-2">Legal Resources</h4>
                <p className="text-sm text-surface-600">
                  Access additional legal information and resources
                </p>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;