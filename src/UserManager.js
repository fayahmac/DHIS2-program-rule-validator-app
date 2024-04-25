import React, { useState } from 'react';
import './UserManager.css'; // Import CSS file

const UserManager = () => {
  // Defining state variables
  const [users, setUsers] = useState([  { id: 1, name: '', email: '', status: '' },
  { id: 2, name: '', email: '', status: '' }
    ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', status: '' });
  const [editingIndex, setEditingIndex] = useState(-1);


  //https://docs.webix.com/usermanager__classmap.html
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
      <h1 class="header" className="user-manager-header">Manage users</h1>
      <div>
        <input type="text" name="name" value={newUser.name} onChange={handleChange} placeholder="Name" />
        <input type="email" name="email" value={newUser.email} onChange={handleChange} placeholder="Email" />
        <input type="text" name="status" value={newUser.status} onChange={handleChange} placeholder="Status" />
        <button className="add-button" onClick={addUser}>{editingIndex !== -1 ? 'Update' : 'New'}</button>
      </div>

      <table className="user-table"> {/* Apply CSS class to table */}
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Status</th> {/* New column for status */}
            <th className="table-header">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td> {/* Display status for each user */}
              <td>
                <button onClick={() => editUser(index)} className="table-header">Edit</button>
                <button onClick={() => deleteUser(index)} className="table-header">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

 


export default UserManager;
