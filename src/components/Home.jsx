import React from 'react'
import {BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill, BsListCheck}from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import Dashboard from './HomeCard'

function Home() {
  return (
    // home container
    <main className='main-container'>
         <div className='main-title'>
          <h3>DASHBOARD OVERVIEW</h3>
          </div>
          <Dashboard/>
    </main>
  )
}

export default Home