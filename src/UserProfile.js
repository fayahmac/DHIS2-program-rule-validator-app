import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import React, { useState } from 'react';

const UserProfile = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { loading, error: queryError, data } = useDataQuery({
        me: {
            resource: 'me',
        },
    });

    useEffect(() => {
        if (loading || !data) {
            return;
        }

        if (queryError) {
            setError(queryError);
            setIsLoading(false);
            return;
        }

        setCurrentUser(data.me);
        setIsLoading(false);
    }, [loading, data, queryError]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    
        const [userData, setUserData] = useState({
            name: 'John Doe',
            email: 'john@example.com',
            status: 'Active',
            // Add more user data fields as needed
        });
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            setUserData(prevUserData => ({
                ...prevUserData,
                [name]: value
            }));
        };
    



    return (
        <div>
            <h2>User ggggProfile</h2>
            {currentUser && (
                <div>
                    <p>Name: {currentUser.displayName}</p>
                    <p>Email: {currentUser.email}</p>
                    <p>Status: {currentUser.status}</p>
                </div>
            )}

<div>
                <label>Name:</label>
                <input type="text" name="name" value={userData.name} onChange={handleChange} />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={userData.email} onChange={handleChange} />
            </div>
            <div>
                <label>Status:</label>
                <select name="status" value={userData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            {/* Add more user data fields as needed */}
            <button onClick={() => console.log(userData)}>Save</button>







        </div>
    );
};

export default UserProfile;
