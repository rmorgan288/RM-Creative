import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import ClientProposal from './pages/ClientProposal';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProposalEditor from './pages/ProposalEditor';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="App bg-[#0f0f0f] text-[#f2ece2] min-h-screen">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/proposals/:slug" element={<ClientProposal />} />
            {/* Hidden admin routes — no public links anywhere */}
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
              path="/admin/proposals/:id"
              element={
                <ProtectedRoute>
                  <ProposalEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
