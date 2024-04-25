import React from 'react'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import Sidebar from './home/Sidebar'


function App() {
  return (
    <div className='grid-container'>
       <Header/> 
       <Sidebar/>   
       <Home/>
    </div>
  )
}

export default App
