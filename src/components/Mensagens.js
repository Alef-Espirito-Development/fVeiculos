// src/components/Message.js
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Message = ({ open, handleClose, message, type }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Message;
