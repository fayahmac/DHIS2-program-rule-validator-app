import React, { useState, useEffect, useCallback } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProgramRulesForm.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DropdownButton from './DropdownButton';

const PROGRAMS_QUERY = {
    programs: {
        resource: 'programs',
        params: {
            fields: ['id', 'displayName'],
        },
    },
};

const VARIABLES_QUERY = {
    variables: {
        resource: 'programRuleVariables',
        params: ({ programId }) => ({
            filter: `program.id:eq:${programId}`,
            fields: ['id', 'displayName'],
        }),
    },
};

const Programrule = () => {
    const [actionType, setActionType] = useState('');
    const [condition, setCondition] = useState('');
    const [programRule, setProgramRule] = useState({
        program: '',
        name: '',
        priority: '',
        description: '',
        actionType: '',
        dataElementId: '',
    });
    const [programs, setPrograms] = useState([]);
    const [variables, setVariables] = useState([]);
    const [isSyntaxCorrect, setIsSyntaxCorrect] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mutationLoading, setMutationLoading] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const { loading: loadingPrograms, error: errorPrograms, data: dataPrograms } = useDataQuery(PROGRAMS_QUERY);
    const { refetch: fetchVariables, loading: loadingVariables, error: errorVariables, data: dataVariables } = useDataQuery(VARIABLES_QUERY, { lazy: true });

    useEffect(() => {
        if (dataPrograms) {
            setPrograms(dataPrograms.programs.programs);
        }
    }, [dataPrograms]);

    useEffect(() => {
        if (programRule.program) {
            fetchVariables({ programId: programRule.program });
        }
    }, [programRule.program]);

    useEffect(() => {
        if (dataVariables) {
            setVariables(dataVariables.variables.programRuleVariables);
        }
    }, [dataVariables]);

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
                let isCorrect = matches.every(match => /^(\{.*?\})|(\(.*?\))|([=><])|(\w+)$/.test(match));
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
            if (value) {
                const updatedCondition = condition + value;
                setCondition(updatedCondition);
                setProgramRule({ ...programRule, condition: updatedCondition });
            }
        } else if (name === 'variable') {
            if (value) {
                const variableSyntax = `#{${value}}`;
                const updatedCondition = condition + variableSyntax;
                setCondition(updatedCondition);
                setProgramRule({ ...programRule, condition: updatedCondition });
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

    const fetchNewId = async () => {
        try {
            const response = await axios.get('/api/system/id', {
                auth: {
                    username: 'admin',
                    password: 'district'
                }
            });

            if (response.status !== 200) {
                throw new Error(`Failed to fetch new ID: ${response.statusText}`);
            }

            return response.data.codes[0];
        } catch (error) {
            console.error('Error fetching new ID:', error);
            throw error;
        }
    };

    const saveProgramRuleMetadata = async () => {
        const [newProgramRuleId, newProgramRuleActionId] = await Promise.all([fetchNewId(), fetchNewId()]);
        const { program, name, priority, description, condition, actionType, dataElementId } = programRule;

        const metadata = {
            programRules: [
                {
                    id: newProgramRuleId,
                    description: description,
                    priority: priority,
                    condition: condition,
                    name: name,
                    program: { id: program },
                    programRuleActions: actionType
                        ? [
                            {
                                id: newProgramRuleActionId,
                                programRuleActionType: actionType,
                                data: programRule.actionData,
                                content: 'n',
                                programRule: { id: newProgramRuleId },
                                dataElement: dataElementId ? { id: dataElementId } : undefined,
                            },
                        ]
                        : [], // Empty array if no actionType is provided
                },
            ],
        };

        console.log('Metadata to be sent:', metadata);

        try {
            const response = await axios.post('http://localhost:8080/api/metadata', metadata, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:district')
                }
            });

            if (response.status === 200) {
                console.log('Program rule saved successfully:', response.data);
            } else {
                console.error('Failed to save program rule:', response.data);
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Failed to save program rule metadata:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleSaveClick = async (event) => {
        event.preventDefault();
        try {
            setMutationLoading(true);
            await saveProgramRuleMetadata();
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error saving program rules:', error);
            alert(`Failed to save program rule: ${error.message}`);
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

    return (
        <form onSubmit={handleSaveClick}>
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
                    <textarea className="form-input" name="description" value={programRule.description} onChange={handleChange} placeholder="Description"></textarea>
                </div>
                <h4 className='section1'><span className="circle">2</span> Define program rule condition</h4>
                <div className="form-group">
                    <label>Program Rule Condition(*)</label>
                    <input className="form-input" type="text" name="condition" value={condition} onChange={handleChange} placeholder="Enter condition" />
                </div>
                <div className="form-group">
                    <DropdownButton
                        label="Insert function"
                        options={['A{event_date}', 'V{current_date}', 'V{event_status}', 'V{due_date}', 'V{completed_date}', 'V{event_date}', 'V{creation_date}', 'V{incident_date}']}
                        onSelect={(option) => handleChange({ target: { name: 'function', value: option } })}
                    />
                </div>
                <div className="form-group">
                    <DropdownButton
                        label="Insert variable"
                        options={variables.map(variable => variable.displayName)}
                        onSelect={(option) => handleChange({ target: { name: 'variable', value: option } })}
                    />
                </div>
                <div className="syntax-message">
                    {getSyntaxMessage()}
                </div>
                <h4 className='section1'><span className="circle">3</span> Program rule action</h4>
                <div className="form-group">
                    <label>Program Rule Action Type</label>
                    <select className="form-input" name="actionType" value={programRule.actionType} onChange={handleChange} placeholder="Action Type">
                        <option value="">Select Action Type</option>
                        <option value="DISPLAYTEXT">Display Text</option>
                        <option value="DISPLAYKEYVALUEPAIR">Display Key-Value Pair</option>
                        <option value="HIDEFIELD">Hide Field</option>
                        <option value="HIDEPROGRAMSTAGE">Hide Program Stage</option>
                        <option value="HIDESECTION">Hide Section</option>
                        <option value="ASSIGN">Assign</option>
                    </select>
                </div>
                {programRule.actionType === 'DISPLAYTEXT' && (
                    <div className="form-group">
                        <label>Data Element</label>
                        <select className="form-input" name="dataElementId" value={programRule.dataElementId} onChange={handleChange} placeholder="Data Element">
                            <option value="">Select Data Element</option>
                            {variables.map(variable => (
                                <option key={variable.id} value={variable.id}>{variable.displayName}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <button className="form-button" type="submit" disabled={mutationLoading}>{mutationLoading ? 'Saving...' : 'Save'}</button>
                </div>
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={isDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Validation Result"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {getSyntaxMessage()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleValidation} color="primary">
                        Validate
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default Programrule;
