import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import {HashRouter, Route, Routes } from 'react-router-dom';
import ProgramRuleValidator from './pages/ProgramRuleValidator';
import ProgramRulesForm from './pages/ProgramRulesForm';
import TroubleshootingEngine from './pages/TroubleshootingEngine';
import EditProgramRule from './pages/EditProgramRule';
// import Programrule from './pages/Programrule';

function App() {
  const contextPath = 'https://play.im.dhis2.org/stable-2-41-0'; 

  return (
    <HashRouter>
      <Routes>
        {/* Routing and rendering the home page component the dashboard view */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/program-rules" element={<ProgramRulesForm/>} />
        <Route path="/Config-rules" element={<ProgramRuleValidator />} />
       <Route path="/edit-rules/:ruleId" element={<EditProgramRule />} />
        <Route path="/configuration-engine" element={<TroubleshootingEngine contextPath={contextPath} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;