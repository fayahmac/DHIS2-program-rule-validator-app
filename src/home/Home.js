import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Link } from 'react-router-dom';
    import './Sidebar.css'; // Import CSS file for styling
    import {BsFillArchiveFill, BsFillGearFill, BsListCheck, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill, BsTools}from 'react-icons/bs'
    import 
     { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
     from 'recharts';

  
    const Sidebar = () => {
      return (
            <div className="sidebar">
              <ul>
                <h1>DHIS2 PROGRAM VALIDATOR</h1>
                <li>
                  
                <ul><li><Link to="/program-rules" style={{ textDecoration: 'none' }}><BsFillArchiveFill className="valid"/>PROGRAM RULES</Link></li></ul>
                    <ul><li><Link to="/validate-rules"style={{ textDecoration: 'none' }} ><BsListCheck className="valid"/>VALIDATE RULES</Link></li></ul>
                    <ul><li><Link to="/configuration-engine" style={{ textDecoration: 'none' }}><BsTools className="valid"/>CONFIGURATION ENGINE</Link></li></ul>
                   <ul><li><Link to="/notification"style={{ textDecoration: 'none' }} ><BsFillBellFill className="valid"/>NOTIFICATION</Link></li></ul> 
                   <ul> <li><Link to="/user"style={{ textDecoration: 'none' }} ><BsPeopleFill className="valid"/>USER</Link></li></ul>
                    <ul><li><Link to="/settings"style={{ textDecoration: 'none' }} ><BsFillGearFill className="valid"/>SETTINGS</Link></li></ul>
                  
                </li>
              </ul>
            </div>
      
            
        );
      }
    

export default Sidebar