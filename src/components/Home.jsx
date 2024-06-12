import React from 'react'
import {BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill, BsListCheck}from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import HomeCard from './HomeCard'

function Home() {
  return (
    // home container
    <main className='main-container'>
         <div className='main-title'>
          <h3>DASHBOARD OVERVIEW</h3>
          </div>
          {/* rendering the homecard component */}
          <HomeCard/>
    </main>
  )
}

export default Home