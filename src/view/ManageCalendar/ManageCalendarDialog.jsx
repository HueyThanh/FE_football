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
import { CODE, OBJECT_STATUS_MATCH, OBJECT_TYPE_MATCH, STATUS_MATCH, TYPE_MATCH } from 'src/AppConst';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getAllTeam } from '../ManageTeam/ManageTeamServices';
import { addMatch, updateMatch } from './ManageCalendarServices';
import { toast } from 'react-toastify';
import { getAllTournaments } from '../Tournaments/TournamentsServices';
import { getAllTeamAway } from '../ManageTeamAway/ManageTeamAwayServices';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function ManageCalendarDialog(props) {
    let {
        open,
        handleClose,
        item,
        updatePageData
    } = props;
    const [dataState, setDataState] = React.useState({});
    const [listTeam, setListTeam] = React.useState([]);
    const [listTeamAway, setListTeamAway] = React.useState([]);
    const [listTournaments, setListTournaments] = React.useState([]);

    const validateSubmit = () => {
        return true;
    }
    const convertData = (value) => {
        return {
            IDMatch: value?.matchID,
            HomeTeamID: value?.homeTeam?.idteam,
            AwayTeamID: value?.awayTeam?.idAwayTeam,
            MatchDate: value?.matchDate,
            status: value?.status?.name,
            LoaiTranDau: value?.loaiTranDau?.name === OBJECT_TYPE_MATCH.Official.name ? 'chinhthuc' : value?.loaiTranDau?.name,
            IDTournament: value?.tournaments?.IDTournaments,
            HomeTeamScore: value?.homeTeamScore,
            AwayTeamScore: value?.awayTeamScore,
        }
    }
    const handleSubmit = async () => {
        try {
            if (!validateSubmit()) return;
            if (item?.matchID) {
                const data = await updateMatch(convertData(dataState));
                if (data?.status === CODE.SUCCESS) {
                    toast.success("Update match success");
                }
            } else {
                const data = await addMatch(convertData(dataState));
                if (data?.status === CODE.SUCCESS) {
                    toast.success("Add match success");
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

    const getAllTeams = async () => {
        try {
            const data = await getAllTeam();
            setListTeam(data?.data);
            const data2 = await getAllTeamAway();
            setListTeamAway(data2?.data);
        } catch (error) {
            console.error(error);
        }
    }
    const getAllTournament = async () => {
        try {
            const data = await getAllTournaments();
            setListTournaments(data?.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getStatus = (value) => {
        switch (value) {
            case OBJECT_STATUS_MATCH.Start.name:
                return OBJECT_STATUS_MATCH.Start
            case OBJECT_STATUS_MATCH.Progress.name:
                return OBJECT_STATUS_MATCH.Progress
            case OBJECT_STATUS_MATCH_MATCH.Progress.name:
                return OBJECT_STATUS_MATCH.Progress
            default:
                return OBJECT_STATUS_MATCH.Start
        }
    }

    const getType = (value) => {
        switch (value) {
            case OBJECT_TYPE_MATCH.Practice.name:
                return OBJECT_TYPE_MATCH.Practice
            case OBJECT_TYPE_MATCH.Friendly.name:
                return OBJECT_TYPE_MATCH.Friendly
            case OBJECT_TYPE_MATCH.Official.name:
                return OBJECT_TYPE_MATCH.Official
            default:
                return OBJECT_TYPE_MATCH.Official
        }
    }

    React.useEffect(() => {
        setDataState({
            ...item,
            matchDate: convertDate(item?.matchDate),
            status: getStatus(item?.status),
            tournaments: item?.idtournaments,
            loaiTranDau: getType(item?.loaiTranDau)
        });
        getAllTeams();
        getAllTournament();
    }, [])

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
                    Add new/update match schedule
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={6} xs={12}>
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className='w-100'
                                    label="Time start"
                                    value={dataState?.date}
                                    onChange={(value) => handleSetData( value, "date" )}
                                    // variant="standard" 
                                />
                            </LocalizationProvider> */}
                            <TextValidator
                                label={'Match date'}
                                className='w-100'
                                type='date'
                                name="matchDate"
                                value={dataState?.matchDate || new Date()}
                                onChange={(event) => handleSetData(event.target.value, "matchDate")}
                            />
                        </Grid>
                        { <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                label="Type of competition"
                                name="loaiTranDau"
                                value={dataState?.loaiTranDau}
                                onChange={(event) => handleSetData(event.target.value, "loaiTranDau")}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                            />
                        </Grid> }
                        <Grid item md={4} sm={6} xs={12}>
                            <Autocomplete
                                fullWidth
                                options={TYPE_MATCH}
                                onChange={(event, value) => handleSetData(value, "loaiTranDau")}
                                value={dataState?.loaiTranDau || null}
                                getOptionLabel={(option) => option.name || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Type of competition"
                                        // variant="standard"
                                        value={dataState?.loaiTranDau || ""}
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
                                size="small"
                                fullWidth
                                options={STATUS_MATCH}
                                onChange={(event, value) => handleSetData(value, "status")}
                                value={dataState?.status || null}
                                getOptionLabel={(option) => option.name || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Status"
                                        // variant="standard"
                                        value={dataState?.status || ""}
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
                                size="small"
                                fullWidth
                                options={listTeam}
                                onChange={(event, value) => handleSetData(value, "homeTeam")}
                                value={dataState?.homeTeam || null}
                                getOptionLabel={(option) => option.teamName || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Home team"
                                        // variant="standard"
                                        value={dataState?.homeTeam || ""}
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
                                size="small"
                                fullWidth
                                options={listTeamAway}
                                onChange={(event, value) => handleSetData(value, "awayTeam")}
                                value={dataState?.awayTeam || null}
                                getOptionLabel={(option) => option.teamAwayName || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Away team"
                                        // variant="standard"
                                        value={dataState?.awayTeam || ""}
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
                                size="small"
                                fullWidth
                                options={listTournaments}
                                onChange={(event, value) => handleSetData(value, "tournaments")}
                                value={dataState?.tournaments || null}
                                getOptionLabel={(option) => option.tournamentsName || ""}
                                filterOptions={filterOptions}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        label="Tournaments"
                                        // variant="standard"
                                        value={dataState?.tournaments || ""}
                                    />
                                )}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                            />
                        </Grid>
                        {item?.matchID && <>
                            <Grid item md={4} sm={6} xs={12}>
                                <TextValidator
                                    className='w-100'
                                    type='number'
                                    label='Home team score'
                                    name="homeTeamScore"
                                    value={dataState?.homeTeamScore}
                                    onChange={(event) => handleSetData(event.target.value, "homeTeamScore")}
                                />
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <TextValidator
                                    className='w-100'
                                    type='number'
                                    label='Away team score'
                                    name="awayTeamScore"
                                    value={dataState?.awayTeamScore}
                                    onChange={(event) => handleSetData(event.target.value, "awayTeamScore")}
                                />
                            </Grid>
                        </>}
                        {/* <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                type='number'
                                label='Home team score'
                                name="homeTeamScore"
                                value={dataState?.homeTeamScore}
                                onChange={(event) => handleSetData(event.target.value, "homeTeamScore")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                type='number'
                                label='Away team score'
                                name="awayTeamScore"
                                value={dataState?.awayTeamScore}
                                onChange={(event) => handleSetData(event.target.value, "awayTeamScore")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                type='number'
                                label='Yellow cards home team'
                                name="yellowCardsHomeTeam"
                                value={dataState?.yellowCardsHomeTeam}
                                onChange={(event) => handleSetData(event.target.value, "yellowCardsHomeTeam")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                type='number'
                                label='Red cards home team'
                                name="redCardsHomeTeam"
                                value={dataState?.redCardsHomeTeam}
                                onChange={(event) => handleSetData(event.target.value, "redCardsHomeTeam")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                type='number'
                                label='Yellow cards away team'
                                name="yellowCardsAwayTeam"
                                value={dataState?.yellowCardsAwayTeam}
                                onChange={(event) => handleSetData(event.target.value, "yellowCardsAwayTeam")}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                type='number'
                                label='Red cards away team'
                                name="redCardsAwayTeam"
                                value={dataState?.redCardsAwayTeam}
                                onChange={(event) => handleSetData(event.target.value, "redCardsAwayTeam")}
                            />
                        </Grid> */}
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