import React from 'react'
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle,BsSearch, BsJustify} from 'react-icons/bs'


function Header() {
  return (
     <header className='header'>
           <div>
              <BsJustify/>
           </div>
           <div>
               <BsSearch/>
           </div>
     </header>
  )
}

export default Header