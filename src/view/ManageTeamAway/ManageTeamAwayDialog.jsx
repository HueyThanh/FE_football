import { useEffect, useState, forwardRef } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Grid } from '@mui/material';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { addTeam, addTeamAway, getPlayerByIDTeam, updateTeam, updateTeamAway } from './ManageTeamAwayServices';
import { CODE } from 'src/AppConst';
import { format } from "date-fns";
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { toast } from 'react-toastify';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function ManageTeamAwayDialog(props) {
    let {
        open,
        handleClose,
        item,
        updatePageData
    } = props;

    const [dataState, setDataState] = useState({});
    const [listPlayer, setListPlayer] = useState([]);
    const validateSubmit = () => {
        return true;
    }
    const convertData = (value) => {
        return {
            teamAwayName: value?.teamAwayName,
            coachAwayName: value?.coachAwayName,
            countryAway: value?.countryAway,
            idAwayTeam: value?.idAwayTeam,
        }
    }
    const handleSubmit = async () => {
        try {
            if (!validateSubmit()) return;
            if (item?.idAwayTeam) {
                const data = await updateTeamAway(convertData({ ...dataState }));
                if (data?.status === CODE.SUCCESS) {
                    toast.success("Update team success");
                }
            } else {
                const data = await addTeamAway({ ...dataState });
                if (data?.status === CODE.SUCCESS) {
                    toast.success("Add team success");
                }
            }
            handleClose();
            updatePageData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleSetData = (value, name) => {
        setDataState((pre) => ({ ...pre, [name]: value }));
    }

    const getPlayerByIdTeam = async () => {
        try {
            const data = await getPlayerByIDTeam(item?.idAwayTeam);
            setListPlayer(data?.data)
        } catch (error) {
        }
    }

    useEffect(() => {
        setDataState({
            ...item
        });
    }, []);

    useEffect(() => {
        if (item?.idAwayTeam) {
            getPlayerByIdTeam();
        }
    }, [item?.idAwayTeam]);

    // const columns = [
    //     {
    //         title: "Full name",
    //         field: "fullName",
    //         minWidth: 300,
    //         render: (rowData) => {
    //             return (
    //                 <Box sx={{ display: "flex", alignItems: "center" }}>
    //                     <div>
    //                         <Avatar sx={{ mr: 1 }} />
    //                     </div>
    //                     <div>{rowData?.fullName}</div>
    //                 </Box>
    //             );
    //         },
    //     },
    //     {
    //         title: "Date of birth",
    //         field: "dateOfBirth",
    //         minWidth: 150,
    //         align: "center",
    //         render: (rowData) =>
    //             rowData?.dateOfBirth && format(new Date(rowData?.dateOfBirth), "dd/MM/yyyy"),
    //     },
    //     {
    //         title: "Country",
    //         field: "country",
    //         minWidth: 200,
    //     },
    //     {
    //         title: "Position",
    //         field: "position",
    //         minWidth: 200,
    //         align: "center",
    //     },
    //     {
    //         title: "Jersey Number",
    //         field: "jerseyNumber",
    //         minWidth: 150,
    //         align: "center",
    //     },
    //     {
    //         title: "Email",
    //         field: "email",
    //         minWidth: 300,
    //     },
    //     {
    //         title: "Phone",
    //         field: "phone",
    //         minWidth: 200,
    //     },
    //     {
    //         title: "Height",
    //         field: "height",
    //         minWidth: 100,
    //         align: "center"
    //     },
    //     {
    //         title: "Weight",
    //         field: "weight",
    //         minWidth: 100,
    //         align: "center"
    //     },
    //     {
    //         title: "Contract Start Date",
    //         field: "contractStartDate",
    //         minWidth: 190,
    //         align: "center",
    //         render: (rowData) =>
    //             rowData?.contractStartDate && format(new Date(rowData?.contractStartDate), "dd/MM/yyyy"),
    //     },
    //     {
    //         title: "Contract End Date",
    //         field: "contractEndDate",
    //         minWidth: 190,
    //         align: "center",
    //         render: (rowData) =>
    //             rowData?.contractEndDate && format(new Date(rowData?.contractEndDate), "dd/MM/yyyy"),
    //     },
    // ];
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
                    Add new/Update football team
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Team away name'}
                                className='w-100'
                                type="text"
                                name="teamAwayName"
                                value={dataState?.teamAwayName}
                                onChange={(event) => handleSetData(event.target.value, "teamAwayName")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Country away'}
                                className='w-100'
                                type="text"
                                name="countryAway"
                                value={dataState?.countryAway}
                                onChange={(event) => handleSetData(event.target.value, "countryAway")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextValidator
                                label={'Coach name'}
                                className='w-100'
                                type="text"
                                name="coachAwayName"
                                value={dataState?.coachAwayName}
                                onChange={(event) => handleSetData(event.target.value, "coachAwayName")}
                                validators={['required']}
                                errorMessages={['This field is required']}
                            />
                        </Grid>
                    </Grid>
                    {/* {item?.idAwayTeam && <Grid container className='mt-10'>
                        <MaterialTable
                            style={{ overflow: "hidden" }}
                            columns={columns}
                            data={listPlayer}
                            options={{
                                search: false,
                                padding: "dense",
                                sorting: false,
                                selection: false,
                                toolbar: false,
                                paging: false,
                                headerStyle: {
                                    backgroundColor: "#6366f1",
                                    color: "#fff",
                                },
                            }}
                            icons={tableIcons}
                        />
                    </Grid>} */}
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