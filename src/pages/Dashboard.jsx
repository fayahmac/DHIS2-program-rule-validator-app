import { useState } from 'react'
import '../App.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Home from '../components/HomeCard'

function Dashboard() {
  //the function close and open the sidebar in small screen view 
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
    //grid rendering of the components on the dashboard view
   <div className='grid-container'>
     <Header OpenSidebar={OpenSidebar}/>
     {/* opening and closing sidebar function called*/}
     <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
     <Home/>      
   </div>
  )
}

export default Dashboard
