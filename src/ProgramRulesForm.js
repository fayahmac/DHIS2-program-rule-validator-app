import React, { useState, useEffect } from 'react';
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime';
import { Link } from 'react-router-dom';
import './ProgramRulesForm.css';

const ProgramRulesForm = () => {
    const [selectedFunction, setSelectedFunction] = useState('');
    const [programRule, setProgramRule] = useState({
        program: '',
        name: '',
        priority: '',
        description: '',
        condition: '',
        actionType: '',
        actionData: '',
        dataElementId: ''
    });
    const [condition, setCondition] = useState('');
    const [isSyntaxCorrect, setIsSyntaxCorrect] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [variables, setVariables] = useState([]);

    const { loading: loadingPrograms, error: errorPrograms, data: dataPrograms } = useDataQuery({
        programs: {
            resource: 'programs',
            params: {
                fields: ['id', 'displayName'],
            },
        }
    });

    const { refetch: fetchVariables, loading: loadingVariables, error: errorVariables, data: dataVariables } = useDataQuery({
        variables: {
            resource: 'programRuleVariables',
            params: ({ programId }) => ({
                filter: `program.id:eq:${programId}`,
                fields: ['id', 'displayName'],
            }),
        },
    }, { lazy: true });

    useEffect(() => {
        if (!loadingPrograms && !errorPrograms && dataPrograms) {
            setPrograms(dataPrograms.programs.programs);
        }
    }, [loadingPrograms, errorPrograms, dataPrograms]);

    useEffect(() => {
        if (programRule.program) {
            fetchVariables({ programId: programRule.program });
        }
    }, [programRule.program]);

    useEffect(() => {
        if (!loadingVariables && !errorVariables && dataVariables) {
            setVariables(dataVariables.variables.programRuleVariables);
        }
    }, [loadingVariables, errorVariables, dataVariables]);

    useEffect(() => {
        checkSyntax();
    }, [condition]);

    const checkSyntax = () => {
        if (condition.trim() === '') {
            setIsSyntaxCorrect(3); // Expression is empty
        } else {
            const regex = /(\{.*?\})|(\(.*?\))|([=><])|(\w+)/g;
            const matches = condition.match(regex);

            if (matches) {
                let isCorrect = true;
                for (let match of matches) {
                    if (!/^(\{.*?\})|(\(.*?\))|([=><])|(\w+)$/.test(match)) {
                        isCorrect = false;
                        break;
                    }
                }
                setIsSyntaxCorrect(isCorrect ? 2 : 1); // Set syntax correctness based on the check
            } else {
                setIsSyntaxCorrect(1); // Syntax is incorrect
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'condition') {
            setCondition(value);
            setProgramRule({ ...programRule, condition: value });
        } else if (name === 'function') {
            setSelectedFunction(value);
            if (value) {
                setCondition(prevCondition => prevCondition + value);
                setProgramRule({ ...programRule, condition: condition + value });
            }
        } else if (name === 'variable') {
            if (value) {
                const variableSyntax = `#{${value}}`;
                setCondition(prevCondition => prevCondition + variableSyntax);
                setProgramRule({ ...programRule, condition: condition + variableSyntax });
            }
        } else {
            setProgramRule({ ...programRule, [name]: value });
        }
    };

    const getSyntaxMessage = () => {
        switch (isSyntaxCorrect) {
            case 1:
                return "Syntax is incorrect!";
            case 2:
                return "Syntax is correct!";
            case 3:
                return "Expression is empty";
            default:
                return "";
        }
    };

    const myMutation = {
        resource: 'programRules',
        type: 'create',
        data: ({ program, name, priority, description, condition, actionType, actionData, dataElementId }) => {
            const data = {
                program: { id: program },
                name,
                priority,
                description,
                condition,
                programRuleActions: [
                    {
                        id: 'UoEMMzMMz2M', // This should be dynamically generated or passed
                        programRuleActionType: actionType,
                        content: actionData,
                        dataElement: { id: dataElementId },
                        location: 'feedback', // Keep location property
                    }
                ]
            };
            return data;
        },
    };

    const handleOperatorClick = (operator) => {
        const textarea = document.querySelector('.form-condition');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = condition.slice(0, start) + operator + condition.slice(end);
        handleChange({ target: { name: 'condition', value: newValue } });
    };
    const operatorMapping = {
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        '%': '%',
        '<': '<',
        '>=': '>=',
        '<=': '<=',
        '==': '==',
        '!=': '!=',
        'NOT': '!',
        'AND': '&&',
        'OR': '||'
    };

    const [mutate, { loading: mutationLoading }] = useDataMutation(myMutation);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSyntaxCorrect !== 2) {
            alert('Please fix the syntax errors in the condition.');
            return;
        }

        try {
            await mutate(programRule);
            console.log('Program rule saved successfully');
            alert('Program rule saved successfully!');
        } catch (error) {
            console.error('Error saving program rule:', error);
            alert('Failed to save program rule');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <h4 className='section1'><span className="circle">1</span> Enter program rule details</h4>
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
                <h4 className='section1'><span className="circle">2</span> Enter program rule expression</h4>
                <label>Condition</label>
                <div className="form-g">
                    <textarea className="form-condition"
                        value={condition}
                        onChange={handleChange}
                        placeholder="Enter condition here"
                        name="condition"
                        disabled={!programRule.program}
                    />
                     
                    <div className='form-option'>
                    <select className="form-input" value={selectedFunction} name="function" onChange={handleChange} disabled={!programRule.program}>
                            <option value="">Built-in Function</option>
                            <option value="V{current_date}">V {'{current_date}'}</option>
                            <option value="V{event_date}">V {'{event_date}'}</option>
                            <option value="V{due_date}">V {'{due_date}'}</option>
                            <option value="V{event_count}">V {'{event_count}'}</option>
                            <option value="V{enrollment_date}">V {'{enrollment_date}'}</option>
                            <option value="V{incident_date}">V {'{incident_date}'}</option>
                            <option value="V{enrollment_id}">V {'{enrollment_id}'}</option>
                            <option value="V{environment}">V {'{environment}'}</option>  
                            <option value="V{event_id}">V {'{event_id}'}</option>
                            <option value="V{orgunit_code}">V {'{orgunit_code}'}</option>
                            <option value="V{program_stage_name}">V {'{program_stage_name}'}</option>
                            <option value="V{program_stage_id}">V {'{program_stage_id}'}</option>
                        </select>
                        <select className="form-input" value={programRule.variable} name="variable" onChange={handleChange} disabled={!programRule.program}>
                            <option value="">Variables</option>
                            {variables.map(variable => (
                                <option key={variable.id} value={variable.id}>{variable.displayName}</option>
                            ))}
                        </select>

                        <select className="form-input" value={selectedFunction} name="function" onChange={handleChange} disabled={!programRule.program}>
                            <option value="">Function</option>
                            <option value="d2:ceil (<number>)">d2:ceil {'(<number>)'}</option>
                            <option value="d2:floor (<number>)">d2:floor {'(<number>)'}</option>
                            <option value="d2:round (<number>)">d2:round {'(<number>)'}</option>
                            <option value="d2:modulus (<number>,<number>)">d2:modulus {'(<number>,<number>)'}</option>
                            <option value="d2:zing (<number>)">d2:zing {'(<number>)'}</option>
                            <option value="d2:oizp (<number>)">d2:oizp {'(<number>)'}</option>
                            <option value="d2:concatenate (<object>,<object>)">d2:concatenate {'(<object>,<object>)'}</option>
                            <option value="d2:daysBetween (<date>,<date>)">d2:daysBetween {'(<date>,<date>)'}</option>  
                            <option value="d2:weeksBetween (<date>,<date>)">d2:weeksBetween {'(<date>,<date>)'}</option>
                            <option value="d2:monthsBetween (<date>,<date>)">d2:monthsBetween {'(<date>,<date>)'}</option>
                            <option value="d2:yearsBetween (<date>,<date>)">d2:yearsBetween {'(<date>,<date>)'}</option>
                            <option value="d2:hasValue (<sourcefield>)">d2:hasValue {'(<sourcefield>)'}</option>
                            <option value="d2:validatePattern (<text>,<regex>)">d2:validatePattern {'(<text>,<regex>)'}</option>
                            <option value="d2:addDays (<date>,<number>)">d2:addDays {'(<date>,<number>)'}</option>
                            <option value="d2:countIfValue (<sourcefield>, <value>)">d2:countIfValue {'(<sourcefield>, <value>)'}</option>
                            <option value="d2:countIfZeroPos (<sourcefield>)">d2:countIfZeroPos {'(<sourcefield>)'}</option>
                            <option value="d2:hasValue (<sourcefield>)">d2:hasValue {'(<sourcefield>)'}</option>
                            <option value="d2:zpvc (<object>,<object>)">d2:zpvc {'(<object>,<object>)'}</option>
                            <option value="d2:validatePatterns (<text>,<regex)">d2:validatePatterns {'(<text>,<regex)'}</option>
                            <option value="d2:left (<text>,<number>)">d2:left {'(<text>,<number>)'}</option>
                            <option value="d2:right (<text>,<number>)">d2:right {'(<text>,<number>)'}</option>
                            <option value="d2:substring (<text>,<number>,<number>)">d2:substring {'(<text>,<number>,<number>)'}</option>  
                            <option value="d2:split (<text>,<text>,<number>)">d2:split {'(<text>,<text>,<number>)'}</option>
                            <option value="d2:length (<text>)">d2:length {'(<text>)'}</option>
                            <option value="d2:inOrgUnitGroup( <orgunit_group_code> )">d2:inOrgUnitGroup{'( <orgunit_group_code> )'}</option>
                            <option value="d2:hasUserRole( <user_role> )">d2:hasUserRole{'( <user_role> )'}</option>
                            <option value="d2:zScoreWFA( <ageInMonth>, <weight>, <gender> )">d2:zScoreWFA{'( <ageInMonth>, <weight>, <gender> )'}</option>  
                            <option value="d2:zScoreHFA( <ageInMonth>, <height>, <gender> )">d2:zScoreHFA{'( <ageInMonth>, <height>, <gender> )'}</option>
                            <option value="d2:zScoreWFH( <height>, <weight>, <gender> )">d2:zScoreWFH{'( <height>, <weight>, <gender> )'}</option>
                            <option value="d2:extractDataMatrixValue( <key>, <value>)">d2:extractDataMatrixValue{'( <key>, <value>)'}</option>
                        </select>
                        </div>
                        </div>
                        <div style={{ display: 'grid', }}  >
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}  > 
                    {Object.keys(operatorMapping).map((displayLabel) => (
                        <span
                            key={displayLabel}
                            onClick={() => handleOperatorClick(operatorMapping[displayLabel])}
                            style={{ padding: '5px 10px', cursor: 'pointer', fontSize: '21px', borderRadius: '4px' }} 
                            disabled={!programRule.program}
                        >
                            {displayLabel}
                        </span>
                    ))}
                 </div>
              <p>  {getSyntaxMessage()}</p>
                
                </div>
                <h4 className='section1'><span className="circle">3</span> Define program rule action</h4>
                
                    <select className="form-input" name="actionType" value={programRule.actionType} onChange={handleChange} placeholder="Action" disabled={!programRule.program}>
                        <option value="">Select Action</option>
                        <option value="SHOWWARNING">Show warning message</option>
                        <option value="SHOWERROR">Show error message</option>
                        <option value="HIDEFIELD">Hide field</option>
                        <option value="MANDATORYFIELD">Make field mandatory</option>
                    </select>  
                
                <button  className="form-buttonsave" type="submit" disabled={mutationLoading}>Save</button>
                <Link to="/programRules">
                    <button className="form-buttoncancel">Back</button>
                </Link>
               
                </div>
           
        </form>
    );
};

export default ProgramRulesForm;
