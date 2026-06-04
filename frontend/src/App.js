import React, { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { SiteContentProvider } from './contexts/SiteContentContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

// Portfolio loads immediately — it is the public homepage
import Portfolio from './pages/Portfolio';

// Everything else loads only when needed
const ClientProposal = lazy(() => import('./pages/ClientProposal'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const ProposalEditor = lazy(() => import('./pages/ProposalEditor'));
const SiteContentEditor = lazy(() => import('./pages/SiteContentEditor'));

function App() {
  return (
    <HelmetProvider>
      <div className="App bg-[#0f0f0f] text-[#f2ece2] min-h-screen">
        <BrowserRouter>
          <AuthProvider>
            <SiteContentProvider>
              <Suspense fallback={<div style={{ background: '#0f0f0f', minHeight: '100vh' }} />}>
                <Routes>
                  <Route path="/" element={<Portfolio />} />
                  <Route path="/proposals/:slug" element={<ClientProposal />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/site-content"
                    element={
                      <ProtectedRoute>
                        <SiteContentEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/proposals/:id"
                    element={
                      <ProtectedRoute>
                        <ProposalEditor />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </SiteContentProvider>
          </AuthProvider>
        </BrowserRouter>
        <Toaster position="bottom-right" theme="dark" />
      </div>
    </HelmetProvider>
  );
}

export default App;
