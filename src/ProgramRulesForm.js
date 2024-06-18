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


// import React, { useState, useEffect } from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
// import { useDataQuery } from '@dhis2/app-runtime';


// import DropdownButton from './DropdownButton';

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
    const [selectedDataElement, setSelectedDataElement] = useState(""); // State to hold selected data element name after commit
    const [field1, setField1] = useState(""); // For selected action or data element id
    const [field2, setField2] = useState(""); // For selected tracked entity attribute id
    const [field3, setField3] = useState(""); // For static text input
    const [dataElements, setDataElements] = useState([]);
    const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);
    const [concatenatedString, setConcatenatedString] = useState(''); // State for concatenated string
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

    const handleOptionSelect = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        // Reset fields when a new option is selected
        setField1(""); // Reset selected data element or action id
        setField2(""); // Reset selected tracked entity attribute id
        setField3(""); // Reset static text
        setSelectedDataElement(""); // Reset selectedDataElement state
        setConcatenatedString(""); // Reset concatenated string state
    };

    const handleDataElementSelect = (event) => {
        const selectedElementId = event.target.value;
        const selectedElement = dataElements.find(element => element.id === selectedElementId);
        if (selectedElement) {
            setField1(selectedElement.id); // Set selected data element id
            setSelectedDataElement(selectedElement.displayName); // Set selected data element name to display after commit
        }
    };

    const handleValidationn = () => {
        // Create the concatenated string based on the selected options
        let concatString = selectedOption;
        if (selectedOption === "Show Warning" || selectedOption === "Show error") {
            if (field1) {
                const selectedElement = dataElements.find(element => element.id === field1);
                if (selectedElement) {
                    concatString += `: on " ${selectedElement.displayName}"`;
                }
            }
            if (field2) {
                const selectedAttribute = trackedEntityAttributes.find(attribute => attribute.id === field2);
                if (selectedAttribute) {
                    concatString += ` - ${selectedAttribute.displayName}`;
                }
            }
            if (field3) {
                concatString += ` - ${field3}`;
            }
        } else if (selectedOption === "Make field mandatory") {
            if (field1) {
                const selectedElement = dataElements.find(element => element.id === field1);
                if (selectedElement) {
                    concatString += `: on " ${selectedElement.displayName}"`;
                }
            }
            if (field2) {
                const selectedAttribute = trackedEntityAttributes.find(attribute => attribute.id === field2);
                if (selectedAttribute) {
                    concatString += ` - ${selectedAttribute.displayName}`;
                }
            }
        }
        
        setConcatenatedString(concatString);
        setOpen(false);
    };

















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


  const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleValidation = () => {
        setIsDialogOpen(false);
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
            const response = await fetch('http://localhost:8081/api/system/id', {
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

            alert('Program rule saved successfully!');
        } catch (error) {
            console.error('Error saving program rule:', error);
            alert('Failed to save program rule');
        } finally {
            setMutationLoading(false);
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
                <div className="form-group">
                    <label>Condition</label>
                    <input className="form-input" type="text" name="condition" value={programRule.condition} onChange={handleChange} placeholder="Condition" />
                </div>
                <div className="form-group">

                    


                    <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1px' }}>
                <h4>Action details</h4>
                <Button 
                    style={{ backgroundColor: 'lightblue', padding: '10px', margin: '1px', borderRadius: '50%', marginBlock: '1px' }} 
                    variant="outlined" 
                    onClick={handleOpen}>
                    +
                </Button>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="select-option-dialog-title"
                PaperProps={{
                    style: {
                        minWidth: '80%', // Adjust the width as needed
                        minHeight: '40px', // Adjust the height as needed
                    },
                }}
            >
                <DialogTitle id="select-option-dialog-title">Define program rule action</DialogTitle>
                <DialogContent>
                    <Select
                        value={selectedOption}
                        onChange={handleOptionSelect}
                        fullWidth
                    >
                        <MenuItem value="">-- Select --</MenuItem>
                        <MenuItem value="Show Warning">Show Warning</MenuItem>
                        <MenuItem value="Make field mandatory">Make field mandatory</MenuItem>
                        <MenuItem value="Show error">Show error</MenuItem>
                    </Select>
                    {(selectedOption === "Show Warning" || selectedOption === "Show error") && (
                        <div>
                            <TextField
                                select
                                label="Data element to display warning next to"
                                value={field1}
                                onChange={handleDataElementSelect}
                                fullWidth
                                margin="normal"
                            >
                                {dataElements.map((element) => (
                                    <MenuItem key={element.id} value={element.id}>
                                        {element.displayName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Tracked entity attribute to display warning next to"
                                value={field2}
                                onChange={(e) => setField2(e.target.value)}
                                fullWidth
                                margin="normal"
                            >
                                {trackedEntityAttributes.map((attribute) => (
                                    <MenuItem key={attribute.id} value={attribute.id}>
                                        {attribute.displayName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Static text"
                                value={field3}
                                onChange={(e) => setField3(e.target.value)}
                                fullWidth
                                margin="normal"
                                defaultValue="Enter static text"
                            />
                        </div>
                    )}
                    {selectedOption === "Make field mandatory" && (
                        <div>
                            <TextField
                                select
                                label="Data element to make mandatory"
                                value={field1}
                                onChange={handleDataElementSelect}
                                fullWidth
                                margin="normal"
                            >
                                {dataElements.map((element) => (
                                    <MenuItem key={element.id} value={element.id}>
                                        {element.displayName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Tracked entity attribute to make mandatory"
                                value={field2}
                                onChange={(e) => setField2(e.target.value)}
                                fullWidth
                                margin="normal"
                            >
                                {trackedEntityAttributes.map((attribute) => (
                                    <MenuItem key={attribute.id} value={attribute.id}>
                                        {attribute.displayName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleValidationn} color="primary">
                        COMMIT
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>
            {concatenatedString && (
                <div style={{ margin: '10px' }}>
                    <TextField
                        label="Selected Action"
                        value={concatenatedString}
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </div>
            )}
        </div>






                </div>
             
                <Button type="submit" variant="contained" color="primary" disabled={mutationLoading}>
                    {mutationLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
            <Dialog
                // fullScreen={fullScreen}
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
