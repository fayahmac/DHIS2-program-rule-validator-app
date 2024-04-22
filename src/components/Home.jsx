import React from 'react'
import {BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}from 'react-icons/bs'

function Home() {
  return (
    <main className='main-container'>
         <div className='main-title'>
          <h3>DASHBOARD OVERVIEW</h3>
          </div>
             <div className='main-cards'>
                 <div className='card'>
                     <BsFillArchiveFill className='icon'/>
                     <h3>Program Rule Management</h3>
                 </div>
                 <div className='card'>
                     <BsFillArchiveFill className='icon'/>
                     <h3>Rule Validator</h3>
                 </div>
                 <div className='card'>
                     <BsFillArchiveFill className='icon'/>
                     <h3>Notifications</h3>
                 </div>
              </div> 
    </main>
  )
}

export default Home