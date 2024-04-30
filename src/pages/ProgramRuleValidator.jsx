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

  const handleValidateClick = (id) => {
    // Handle validation logic here
    console.log(`Validating program rule with ID ${id}`);
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
              <button onClick={() => handleValidateClick(rule.id)}>
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
