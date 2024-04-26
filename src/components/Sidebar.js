import React from 'react'
import './Sidebar.css'; // Import CSS file for styling
import {BsFillArchiveFill, BsFillGearFill, BsListCheck, BsPeopleFill, BsFillBellFill, BsTools}from 'react-icons/bs'
import './Sidebar.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';

  
    const Sidebar = () => {
      return (
            <div className="sidebar">
              <ul>
                     <h1>DHIS2 PROGRAM RULE VALIDATOR</h1>
                <li> 
                    <ul>
                        <li>
                            <Link to="/program-rules" style={{ textDecoration: 'none' }}>
                            <BsFillArchiveFill className="valid"/>PROGRAM RULES</Link>
                        </li>
                    </ul>
                    <ul>
                        <li>
                           <Link to="/validate-rules"style={{ textDecoration: 'none' }}>
                           <BsListCheck className="valid"/>VALIDATE RULES</Link>
                        </li>
                    </ul>
                    <ul>
                        <li> <Link to="/configuration-engine" style={{ textDecoration: 'none' }}>
                            <BsTools className="valid"/>CONFIGURATION</Link>
                        </li>
                    </ul>
                   <ul>
                       <li>
                            <Link to="/notification"style={{ textDecoration: 'none' }} >
                            <BsFillBellFill className="valid"/>NOTIFICATION</Link>
                       </li>
                    </ul> 
                   <ul>
                        <li> <Link to="/user"style={{ textDecoration: 'none' }} >
                            <BsPeopleFill className="valid"/>USER</Link>
                        </li>
                    </ul>
                    <ul>
                        <li> <Link to="/settings"style={{ textDecoration: 'none' }} >
                            <BsFillGearFill className="valid"/>SETTINGS</Link>
                        </li>
                      </ul>
                </li>
              </ul>
            </div>
      
            
        );
      }
    

export default Sidebar