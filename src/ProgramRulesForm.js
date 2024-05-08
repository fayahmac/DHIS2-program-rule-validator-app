import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDataQuery } from '@dhis2/app-runtime'
import './ProgramRulesForm.css'; // Import CSS file for styling

const ProgramRulesForm = () => {
    const [programRule, setProgramRule] = useState({
        program: '',
        name: '',
        priority: '',
        description: '',
        condition: '',
        action: ''
    });

    const { loading, error, data } = useDataQuery({
        results: {
            resource: 'programs',
            params: {
                
                fields: ['id', 'displayName'],
            },
        },
    });

    useEffect(() => {
        if (!loading && !error) {
            setPrograms(data.results.programs);
        }
    }, [loading, error, data]);

    const [programs, setPrograms] = useState([]); // State to store programs fetched from DHIS2

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProgramRule(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://play.dhis2.org/2.39.5/api/programRules', programRule, {
                auth: {
                    username: 'admin',
                    password: 'district'
                }
            });
            console.log('Program rule created:', response.data);
            // Reset form fields or perform other actions as needed
        } catch (error) {
            console.error('Error creating program rule:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <h4>Enter program rule details</h4>
                <div className="form-group">
                    <label>Program(*)</label>
                    <select className="form-input" name="program" value={programRule.program} onChange={handleChange} placeholder="Program">
                        <option value="">Select Program</option>
                        {programs.map(program => (
                            <option key={program.id} value={program.id}>{program.displayName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Name(*)</label>
                    <input className="form-input" type="text" name="name" value={programRule.name} onChange={handleChange} placeholder="Name" />
                </div>
                <div className="form-group">
                    <label>Priority</label>
                    <input className="form-input" type="text" name="priority" value={programRule.priority} onChange={handleChange} placeholder="Priority" />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input className="form-input" type="text" name="description" value={programRule.description} onChange={handleChange} placeholder="Description" />
                </div>
                <h4>Enter program rule expression</h4>
                <div className="form-group">
                    <label>Condition</label>
                    <input className="form-condition" type="text" name="condition" value={programRule.condition} onChange={handleChange} placeholder="Condition" />
                    <p>&nbsp;&nbsp;+ &nbsp;&nbsp; - &nbsp;&nbsp; * &nbsp;&nbsp; / &nbsp;&nbsp; % &nbsp;&nbsp; &lt; &nbsp;&nbsp; &gt;= &nbsp;&nbsp; &lt;= &nbsp;&nbsp; == &nbsp;&nbsp; != &nbsp;&nbsp;NOT &nbsp;&nbsp;AND &nbsp; OR</p>
                </div>
                <div className="form-group">
                    <h4>Define program rule action</h4>
                    <input className="form-input" type="text" name="action" value={programRule.action} onChange={handleChange} placeholder="Action" />
                </div >
                <div className="form-button">
                    <button className="form-buttonsave" type="submit">Save</button>
                    <button className="form-buttoncancel" type="button">Cancel</button>
                </div>
            </div>
        </form>
    );
};

export default ProgramRulesForm;
