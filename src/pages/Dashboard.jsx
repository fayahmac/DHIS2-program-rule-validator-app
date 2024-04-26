import React from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Home from '../components/Home'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className='grid-container'>
      <Header/>
      <Sidebar/>
      <Home/>
    </div>
  )
}

export default Dashboard