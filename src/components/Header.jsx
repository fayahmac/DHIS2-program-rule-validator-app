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
         <div className='header-left'>
             <BsSearch className='icon'/>         
         </div>
         <div>
            <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/>
            <BsPersonCircle className='icon'/> 
         </div>
    </header>
  )
}

export default Header