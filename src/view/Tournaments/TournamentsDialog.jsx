import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Autocomplete, Avatar, Grid, TextField } from '@mui/material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { convertDate } from 'src/AppFunction';
import { addTournaments, updateTournaments } from './TournamentsServices';
import { CODE } from 'src/AppConst';
import { toast } from 'react-toastify';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function TournamentsDialog(props) {
    let {
        open,
        handleClose,
        item,
        updatePageData
    } = props;

    const [dataState, setDataState] = React.useState({});

    const validateSubmit = () => {
        return true;
    }
    const convertData = (value) => {
        return {
            tournamentsName: value?.tournamentsName,
            startDate: value?.startDate,
            endDate: value?.endDate,
            IDTournaments: value?.IDTournaments,
        }
    }

    const handleSubmit = async () => {
        try {
            if (!validateSubmit()) return;
            if (item?.IDTournaments) {
                const data = await updateTournaments(convertData({ ...dataState }));
                if (data?.status === CODE.SUCCESS) {
                    toast.success("Update tournament success");
                }
            } else {
                const data = await addTournaments({ ...dataState });
                if (data?.status === CODE.SUCCESS) {
                    toast.success("Add tournament success");
                }
            }
            handleClose();
            updatePageData();
        } catch (error) {
            console.log(error)
        }
    }

    const handleSetData = (value, name) => {
        setDataState((pre) => ({ ...pre, [name]: value }));
    }



    React.useEffect(() => {
        setDataState({
            ...item,
            startDate: convertDate(item?.startDate),
            endDate: convertDate(item?.endDate),
        });
    }, []);

    return (
        <BootstrapDialog
            maxWidth="lg"
            minWidth="lg"
            width="lg"
            onClose={handleClose}
            fullWidth
            open={open}
        >
            <ValidatorForm onSubmit={handleSubmit}>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Add new/Update tournaments
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Tournaments name'}
                                className='w-100'
                                type="text"
                                name="tournamentsName"
                                value={dataState?.tournamentsName}
                                onChange={(event) => handleSetData(event.target.value, "tournamentsName")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Start date'}
                                className='w-100'
                                type='date'
                                name="startDate"
                                value={dataState?.startDate || new Date()}
                                onChange={(event) => handleSetData(event.target.value, "startDate")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'End date'}
                                className='w-100'
                                type='date'
                                name="endDate"
                                value={dataState?.endDate || new Date()}
                                onChange={(event) => handleSetData(event.target.value, "endDate")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        Save
                    </Button>
                </DialogActions>
            </ValidatorForm>
        </BootstrapDialog>
    );
}