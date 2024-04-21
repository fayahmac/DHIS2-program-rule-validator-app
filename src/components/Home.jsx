import React from 'react'
import {BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}from 'react-icons/bs'

function DashboardHome() {
  return (
    <main className='main-container'>
         <div className='main-title'>
             <div className='main-cards'>
                 <div className='card'>
                    <h3>Program Rule Management</h3>
                    <BsFillArchiveFill className='icon'/>
                 </div>
              </div>
          </div>    
    </main>
  )
}

export default DashboardHome