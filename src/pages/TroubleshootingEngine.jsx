import React, { useState } from 'react';
import { BsListCheck } from 'react-icons/bs';
import { Link} from 'react-router-dom';
import './TroubleshootingEngine.css'; // Import CSS file for styling

const TroubleshootingEngine = () => {
    // Sample data for failed program rules
    const failedRules = [
        {
            ruleName: 'Antenatal care visit',
            conditions: [
                {
                    condition: 'Date of birth (mal) : assign age in years',
                    description: 'Unexpected exception while evaluating d2:yearsBetween(A{dateofbirth}, V{current_date}): Failed to coerce value ‘RuleVariableValue{value=, type=TEXT, candidates -[]. eventDate=2024-04-09}’ (AutoValue_RuleVariableValue) to Localdate: Text” could not be parsed at index 0 in expression: A{dateofbirth}.'
                }
            ]
        },
        {
            ruleName: 'Antenatal care visit',
            conditions: [
                {
                    condition: 'Date of birth (mal) : assign age in years',
                    description: 'Unexpected exception while evaluating d2:yearsBetween(A{dateofbirth}, V{current_date}): Failed to coerce value ‘RuleVariableValue{value=, type=TEXT, candidates -[]. eventDate=2024-04-09}’ (AutoValue_RuleVariableValue) to Localdate: Text” could not be parsed at index 0 in expression: A{dateofbirth}.'
                }
            ]
        },
        // Add more failed rules here if needed
    ];

    // State to manage which rule is currently expanded
    const [expandedRule, setExpandedRule] = useState(null);

    // Function to toggle the expanded rule
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
            {failedRules.map((rule, index) => (
                <div key={index} className="card-bar">
                    <div className="failed-rules-list">
                        <div className="failed-rule">
                            <h3 onClick={() => toggleExpandedRule(index)}>{rule.ruleName}</h3>
                            {expandedRule === index && (
                                <div className="rule-details">
                                    {rule.conditions.map((condition, idx) => (
                                        <div key={idx} className="condition-details">
                                            <h4>{condition.condition}</h4>
                                            <p>{condition.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <button className="buttonn"><Link to="/" style={{ textDecoration: 'none' }}>HOME</Link></button>
        </div>
    );
};

export default TroubleshootingEngine;
