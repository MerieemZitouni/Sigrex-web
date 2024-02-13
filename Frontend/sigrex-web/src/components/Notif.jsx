import Alert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';
import React from 'react';

export default function Notif(props) {
  const { notify, setNotify } = props;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotify({ ...notify, isOpen: false });
  };

  return (
    <Snackbar
      key={notify.key}  // Add key prop
      open={notify.isOpen}
      autoHideDuration={6000}
      onClose={handleClose}  // Move the onClose handling to Snackbar
    >
      <Alert severity={notify.type} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  );
}
