// src/DropdownDialog.js
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const DropdownDialog = () => {
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [field1, setField1] = useState("");
    const [field2, setField2] = useState("");
    const [field3, setField3] = useState("");
    const [field4, setField4] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOptionSelect = (event) => {
        setSelectedOption(event.target.value);
        // Reset fields when a new option is selected
        setField1("");
        setField2("");
        setField3("");
        setField4("");
    };

    const handleValidation = () => {
        // Handle validation logic here
        console.log("Validation logic here...");
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleOpen}>
                {selectedOption ? `Selected: ${selectedOption}` : "Select an Option"}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="select-option-dialog-title"
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
                        <MenuItem value="Option 2">Option 2</MenuItem>
                        <MenuItem value="Option 3">Option 3</MenuItem>
                    </Select>
                    {selectedOption === "Show Warning" && (
                        <div>
                            <TextField
                                label="Data element to display warning next to"
                                value={field1}
                                onChange={(e) => setField1(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Tracked entity attribute to display warning next to"
                                value={field2}
                                onChange={(e) => setField2(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Static text"
                                value={field3}
                                onChange={(e) => setField3(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleValidation} color="primary">
                        Validate
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DropdownDialog;
