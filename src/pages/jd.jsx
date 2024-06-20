import React, { useState, useEffect } from 'react';
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime';
import { Link } from 'react-router-dom';
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
        actionContent:'',
        trackedEntity: '',
        dataElement: ''
    });

    const [selectedDataElementId, setSelectedDataElementId] = useState('');
    const [selectedTrackedEntityId, setSelectedTrackedEntityId] = useState('');
    const [selectedOption, setSelectedOption] = useState("");
    const [open, setOpen] = useState(false);
    const [mutationLoading, setMutationLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dataElements, setDataElements] = useState([]);
    const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [variables, setVariables] = useState([]);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProgramRule({ ...programRule, [name]: value });

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
                    'Authorization': `Basic ${btoa('admin:district')}`
                }
            });
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
            do {
                id2 = await fetchNewId();
            } while (id1 === id2);
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
        if (!programRule.program || !programRule.name) {
            alert('Please fill all required fields.');
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
                                    id: selectedTrackedEntityId,
                                },
                                programRule: {
                                    id: newProgramRuleId,
                                },
                                dataElement: {
                                    id: selectedDataElementId,
                                },
                            },
                        ],
                    },
                ],
                programRuleActions: [
                    {
                        id: newProgramRuleActionId,
                        data: programRule.actionData,
                        content: programRule.actionContent,
                        programRuleActionType: programRule.actionType,
                        trackedEntityAttribute: {
                            id: selectedTrackedEntityId,
                        },
                        programRule: {
                            id: newProgramRuleId,
                        },
                        dataElement: {
                            id: selectedDataElementId,
                        },
                    },
                ]
            };

            await mutate(payload);
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

                <h4 className='section2'><span className="circle">2</span> Select data elements or attributes</h4>
                <div className="form-group">
                    <label>Select Option:</label>
                    <Select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="dataElement">Data Element</MenuItem>
                        <MenuItem value="trackedEntity">Tracked Entity</MenuItem>
                    </Select>
                </div>

                {selectedOption === "dataElement" && (
                    <div className="form-group">
                        <label>Data Element</label>
                        <select className="form-input" name="dataElement" value={programRule.dataElement} onChange={handleChange}>
                            <option value="">Select Data Element</option>
                            {dataElements.map(dataElement => (
                                <option key={dataElement.id} value={dataElement.id}>{dataElement.displayName}</option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedOption === "trackedEntity" && (
                    <div className="form-group">
                        <label>Tracked Entity Attribute</label>
                        <select className="form-input" name="trackedEntity" value={programRule.trackedEntity} onChange={handleChange}>
                            <option value="">Select Tracked Entity Attribute</option>
                            {trackedEntityAttributes.map(attribute => (
                                <option key={attribute.id} value={attribute.id}>{attribute.displayName}</option>
                            ))}
                        </select>
                    </div>
                )}

                <h4 className='section3'><span className="circle">3</span> Add program rule action</h4>
                <div className="form-group">
                    <label>Action Type</label>
                    <TextField fullWidth name="actionType" value={programRule.actionType} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Action Data</label>
                    <TextField fullWidth name="actionData" value={programRule.actionData} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Action Content</label>
                    <TextField fullWidth name="actionContent" value={programRule.actionContent} onChange={handleChange} />
                </div>

                <div className="button-container">
                    <Link to="/" className="cancel-link">Cancel</Link>
                    <button className="submit-button" type="submit" disabled={mutationLoading}>{mutationLoading ? 'Saving...' : 'Save'}</button>
                </div>
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={isDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Program rule saved successfully"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The program rule was saved successfully. You can now use it in your application.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default ProgramRulesForm;
