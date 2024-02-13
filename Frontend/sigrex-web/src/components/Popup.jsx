import { Button, Dialog, DialogContent, DialogTitle, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import ActionButton from "../reusable/ActionButton";
import CancelIcon from '@mui/icons-material/Cancel';

const useStyles = makeStyles(theme => ({
  dialogWrapper: {
    padding: theme.spacing(5),
  },
}));

export default function Popup({ title, children, openPopup, setOpenPopup }) {
  const classes = useStyles();

  return (
    <Dialog open={openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper }}>
      <DialogTitle>
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <ActionButton
            color="primary"
            onClick={() => setOpenPopup(false)}
            aria-label="Close"
          >
            <CancelIcon />
          </ActionButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
