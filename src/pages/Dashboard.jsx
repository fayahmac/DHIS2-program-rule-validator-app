import { useState } from 'react'
import '../App.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Home from '../components/HomeCard'

function Dashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
   <div className='grid-container'>
     <Header OpenSidebar={OpenSidebar}/>
     <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
     <Home/>      
   </div>
  )
}

export default Dashboard
