import Templates from '@/components/pages/Templates';
import MyDocuments from '@/components/pages/MyDocuments';
import CreateDocument from '@/components/pages/CreateDocument';
import DocumentPreview from '@/components/pages/DocumentPreview';
import Help from '@/components/pages/Help';

export const routes = {
  templates: {
    id: 'templates',
    label: 'Templates',
    path: '/templates',
    icon: 'FileText',
    component: Templates,
    showInNav: true
  },
  myDocuments: {
    id: 'myDocuments',
    label: 'My Documents',
    path: '/my-documents',
    icon: 'Folder',
    component: MyDocuments,
    showInNav: true
  },
  createDocument: {
    id: 'createDocument',
    label: 'Create New',
    path: '/create/:templateId',
    icon: 'Plus',
    component: CreateDocument,
    showInNav: false
  },
  documentPreview: {
    id: 'documentPreview',
    label: 'Preview',
    path: '/preview/:documentId',
    icon: 'Eye',
    component: DocumentPreview,
    showInNav: false
  },
  help: {
    id: 'help',
    label: 'Help',
    path: '/help',
    icon: 'HelpCircle',
    component: Help,
    showInNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;