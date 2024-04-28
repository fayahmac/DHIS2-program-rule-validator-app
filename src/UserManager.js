import React, { useState } from 'react';
import './UserManager.css'; // Import CSS file
import AddNewUserContainer from './AddNewUserContainer'; // Import the AddNewUserContainer component
import AddNewRoleContainer from './AddNewRoleContainer'; // Import the AddNewRoleContainer component

const UserManager = () => {

  const [showAddUserContainer, setShowAddUserContainer] = useState(false);

 
  const handleUsersClick = () => {
    // Handle click for "Users" button
    console.log("Users button clicked");
  };


  const [showAddRoleContainer, setShowAddRoleContainer] = useState(false);

  
   const handleRolesClick = () => {
    // Handle click for "Roles" button
    console.log("Roles button clicked");
  };

  const handleRulesClick = () => {
    // Handle click for "Rules" button
    console.log("Rules button clicked");
  };

                  // creating new plus button
                  const [showAddButton, setShowAddButton] = useState(false);

                  const handleAddButtonClick = () => {
                    setShowAddButton(!showAddButton); // Toggle the state when the button is clicked
                  };

                  const handleConfirmAdd = () => {
                    // Logic to handle the "Add" action
                    console.log("Add action confirmed");
                  };


    // eventhandler for new user or role add buttons
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);


  const handleAddUserClick = () => {
    setShowAddUser(true);
    setShowAddRole(false);
    setShowAddUserContainer(true);
  };

  const handleCloseAddUser = () => {
    setShowAddUserContainer(false);
  };

  const handleAddRoleClick = () => {
    setShowAddRole(true);
    setShowAddUser(false);
    setShowAddRoleContainer(true);
  };

  const handleCloseAddRole = () => {
    setShowAddRoleContainer(false);
  };

  // const handleConfirmAddUser = () => {
  //   // Handle logic for adding new user
  // };

  // const handleConfirmAddRole = () => {
  //   // Handle logic for adding new role
  // };

  // Defining state variables
  const [users, setUsers] = useState([  { id: 1, name: '', email: '', status: '', role:'' },
  { id: 2, name: '', email: '', status: '', role:'' }
    ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', status: '', role:'' });
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
  
      // search and find users
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    // Perform search logic here
    // For example, filter users based on search term
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Update users state with filtered users
    // For example:
    // setUsers(filteredUsers);
    console.log(filteredUsers);
  };

  return (
    <div className="user-manager-container">
      <h1 class="header" className="user-manager-header">Manage users</h1>

      
        {/* add new plus contianer */}
        <div>
        {/* <button className="add-button" onClick={handleAddButtonClick}>New</button> */}
        {/* <button className="add-button" onClick={handleAddUserClick}>New</button> */}
                      {/* {showAddUserContainer && <AddNewUserContainer />} */}
        </div>     

      {/* users, rules and roles buttons container */}
      <div className="button-group">
        <button className="action-button" onClick={handleUsersClick}>Users</button>
        <button className="action-button" onClick={handleRolesClick}>Roles</button>
        <button className="action-button" onClick={handleRulesClick}>Rules</button>
        <button className="action-button" onClick={handleAddUserClick}>New User</button>  
                {showAddUserContainer && <AddNewUserContainer onClose={handleCloseAddUser}/>}
        <button className="action-button" onClick={handleAddRoleClick}>New Role</button>  
                   {showAddRoleContainer && <AddNewRoleContainer onClose={handleCloseAddRole} />}
      </div>

               {/* search buttons container */}
      <div className="search-container">
        <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search users..." />
        <button className="search-button"  onClick={handleSearch}>&#128269; Search</button>
        </div>

        {/* entry of newusers or edit usrs container */}
        <div>
        <input type="text" name="name" value={newUser.name} onChange={handleChange} placeholder="Name" />
        <input type="email" name="email" value={newUser.email} onChange={handleChange} placeholder="Email" />
        <input type="text" name="status" value={newUser.status} onChange={handleChange} placeholder="Status" />
        <input type="text" name="role" value={newUser.role} onChange={handleChange} placeholder="Role" />
        <button className="add-button" onClick={addUser}>{editingIndex !== -1 ? 'Update' : 'New'}</button>
      </div>

        {/* users table date container */}
        <div className="user-list-container">
              <table className="user-table"> {/* Apply CSS class to table */}
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Status</th> {/* New column for status */}
            <th className="table-header">Role</th>
            <th className="table-header">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td> {/* Display status for each user */}
              <td>{user.role}</td>
              <td>
                <button onClick={() => editUser(index)} className="table-header">Edit</button>
                <button onClick={() => deleteUser(index)} className="table-header">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

 

export default UserManager;
