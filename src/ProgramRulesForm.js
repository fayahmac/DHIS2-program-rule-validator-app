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
    const [actionType, setActionType] = useState('');
    const [condition, setCondition] = useState('');
    const [programRule, setProgramRule] = useState({
        program: '',
        name: '',
        priority: '',
        description: '',
        actionType: '',
        dataElementId: ''
    });
    const [programs, setPrograms] = useState([]);
    const [variables, setVariables] = useState([]);
    const [isSyntaxCorrect, setIsSyntaxCorrect] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mutationLoading, setMutationLoading] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Fetch programs and program rule variables
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

    const saveProgramRuleMetadata = async () => {
        const { program, name, condition, actionType, dataElementId } = programRule;
        const programRuleId = generateId();
        const programRuleActionId = generateId();

        const metadata = {
            programRules: [
                {
                    condition: condition,
                    name: name,
                    program: { id: program },
                    programRuleActions: [
                        {
                            id: programRuleActionId,
                            programRuleActionType: actionType,
                            programRule: { id: programRuleId },
                            dataElement: { id: dataElementId }
                        }
                    ],
                    id: programRuleId
                }
            ],
            programRuleActions: [
                {
                    id: programRuleActionId,
                    programRuleActionType: actionType,
                    programRule: { id: programRuleId },
                    dataElement: { id: dataElementId }
                }
            ]
        };

        try {
            const response = await fetch('http://localhost:8080/api/41/programRules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(metadata)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // Check if the response is JSON
            let responseData;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                responseData = await response.json();
            } else {
                responseData = await response.text(); // Handle non-JSON responses
            }
            console.log('Program rule metadata saved successfully:', responseData);

        } catch (error) {
            console.error('Failed to save program rule metadata:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleSaveClick = async (event) => {
        event.preventDefault(); // Prevent form submission default behavior
        try {
            // Start the loading indicator
            setMutationLoading(true);

            // Simulate saving the program rules (replace with your actual save logic)
            await saveProgramRuleMetadata();

            // Show the validation dialog
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error saving program rules:', error);
            alert(`Failed to save program rule: ${error.message}`);
        } finally {
            // Stop the loading indicator regardless of success or failure
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
                    <div className={`syntax-message ${isSyntaxCorrect === 2 ? 'correct' : 'incorrect'}`}>{getSyntaxMessage()}</div>
                </div>
                <div className="form-group">
                    <label>Functions</label>
                    <DropdownButton options={["#{value}", "#{option}", "d2:daysBetween"]} name="function" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Program rule variables</label>
                    <DropdownButton options={variables.map(v => v.displayName)} name="variable" onChange={handleChange} />
                </div>
                <h4 className='section1'><span className="circle">3</span> Program rule action</h4>
                <div className="form-group">
                    <label>Action Type(*)</label>
                    <select className="form-input" name="actionType" value={programRule.actionType} onChange={handleChange} placeholder="Action Type">
                        <option value="">Select Action Type</option>
                        <option value="ASSIGN">Assign value</option>
                        <option value="SHOWWARNING">Show warning</option>
                        <option value="SHOWERROR">Show error</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Data Element(*)</label>
                    <input className="form-input" type="text" name="dataElementId" value={programRule.dataElementId} onChange={handleChange} placeholder="Data Element ID" />
                </div>
                <div className="button-container">
                    <button type="button" onClick={handleSaveClick} disabled={mutationLoading} className="save-button">
                        {mutationLoading ? 'Saving...' : 'Save'}
                    </button>
                    <Link to="/" className="cancel-button">Cancel</Link>
                </div>
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={isDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="validation-dialog-title"
            >
                <DialogTitle id="validation-dialog-title">Validate Program Rule</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The program rule was saved successfully! Do you want to validate the program rule now?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleValidation} autoFocus>
                        Validate
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default ProgramRulesForm;
