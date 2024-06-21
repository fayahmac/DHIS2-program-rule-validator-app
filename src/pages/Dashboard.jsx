import { useState } from 'react'
import '../App.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Home from '../components/HomeCard'
 

/**
 * the dashboard component 
 *
 * @returns {*}
 */
function Dashboard() {
   
  /**
   * the function close and open the sidebar in small screen view 
   *
   * @type {*}
   */
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  
  
  /**
   * this function handles the opening and closing of side bar in mobile view
   */
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
 
  /**
   * rendering the component
   */
  return (
    //grid rendering of the components on the dashboard view
   <div className='grid-container'>
     <Header OpenSidebar={OpenSidebar}/>
     {/* opening and closing sidebar function called here*/}
     <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
     <Home/>      
   </div>
  )
}

export default Dashboard
