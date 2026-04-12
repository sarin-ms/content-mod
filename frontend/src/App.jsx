import React, { useState } from 'react'
import Navbar from './components/Navbar';
import ContentModerator from './pages/ContentModeration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Api from './pages/Api';
import SafetyStandards from './pages/SafetyStandards';

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ContentModerator />} />
        <Route path="/safety-standards" element={<SafetyStandards />} />
        <Route path="/api" element={<Api />} />
      </Routes>
    </Router>
  )
}

export default App
