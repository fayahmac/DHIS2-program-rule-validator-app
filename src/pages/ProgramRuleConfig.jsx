import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataQuery, useDataMutation } from '@dhis2/app-runtime';
import './ProgramRuleConfig.css';


/**
 * this function defines and implements the whole logic behind the program rule deletions
 *
 * @returns {*}
 */
const ProgramRuleConfig = () => {
  const navigate = useNavigate();

  
  /**
   * this function Define the query to fetch multiple data elements
   *
   * @type {{ programRules: { resource: string; params: { fields: string; }; }; }}
   */
  const query = {
    programRules: {
      resource: 'programRules',
      params: { fields: '*,created' },
    },
  };

  
  /**
   * this function Define the delete mutation
   *
   * @type {{ resource: string; type: string; id: ({ id }: { id: any; }) => any; }}
   */
  const deleteMutation = {
    resource: 'programRules',
    type: 'delete',
    id: ({ id }) => id,
  };

  
  /**
   * this functions Initialize state for fetched data
   *
   * @type {*}
   */
  const [programRules, setProgramRules] = useState([]);
  const { data, loading, error } = useDataQuery(query);
  const [deleteProgramRule] = useDataMutation(deleteMutation);
  
  
   
  /**
   * Use effect to set program rules when data is fetched
   *
   * @type {*}
   */
  useEffect(() => {
    if (data && data.programRules) {
      
       /**
       *  Sort the program rules by the created date in descending order
       *
       * @type {*}
       */
      const sortedRules = data.programRules.programRules.sort((a, b) => new Date(b.created) - new Date(a.created));
      setProgramRules(sortedRules);
      console.log('Fetched and sorted program rules (samples):', sortedRules.slice(0, 5));
    }
  }, [data]);

  
  
  /**
   * this function Handles delete button click
   *
   * @async
   * @param {*} rule
   * @returns {*}
   */
  const handleDeleteClick = async (rule) => {
    try {
      await deleteProgramRule({ id: rule.id });
      setProgramRules(programRules.filter(pr => pr.id !== rule.id)); // Update the state
      console.log(`Program rule with id ${rule.id} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete program rule with id ${rule.id}`, error);
    }
  };

   
   /**
   * Rendering the component
   *
   */
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
      <button className='buttonn'><Link to="/" style={{ textDecoration: 'none', color:'white', }}>HOME</Link></button>
    </div>
  );
};

export default ProgramRuleConfig;
