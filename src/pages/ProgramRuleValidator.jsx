import React, { useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime'; // Import useDataQuery hook
import './ProgramRuleValidator.css'; // Import CSS file

const ProgramRuleValidator = () => {
  // Define the query to fetch program rules with all necessary fields
  const programRulesQuery = {
    programRules: {
      resource: 'programRules',
      params: {
        fields: ['id', 'displayName', 'condition', 'action'],
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

  const fetchDataForProgramRuleEvaluation = async () => {
    // Fetch relevant data for evaluating conditions (e.g., data elements, attribute values)
    // You can customize this function to fetch the necessary data using useDataQuery or any other method
    // For simplicity, let's assume we're fetching static data here
    return {
      dataElement1: 'value1',
      dataElement2: 'value2',
    };
  };

  const evaluateConditions = (conditions, data) => {
    // Evaluate conditions for the rule based on the fetched data
    // For simplicity, let's assume all conditions are met if data elements have non-empty values
    return conditions.every(condition => {
      return data[condition.dataElement] !== '';
    });
  };

  const executeActions = (actions) => {
    // Execute actions associated with the program rule
    // You can implement the logic to execute actions here
  };

  const handleValidateClick = async (rule) => {
    try {
      // Fetch relevant data for evaluating conditions
      const fetchedData = await fetchDataForProgramRuleEvaluation();

      // Evaluate conditions for the rule based on the fetched data
      const conditionsMet = evaluateConditions(rule.condition, fetchedData);

      // Display validation result
      if (conditionsMet) {
        executeActions(rule.action);
        alert(`Program rule "${rule.displayName}" is valid!`);
      } else {
        alert(`Program rule "${rule.displayName}" is not valid!`);
      }
    } catch (error) {
      console.error('Error occurred during program rule validation:', error);
      alert('An error occurred during program rule validation. Please try again later.');
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
