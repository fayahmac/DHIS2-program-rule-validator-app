import React from 'react'
import {BsJustify} from 'react-icons/bs'


/**
 * header component
 *
 * @param {{ OpenSidebar: any; }} param0
 * @param {*} param0.OpenSidebar
 * @returns {*}
 */
function Header({OpenSidebar}) {
  return (
    //header container 
    <header className='header'>
         <div className='menu-icon'>
         {/* open and closing sidebar effect in small and big screen view */}
             <BsJustify className='icon' onClick={OpenSidebar}/>
         </div>
         {/* header contents and icons */}
               </header>
  )
}

export default Header