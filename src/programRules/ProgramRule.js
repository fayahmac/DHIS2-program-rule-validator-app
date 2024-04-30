import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="condition">Condition:</label>
        <input
          type="text"
          id="condition"
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="action">Action:</label>
        <input
          type="text"
          id="action"
          value={action}
          onChange={(event) => setAction(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProgramRule;
