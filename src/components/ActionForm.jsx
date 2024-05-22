import React from 'react';


const ActionForm = ({ action, onClose }) => {
    const handleSubmit = (e) => {
        // Handle action form submission
        e.preventDefault();
        // Perform action form submission logic
        // You can add your logic here
        // Then close the action form
        onClose();
    };

    return (
        <div className="action-form">
            <h4>Action: {action}</h4>
            <form onSubmit={handleSubmit}>
                {/* Add fields related to the selected action */}
                {/* For example: */}
                <div className="form-group">
                    <label>Data Element</label>
                    <input className="form-input" type="text" name="dataElement" placeholder="Data Element" />
                </div>
                <div className="form-group">
                    <label>Tracked Entity Attribute</label>
                    <input className="form-input" type="text" name="trackedEntityAttribute" placeholder="Tracked Entity Attribute" />
                </div>
                {/* Add more fields as needed */}
                <div className="form-button">
                    <button className="form-buttonsave" type="submit">Save</button>
                    <button className="form-buttoncancel" type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ActionForm;
