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

const DropdownButton = () => {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedDataElement, setSelectedDataElement] = useState(""); // State to hold selected data element name after commit
    const [field1, setField1] = useState(""); // For selected action or data element id
    const [field2, setField2] = useState(""); // For selected tracked entity attribute id
    const [field3, setField3] = useState(""); // For static text input
    const [dataElements, setDataElements] = useState([]);
    const [trackedEntityAttributes, setTrackedEntityAttributes] = useState([]);

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
    };

    const handleDataElementSelect = (event) => {
        const selectedElementId = event.target.value;
        const selectedElement = dataElements.find(element => element.id === selectedElementId);
        if (selectedElement) {
            setField1(selectedElement.id); // Set selected data element id
            setSelectedDataElement(selectedElement.displayName); // Set selected data element name to display after commit
        }
    };

    const handleValidation = () => {
        // Handle validation logic here
        console.log("Validation logic here...");
        setOpen(false);
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
                        <MenuItem value="Option 2">Make field mandatory</MenuItem>
                        <MenuItem value="Option 3">Show error</MenuItem>
                    </Select>
                    {(selectedOption === "Show Warning" || selectedOption === "Option 3") && (
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
                    {selectedOption === "Option 2" && (
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
                    <Button onClick={handleValidation} color="primary">
                        COMMIT
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>
            {selectedDataElement && (
                <div style={{ margin: '10px' }}>
                    <TextField
                        label="Selected Data Element"
                        value={selectedDataElement}
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default DropdownButton;