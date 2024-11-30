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
import { addCard, addMatch, updateMatch } from './ManageCalendarServices';
import { toast } from 'react-toastify';
import { getAllTournaments } from '../Tournaments/TournamentsServices';
import { getAllPlayer } from '../ManagePlayer/ManagePlayerServices';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function DialogPlayerInfo(props) {
    let {
        open,
        handleClose,
        item,
        updatePageData
    } = props;
    const [dataState, setDataState] = React.useState({});
    const [listTeam, setListTeam] = React.useState([]);
    const [listPlayer, setListPlayer] = React.useState([]);

    const validateSubmit = () => {
        return true;
    }

    const convertData = (value) => {
        return {
            idmatch: value?.idmatch,
            idplayer: value?.player?.idplayer,
            yellow_cards: value?.yellow_cards,
            red_cards: value?.red_cards,
            idteam: value?.team?.idteam
        }
    }

    const handleSubmit = async () => {
        try {
            if (!validateSubmit()) return;
            const data = await addCard(convertData(dataState));
            if (data?.status === CODE.SUCCESS) {
                toast.success("Add infomation player success");
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
                    Update player history
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
                        <Grid item md={6} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                type='number'
                                label='Yellow cards'
                                name="yellow_cards"
                                value={dataState?.yellow_cards}
                                onChange={(event) => handleSetData(event.target.value, "yellow_cards")}
                            />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <TextValidator
                                className='w-100'
                                type='number'
                                label='Red cards'
                                name="red_cards"
                                value={dataState?.red_cards}
                                onChange={(event) => handleSetData(event.target.value, "red_cards")}
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