import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useDataQuery } from '@dhis2/app-runtime';

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

const DropdownDialog = () => {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedDataElement, setSelectedDataElement] = useState(""); // State to hold selected data element name after commit
    const [field1, setField1] = useState(""); // For selected action or data element id
    const [field2, setField2] = useState(""); // For selected tracked entity attribute id
    const [field3, setField3] = useState(""); // For static text input
    const [dataElements, setDataElements] = useState([]);
    const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);
    const [concatenatedString, setConcatenatedString] = useState(''); // State for concatenated string
    const [visibleFields, setVisibleFields] = useState({});
    const [mandatoryFields, setMandatoryFields] = useState({});

    const { loading: loadingDataElements, error: errorDataElements, data: dataDataElements } = useDataQuery(dataElementQuery);
    const { loading: loadingTrackedEntityAttributes, error: errorTrackedEntityAttributes, data: dataDataAttributes } = useDataQuery(trackedEntityAttributeQuery);

    useEffect(() => {
        if (!loadingDataElements && !errorDataElements && dataDataElements) {
            setDataElements(dataDataElements.dataElements || []);
        }
    }, [loadingDataElements, errorDataElements, dataDataElements]);

    useEffect(() => {
        if (!loadingTrackedEntityAttributes && !errorTrackedEntityAttributes && dataDataAttributes) {
            setTrackedEntityAttributes(dataDataAttributes.trackedEntityAttributes || []);
        }
    }, [loadingTrackedEntityAttributes, errorTrackedEntityAttributes, dataDataAttributes]);

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
                    concatString += `: on "${selectedElement.displayName}"`;
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
                    concatString += `: on "${selectedElement.displayName}"`;
                }
            }
            if (field2) {
                const selectedAttribute = trackedEntityAttributes.find(attribute => attribute.id === field2);
                if (selectedAttribute) {
                    concatString += ` - ${selectedAttribute.displayName}`;
                }
            }
        }

        // Apply actions based on the selected option
        applyActions(selectedOption, field1, field2, field3);

        setConcatenatedString(concatString);
        setOpen(false);
    };

    const applyActions = (option, dataElementId, attributeId, staticText) => {
        // Here we will manipulate the DOM based on the selected option
        switch (option) {
            case "Show Warning":
            case "Show error":
                setVisibleFields(prev => ({
                    ...prev,
                    [dataElementId]: true,
                    [attributeId]: true
                }));
                break;
            case "Make field mandatory":
                setMandatoryFields(prev => ({
                    ...prev,
                    [dataElementId]: true,
                    [attributeId]: true
                }));
                break;
            default:
                break;
        }
    };

    return (
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
                                {dataElements?.map((element) => (
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
                                {trackedEntityAttributes?.map((attribute) => (
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
                                {dataElements?.map((element) => (
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
                                {trackedEntityAttributes?.map((attribute) => (
                                    <MenuItem key={attribute.id} value={attribute.id}>
                                        {attribute.displayName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleValidationn} color="primary">
                        Commit
                    </Button>
                </DialogActions>
            </Dialog>
            {concatenatedString && (
                <div>
                    <h5>Action Summary:</h5>
                    <p>{concatenatedString}</p>
                </div>
            )}
            {dataElements.map((element) => (
                <div key={element.id}>
                    {visibleFields[element.id] && (
                        <TextField
                            label={element.displayName}
                            required={mandatoryFields[element.id] || false}
                            fullWidth
                            margin="normal"
                        />
                    )}
                </div>
            ))}
            {trackedEntityAttributes.map((attribute) => (
                <div key={attribute.id}>
                    {visibleFields[attribute.id] && (
                        <TextField
                            label={attribute.displayName}
                            required={mandatoryFields[attribute.id] || false}
                            fullWidth
                            margin="normal"
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default DropdownDialog;
