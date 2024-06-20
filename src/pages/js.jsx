import React, { useState, useEffect } from 'react';
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime';
import { Link, useParams } from 'react-router-dom';
import './ProgramRulesForm.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const EditProgramRule = () => {
    const { ruleId } = useParams(); // Assuming the rule ID is passed as a URL parameter
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

    const programRuleQuery = {
        programRule: {
            resource: `programRules/${ruleId}`,
            params: {
                fields: [
                    'id',
                    'name',
                    'priority',
                    'description',
                    'condition',
                    'program[id]',
                    'programRuleActions[data,content,programRuleActionType,trackedEntityAttribute[id],dataElement[id]]'
                ],
            },
        },
    };

    const { loading: loadingProgramRule, error: errorProgramRule, data: dataProgramRule } = useDataQuery(programRuleQuery);

    useEffect(() => {
        if (!loadingProgramRule && !errorProgramRule && dataProgramRule) {
            const fetchedProgramRule = dataProgramRule.programRule;
            setProgramRule({
                program: fetchedProgramRule.program.id,
                name: fetchedProgramRule.name,
                priority: fetchedProgramRule.priority,
                description: fetchedProgramRule.description,
                condition: fetchedProgramRule.condition,
                actionType: fetchedProgramRule.programRuleActions[0]?.programRuleActionType || '',
                actionData: fetchedProgramRule.programRuleActions[0]?.data || '',
                actionContent: fetchedProgramRule.programRuleActions[0]?.content || '',
                trackedEntity: fetchedProgramRule.programRuleActions[0]?.trackedEntityAttribute?.id || '',
                dataElement: fetchedProgramRule.programRuleActions[0]?.dataElement?.id || ''
            });
            setCondition(fetchedProgramRule.condition);
            setSelectedTrackedEntityId(fetchedProgramRule.programRuleActions[0]?.trackedEntityAttribute?.id || '');
            setSelectedDataElementId(fetchedProgramRule.programRuleActions[0]?.dataElement?.id || '');
        }
    }, [loadingProgramRule, errorProgramRule, dataProgramRule]);

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

    const editProgramRuleMutation = {
        resource: 'metadata',
        type: 'update',
        data: (payload) => payload,
    };

    const [mutate] = useDataMutation(editProgramRuleMutation);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSyntaxCorrect !== 2) {
            alert('Please fix the syntax errors in the condition.');
            return;
        }
    
        try {
            setMutationLoading(true);
    
            const payload = {
                programRules: [
                    {
                        id: ruleId,
                        description: programRule.description,
                        priority: programRule.priority,
                        condition: programRule.condition,
                        name: programRule.name,
                        program: { id: programRule.program },
                        programRuleActions: [
                            {
                                data: programRule.actionData,
                                content: programRule.actionContent,
                                programRuleActionType: programRule.actionType,
                                trackedEntityAttribute: selectedTrackedEntityId
                                    ? { id: selectedTrackedEntityId }
                                    : undefined,
                                dataElement: selectedDataElementId
                                    ? { id: selectedDataElementId }
                                    : undefined,
                            },
                        ],
                    },
                ],
            };
    
            await mutate(payload);
    
            setIsDialogOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setMutationLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        // Redirect to the list of program rules
        window.location.href = '/program-rules';
    };

    if (loadingPrograms || loadingVariables || loadingDataElements || loadingTrackedEntityAttributes || loadingProgramRule) {
        return <div>Loading...</div>;
    }

    if (errorPrograms || errorVariables || errorDataElements || errorTrackedEntityAttributes || errorProgramRule) {
        return <div>Error: {errorPrograms?.message || errorVariables?.message || errorDataElements?.message || errorTrackedEntityAttributes?.message || errorProgramRule?.message}</div>;
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <label>
                    Program:
                    <select name="program" value={programRule.program} onChange={handleChange} required>
                        <option value="">Select Program</option>
                        {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                                {program.displayName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={programRule.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Priority:
                    <input
                        type="number"
                        name="priority"
                        value={programRule.priority}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={programRule.description}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Condition:
                    <textarea
                        name="condition"
                        value={condition}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div className={`syntax-status ${isSyntaxCorrect === 2 ? 'correct' : 'incorrect'}`}>
                    {isSyntaxCorrect === 2 && 'Syntax is correct'}
                    {isSyntaxCorrect === 1 && 'Syntax is incorrect'}
                    {isSyntaxCorrect === 3 && 'Expression is empty'}
                </div>
                <label>
                    Action Type:
                    <input
                        type="text"
                        name="actionType"
                        value={programRule.actionType}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Action Data:
                    <input
                        type="text"
                        name="actionData"
                        value={programRule.actionData}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Action Content:
                    <input
                        type="text"
                        name="actionContent"
                        value={programRule.actionContent}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Data Element:
                    <select
                        name="dataElement"
                        value={selectedDataElementId}
                        onChange={handleChange}
                    >
                        <option value="">Select Data Element</option>
                        {dataElements.map((dataElement) => (
                            <option key={dataElement.id} value={dataElement.id}>
                                {dataElement.displayName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Tracked Entity Attribute:
                    <select
                        name="trackedEntity"
                        value={selectedTrackedEntityId}
                        onChange={handleChange}
                    >
                        <option value="">Select Tracked Entity Attribute</option>
                        {trackedEntityAttributes.map((trackedEntity) => (
                            <option key={trackedEntity.id} value={trackedEntity.id}>
                                {trackedEntity.displayName}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit" disabled={mutationLoading}>
                    {mutationLoading ? 'Submitting...' : 'Submit'}
                </button>
            </form>

            <Dialog
                fullScreen={fullScreen}
                open={isDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Program Rule"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Program rule has been successfully updated!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseDialog}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditProgramRule;
