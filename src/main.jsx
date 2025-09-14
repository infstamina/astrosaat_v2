import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import NextPage from './NextPage.jsx';
import Today from './Today.jsx';
import { HashRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/next" element={<NextPage />} />
        <Route path="/today" element={<Today />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
