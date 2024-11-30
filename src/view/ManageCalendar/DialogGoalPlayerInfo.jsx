import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Autocomplete, Grid } from '@mui/material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { convertDate, filterOptions } from 'src/AppFunction';
import { CODE, OBJECT_STATUS_MATCH, STATUS_MATCH, TYPE_MATCH } from 'src/AppConst';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getAllTeam } from '../ManageTeam/ManageTeamServices';
import { addGoal, addMatch, updateMatch } from './ManageCalendarServices';
import { getAllTournaments } from '../Tournaments/TournamentsServices';
import { getAllPlayer } from '../ManagePlayer/ManagePlayerServices';
import { toast } from "react-toastify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function DialogGoalPlayerInfo(props) {
    let {
        open,
        handleClose,
        item,
        updatePageData
    } = props;
    const [dataState, setDataState] = React.useState({});
    const [listTeam, setListTeam] = React.useState([]);
    const [listPlayer, setListPlayer] = React.useState([]);

    const [hour, setHour] = React.useState(0);
    const [minute, setMinute] = React.useState(0);
    const [second, setSecond] = React.useState(0);

    const validateSubmit = () => {
        if (!dataState?.team?.idteam) {
            toast.warning("Please chose team");
            return false;
        }
        if (!dataState?.player?.idplayer) {
            toast.warning("Please chose player");
            return false;
        }
        if (dataState?.second <= 0) {
            toast.warning("Please type second");
            return false;
        }
        return true;
    }

    const formatTime = (time) => {
        return time < 10 ? '0' + time : time;
    };

    const convertData = (value) => {
        return {
            idmatch: value?.idmatch,
            idplayer: value?.player?.idplayer,
            idteam: value?.team?.idteam,
            goal_time: `${formatTime(hour)}:${formatTime(minute)}:${formatTime(second)}`,
        }
    }

    const handleSubmit = async () => {
        try {
            if (!validateSubmit()) return;
            const data = await addGoal(convertData(dataState));
            if (data?.status === CODE.SUCCESS) {
                toast.success("Update info player gold success");
            }
            handleClose();
            updatePageData();
        } catch (error) {
            console.log(error)
        }
    }

    const handleSetData = (value, name) => {

        setDataState((pre) => ({ ...pre, [name]: value }));

        if (name === 'team') {
            getListPlayer();
            setDataState((pre) => ({ ...pre, 'player': null }));
        }
    }

    const getListPlayer = async () => {
        try {
            const data = await getAllPlayer();
            if (dataState?.team?.idteam) {
                let listPlayerByTeam = data?.data.filter(i => i?.team?.idteam === dataState?.team?.idteam);
                setListPlayer(listPlayerByTeam);
            } else {
                setListPlayer(data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleHourChange = (event) => {
        setHour(event.target.value);
    };

    const handleMinuteChange = (event) => {
        setMinute(event.target.value);
    };

    const handleSecondChange = (event) => {
        setSecond(event.target.value);
    };

    React.useEffect(() => {
        setDataState({
            idmatch: item?.matchID
        });
        setListTeam([item?.awayTeam, item?.homeTeam]);
        getListPlayer();
    }, [])
    React.useEffect(() => {
        getListPlayer();
    }, [dataState?.team])

    return (
        <BootstrapDialog
            maxWidth="md"
            minWidth="md"
            width="md"
            onClose={handleClose}
            fullWidth
            open={open}
        >
            <ValidatorForm onSubmit={handleSubmit}>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Update player goal
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={6} xs={12}>
                            <Autocomplete
                                className="mt-3"
                                id="combo-box"
                                size="small"
                                fullWidth
                                options={listTeam}
                                onChange={(event, value) => handleSetData(value, "team")}
                                value={dataState?.team || null}
                                getOptionLabel={(option) => option?.teamName || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Team"
                                        // variant="standard"
                                        value={dataState?.team || ""}
                                    />
                                )}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                            />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Autocomplete
                                className="mt-3"
                                id="combo-box"
                                size="small"
                                fullWidth
                                options={listPlayer}
                                onChange={(event, value) => handleSetData(value, "player")}
                                value={dataState?.player || null}
                                getOptionLabel={(option) => option.fullName || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Player"
                                        value={dataState?.player || ""}
                                    />
                                )}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                            />
                        </Grid>
                        <div style={{ display: "block", width: "100%", marginTop: 20, paddingLeft: 20, color: "red" }}><b>Goal time</b></div>
                        <Grid item md={2} sm={2} xs={2}>
                            <TextValidator
                                type="number"
                                label="Hour"
                                value={hour}
                                onChange={handleHourChange}
                                min={0}
                                max={1}
                                validators={['required', 'minNumber:0', 'maxNumber:1']}
                                errorMessages={['This field is required', 'Hour must be greater than 0', 'Hour must be less than 1']}
                            />

                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <TextValidator
                                type="number"
                                label="Minute"
                                value={minute}
                                onChange={handleMinuteChange}
                                min={0}
                                max={59}
                                validators={['required', 'minNumber:0', 'maxNumber:59']}
                                errorMessages={['This field is required', 'Minute must be greater than 0', 'Minute must be less than 60']}
                            />
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <TextValidator
                                type="number"
                                label="Second"
                                value={second}
                                onChange={handleSecondChange}
                                min={0}
                                max={59}
                                validators={['required', 'minNumber:0', 'maxNumber:59']}
                                errorMessages={['This field is required', 'Second must be greater than 0', 'Second must be less than 60']}
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