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
import ConditionCheck from './ConditionChecker'
import ShowWarningMessage from './ShowWarningMessage';  //importing showwarntext by jika
import ShowErrorMessage from './ShowErrorMessage'; // Import the component
import HideFieldForm from './HideFieldForm';
import MakeFieldMandatoryForm from './MakeFieldMandatoryForm';





const MyApp = () => {
  return (
    // <div>
    //   <ConditionCheck/>
    // </div>


//calling the showwarnform
 //   <div>
 // <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Warnings:</h1>
  //    <ShowWarningMessage />
  //</div>


//calling showerrorform
//<div>
//<h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>errors met</h1>
//<ShowErrorMessage />
//</div>

//<div className="App">
//<h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Hide Fields</h1>
//<HideFieldForm />
//</div>

<div className="App">
<h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Make Fields Mandatory</h1>
<MakeFieldMandatoryForm />
</div>



    // <BrowserRouter>

    // <ProgramRulesForm/>
    //   <Routes>
    //     {/* <Route path="/program-rules" element={<ProgramRulesForm />} /> */}
    //   </Routes> 
     
    // </BrowserRouter>
  );
}
    

export default MyApp
