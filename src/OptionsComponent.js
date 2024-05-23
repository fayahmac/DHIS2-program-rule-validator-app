// src/OptionsComponent.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OptionsComponent = () => {
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    console.log(`Option clicked: ${option}`);
    // Navigate to another route or perform an action based on the option
    navigate(`/${option}`);
  };

  return (
    <div>
      <h2>Options Page</h2>
      <button onClick={() => handleOptionClick('option1')}>Show warning message</button>
      <button onClick={() => handleOptionClick('option2')}>Show errol message</button>
      <button onClick={() => handleOptionClick('option3')}>Hide option</button>
    </div>
  );
};

export default OptionsComponent;
