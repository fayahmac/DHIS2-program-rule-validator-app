import React from 'react'
import {BsTools, BsFillBellFill, BsFillArchiveFill, BsPeopleFill, 
    BsListCheck, BsFillGearFill, BsAppIndicator}from 'react-icons/bs'
import {Link } from 'react-router-dom'


function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id='sidebar' className={openSidebarToggle ? "sidebar-responsive":""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsAppIndicator className='icon'/> DHIS2 PROGRAM RULE VALIDATOR
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>
        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link to="/program-rules" style={{ textDecoration: 'none' }}>
                <BsFillArchiveFill className="icon"/>PROGRAM RULES</Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/validate-rules"style={{ textDecoration: 'none' }}>
                 <BsListCheck className='icon'/>VALIDATE RULES</Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/configuration-engine" style={{ textDecoration: 'none' }}>
                <BsTools className='icon'/>CONFIGURATION</Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/notification"style={{ textDecoration: 'none' }} >
                <BsFillBellFill className='icon'/>NOTIFICATION</Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/user"style={{ textDecoration: 'none' }} >
                <BsPeopleFill className='icon'/>USER</Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/settings"style={{ textDecoration: 'none' }} >
                <BsFillGearFill className='icon'/>SETTINGS</Link>
           </li>
        </ul>
    </aside>
  )
}

export default Sidebar