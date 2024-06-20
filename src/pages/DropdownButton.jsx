import React, { useState, useEffect } from 'react';
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime';
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
import './ProgramRulesForm.css';

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

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedDataElement, setSelectedDataElement] = useState("");
    const [field1, setField1] = useState("");
    const [field2, setField2] = useState("");
    const [field3, setField3] = useState("");
    const [dataElements, setDataElements] = useState([]);
    const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);
    const [concatenatedString, setConcatenatedString] = useState('');

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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOptionSelect = (event) => {
        setSelectedOption(event.target.value);
        setField1("");
        setField2("");
        setField3("");
        setSelectedDataElement("");
    };

    const handleDataElementSelect = (event) => {
        const selectedElementId = event.target.value;
        const selectedElement = dataElements.find(element => element.id === selectedElementId);
        if (selectedElement) {
            setField1(selectedElement.id);
            setSelectedDataElement(selectedElement.displayName);
        }
    };

    const handleValidationn = () => {
        let concatString = selectedOption;
        if (["Show Warning", "Show error", "Make field mandatory"].includes(selectedOption)) {
            if (field1) {
                const selectedElement = dataElements.find(element => element.id === field1);
                if (selectedElement) concatString += `: on "${selectedElement.displayName}"`;
            }
            if (field2) {
                const selectedAttribute = trackedEntityAttributes.find(attribute => attribute.id === field2);
                if (selectedAttribute) concatString += ` - ${selectedAttribute.displayName}`;
            }
            if (field3) concatString += ` - ${field3}`;
        }
        setConcatenatedString(concatString);
        setOpen(false);
    };

    const [selectedFunction, setSelectedFunction] = useState('');
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
                        programRuleActions: programRule.actionType
                            ? [
                                {
                                    id: newProgramRuleActionId,
                                    programRuleActionType: programRule.actionType,
                                    data: programRule.actionData,
                                    content: 'n',
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

    const handleDialogClose = () => setIsDialogOpen(false);

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
            {/* Form fields and UI elements here */}
            <TextField
                name="name"
                label="Name"
                value={programRule.name}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                name="priority"
                label="Priority"
                value={programRule.priority}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                name="description"
                label="Description"
                value={programRule.description}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                name="condition"
                label="Condition"
                value={programRule.condition}
                onChange={handleChange}
                fullWidth
            />
            <Button onClick={handleOpen}>Add Program Rule Action</Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Option</DialogTitle>
                <DialogContent>
                    <DialogContentText>Select an option:</DialogContentText>
                    <Select
                        value={selectedOption}
                        onChange={handleOptionSelect}
                        fullWidth
                    >
                        <MenuItem value="Show Warning">Show Warning</MenuItem>
                        <MenuItem value="Show error">Show error</MenuItem>
                        <MenuItem value="Make field mandatory">Make field mandatory</MenuItem>
                    </Select>
                    <Select
                        value={field1}
                        onChange={handleDataElementSelect}
                        fullWidth
                    >
                        {dataElements.map((element) => (
                            <MenuItem key={element.id} value={element.id}>
                                {element.displayName}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Static Text"
                        value={field3}
                        onChange={(e) => setField3(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleValidationn} color="primary">
                        OK
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Validation</DialogTitle>
                <DialogContent>
                    <DialogContentText>{getSyntaxMessage()}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Button type="submit" disabled={mutationLoading} variant="contained" color="primary">
                Save
            </Button>
        </form>
    );
};

export default ProgramRulesForm;
