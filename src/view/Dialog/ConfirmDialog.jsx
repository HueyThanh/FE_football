import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ConfirmDialog(props) {
    let {
        open, 
        handleClose,
        handleOk,
        text
    } = props;
    
    return (
        <BootstrapDialog
            maxWidth="sm"
            minWidth="sm"
            width="sm" 
            onClose={handleClose}
            fullWidth
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Confirm delete dialog !!!
            </DialogTitle>
            <DialogContent dividers>
                {text}
            </DialogContent>
            <DialogActions>
            <Button  variant="contained" onClick={handleClose} color="error">
                Cancel
            </Button>
            <Button  variant="contained" onClick={handleOk}>
                Save
            </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}