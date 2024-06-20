import React, { useState, useEffect } from 'react';
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime';
import { Link } from 'react-router-dom';
import './ProgramRulesForm.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
// import { useDataQuery } from '@dhis2/app-runtime';


const ProgramRulesForm = () => {
    const [programRule, setProgramRule] = useState({
        program: '',
        name: '',
        priority: '',
        description: '',
        condition: '',
        actionType: '',
        actionData: '',
        actionContent:'',
        trackedEntity:'',
        dataElement: ''
    });
    const [selectedFunction, setSelectedFunction] = useState('');
    const [condition, setCondition] = useState('');
    const [isSyntaxCorrect, setIsSyntaxCorrect] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [variables, setVariables] = useState([]);
    const [mutationLoading, setMutationLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedDataElementId, setSelectedDataElementId] = useState('');
    const [selectedTrackedEntityId, setSelectedTrackedEntityId] = useState('');
    const [open, setOpen] = useState(false);
    const [dataElements, setDataElements] = useState([]);
    const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);
   
    const dataElementQuery = {
        dataElements: {
            resource: 'dataElements',
            params: {
                fields: ['id', 'displayName'],
            },
        },
    };
    
    const trackedEntityAttributeQuery = {
        trackedEntityAttributes: {
            resource: 'trackedEntityAttributes',
            params: {
                fields: ['id', 'displayName'],
            },
        },
    };
    
    const { loading: loadingDataElements, error: errorDataElements, data: dataDataElements } = useDataQuery(dataElementQuery);
    const { loading: loadingTrackedEntityAttributes, error: errorTrackedEntityAttributes, data: dataTrackedEntityAttributes } = useDataQuery(trackedEntityAttributeQuery);

    useEffect(() => {
        if (!loadingDataElements && !errorDataElements && dataDataElements) {
            setDataElements(dataDataElements.dataElements.dataElements);
        }
    }, [loadingDataElements, errorDataElements, dataDataElements]);

    useEffect(() => {
        if (!loadingTrackedEntityAttributes && !errorTrackedEntityAttributes && dataTrackedEntityAttributes) {
            setTrackedEntityAttributes(dataTrackedEntityAttributes.trackedEntityAttributes.trackedEntityAttributes);
        }
    }, [loadingTrackedEntityAttributes, errorTrackedEntityAttributes, dataTrackedEntityAttributes]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

   

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
            setCondition(prevCondition => prevCondition + value);
            setProgramRule({ ...programRule, condition: condition + value });
        } else if (name === 'variable') {
            const variableSyntax = `#{${value}}`;
            setCondition(prevCondition => prevCondition + variableSyntax);
            setProgramRule({ ...programRule, condition: condition + variableSyntax });
        } else {
            setProgramRule({ ...programRule, [name]: value });
        }
        if (name === 'dataElement') {
            setSelectedDataElementId(value);
        } else if (name === 'trackedEntity') {
            setSelectedTrackedEntityId(value);
        }
    };
    const fetchNewId = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/system/id', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa('admin:district')}` // Ensure these credentials are correct
                }
            });
    
            if (!response.ok) {
                console.error('Response Status:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Response Body:', errorText);
                throw new Error(`Failed to fetch new ID: ${response.statusText}`);
            }
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                console.error('Response Body:', errorText);
                throw new Error('Response is not valid JSON');
            }
    
            const data = await response.json();
            return data.codes[0];
        } catch (error) {
            console.error('Error fetching new ID:', error);
            throw error;
        }
    };
    
    const fetchTwoDistinctIds = async () => {
        try {
            const id1 = await fetchNewId();
            let id2;
            
            // Loop until we get a different ID
            do {
                id2 = await fetchNewId();
            } while (id1 === id2);
    
            console.log(`Fetched distinct IDs: ${id1}, ${id2}`);
            return [id1, id2];
        } catch (error) {
            console.error('Error fetching two distinct IDs:', error);
            throw error;
        }
    };

    const createProgramRuleMutation = {
        resource: 'metadata',
        type: 'create',
        data: (payload) => payload,
    };

    const [mutate] = useDataMutation(createProgramRuleMutation);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSyntaxCorrect !== 2) {
            alert('Please fix the syntax errors in the condition.');
            return;
        }
    
        try {
            setMutationLoading(true);
    
            const [newProgramRuleId, newProgramRuleActionId] = await fetchTwoDistinctIds();
    
            const payload = {
                programRules: [
                    {
                        id: newProgramRuleId,
                        description: programRule.description,
                        priority: programRule.priority,
                        condition: programRule.condition,
                        name: programRule.name,
                        program: {
                            id: programRule.program,
                        },
                        programRuleActions:[ 
                            {
                                id: newProgramRuleActionId,
                                data: programRule.actionData,
                                content:programRule.actionContent,
                                programRuleActionType: programRule.actionType,
                                // trackedEntityAttribute: {
                                //     id: selectedTrackedEntityId,
                                // },
                                programRule: {
                                    id: newProgramRuleId,
                                },
                                // dataElement: {
                                //     id: selectedDataElementId,
                                // },

                            },
                        ] ,
                    },
                ],
                  programRuleActions: [
                    {
                        id: newProgramRuleActionId,
                        data: programRule.actionData,
                        content: programRule.actionContent,
                        programRuleActionType: programRule.actionType,
                        // trackedEntityAttribute: {
                        //     id: selectedTrackedEntityId,
                        // },
                        programRule: {
                            id: newProgramRuleId,
                        },
                        // dataElement: {
                        //     id: selectedDataElementId,
                        // },
                    },
                ] 
            };
    
            const response = await mutate(payload);
            console.log('API Response:', response);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error saving program rule:', error);
            alert('Failed to save program rule');
        } finally {
            setMutationLoading(false);
        }
    };
    
    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleValidation = () => {
        setIsDialogOpen(false);
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
                        value={programRule.condition}
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
                        <select className="form-input" name="variable" onChange={handleChange} placeholder="Variable" disabled={!programRule.program}>
                            <option value="">Variables</option>
                            {variables.map(variable => (
                                <option key={variable.id} value={variable.displayName}>{variable.displayName}</option>
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
                    <p>{getSyntaxMessage()}</p>
                </div>
                <h4 className='section1'><span className="circle">3</span> Enter program rule action details</h4>
                <div className="form-group">
                <label>Action Type</label>
                <select className="form-input" name="actionType" value={programRule.actionType} onChange={handleChange} placeholder="Action Type">
                    <option value="">Select Action Type</option>
                    <option value="SHOWWARNING">Show Warning</option>
                    <option value="SHOWERROR">Show Error</option>
                    <option value="MANDATORYFIELD">Make Field Mandatory</option>
                    <option value="ASSIGN">Assign Value</option>
                    <option value="HIDEFIELD">Hide Field</option>
                </select>
            </div>
            <div className="form-group">
                <label>Data Element</label>
                <select className="form-input" name="dataElementId" value={programRule.dataElementId} onChange={handleChange} placeholder="Data Element">
                    <option value="">Select Data Element</option>
                    {dataElements.map(element => (
                        <option key={element.id} value={element.id}>{element.displayName}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Tracked Entity Attribute</label>
                <select className="form-input" name="trackedEntity" value={programRule.trackedEntity} onChange={handleChange} placeholder="Tracked Entity">
                    <option value="">Select Tracked Entity</option>
                    {trackedEntityAttributes.map(attribute => (
                        <option key={attribute.id} value={attribute.id}>{attribute.displayName}</option>
                    ))}
                    </select>
                    </div>
                    <div className="form-group">
                    <label>static text</label>
                    <input className="form-input" type="text" name="static text" value={programRule.actionContent} onChange={handleChange} placeholder="static text" />
                </div>
                    <div className="form-group">
                    <label>Expression to evaluate and display after static text</label>
                    <input className="form-input" type="text" name="actionData" value={programRule.actionData} onChange={handleChange} placeholder="Action Data" />
                </div>
            
                <div className="form-button">
                    <button className="form-buttonsave" type="submit" disabled={mutationLoading}>
                        {mutationLoading ? 'Saving...' : 'SAVE'}
                    </button>
                    <button className="form-buttoncancel"> <Link to="/" style={{ textDecoration: 'none' }}>CANCEL</Link></button>
                </div>
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={isDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Program rule validation"}</DialogTitle>
                <DialogContent> 
                    <DialogContentText>
                        The Rule successfully created: Run validation!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleValidation} color="primary" autoFocus>
                    <Link to="/configuration-engine" style={{ textDecoration: 'none' }}>Validate</Link>
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default ProgramRulesForm;
