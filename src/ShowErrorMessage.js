import React from 'react';
import './ShowErrorMessage.css'; // Import CSS file for styling


const ShowErrorMessage = ({ message }) => {

    
    return (
        <div className="error-message-container">
            <div className="error-icon">⚠️</div>
            <span>An unexpected error occurred. Please try again</span>
            <div className="error-message">{message}</div>
        </div>
    );
};

export default ShowErrorMessage;
