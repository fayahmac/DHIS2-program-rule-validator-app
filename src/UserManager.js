import React, { useState } from 'react';

const UserManager = () => {
  // Defining state variables
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  //const [editingIndex, setEditingIndex] = useState(-1);

  // Function to add a new user
  const addUser = () => {
      // Adding logic to add a new use
      setUsers([...users, newUser]);
      setNewUser({ name: '', email: '' });
    };
  
    const deleteUser = (index) => {
      //delete users
      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewUser({ ...newUser, [name]: value });
    };
  
    return (
      <div>
        <h2>User Manager</h2>
        <div>
          <input type="text" name="name" value={newUser.name} onChange={handleChange} placeholder="Name" />
          <input type="email" name="email" value={newUser.email} onChange={handleChange} placeholder="Email" />
          <button onClick={addUser}>Add User</button>
        </div>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.name} - {user.email} <button onClick={() => deleteUser(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
 





//   return (
//     <div>
//       <h2>User Manager</h2>
//       <button onClick={addUser}>Add User</button>
//       <ul>
//         {users.map((user, index) => (
//           <li key={index}>{user.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

export default UserManager;
