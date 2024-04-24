import React, { useState } from 'react';

const UserManager = () => {
  // Defining state variables
  const [users, setUsers] = useState([]);

  // Function to add a znew user
  const addUser = () => {
    // Adding logic to add a new user
  };

  return (
    <div>
      <h2>User Manager</h2>
      <button onClick={addUser}>Add User</button>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
