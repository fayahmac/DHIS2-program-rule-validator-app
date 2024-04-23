import React from 'react';
import './HomeCard.css'; 
import {  BsFillArchiveFill, BsFillBellFill, BsFillGearFill, BsFillPeopleFill, BsListCheck } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';

function HomeCard() {
  return (
    <div className="cardview">
      <div className="row">
        <div className="card blue">
            <h3><BsFillArchiveFill className='icon'/> Program Rules Management</h3> 
            <div className="cardvie">
            </div>
            <div className="cardvie">
            </div>
            <div className="cardvie">
            </div>
            <button className='plus-button' >
                   <FiPlus className='icon-plus'/>
            </button>
        </div>
        <div className="card green">
        <div>
        <h3><BsListCheck className='icon'/> Rule Validator</h3> 
        </div>
        </div>
        <div className="card orange">
        <div>
        <h3><BsFillBellFill className='icon'/> Notifications</h3> 
        </div>
        </div>
      </div>
      <div className="row">
        <div className="card red big">
        <div>
        <h3><BsFillGearFill className='icon'/> Configuration and Troubleshooting Engine</h3> 
        </div>
        </div>
        <div className="card gray">
        <div>
        <h3><BsFillPeopleFill className='icon'/> User Manager</h3> 
        </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
