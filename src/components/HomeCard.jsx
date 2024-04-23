import React from 'react';
import './HomeCard.css'; 
import {  BsFillArchiveFill, BsFillBellFill, BsFillGearFill, BsFillPeopleFill, BsListCheck } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { FaCheckDouble, FaCut, FaExchangeAlt, FaExclamation, FaGlobe, FaHandPointLeft, FaHandPointRight, FaQuoteRight } from 'react-icons/fa';

function HomeCard() {
  return (
    <div className="cardview">
      <div className="row">
        <div className="card blue">
                <h3><BsFillArchiveFill className='icon'/> Program Rules Management</h3> 
                <div className="cardlist">
                </div>
                <div className="cardlist">
                </div>
                <div className="cardlist">
                </div>
                <button className='plus-button' >
                      <FiPlus className='icon-plus'/>
                </button>
        </div>
        <div className="card green">
               <h3><BsListCheck className='icon'/> Rule Validator</h3> 
                <div className="cardlist1">
                  <FaCheckDouble className='qoute'/>
                </div>
                <div className="cardlist1">
                  <FaExclamation className='exclaim'/>
                </div>
                <button className='plus-button' >
                      <FaCut className='icon-plus'/>
              </button>
        </div>
        <div className="card orange">
            <h3><BsFillBellFill className='icon'/> Notifications</h3> 
            <div className="cardlist0">
            </div>
            <div className="cardlist0">
            </div>
            <button className='plus-button1' >
            <FaHandPointRight className='icon-plus'/>
           </button>
        </div>
      </div>
      <div className="row">
        <div className="card red big">
            <h3 className='h3c'><BsFillGearFill className='icon'/> Configuration and Troubleshooting Engine</h3> 
                  <div className="cardlist2">
                 <BsListCheck className='chechs'/> 
                  </div>
                  <div className="cardlist2">
                  <FaGlobe className='chechs'/> 
                  </div>
              <button className='plus-button2' >
                    <FaExchangeAlt className='icon-plus'/>
              </button>
        </div>
        <div className="card gray">
                <h3><BsFillPeopleFill className='icon'/> User Manager</h3> 
                <div className="cardlist3">
                </div>
                <div className="cardlist3a">
                </div>
                <div className="cardlist3">
                </div>
                <div className="cardlist3a">
                </div>
                <div className="cardlist3">
                </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
