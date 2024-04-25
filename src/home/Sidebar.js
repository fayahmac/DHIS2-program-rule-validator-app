import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
                  
                <ul><li><BsFillArchiveFill className="valid"/>PROGRAM RULES</li></ul>
                    <ul><li><BsListCheck className="valid"/>VALIDATE RULES</li></ul>
                    <ul><li><BsTools className="valid"/>CONFIGURATION ENGINE</li></ul>
                   <ul><li><BsFillBellFill className="valid"/>NOTIFICATION</li></ul> 
                   <ul> <li><BsPeopleFill className="valid"/>USER</li></ul>
                    <ul><li><BsFillGearFill className="valid"/>SETTINGS</li></ul>
                  
                </li>
              </ul>
            </div>
      
            
        );
      }
    

export default Sidebar