import React from 'react';

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
    // table view of the program rules
    <div>
      <h2>Program Rule Validator</h2>
      <table>
        <thead>
          <tr>
            <th>Program Rule Name</th>
            <th>Validate</th>
          </tr>
        </thead>
        <tbody>
          {programRules.map(rule => (
            <tr key={rule.id}>
            <td>{rule.name}</td>
              <td>
                <button onClick={() => handleValidateClick(rule.id)}>
                  Validate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProgramRuleValidator;
