import React, { useState, useEffect } from 'react';
import { BsListCheck } from 'react-icons/bs';
import { Link} from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import './TroubleshootingEngine.css'; // Import CSS file for styling

const TroubleshootingEngine = () => {
    const [failedRules, setFailedRules] = useState([]);

    const { loading, error, data } = useDataQuery({
        programRules: {
            resource: 'programRules',
            params: {
                fields: ['id', 'displayName', 'condition', 'program'],
            },
        },
    });

    useEffect(() => {
        if (data && data.programRules) {
            setFailedRules(data.programRules.programRules);
        }
    }, [data]);

    const [expandedRule, setExpandedRule] = useState(null);

    const toggleExpandedRule = (index) => {
        setExpandedRule(expandedRule === index ? null : index);
    };

    return (
        <div className="troubleshooting-container">
            <h1 className="troubleshooting-heading">Configuration and Troubleshooting Engine</h1>
            <div className="card-bar">
                <div className="validation-bar">
                    <BsListCheck className='iconn'/>
                    <div className="validation-content">
                        <h2>Program Rule Validation</h2>
                        <p>This action will check all the rules configured and display bad configuratuons if any</p>
                    </div>
                </div>
            </div>
            {/* Render each set of failed rules as a separate card */}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {failedRules.map((rule, index) => (
                <div key={index} className="card-bar">
                    <div className="failed-rules-list">
                        <div className="failed-rule">
                            <h3 onClick={() => toggleExpandedRule(index)}>{rule.displayName}</h3>
                            {expandedRule === index && (
                                <div className="rule-details">
                                     <ul>
                                        {Array.isArray(rule.condition) ? (
                                            rule.condition.map((condition, idx) => (
                                                <li key={idx}>{condition}</li>
                                            ))
                                        ) : (
                                            <li>{rule.condition}</li>
                                        )}
                                    </ul>
                                    <h4>Description:</h4>
                                    <p>{rule.description}</p> {/* Assuming description is available */}
                                </div>
                            )}
                            
                        </div>
                    </div>
                </div>
            ))}
            <button className='buttonn'><Link to="/" style={{ textDecoration: 'none' }}>HOME</Link></button>
        </div>
    );
};

export default TroubleshootingEngine;
