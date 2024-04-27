import React, { useState } from 'react';

const AddNewUserContainer = ({ onClose }) => {
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit new user data
    console.log("New user data submitted:", newUserData);
    // Reset form data
    setNewUserData({
      name: '',
      email: '',
      role: '',
    });
    // Close the container
    onClose();
  };

  return (
    <div className="add-new-user-container">
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={newUserData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={newUserData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Role:</label>
          <input type="text" name="role" value={newUserData.role} onChange={handleChange} />
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddNewUserContainer;
