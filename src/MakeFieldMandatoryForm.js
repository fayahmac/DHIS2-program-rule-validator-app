import React, { useState } from 'react';
import './MakeFieldMandatoryForm.css'; // Import the CSS file

const MakeFieldMandatoryForm = () => {
    const [formData, setFormData] = useState({
        mainField: '',
        optionalField: '',
        makeOptionalFieldMandatory: false,
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
        // Validate mandatory fields
        if (!formData.mainField) {
            alert('all fieds are required');
            return;
        }
        if (formData.makeOptionalFieldMandatory && !formData.optionalField) {
            alert('this field is required');
            return;
        }
        console.log('Form data:', formData);
        // You can add the code to send data to the server here
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Program <span className="mandatory">*</span></label>
                <input
                    className="form-input"
                    type="text"
                    name="mainField"
                    value={formData.mainField}
                    onChange={handleChange}
                    placeholder="Enter program name"
                />
            </div>
            <div className="form-group">
                <label>Condition <span className="mandatory">*</span></label>
                <input
                    className="form-input"
                    type="text"
                    name="mainField"
                    value={formData.mainField}
                    onChange={handleChange}
                    placeholder="Enter option"
                />
            </div>
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        name="makeOptionalFieldMandatory"
                        checked={formData.makeOptionalFieldMandatory}
                        onChange={handleChange}
                    />
                    Make Field Mandatory
                </label>
            </div>
            <div className="form-group">
                <label>
                    Optional Field {formData.makeOptionalFieldMandatory && <span className="mandatory">*</span>}
                </label>
                <input
                    className="form-input"
                    type="text"
                    name="optionalField"
                    value={formData.optionalField}
                    onChange={handleChange}
                    placeholder="Enter data item"
                />
            </div>
            <div className="form-group">
                <label>
                    Optional Field {formData.makeOptionalFieldMandatory && <span className="mandatory">*</span>}
                </label>
                <input
                    className="form-input"
                    type="text"
                    name="optionalField"
                    value={formData.optionalField}
                    onChange={handleChange}
                    placeholder="Enter data item type"
                />
            </div>
            <button type="submit" className="form-button">Submit</button>
        </form>
    );
};

export default MakeFieldMandatoryForm;
