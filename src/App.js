import React from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
  return (
  <BrowserRouter>
         <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/program-rules">
                {/* Component for Program Rules */}
              </Route>
              <Route path="/validate-rules">
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
              <Route path="/Home">
                {/* Component for Settings */}
              </Route>
        </Routes>
  </BrowserRouter>
  )
}

export default App
