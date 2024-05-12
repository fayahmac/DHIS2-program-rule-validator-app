import React, { useState, useEffect } from 'react';
import { BsListCheck } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import './TroubleshootingEngine.css'; // Import CSS file for styling

const TroubleshootingEngine = () => {
    const [failedRules, setFailedRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRule, setExpandedRule] = useState(null);
    const [validationResults, setValidationResults] = useState({});

    const { data } = useDataQuery({
        programRules: {
            resource: 'programRules',
            params: {
                fields: ['id', 'displayName', 'condition', 'program', 'description'], // Added 'description' field
            },
        },
    });

    useEffect(() => {
        if (data && data.programRules) {
            setFailedRules(data.programRules.programRules);
            setLoading(false);
        }
    }, [data]);

    const toggleExpandedRule = async (index, rule) => {
        if (expandedRule === index) {
            setExpandedRule(null);
            return;
        }
        try {
            const validationResult = await validateProgramRule(rule);
            setValidationResults({ ...validationResults, [rule.id]: validationResult });
        } catch (error) {
            setError(error.message);
        }
        setExpandedRule(index);
    };

    //fetching program data elements from the API
    const getProgramDataElements = async (programId) => {
        try {
            // the endpoint URL for fetching program data elements
            const response = await fetch(`/api/programs/${programId}/dataElements`);

            // Checking if response is okay
            if (!response.ok) {
                throw new Error(`Failed to fetch data elements for program ${programId}. Status: ${response.status}`);
            }

            // Parse and return data elements from response
            const data = await response.json();
            console.log('Fetched program data elements:', data.dataElements);
            return data.dataElements || [];
        } catch (error) {
            console.error('Error fetching data elements:', error);
            // Handle errors (e.g., display error message)
            return []; // Return empty array to avoid breaking logic
        }
    };

    //validation logic
    const validateProgramRule = async (rule,enrollmentStatus,evaluationContext) => {
        let isValid = true;
        let errorMessage = '';
        //validate the program rule by checking if it's attached to a program
        if (!rule.program) {
            isValid = false;
            errorMessage += 'Program rule must be assigned to a program.\n';
        }
        //validating program rule by checking existence of conditions in that program rule
        if (!rule.condition || rule.condition.length === 0) {
            isValid = false;
            errorMessage += 'Program rule must have conditions set.\n';
        } else {
            const variables = extractVariables(rule.condition);
            const programDataElements = await getProgramDataElements(rule.program);
            variables.forEach(variable => {
                if (!programDataElements.includes(variable)) {
                    isValid = false;
                    errorMessage += `Variable "${variable}" in condition does not conform to program data elements.\n`;
                }
            });
        }
        if (!enrollmentStatus || !enrollmentStatus.stage || enrollmentStatus.program !== rule.program) {
            isValid = false;
            errorMessage += 'Program rule is not applicable to the current program stage.\n';
          } 
        if (!rule.action || rule.action.length === 0) {
            isValid = false;
            errorMessage += 'Program rule must have at least one defined program rule action.\n';
        }
        
    // Check for dynamic behavior
    if (isValid) {
        const dynamicBehavior = getDynamicBehavior(rule.action);
        if (!dynamicBehavior) {
          isValid = false;
          errorMessage += 'Program rule does not have defined dynamic behavior.\n';
        }
      }
        return { isValid, errorMessage };
    };
    const getDynamicBehavior = (rule, evaluationContext) => {
        // Check if the conditions of the rule are met
        const conditionsMet = evaluateConditions(rule.condition, evaluationContext);
        
        // If conditions are met, determine dynamic behavior
        if (conditionsMet) {
          // Check the program rule configuration for dynamic behavior
          const dynamicBehavior = rule.dynamicBehavior;
          
          if (dynamicBehavior) {
            // Return the dynamic behavior configuration
            return dynamicBehavior;
          } else {
            // If no dynamic behavior is defined, return null
            return null;
          }
        } else {
          // If conditions are not met, return null
          return null;
        }
      };
    // Function to extract variables from condition
    const extractVariables = (condition) => {
        const regex = /#{([^}]*)}/g;
        const variables = [];
        let match;
        while ((match = regex.exec(condition))) {
            variables.push(match[1]);
        }
        return variables;
    };

    return (
        <div className="troubleshooting-container">
            <h1 className="troubleshooting-heading">Configuration and Troubleshooting Engine</h1>
            <div className="card-bar">
                <div className="validation-bar">
                    <BsListCheck className='iconn'/>
                    <div className="validation-content">
                        <h2>Program Rule Validation</h2>
                        <p>This action will check all the rules configured and display bad configurations if any</p>
                    </div>
                </div>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && failedRules.map((rule, index) => (
                <div key={index} className="card-bar">
                    <div className="failed-rules-list">
                        <div className="failed-rule">
                            <h3 onClick={() => toggleExpandedRule(index, rule)}>{rule.displayName}</h3>
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
                                    <h4>Validation Results:</h4>
                                    {validationResults[rule.id] && validationResults[rule.id].isValid === false ? (
                                        <div className="validation-error">
                                            <p>{validationResults[rule.id].errorMessage}</p>
                                        </div>
                                    ) : (
                                        <p>{validationResults[rule.id]?.isValid ? 'Rule is valid.' : 'No validation errors found.'}</p>
                                    )}
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
