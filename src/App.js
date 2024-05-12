import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import './App.css'
// import classes from './App.module.css'
import Home from './home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homeee from './components/Homeee'
import Header from './components/Header'
import ProgramRule from './programRules/ProgramRule'
import ProgramRulesForm from './ProgramRulesForm'
import NewProgramRule from './NewProgramRule'

const MyApp = () => {
  return (
    <BrowserRouter>
    <ProgramRulesForm/>
      <Routes>
        <Route path="/program-rules" element={<ProgramRulesForm />} />
      </Routes>
    
    </BrowserRouter>
  );
}
    

export default MyApp
