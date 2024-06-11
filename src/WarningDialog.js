// WarningDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

const WarningDialog = ({ open, onClose, onSave }) => {
  const [warningTitle, setWarningTitle] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const handleSave = () => {
    onSave(warningTitle, warningMessage);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter Warning Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Warning Title"
          type="text"
          fullWidth
          value={warningTitle}
          onChange={(e) => setWarningTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Warning Message"
          type="text"
          fullWidth
          value={warningMessage}
          onChange={(e) => setWarningMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningDialog;
