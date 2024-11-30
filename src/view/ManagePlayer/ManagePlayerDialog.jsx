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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CODE, OBJECT_POSITION, POSITION, TYPE_MATCH } from 'src/AppConst';
import { convertDate, filterOptions } from 'src/AppFunction';
import { addPlayer, updateImagePlayer, updatePlayer } from './ManagePlayerServices';
import { getAllTeam } from '../ManageTeam/ManageTeamServices';
import { toast } from 'react-toastify';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function ManagePlayerDialog(props) {
    let {
        open,
        handleClose,
        item,
        updatePageData
    } = props;

    const [dataState, setDataState] = React.useState({});
    const [listTeam, setListTeam] = React.useState([]);
    const [updatedImage, setUpdatedImage] = React.useState("");
    const [imageData, setImageData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const validateSubmit = () => {
        return true;
    }

    const convertDto = (value) => {
        return {
            dateOfBirth: value?.dateOfBirth,
            contractStartDate: value?.contractStartDate,
            contractEndDate: value?.contractEndDate,
            fullName: value?.fullName,
            country: value?.country,
            position: value?.position?.name,
            jerseyNumber: value?.jerseyNumber,
            height: value?.height,
            weight: value?.weight,
            email: value?.email,
            phone: value?.phone,
            idteam: value?.team?.idteam,
            idplayer: value?.idplayer,
            photo: value?.photo,
        }
    }

    const handleUpload = async () => {
        try {
            if (updatedImage) {
                let formData = new FormData();
                formData.append('IDPlayer', item?.idplayer);
                formData.append('avatar', updatedImage);
                const data = await updateImagePlayer(formData);
                return data;
            }
        } catch (error) {
            console.log(error);
            throw error; // Ném lỗi để xử lý ở hàm handleSubmit
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            if (!validateSubmit()) return;
            if (item?.idplayer) {
                const data = await updatePlayer(convertDto({ ...dataState }));
                const uploadResult = await handleUpload();
                if (data?.status === CODE.SUCCESS) {
                    toast.success("Update player success");
                }
            } else {
                const data = await addPlayer(convertDto({ ...dataState }));
                if (data?.status === CODE.SUCCESS) {
                    toast.success("Add player success");
                }
            }
            handleClose();
            updatePageData();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }


    const handleSetData = (value, name) => {
        setDataState((pre) => ({ ...pre, [name]: value }));
    }

    const handleImageChange = (e) => {
        const newImage = e.target.files[0];
        if (newImage) {
            setUpdatedImage(newImage);
            const reader = new FileReader();
            reader.onload = () => {
                setImageData(reader.result);
            };
            reader.readAsDataURL(newImage);
        }
    };

    const getListTeam = async () => {
        try {
            const data = await getAllTeam();
            if (data?.status == CODE.SUCCESS) {
                setListTeam(data?.data)
            }
        } catch (error) {

        }
    }

    const getPosition = (value) => {
        switch (value) {
            case OBJECT_POSITION.Goalkeeper.name:
                return OBJECT_POSITION.Goalkeeper;
            case OBJECT_POSITION.Wing.name:
                return OBJECT_POSITION.Wing;
            case OBJECT_POSITION.Full.name:
                return OBJECT_POSITION.Full;
            case OBJECT_POSITION.Sweeper.name:
                return OBJECT_POSITION.Sweeper;
            case OBJECT_POSITION.Center.name:
                return OBJECT_POSITION.Center;
            case OBJECT_POSITION.Defensive.name:
                return OBJECT_POSITION.Defensive;
            case OBJECT_POSITION.Winger.name:
                return OBJECT_POSITION.Winger;
            case OBJECT_POSITION.CenterMid.name:
                return OBJECT_POSITION.CenterMid;
            case OBJECT_POSITION.Striker.name:
                return OBJECT_POSITION.Striker;
            case OBJECT_POSITION.Attacking.name:
                return OBJECT_POSITION.Attacking;
            case OBJECT_POSITION.Forward.name:
                return OBJECT_POSITION.Forward;
            default:
                return OBJECT_POSITION.Goalkeeper;
        }
    };

    React.useEffect(() => {
        setDataState({
            ...item,
            dateOfBirth: convertDate(item?.dateOfBirth),
            contractStartDate: convertDate(item?.contractStartDate),
            contractEndDate: convertDate(item?.contractEndDate),
            position: getPosition(item?.position)
        });
        setImageData(item?.photo)
        getListTeam();
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
                    Add new/Update players
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container justifyContent={"center"} textAlign={"center"} spacing={2} sx={{ mb: 4, mt: 1 }}>
                        <Box>
                            <Avatar
                                style={{ width: 150, height: 150 }}
                                sizes="large"
                                variant="rounded"
                                src={imageData}
                            />
                            <TextField
                                type="file"
                                id="avataImage"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            <Button variant="contained" size='small' sx={{ mt: 2 }}><label for="avataImage">Upload image</label></Button>
                        </Box>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Full name'}
                                className='w-100'
                                type="text"
                                name="fullName"
                                value={dataState?.fullName}
                                onChange={(event) => handleSetData(event.target.value, "fullName")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Country'}
                                className='w-100'
                                type="text"
                                name="country"
                                value={dataState?.country}
                                onChange={(event) => handleSetData(event.target.value, "country")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <Autocomplete
                                className="mt-3"
                                id="combo-box"
                                fullWidth
                                options={POSITION}
                                onChange={(event, value) => handleSetData(value, "position")}
                                value={dataState?.position
                                    || null}
                                getOptionLabel={(option) => option.name || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Position"
                                        value={dataState?.position || ""}
                                    />
                                )}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <Autocomplete
                                className="mt-3"
                                id="combo-box"
                                fullWidth
                                options={listTeam}
                                onChange={(event, value) => handleSetData(value, "team")}
                                value={dataState?.team
                                    || null}
                                getOptionLabel={(option) => option.teamName || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Team"
                                        value={dataState?.team || ""}
                                    />
                                )}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Jersey number'}
                                className='w-100'
                                type="text"
                                name="jerseyNumber"
                                value={dataState?.jerseyNumber}
                                onChange={(event) => handleSetData(event.target.value, "jerseyNumber")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Date of birth'}
                                className='w-100'
                                type='date'
                                name="dateOfBirth"
                                value={dataState?.dateOfBirth || new Date()}
                                onChange={(event) => handleSetData(event.target.value, "dateOfBirth")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Contract start date'}
                                className='w-100'
                                type='date'
                                name="contractStartDate"
                                value={dataState?.contractStartDate || new Date()}
                                onChange={(event) => handleSetData(event.target.value, "contractStartDate")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Contract end date'}
                                className='w-100'
                                type='date'
                                value={dataState?.contractEndDate || new Date()}
                                onChange={(event) => handleSetData(event.target.value, "contractEndDate")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Height'}
                                className='w-100'
                                type="text"
                                name="height"
                                value={dataState?.height}
                                onChange={(event) => handleSetData(event.target.value, "height")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Weight'}
                                className='w-100'
                                type="text"
                                name="weight"
                                value={dataState?.weight}
                                onChange={(event) => handleSetData(event.target.value, "weight")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Email'}
                                className='w-100'
                                type="text"
                                name="email"
                                value={dataState?.email}
                                onChange={(event) => handleSetData(event.target.value, "email")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Phone'}
                                className='w-100'
                                type="text"
                                name="phone"
                                value={dataState?.phone}
                                onChange={(event) => handleSetData(event.target.value, "phone")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <LoadingButton variant="contained" type="submit" loading={loading}>
                        Save
                    </LoadingButton>
                </DialogActions>
            </ValidatorForm>
        </BootstrapDialog>
    );
}