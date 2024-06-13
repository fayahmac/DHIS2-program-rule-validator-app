import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import './ProgramRuleValidator.css';

const ProgramRuleValidator = () => {
  const navigate = useNavigate();
  
  // Define the query to fetch multiple data elements
  const query = {
    programRules: {
      resource: 'programRules',
      params: { fields: '*,created' },
    },
    programRuleVariables: {
      resource: 'programRuleVariables',
      params: { fields: '*' },
    },
    trackedEntityAttributes: {
      resource: 'trackedEntityAttributes',
      params: { fields: '*' },
    },
    dataElements: {
      resource: 'dataElements',
      params: { fields: '*' },
    },
    options: {
      resource: 'options',
      params: { fields: '*' },
    },
  };

  // Initialize state for fetched data
  const [programRules, setProgramRules] = useState([]);
  const { data, loading, error } = useDataQuery(query);

  // Use effect to set program rules when data is fetched
  useEffect(() => {
    if (data && data.programRules) {
      setProgramRules(data.programRules.programRules);
      console.log('Fetched program rules (samples):', data.programRules.programRules.slice(0, 5));
    }
  }, [data]);

  // Fetching program data elements from the API
  const getProgramDataElements = async (programId) => {
    try {
      const response = await fetch(`/api/programs/${programId}/dataElements[*]`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data elements for program ${programId}. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched program data elements:', data.dataElements);
      return data.dataElements || [];
    } catch (error) {
      console.error('Error fetching data elements:', error);
      return [];
    }
  };

  // Extract variables from conditions
  const extractVariables = (condition) => {
    const regex = /#{([^}]*)}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(condition))) {
      variables.push(match[1]);
    }
    return variables;
  };

  // Validate program rule
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
      const programDataElements = await getProgramDataElements(rule.program.id);
      variables.forEach(variable => {
        if (!programDataElements.includes(variable)) {
          isValid = false;
          errorMessage += `Variable "${variable}" in condition does not conform to program data elements.\n`;
        }
      });
    }

    return { isValid, errorMessage };
  };

  // Handle validation click
  const handleValidateClick = async (rule) => {
    console.log('Program rule:', rule);
    const { isValid, errorMessage } = await validateProgramRule(rule);

    if (isValid) {
      alert(`Program rule "${rule.displayName}" is valid`);
    } else {
      alert(`Program rule "${rule.displayName}" is not valid:\n${errorMessage}`);
    }
  };

  // Render the component
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
