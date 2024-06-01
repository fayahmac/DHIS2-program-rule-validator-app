// ShowWarningMessage.js
import React, { useState } from 'react';
import './ShowWarningMessage.css'; // Import the CSS file

const ShowWarningMessage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowWarning(true);
  };

//creating warning icons
   const warningStyle = {
      position: 'relative',
      padding: '1rem',
      border: '1px',
      borderRadius: '5px',
    };
  
    const triangleStyle = {
      width: '0px',
      height: '0px',
      borderLeft: '15px solid transparent',
      borderRight: '15px solid transparent',
      borderTop: '20px solid #f0ad4e',
      position: 'absolute',
      top: '-10px',
      left: '10px',
    };



  return (
    <div  className="form-container">
      <form onSubmit={handleSubmit}>

              
        <div style={warningStyle}>
          <span  >There are items that require your attention</span>
                 </div>


        <div className="form-group">
          <label>Program</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter program name"
          />
        </div>
        <div className="form-group">
          <label>Data item</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter data-item"
          />
        </div>

        <div className="form-group">
          <label>Data type</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter data-type"
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {showWarning && (
        <div className="warning-box">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      )}

        </div>
    
  );
};

export default ShowWarningMessage;
