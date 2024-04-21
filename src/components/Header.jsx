import React from 'react'
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle,BsSearch, BsJustify} from 'react-icons/bs'


function Header() {
  return (
     <header>
           <div>
              <BsJustify/>
           </div>
           <div>
               <BsSearch/>
           </div>
           <div>
             <BsFillBellFill/>
             <BsFillEnvelopeFill/>
             <BsPersonCircle/>
           </div>
     </header>
  )
}

export default Header