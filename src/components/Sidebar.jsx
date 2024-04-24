import React from 'react'
import {BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
    BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsAppIndicator}from 'react-icons/bs'
import './Sidebar.css'


function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id='sidebar' className={openSidebarToggle ? "sidebar-responsive":""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsAppIndicator className='icon'/> PRV
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>
        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                    <BsGrid1X2Fill className='icon'/> Dashboard
            </li>
            <li className='sidebar-list-item'>
                    <BsFillArchiveFill className='icon'/> Program Rules
            </li>
            <li className='sidebar-list-item'>
                    <BsFillGrid3X3GapFill className='icon'/> Rule Variables
            </li>
            <li className='sidebar-list-item'>
                    <BsListCheck className='icon'/> Validations
            </li>
            <li className='sidebar-list-item'>
                    <BsMenuButtonWideFill className='icon'/> Notifications
            </li>
            <li className='sidebar-list-item'>
                  <BsPeopleFill className='icon'/> Users
           </li>
            <li className='sidebar-list-item'>
                    <BsFillGearFill className='icon'/> Settings
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar