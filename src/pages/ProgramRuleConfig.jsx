import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataQuery, useDataMutation } from '@dhis2/app-runtime';
import './ProgramRuleConfig.css';

const ProgramRuleConfig = () => {
  const navigate = useNavigate();

  // Define the query to fetch multiple data elements
  const query = {
    programRules: {
      resource: 'programRules',
      params: { fields: '*,created' },
    },
  };

  // Define the delete mutation
  const deleteMutation = {
    resource: 'programRules',
    type: 'delete',
    id: ({ id }) => id,
  };

  // Initialize state for fetched data
  const [programRules, setProgramRules] = useState([]);
  const { data, loading, error } = useDataQuery(query);
  const [deleteProgramRule] = useDataMutation(deleteMutation);

  // Use effect to set program rules when data is fetched
  useEffect(() => {
    if (data && data.programRules) {
      setProgramRules(data.programRules.programRules);
      console.log('Fetched program rules (samples):', data.programRules.programRules.slice(0, 5));
    }
  }, [data]);

  // Handle delete click
  const handleDeleteClick = async (rule) => {
    try {
      await deleteProgramRule({ id: rule.id });
      setProgramRules(programRules.filter(pr => pr.id !== rule.id)); // Update the state
      console.log(`Program rule with id ${rule.id} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete program rule with id ${rule.id}`, error);
    }
  };

  // Handle edit click
  const handleEditClick = (rule) => {
    // Navigate to the edit page with the rule ID
    navigate(`/edit-rules/${rule.id}`);
  };

  // Render the component
  return (
    <div className="program-rule-validator">
      <h2>PROGRAM RULE CONFIGURATION</h2>
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
              <button onClick={() => handleDeleteClick(rule)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <button className='buttonn'><Link to="/" style={{ textDecoration: 'none' }}>HOME</Link></button>
    </div>
  );
};

export default ProgramRuleConfig;
