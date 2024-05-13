import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDataMutation } from '@dhis2/app-runtime'
import { useDataQuery } from '@dhis2/app-runtime';
import './ProgramRulesForm.css'; // Import CSS file for styling
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import ConditionCheck from './ConditionChecker';

const ProgramRulesForm = () => {
    const [selectedFunction, setSelectedFunction] = useState('');
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
        if (name === 'condition') {
            setProgramRule(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else if (name === 'function') {
            setSelectedFunction(value);
            setProgramRule(prevState => ({
                ...prevState,
                condition: value // Set the selected function as the condition
            }));
        } else {
            setProgramRule(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Define the mutation to create a new program
    const myMutation = {
        resource: 'programs',
        type: 'create',
        data: {
            name: 'A new Program',
            shortName: 'A new Program',
            programType: 'WITH_REGISTRATION',
        },
    }

    // Use the useDataMutation hook to perform the mutation
    const [mutate, { loading: mutationLoading }] = useDataMutation(myMutation);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submit behavior

        try {
            // Perform the mutation to save the program rule
            await mutate(programRule);
            console.log('Program rule saved successfully');
            // Optionally, reset the form or provide feedback to the user
            // setProgramRule({ program: '', name: '', priority: '', description: '', condition: '', action: '' });
            // alert('Program rule saved successfully!');
        } catch (error) {
            console.error('Error saving program rule:', error);
            // Optionally, provide feedback to the user
            // alert('Failed to save program rule');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                {/* Existing form fields */}
                <h4 class='section1'><span class="circle">1</span> Enter program rule details</h4>
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
                <h4 class='section1'><span class="circle">2</span> Enter program rule expression</h4>
                <label>Condition</label>
                <div className="form-g">

                    {/* <input className="form-condition" type="text" name="condition" value={programRule.condition} onChange={handleChange} placeholder="Condition" /> */}
                    <ConditionCheck/>
                    <div className='form-option'>

                        <select className="form-input" value={selectedFunction} name="function" onChange={handleChange}>
                            <option value="">Built-in Function</option>
                            <option value="V{current_date}">V {'{current_date}'}</option>
                            <option value="V{event_date}">V {'{event_date}'}</option>
                            <option value="V{due_date}">V {'{due_date}'}</option>
                            <option value="V{event_count}">V {'{event_count}'}</option>
                            <option value="V{enrollment_date}">V {'{enrollment_date}'}</option>
                            <option value="V{incident_date}">V {'{incident_date}'}</option>
                            <option value="V{enrollment_id}">V {'{enrollment_id}'}</option>
                            <option value="V{enveronment}">V {'{enveronment}'}</option>  
                            <option value="V{event_id}">V {'{event_id}'}</option>
                            <option value="V{orgunit_code}">V {'{orgunit_code}'}</option>
                            <option value="V{program_stage_name}">V {'{program_stage_name}'}</option>
                            <option value="V{program_stage_id}">V {'{program_stage_id}'}</option>
                        </select>

                        <select className="form-input" name="program" value={programRule.program} onChange={handleChange} placeholder="Program">
                            <option value="" style={{ textDecoration: 'none' }}>Variables</option>
                        </select>
                        <select className="form-input" value={selectedFunction} name="function" onChange={handleChange}>
                            <option value="">Function</option>
                            <option value="d2:ceil {'(<number>)'}">d2:ceil {'(<number>)'}</option>
                            <option value="d2:floor {'(<number>)'}">d2:floor {'(<number>)'}</option>
                            <option value="d2:round {'(<number>)'}">d2:round {'(<number>)'}</option>
                            <option value="d2:modulus {'(<number>,<number>)'}">d2:modulus {'(<number>,<number>)'}</option>
                            <option value="d2:zing {'(<number>)'}">d2:zing {'(<number>)'}</option>
                            <option value="d2:oizp {'(<number>)'}">d2:oizp {'(<number>)'}</option>
                            <option value="d2:concatenate {'(<object>,<object>)'}">d2:concatenate {'(<object>,<object>)'}</option>
                            <option value="d2:daysBetween {'(<date>,<date>)'}">d2:daysBetween {'(<date>,<date>)'}</option>  
                            <option value="d2:weeksBetween {'(date>,<date>)'}">d2:weeksBetween {'(date>,<date>)'}</option>
                            <option value="d2:monthBetween {'(date>,<date>)'}">d2:monthBetween {'(date>,<date>)'}</option>
                            <option value="d2:yearsBetween {'(date>,<date>)'}">d2:yearsBetween {'(date>,<date>)'}</option>
                            <option value="d2:addDays {'(date>,<number>)'}">d2:addDays {'(date>,<number>)'}</option>
                            <option value="d2:count {'(<sourcefield>)'}">d2:count {'(<sourcefield>)'}</option>  
                            <option value="d2:countIfValue {'(<sourcefield>,<text>)'}">d2:countIfValue {'(<sourcefield>,<text>)'}</option>
                            <option value="d2:countIfZeroPos {'(<sourcefield>)'}">d2:countIfZeroPos {'(<sourcefield>)'}</option>
                            <option value="d2:hasValue {'(<sourcefield>)'}">d2:hasValue {'(<sourcefield>)'}</option>
                            <option value="d2:zpvc {'(<object>,<object>)'}">d2:zpvc {'(<object>,<object>)'}</option>
                            <option value="d2:validatePatterns {'(<text>,<regex)'}">d2:validatePatterns {'(<text>,<regex)'}</option>
                            <option value="d2:left {'(<text>,<number>)'}">d2:left {'(<text>,<number>)'}</option>
                            <option value="d2:right {'(<text>,<number>)'}">d2:right {'(<text>,<number>)'}</option>
                            <option value="d2:substring {'(<text>,<number>,<number>)'}">d2:substring {'(<text>,<number>,<number>)'}</option>  
                            <option value="d2:split {'(<text>,<text>,<number>)'}">d2:split {'(<text>,<text>,<number>)'}</option>
                            <option value="d2:length {'(<text>)'}">d2:length {'(<text>)'}</option>
                            <option value="d2:inOrgUnitGroup{'( <orgunit_group_code> )'}">d2:inOrgUnitGroup{'( <orgunit_group_code> )'}</option>
                            <option value="d2:hasUserRole{'( <user_role> )'}">d2:hasUserRole{'( <user_role> )'}</option>
                            <option value="d2:zScoreWFA{'( <ageInMonth>, <weight>, <gender> )'}">d2:zScoreWFA{'( <ageInMonth>, <weight>, <gender> )'}</option>  
                            <option value="d2:zScoreHFA{'( <ageInMonth>, <height>, <gender> )'}">d2:zScoreHFA{'( <ageInMonth>, <height>, <gender> )'}</option>
                            <option value="d2:zScoreWFH{'( <height>, <weight>, <gender> )'}">d2:zScoreWFH{'( <height>, <weight>, <gender> )'}</option>
                            <option value="d2:extractDataMatrixValue{'( <key>, <value>)'}">d2:extractDataMatrixValue{'( <key>, <value>)'}</option>
                        </select>
                    </div>
                </div>
                <p>&nbsp;&nbsp;+ &nbsp;&nbsp; - &nbsp;&nbsp; * &nbsp;&nbsp; / &nbsp;&nbsp; % &nbsp;&nbsp; &lt; &nbsp;&nbsp; &gt;= &nbsp;&nbsp; &lt;= &nbsp;&nbsp; == &nbsp;&nbsp; != &nbsp;&nbsp;NOT &nbsp;&nbsp;AND &nbsp; OR</p>
                <div className="form-group">
                    <h4 class='section1'><span class="circle">3</span> Define program rule action</h4>
                    <select className="form-input" name="action" value={programRule.action} onChange={handleChange} placeholder="Action">
                        <option value="">Select Action</option>
                        <option value="Show warning message">Show warning message</option>
                        <option value="Show error message">Show error message</option>
                        <option value="Hide field">Hide field</option>
                        <option value="Make field mandatory">Make field mandatory</option>
                    </select>
                </div>
                {/* Other form inputs */}
                <div className="form-button">
                    {/* Use Link component to navigate to '/new-program' */}
                    <button className="form-buttonsave" disabled={loading || mutationLoading} style={{ textDecoration: 'none' }}>

                        <Link to="/new-program" style={{ textDecoration: 'none' }}>{loading || mutationLoading ? 'Saving...' : 'Save'} </Link>
                    </button>
                    <button className="form-buttoncancel" type="button">Cancel</button>
                </div>
            </div>
        </form>
    );
};

export default ProgramRulesForm;
