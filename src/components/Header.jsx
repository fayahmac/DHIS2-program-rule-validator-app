import React from 'react'
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle,BsSearch, BsJustify} from 'react-icons/bs'


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