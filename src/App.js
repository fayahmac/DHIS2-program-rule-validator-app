import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProgramRuleValidator from './pages/ProgramRuleValidator';
import ProgramRulesForm from './pages/ProgramRulesForm';
import TroubleshootingEngine from './pages/TroubleshootingEngine';

function App() {
  const contextPath = 'https://play.im.dhis2.org/stable-2-40-3-1'; 

  return (
    <BrowserRouter>
      <Routes>
        {/* Routing and rendering the home page component the dashboard view */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/program-rules" element={<ProgramRulesForm />} />
        <Route path="/validate-rules" element={<ProgramRuleValidator />} />
        <Route path="/configuration-engine" element={<TroubleshootingEngine contextPath={contextPath} />} />
        <Route path="/notification" />
        <Route path="/user" />
        <Route path="/settings" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
