import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import './App.css'
// import classes from './App.module.css'
import Home from './home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homeee from './components/Homeee'
import Header from './components/Header'

    const MyApp = () => {
      return (
        
      
       <BrowserRouter>
       
<div className='container'>

       <Routes>
        <Route>
        <Route path="/" element={<Home/>} />
        </Route>
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
        <div className='container-grid'>
        <Header/>
        <Homeee/>
        </div>
   
        </div>
       </BrowserRouter>
     
      );
    }
    

export default MyApp
