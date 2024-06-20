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

const ProgramRulesForm = () => {
    const [programRule, setProgramRule] = useState({
        program: '',
        name: '',
        priority: '',
        description: '',
        condition: '',
        actionType: '',
        actionData: '',
        actionContent: '',
        trackedEntity: '',
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

        // Set selected dataElement and trackedEntity values
        if (name === 'dataElement') {
            setProgramRule({ ...programRule, dataElement: value });
        } else if (name === 'trackedEntity') {
            setProgramRule({ ...programRule, trackedEntity: value });
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
                        programRuleActions: [
                            {
                                id: newProgramRuleActionId,
                                data: programRule.actionData,
                                content: programRule.actionContent,
                                programRuleActionType: programRule.actionType,
                                trackedEntityAttribute: {
                                    id: programRule.trackedEntity,  // Added this line
                                },
                                dataElement: {
                                    id: programRule.dataElement,  // Added this line
                                },
                            },
                        ],
                    },
                ],
            };

            await mutate({ data: payload });

            setMutationLoading(false);
            alert('Program Rule created successfully');
        } catch (error) {
            console.error('Error submitting program rule:', error);
            setMutationLoading(false);
            alert('Error creating program rule');
        }
    };

    return (
        <div className="form-container">
            <h1>Program Rules Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="program">Program:</label>
                    <select id="program" name="program" value={programRule.program} onChange={handleChange}>
                        <option value="">Select a program</option>
                        {programs.map(program => (
                            <option key={program.id} value={program.id}>{program.displayName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={programRule.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority:</label>
                    <input
                        type="text"
                        id="priority"
                        name="priority"
                        value={programRule.priority}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={programRule.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="condition">Condition:</label>
                    <input
                        type="text"
                        id="condition"
                        name="condition"
                        value={condition}
                        onChange={handleChange}
                    />
                    <div className="syntax-check">
                        {isSyntaxCorrect === 2 && <span style={{ color: 'green' }}>Syntax is correct</span>}
                        {isSyntaxCorrect === 1 && <span style={{ color: 'red' }}>Syntax is incorrect</span>}
                        {isSyntaxCorrect === 3 && <span style={{ color: 'orange' }}>Expression is empty</span>}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="actionType">Action Type:</label>
                    <input
                        type="text"
                        id="actionType"
                        name="actionType"
                        value={programRule.actionType}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="actionData">Action Data:</label>
                    <input
                        type="text"
                        id="actionData"
                        name="actionData"
                        value={programRule.actionData}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="actionContent">Action Content:</label>
                    <input
                        type="text"
                        id="actionContent"
                        name="actionContent"
                        value={programRule.actionContent}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dataElement">Data Element:</label>
                    <select id="dataElement" name="dataElement" value={programRule.dataElement} onChange={handleChange}>
                        <option value="">Select a Data Element</option>
                        {dataElements.map(dataElement => (
                            <option key={dataElement.id} value={dataElement.id}>{dataElement.displayName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="trackedEntity">Tracked Entity Attribute:</label>
                    <select id="trackedEntity" name="trackedEntity" value={programRule.trackedEntity} onChange={handleChange}>
                        <option value="">Select a Tracked Entity Attribute</option>
                        {trackedEntityAttributes.map(trackedEntityAttribute => (
                            <option key={trackedEntityAttribute.id} value={trackedEntityAttribute.id}>{trackedEntityAttribute.displayName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="function">Functions:</label>
                    <select id="function" name="function" value={selectedFunction} onChange={handleChange}>
                        <option value="">Select a function</option>
                        <option value="d2:daysBetween()">d2:daysBetween()</option>
                        <option value="d2:count()">d2:count()</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="variable">Variables:</label>
                    <select id="variable" name="variable" onChange={handleChange}>
                        <option value="">Select a variable</option>
                        {variables.map(variable => (
                            <option key={variable.id} value={variable.id}>{variable.displayName}</option>
                        ))}
                    </select>
                </div>
                <Button variant="contained" color="primary" type="submit" disabled={mutationLoading}>
                    {mutationLoading ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
            <Button variant="outlined" color="primary" onClick={handleOpen}>
                Syntax Help
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={isDialogOpen}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Syntax Help"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here is some help on writing the correct syntax for your condition...
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProgramRulesForm;
