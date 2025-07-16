import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';

function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  return (
    <Router basename={baseUrl}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;