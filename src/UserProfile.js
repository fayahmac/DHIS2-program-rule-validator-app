import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import './UserProfile.css'; // Import CSS file for styling

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



    return (
        <div className="user-profile-container">
            <h1>User Profile</h1>
            {currentUser && (
                <div><table className="user-profile-table">
                    <p className="user-profile-label">Name: {currentUser.displayName}</p>                   
                    <p className="user-profile-label">User Name: {currentUser.displayUserName}</p>
                    <p className="user-profile-label">Email: {currentUser.email}</p>
                    <p className="user-profile-label">Acoount Status: {currentUser.status}</p>
                    <p className="user-profile-label">Organisation Unit: {currentUser.organisationUnit}</p>
                    <p className="user-profile-label">User Group: {currentUser.userGroup}</p>
                    <p className="user-profile-label">Roles: {currentUser.roles}</p>
                    <p className="user-profile-label">Preferences: {currentUser.preference}</p>
                </table></div>
            )}
        </div>
    );
};


export default UserProfile;
