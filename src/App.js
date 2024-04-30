import React from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProgramRuleValidator from './pages/ProgramRuleValidator'


function App() {
  return (
  <BrowserRouter>
         <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/program-rules">
              </Route>
              <Route path="/validate-rules" element={<ProgramRuleValidator/>}>
                {/* Component for Validate Rules */}
              </Route>
              <Route path="/configuration-engine">
                {/* Component for Configuration Engine */}
              </Route>
              <Route path="/notification">
                {/* Component for Notification */}
              </Route>
              <Route path="/user">
                {/* Component for User */}
              </Route>
              <Route path="/settings">
                {/* Component for Settings */}
              </Route>
        </Routes>
  </BrowserRouter>
  )
}

export default App
