import React, { useState } from 'react';

const UserManager = () => {
  // Defining state variables
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingIndex, setEditingIndex] = useState(-1);

  // Function to add a new user
  const addUser = () => {
    if (editingIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = newUser;
      setUsers(updatedUsers);
      setNewUser({ name: '', email: '' });
      setEditingIndex(-1);
    } else {
      setUsers([...users, newUser]);
      setNewUser({ name: '', email: '' });
    }
  };

      // func to edit users
  const editUser = (index) => {
    setNewUser(users[index]);
    setEditingIndex(index);
  };

      //func to delete users
  const deleteUser = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  };

        //save changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewUser({ ...newUser, [name]: value });
    };
  
 
  return (
    <div>
      <h2>Manage users</h2>
      <div>
        <input type="text" name="name" value={newUser.name} onChange={handleChange} placeholder="Name" />
        <input type="email" name="email" value={newUser.email} onChange={handleChange} placeholder="Email" />
        <button onClick={addUser}>{editingIndex !== -1 ? 'Update User' : 'Add User'}</button>
      </div>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.email} 
            <button onClick={() => editUser(index)}>Edit this user</button>
            <button onClick={() => deleteUser(index)}>Delete this user</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

 


export default UserManager;
