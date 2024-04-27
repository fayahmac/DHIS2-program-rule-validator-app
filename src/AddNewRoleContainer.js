import React, { useState } from 'react';

const AddNewRoleContainer = ({ onClose }) => {
  const [newRoleData, setNewRoleData] = useState('');

  const handleChange = (e) => {
    setNewRoleData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit new role data
    console.log("New role data submitted:", newRoleData);
    // Reset form data
    setNewRoleData('');
    // Close the container
    onClose();
  };

  return (
    <div className="add-new-role-container">
      <h3>Add New Role</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Role Name:</label>
          <input type="text" value={newRoleData} onChange={handleChange} />
        </div>
        <button type="submit">Add Role</button>
      </form>
    </div>
  );
};

export default AddNewRoleContainer;
