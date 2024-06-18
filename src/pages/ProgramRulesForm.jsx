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

import DropdownButton from './DropdownButton';

const ProgramRulesForm = () => {
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
    const [mutationLoading, setMutationLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
            setCondition(prevCondition => prevCondition + value);
            setProgramRule({ ...programRule, condition: condition + value });
        } else if (name === 'variable') {
            const variableSyntax = `#{${value}}`;
            setCondition(prevCondition => prevCondition + variableSyntax);
            setProgramRule({ ...programRule, condition: condition + variableSyntax });
        } else {
            setProgramRule({ ...programRule, [name]: value });
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
    
            // Check if response is JSON
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

            const [newProgramRuleId, newProgramRuleActionId] = await Promise.all([fetchNewId(), fetchNewId()]);

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
                        programRuleActions: programRule.actionType
                            ? [
                                {
                                    id: newProgramRuleActionId,
                                    programRuleActionType: programRule.actionType,
                                    data: programRule.actionData,
                                    content: 'n',
                                    programRule: {
                                        id: newProgramRuleId,
                                    },
                                    dataElement: programRule.dataElementId ? { id: programRule.dataElementId } : undefined,
                                },
                            ]
                            : [],
                    },
                ],
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
                <div className="form-group">
                    <label>Condition</label>
                    <input className="form-input" type="text" name="condition" value={programRule.condition} onChange={handleChange} placeholder="Condition" />
                </div>
                <div className="form-group">
                    <label>Program Rule Variable</label>
                    <DropdownButton items={variables} name="variable" handleChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Function</label>
                    <DropdownButton
                        items={[
                            { id: '(', displayName: '(' },
                            { id: ')', displayName: ')' },
                            { id: '=', displayName: '=' },
                            { id: '>', displayName: '>' },
                            { id: '<', displayName: '<' },
                            { id: '&&', displayName: '&&' },
                            { id: '||', displayName: '||' },
                        ]}
                        name="function"
                        handleChange={handleChange}
                    />
                </div>
                <div className="form-actions">
                    <button className="form-button" type="submit" disabled={mutationLoading}>
                        {mutationLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button> <Link to="/" style={{ textDecoration: 'none' }}>BACK</Link></button>
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
