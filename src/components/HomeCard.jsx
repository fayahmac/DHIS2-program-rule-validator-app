import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { BsFillArchiveFill, BsListCheck, BsFillBellFill, BsFillGearFill, BsFillPeopleFill } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { FaCheckDouble, FaCut, FaExchangeAlt, FaExclamation, FaGlobe, FaHandPointRight } from 'react-icons/fa';
import './HomeCard.css'; 

const programRulesQuery = {
    programRules: {
        resource: 'programRules',
        params: {
            fields: ['id', 'displayName', 'condition'],
        },
    },
};

const HomeCard = () => {
    const [programRules, setProgramRules] = useState([]);
    const { loading, error, data } = useDataQuery(programRulesQuery);

    useEffect(() => {
        if (!loading && !error && data.programRules && Array.isArray(data.programRules.programRules)) {
            setProgramRules(data.programRules.programRules.slice(0, 3));
        }
    }, [loading, error, data]);

    if (loading) {
        return <span>Loading...</span>;
    }

    if (error) {
        return <span>Error: {error.message}</span>;
    }

    if (!data.programRules || !Array.isArray(data.programRules.programRules)) {
        return <span>No program Rules found</span>;
    }

    return (
        <div className="cardview">
            <div className="row">
                <div className="card blue">
                    <h3><BsFillArchiveFill className='icon'/> Program Rules Management</h3> 
                    {programRules.map(programRule => (
                        <div key={programRule.id} className="cardlist">
                            {programRule.displayName}
                        </div>
                    ))}
                    <button className='plus-button'>
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
                    <button className='plus-button'>
                        <FaCut className='icon-plus'/>
                    </button>
                </div>
                <div className="card orange">
                    <h3><BsFillBellFill className='icon'/> Notifications</h3> 
                    <div className="cardlist0">
                    </div>
                    <div className="cardlist0">
                    </div>
                    <button className='plus-button'>
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
                    <button className='plus-button'>
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
                </div>
            </div>
        </div>
    );
}

export default HomeCard;
