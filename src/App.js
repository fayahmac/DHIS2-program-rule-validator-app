import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import {HashRouter, Route, Routes } from 'react-router-dom';
import ProgramRuleConfig from './pages/ProgramRuleConfig';
import ProgramRulesForm from './pages/ProgramRulesForm';
import TroubleshootingEngine from './pages/TroubleshootingEngine';



function App() {
  const contextPath = 'https://play.im.dhis2.org/stable-2-41-0'; 

  return (
    <HashRouter>
      <Routes>
        {/* Routing and rendering the home page component the dashboard view */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/program-rules" element={<ProgramRulesForm/>} />
        <Route path="/Config-rules" element={<ProgramRuleConfig />} />
        <Route path="/configuration-engine" element={<TroubleshootingEngine contextPath={contextPath} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;