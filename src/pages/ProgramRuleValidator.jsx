import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import './ProgramRuleValidator.css';

const ProgramRuleValidator = () => {
  // using useNavigate to save history instead of useHistory which is no longer in use
  const navigate = useNavigate();
 //get program rules from the instance using useDataQuery
  const programRulesQuery = {
    programRules: {
      resource: 'programRules',
      params: {
        fields: ['id', 'displayName', 'program', 'condition', 'action'],
      },
    },
  };
//initialize the fetched program rule data
  const [programRules, setProgramRules] = useState([]);
  const { data, loading, error } = useDataQuery(programRulesQuery);

  useEffect(() => {
    if (data && data.programRules) {
      setProgramRules(data.programRules.programRules);
    }
  }, [data]);
  
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
  
//getting the variables from the conditions
  const extractVariables = (condition) => {
    const regex = /#{([^}]*)}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(condition))) {
      variables.push(match[1]);
    }
    return variables;
  };
//validation logic
  const validateProgramRule = async (rule,evaluationContext, enrollmentStatus) => {
    let isValid = true;
    let errorMessage = '';
//validate]ing the program rule by checking if its attached to program 
    if (!rule.program) {
      isValid = false;
      errorMessage += 'Program rule must be assigned to a program.\n';
    }
//validating pogram rule by checking existence of conditions in that program rule
    if (!rule.condition || rule.condition.length === 0) {
      isValid = false;
      errorMessage += 'Program rule must have conditions set.\n';
    } 
    //check the variables in program conditions agaisnt the generated data elements
    else {
      const variables = extractVariables(rule.condition);
      // Fetch program data elements for the program associated with the rule
      const programDataElements = await getProgramDataElements(rule.program);
      // Check if variables conform to data elements in the program
      variables.forEach(variable => {
        if (!programDataElements.includes(variable)) {
          isValid = false;
          errorMessage += `Variable "${variable}" in condition does not conform to program data elements.\n`;
        }
      });
    }
  
      // Check enrollment status
      if (!enrollmentStatus || !enrollmentStatus.stage || enrollmentStatus.program !== rule.program) {
        isValid = false;
        errorMessage += 'Program rule is not applicable to the current program stage.\n';
        return { isValid, errorMessage };
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
  
// handling onclick guncution
  const handleValidateClick = async (rule) => {
    console.log('Program rule:', rule);

    const { isValid, errorMessage } = await validateProgramRule(rule);

    if (isValid) {
      // If the program rule is valid, navigate to a notification page
      navigate('/notification');
    } else {
      
      // If the program rule is not valid, display an alert with the error message`
      alert(`Program rule "${rule.displayName}" is not valid:\n${errorMessage}`);
    }
  };
 //ui div remderrimh
  return (
    <div className="program-rule-validator">
      <h2>PROGRAM RULE VALIDATOR</h2>
      <div className="search-bar-space"></div>
      <h3>Program Rules</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : programRules.length === 0 ? (
        <p>No program rules found</p>
      ) : (
        <ul className="program-rule-list">
          {programRules.map(rule => (
            <li key={rule.id} className="program-rule">
              <span>{rule.displayName}</span>
              <button onClick={() => handleValidateClick(rule)}>
                Validate
              </button>
            </li>
          ))}
        </ul>
      )}
      <button className='buttonn'><Link to="/" style={{ textDecoration: 'none' }}>HOME</Link></button>
    </div>
  );
};

export default ProgramRuleValidator;
