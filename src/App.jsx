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
        toastClassName="!bg-white/95 !backdrop-blur-xl !text-slate-800 !shadow-2xl !border !border-slate-200/50 !rounded-xl"
        progressClassName="!bg-gradient-to-r !from-blue-500 !to-purple-500"
        className="!z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;