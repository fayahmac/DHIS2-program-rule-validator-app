// ProgramRule.js

import React, { useState } from 'react';
import './ProgramRule.css'; // Import the CSS file

const ProgramRule = () => {
  const [name, setName] = useState('');
  const [condition, setCondition] = useState('');
  const [action, setAction] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { name, condition, action, description });
    // Reset form fields
    setName('');
    setCondition('');
    setAction('');
    setDescription('');
  };

  return (
    <div className="form-container">
      <form className="program-rule-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="condition" className="form-label">Condition:</label>
          <input
            type="text"
            id="condition"
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="action" className="form-label">Action:</label>
          <input
            type="text"
            id="action"
            value={action}
            onChange={(event) => setAction(event.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default ProgramRule;
