import React from 'react'
import {BsTools, BsFillBellFill, BsFillArchiveFill, BsPeopleFill, 
    BsListCheck, BsFillGearFill, BsAppIndicator}from 'react-icons/bs'
import {Link } from 'react-router-dom'


function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    // sidebar main container 
    <aside id='sidebar' className={openSidebarToggle ? "sidebar-responsive":""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <BsAppIndicator className='icon'/> DHIS2 PROGRAM RULE VALIDATOR</Link>
            </div>
            {/* an invisible icon for opening and closing sidebar in small screen view */}
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>
        {/* list of sidebar items displayed in card view sortof */}
        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
            {/* sidebar first listeditem and its routing link */}
                <Link to="/program-rules" style={{ textDecoration: 'none' }}>
                <BsFillArchiveFill className="icon"/>PROGRAM RULES</Link>
            </li>
            <li className='sidebar-list-item'>
             {/* sidebar second listeditem and its routing link */}
                <Link to="/validate-rules"style={{ textDecoration: 'none' }}>
                 <BsListCheck className='icon'/>VALIDATE RULES</Link>
            </li>
            <li className='sidebar-list-item'>
             {/* sidebar third listeditem and its routing link */}
                <Link to="/configuration-engine" style={{ textDecoration: 'none' }}>
                <BsTools className='icon'/>CONFIGURATION</Link>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar