import React, { useState } from 'react';
import './HideFieldForm.css'; // Import the CSS file

const HideFieldForm = () => {
    const [formData, setFormData] = useState({
        mainField: '',
        optionalField: '',
        showOptionalField: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // You can add the code to send data to the server here
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Program</label>
                <input
                    type="text"
                    name="mainField"
                    value={formData.mainField}
                    onChange={handleChange}
                    placeholder="Enter program"
                />
            </div>
            <div className="form-group">
                <label>conditions</label>
                <input
                    type="text"
                    name="mainField"
                    value={formData.mainField}
                    onChange={handleChange}
                    placeholder="Enter main field"
                />
            </div>
            <div className="form-group">
                <label>parameters</label>
                <input
                    type="text"
                    name="mainField"
                    value={formData.mainField}
                    onChange={handleChange}
                    placeholder="Enter main field"
                />
            </div>
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        name="showOptionalField"
                        checked={formData.showOptionalField}
                        onChange={handleChange}
                    />
                    Show Optional Field
                </label>
            </div>
            {formData.showOptionalField && (
                <div className="form-group">
                    <label>data element</label>
                    <input
                        type="text"
                        name="optionalField"
                        value={formData.optionalField}
                        onChange={handleChange}
                        placeholder="Enter element"
                    />
                </div>
                 
            )}
            {formData.showOptionalField && (
                <div className="form-group">
                    <label>data element type</label>
                    <input
                        type="text"
                        name="optionalField"
                        value={formData.optionalField}
                        onChange={handleChange}
                        placeholder="Enter element type"
                    />
                </div>
                 
            )}
            <button type="submit" className="form-button">Send</button>
        </form>
    );
};

export default HideFieldForm;