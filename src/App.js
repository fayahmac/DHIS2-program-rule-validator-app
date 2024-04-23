import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import classes from './App.module.css'
    import './Sidebar.css'; // Import CSS file for styling

    import {BsFillArchiveFill, Tooltip, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}from 'react-icons/bs'
    import 
     { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
     from 'recharts';
    
    
    const MyApp = () => {
      return (
        <div className="sidebar">
          <ul>
            
            <h1>DHIS2 PROGRAM VALIDATOR</h1>
            <li>
            <ul><BsFillArchiveFill/><li><span>PROGRAM RULES</span></li></ul>
            <ul><BsFillArchiveFill/><li>VALIDATE RULES</li></ul>
            <ul><li>CONFIGURATION ENGINE</li></ul>
            <ul><li>NOTIFICATION</li></ul>
            <ul><BsPeopleFill/><li>USER</li></ul>
            <ul><li>SETTINGS</li></ul>
            </li>
          </ul>
        </div>
      );
    }
    

export default MyApp
