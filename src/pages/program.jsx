import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
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

const ProgramRulesForm = () => {
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

    const { loading: loadingPrograms, error: errorPrograms, data: dataPrograms } = useDataQuery({
        programs: {
            resource: 'programs',
            params: {
                fields: ['id', 'displayName'],
            },
        },
    });

    const { refetch: fetchVariables, loading: loadingVariables, error: errorVariables, data: dataVariables } = useDataQuery(
        {
            variables: {
                resource: 'programRuleVariables',
                params: ({ programId }) => ({
                    filter: `program.id:eq:${programId}`,
                    fields: ['id', 'displayName'],
                }),
            },
        },
        { lazy: true }
    );

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

    const saveProgramRuleMetadata = async () => {
        const { program, name, condition, actionType, dataElementId } = programRule;
        const programRuleId = generateId();
        const programRuleActionId = generateId();

        const metadata = {
            programRules: [
                {
                    id: programRuleId,
                    name: name,
                    condition: condition,
                    program: { id: program },
                    programRuleActions: [
                        {
                            id: programRuleActionId,
                            programRuleActionType: actionType,
                            dataElement: dataElementId ? { id: dataElementId } : undefined,
                        },
                    ],
                },
            ],
            programRuleActions: [
                {
                    id: programRuleActionId,
                    programRuleActionType: actionType,
                    dataElement: dataElementId ? { id: dataElementId } : undefined,
                    programRule: { id: programRuleId },
                },
            ],
        };

        try {
            const response = await fetch(`http://localhost:8080/api/programRules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(`${'admin'}:${'district'}`)  // Include Basic Auth header
                },
                body: JSON.stringify(metadata),
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const responseData = await response.json();
                console.log('Program rule metadata saved successfully:', responseData);
            } else {
                const errorText = await response.text();
                throw new Error(`Non-JSON response received: ${errorText}`);
            }
        } catch (error) {
            if (error.message.includes('NetworkError')) {
                alert('Network error: Please check your connection and try again.');
            } else if (error.message.includes('400')) {
                alert('Bad Request: Please check the input data.');
            } else if (error.message.includes('500')) {
                alert('Server error: Please try again later.');
            } else {
                alert(`Unexpected error: ${error.message}`);
            }
        }
    };

    const handleSaveClick = async (event) => {
        event.preventDefault();
        const { program, name, condition, actionType } = programRule;

        // Validate required fields
        if (!program) {
            alert('Program is required.');
            return;
        }
        if (!name) {
            alert('Name is required.');
            return;
        }
        if (!condition) {
            alert('Condition is required.');
            return;
        }
        if (!actionType) {
            alert('Action type is required.');
            return;
        }

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

    const generateId = () => 'id-' + Math.random().toString(36).substr(2, 9);

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
                    <input className="form-input" type="text" name="description" value={programRule.description} onChange={handleChange} placeholder="Description" />
                </div>
                <h4 className='section1'><span className="circle">2</span> Define program rule condition</h4>
                <div className="form-group">
                    <label>Condition(*)</label>
                    <textarea className="form-input" name="condition" value={condition} onChange={handleChange} placeholder="Enter Condition"></textarea>
                    <div className={`syntax-message ${isSyntaxCorrect === 2 ? 'valid' : 'invalid'}`}>
                        {getSyntaxMessage()}
                    </div>
                </div>
                <div className="form-group">
                    <label>Functions</label>
                    <DropdownButton functions={['d2:hasValue', 'd2:daysBetween']} handleChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Variables</label>
                    <DropdownButton variables={variables} handleChange={handleChange} />
                </div>
                <h4 className='section1'><span className="circle">3</span> Define program rule action</h4>
                <div className="form-group">
                    <label>Action type(*)</label>
                    <select className="form-input" name="actionType" value={programRule.actionType} onChange={handleChange} placeholder="Action Type">
                        <option value="">Select Action Type</option>
                        <option value="ASSIGN">Assign value</option>
                        <option value="SHOWWARNING">Show warning</option>
                        <option value="HIDEFIELD">Hide field</option>
                    </select>
                </div>
                {programRule.actionType && (
                    <div className="form-group">
                        <label>Data element</label>
                        <select className="form-input" name="dataElementId" value={programRule.dataElementId} onChange={handleChange} placeholder="Data Element">
                            <option value="">Select Data Element</option>
                            {variables.map(variable => (
                                <option key={variable.id} value={variable.id}>{variable.displayName}</option>
                            ))}
                        </select>
                    </div>
                )}
                <Button type="submit" variant="contained" color="primary" disabled={mutationLoading}>
                    {mutationLoading ? 'Saving...' : 'Save'}
                </Button>
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
                        The program rule was successfully validated!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleValidation} color="primary" autoFocus>
                        Validate
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default ProgramRulesForm;
