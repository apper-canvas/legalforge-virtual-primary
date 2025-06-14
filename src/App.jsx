import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/Layout';
import { routes, routeArray } from '@/config/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/templates" replace />} />
          {routeArray.map(route => (
            <Route 
              key={route.id} 
              path={route.path} 
              element={<route.component />} 
            />
          ))}
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!bg-white !text-surface-800 !shadow-lg !border !border-surface-200"
        progressClassName="!bg-primary"
        className="!z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;