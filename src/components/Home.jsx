import React from 'react'
import HomeCard from './HomeCard'


/**
 * Home component
 *
 * @returns {*}
 */
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