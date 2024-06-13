import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import './NotificationPage.css';
const NotificationPage = () => {
    const location = useLocation(); // Initialize useLocation
    const message = location.state?.message || 'No message available';

      return (
        <div className="notification-container">
          <div className="notification-message">
            <div className="notification-icon">&#10003;</div>
            <div className="notification-text">RULE CREATED SUCCESFULLY</div>
          </div>
          <button className="validation-button">
            RUN RULE VALIDATION CHECK
          </button>
          <p>{message}</p>
        </div>
      );
    };
   
export default NotificationPage;
