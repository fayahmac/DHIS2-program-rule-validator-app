import React, { useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime'; // Import useDataQuery hook
import './ProgramRuleValidator.css'; // Import CSS file

const ProgramRuleValidator = () => {
  // Define the query to fetch program rules with all necessary fields
  const programRulesQuery = {
    programRules: {
      resource: 'programRules',
      params: {
        fields: ['id', 'displayName', 'program', 'condition', 'action'],
      },
    },
  };

  const [programRules, setProgramRules] = useState([]);
  const { loading, error, data } = useDataQuery(programRulesQuery);

  useEffect(() => {
    // Update program rules state when data changes
    if (data && data.programRules) {
      setProgramRules(data.programRules.programRules);
    }
  }, [data]);

  const validateProgramRule = (rule) => {
    let isValid = true;
    let errorMessage = '';

    // Check if program is assigned to the rule
    if (!rule.program) {
      isValid = false;
      errorMessage += 'Program rule must be assigned to a program.\n';
    }

    // Check if conditions are set
    if (!rule.condition || rule.condition.length === 0) {
      isValid = false;
      errorMessage += 'Program rule must have conditions set.\n';
    }

    // Check if condition variables conform to data elements in the progra

    // Check if program rule actions are defined
    if (!rule.action || rule.action.length === 0) {
      isValid = false;
      errorMessage += 'Program rule must have defined program rule actions.\n';
    }

    return { isValid, errorMessage };
  };


  const handleValidateClick = (rule) => {
    const { isValid, errorMessage } = validateProgramRule(rule);

    // Display validation result
    if (isValid) {
      alert(`Program rule "${rule.displayName}" is valid!`);
    } else {
      alert(`Program rule "${rule.displayName}" is not valid:\n${errorMessage}`);
    }
  };

  return (
    <div className="program-rule-validator">
      <h2>Program Rule Validator</h2>
      {/* Search bar space goes here */}
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
}

export default ProgramRuleValidator;
