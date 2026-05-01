import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import ClientProposal from './pages/ClientProposal';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="App bg-[#0f0f0f] text-[#f2ece2] min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/proposals/:slug" element={<ClientProposal />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
