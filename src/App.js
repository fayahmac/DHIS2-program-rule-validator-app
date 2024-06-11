import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import './App.css'
// import classes from './App.module.css'
import Home from './home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homeee from './components/Homeee'
import Header from './components/Header'
import ProgramRulesForm from './ProgramRulesForm'


<<<<<<< HEAD

const MyApp = () => {
  return (
    // <div>
    //   <ProgramRulesForm/>
=======
const MyApp = () => {
  return (
    // <div>
    //   <ConditionCheck/>
>>>>>>> d372a7716ad3c747e017d5ec904fd4c6ce1c86f1
    // </div>
  
    <BrowserRouter>
    
    <ProgramRulesForm/>
<<<<<<< HEAD
      <Routes>
        <Route path="/program-rules" element={<ProgramRulesForm />} />
      </Routes>
=======
      {/* <Routes>
        <Route path="/program-rules" element={<ProgramRulesForm />} />
      </Routes> */}
>>>>>>> d372a7716ad3c747e017d5ec904fd4c6ce1c86f1
    
    </BrowserRouter>
  );
}
    

<<<<<<< HEAD
export default MyApp
=======
export default MyApp
>>>>>>> d372a7716ad3c747e017d5ec904fd4c6ce1c86f1
