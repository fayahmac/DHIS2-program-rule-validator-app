import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

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
        <div>
            <h1>User Profile</h1>
            {currentUser && (
                <div>
                    <p>Name: {currentUser.displayName}</p>                   <p>UserName: {currentUser.displayUserName}</p>
                    <p>Email: {currentUser.email}</p>
                    <p>AcoountStatus: {currentUser.status}</p>
                    <p>OrganisationUnit: {currentUser.organisationUnit}</p>
                    <p>UserGroup: {currentUser.userGroup}</p>
                    <p>Roles: {currentUser.roles}</p>
                    <p>Preferences: {currentUser.preference}</p>
                </div>
            )}
        </div>
    );
};


export default UserProfile;
