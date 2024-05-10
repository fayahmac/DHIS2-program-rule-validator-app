import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { BsFillArchiveFill, BsListCheck, BsFillBellFill, BsTools, BsGear, BsFillPeopleFill } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { FaAd, FaCheckDouble, FaCut, FaExchangeAlt, FaExclamation, FaGlobe, FaHandPointRight } from 'react-icons/fa';
import './HomeCard.css'; 
import { Link } from 'react-router-dom';

const programRulesQuery = {
    // the parameter graphQl to fetch program rules from dhis2 instances by Id
    programRules: {
        resource: 'programRules',
        params: {
            fields: ['id', 'displayName', 'condition'],
        },
    },
};

const HomeCard = () => {
    // fetching program rules from the instance using useDataQuery provided by dhis2 app-runtime
    const [programRules, setProgramRules] = useState([]);
    const [totalProgramRules, setTotalProgramRules] = useState(0);
    const { loading, error, data } = useDataQuery(programRulesQuery);

    useEffect(() => {
        //function to catch errors in fetching program rules, counting all rules available and filter the first 3 program rules before displaying them 
        if (!loading && !error && data.programRules && Array.isArray(data.programRules.programRules)) {
            const limitedProgramRules = data.programRules.programRules.slice(0, 3);
            setProgramRules(limitedProgramRules);
            setTotalProgramRules(data.programRules.programRules.length);
        }
    }, [loading, error, data]);
    // displaying loading when the page is opening to load the data from the instance
    if (loading) {
        return <span>Loading...</span>;
    }
    // displaying catched errors during data loading from the instance
    if (error) {
        return <span>Error: {error.message}</span>;
    }
    // displaying a message to show when no program rule was found
    if (!data.programRules || !Array.isArray(data.programRules.programRules)) {
        return <span>No program Rules found</span>;
    }

    return (
        // main cards container
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD OVERVIEW</h3>
            </div>
            <div className="cardview">
                {/* First row of the cards*/}
                <div className="row">
                 {/* home first card in the row and its inside card with routing link */}
                    <div className="card blue">
                        <h3><BsFillArchiveFill className='icon'/> Program Rules Manager</h3> 
                        <Link to="/program-rules" style={{ textDecoration: 'none' }}>
                        {/* displaying fetcheng program rule data on the card*/}
                            {programRules.map(programRule => (
                                <div key={programRule.id} className="cardlist">
                                    {programRule.displayName}
                                </div>
                            ))}
                            {/* card button */}
                            <button className='plus-button'>
                                <FiPlus className='icon-plus'/>
                            </button>
                        </Link>
                    </div>
                    {/* home second card in the row and its inside card with routing link */}
                    <div className="card green">
                        <h3><BsListCheck className='icon'/> Rule Validator</h3> 
                        <Link to="/validate-rules" style={{ textDecoration: 'none' }}>
                            <div className="cardlist1">
                            {/* displaying fetcheng program rule counted in the card*/}
                                {totalProgramRules} Available Program Rules <FaCheckDouble className='qoute'/>
                            </div>
                            <div className="cardlist1">
                                <FaExclamation className='exclaim'/>
                            </div>
                            {/* button on the card */}
                            <button className='plus-button'>
                                <FaCut className='icon-plus'/>
                            </button>
                        </Link>
                    </div>
                    {/* home final card in the row and its inside card with routing link */}
                    <div className="card orange">
                        <h3><BsFillBellFill className='icon'/> Notifications</h3> 
                        <Link to="/notification" style={{ textDecoration: 'none' }}>
                        {/*button on the notification card*/}
                            <button className='plus-button'>
                                <FaHandPointRight className='icon-plus'/>
                            </button>
                        </Link>
                    </div>
                </div>
                {/* Second row cards*/}
                <div className="row">
                {/* home first card in the second row and its inside card with routing link */}
                    <div className="card red">
                        <h3><BsTools className='icon'/> Configuration Engine</h3> 
                        <Link to="/configuration-engine" style={{ textDecoration: 'none' }}>
                        {/* card displaying the inside the main card of configuration engine */}
                        <div className="cardlist0">
                        <BsListCheck className='icon'/> Program Rule validation
                        </div>
                        <div className="cardlist0">
                        <FaGlobe className='icon'/> Language
                        </div>
                        {/* button inside the configuration engine */}
                            <button className='plus-button'>
                                <FaExchangeAlt className='icon-plus'/>
                            </button>
                        </Link>
                    </div>
                    {/* home second card in the second row and its routing link */}
                    <div className="card pink">
                        <h3><BsGear className='icon'/> Settings</h3> 
                        <Link to="/settings" style={{ textDecoration: 'none' }}>
                            <button className='plus-button'>
                                <FaAd className='icon-plus'/>
                            </button>
                        </Link>
                    </div>
                    {/* home final card in the second row and its inside card with routing link */}
                    <div className="card gray">
                        <h3><BsFillPeopleFill className='icon'/> User Manager</h3> 
                        <Link to="/user" style={{ textDecoration: 'none' }}>
                            <div className="cardlist0">
                            </div>
                            <div className="cardlist0">
                            </div>
                            <div className="cardlist0">
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default HomeCard;
