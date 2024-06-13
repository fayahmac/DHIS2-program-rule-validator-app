import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NotificationPage.css';

const NotificationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message;

    // Redirect if no message is available
    React.useEffect(() => {
        if (!message) {
            navigate('/program-rules'); 
        }
    }, [message, navigate]);

    return (
        <div className="notification-container">
            {message ? (
                <>
                    <div className="notification-message">
                        <div className="notification-icon">&#10003;</div>
                        <div className="notification-text">{message}</div>
                    </div>
                    <button className="validation-button">
                        RUN RULE VALIDATION CHECK
                    </button>
                </>
            ) : (
                <div className="no-message">
                    <p>No message available. Please create a rule to see the notification.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
