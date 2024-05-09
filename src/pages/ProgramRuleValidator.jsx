import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import './ProgramRuleValidator.css';

const ProgramRuleValidator = () => {
  const navigate = useNavigate();

  const programRulesQuery = {
    programRules: {
      resource: 'programRules',
      params: {
        fields: ['id', 'displayName', 'program', 'condition', 'action'],
      },
    },
  };

  const [programRules, setProgramRules] = useState([]);
  const { data, loading, error } = useDataQuery(programRulesQuery);

  useEffect(() => {
    if (data && data.programRules) {
      setProgramRules(data.programRules.programRules);
    }
  }, [data]);

  const getProgramDataElements = async (programId) => {
    try {
      // Ensure the endpoint URL is correct
      const response = await fetch(`/api/programs/${programId}/dataElements`);
      
      // Check if response is okay
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
  

  const extractVariables = (condition) => {
    const regex = /#{([^}]*)}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(condition))) {
      variables.push(match[1]);
    }
    return variables;
  };

  const validateProgramRule = async (rule) => {
    let isValid = true;
    let errorMessage = '';

    if (!rule.program) {
      isValid = false;
      errorMessage += 'Program rule must be assigned to a program.\n';
    }

    if (!rule.condition || rule.condition.length === 0) {
      isValid = false;
      errorMessage += 'Program rule must have conditions set.\n';
    } else {
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
  

  const handleValidateClick = async (rule) => {
    console.log('Program rule:', rule);

    const { isValid, errorMessage } = await validateProgramRule(rule);

    if (isValid) {
      // If the program rule is valid, navigate to a notification page
      navigate('/notification');
    } else {
      
      // If the program rule is not valid, display an alert with the error message
      alert(`Program rule "${rule.displayName}" is not valid:\n${errorMessage}`);
    }
  };

  return (
    <div className="program-rule-validator">
      <h2>Program Rule Validator</h2>
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
    </div>
  );
};

export default ProgramRuleValidator;
