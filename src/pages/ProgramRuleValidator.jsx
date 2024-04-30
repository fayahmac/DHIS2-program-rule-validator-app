import React from 'react';
import './ProgramRuleValidator.css'; // Import CSS file

const ProgramRuleValidator = () => {
  const programRules = [
    { id: 1, name: 'Rule 1' },
    { id: 2, name: 'Rule 2' },
    { id: 3, name: 'Rule 3' },
    // Add more program rules as needed
  ];

  const handleValidateClick = (id) => {
    // Handle validation logic here
    console.log(`Validating program rule with ID ${id}`);
  };

  return (
    //table view of the prgram rules to be validated
    <div className="program-rule-validator">
      <h2>Program Rule Validator</h2>
      {/* Search bar space goes here */}
      <div className="search-bar-space"></div>
      <h3>Program Rules</h3>
      <ul className="program-rule-list">
        {programRules.map(rule => (
          <li key={rule.id} className="program-rule">
            <span>{rule.name}</span>
            <button onClick={() => handleValidateClick(rule.id)}>
              Validate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProgramRuleValidator;
