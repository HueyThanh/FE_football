import { useEffect, useState } from "react";
import Head from "next/head";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import DocumentCheckIcon from "@heroicons/react/24/solid/DocumentCheckIcon";
import {
  AppBar,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Stack,
  SvgIcon,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { ManageCalendarTable } from "src/view/ManageCalendar/ManageCalendarTable";
import ManageCalendarDialog from "src/view/ManageCalendar/ManageCalendarDialog";
import {
  deleteMatch,
  getAllMatch,
  getByCaculate,
} from "src/view/ManageCalendar/ManageCalendarServices";
import { CODE, OBJECT_STATUS_MATCH, OBJECT_TYPE_MATCH } from "src/AppConst";
import { format } from "date-fns";
import PropTypes from "prop-types";
import DialogGoalPlayerInfo from "src/view/ManageCalendar/DialogGoalPlayerInfo";
import ConfirmDialog from "src/view/Dialog/ConfirmDialog";
import DialogPlayerInfo from "src/view/ManageCalendar/DialogPlayerInfo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageCalendarSearch from "src/view/ManageCalendar/ManageCalendarSearch";
import { getAllTournaments } from "src/view/Tournaments/TournamentsServices";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    marginLeft: "-1.0em",
  },
}))(Tooltip);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function MaterialButton(props) {
  const item = props.item;
  return (
    <div className="none_wrap">
      {item?.shows && (
        <>
          <LightTooltip
            title={"Chỉnh sửa"}
            placement="right-end"
            enterDelay={300}
            leaveDelay={200}
            PopperProps={{
              popperOptions: { modifiers: { offset: { enabled: true, offset: "10px, 0px" } } },
            }}
          >
            <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
              <Icon fontSize="small" color="primary">
                <PencilIcon />
              </Icon>
            </IconButton>
          </LightTooltip>
          {item?.status !== OBJECT_STATUS_MATCH.Finished.name && (
            <LightTooltip
              title={"Xóa"}
              placement="right-end"
              enterDelay={300}
              leaveDelay={200}
              PopperProps={{
                popperOptions: { modifiers: { offset: { enabled: true, offset: "10px, 0px" } } },
              }}
            >
              <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
                <Icon fontSize="small" color="error">
                  <TrashIcon />
                </Icon>
              </IconButton>
            </LightTooltip>
          )}
          <LightTooltip
            title={"History"}
            placement="right-end"
            enterDelay={300}
            leaveDelay={200}
            PopperProps={{
              popperOptions: { modifiers: { offset: { enabled: true, offset: "10px, 0px" } } },
            }}
          >
            <IconButton size="small" onClick={() => props.onSelect(item, 2)}>
              <Icon fontSize="small" color="default">
                <ClockIcon />
              </Icon>
            </IconButton>
          </LightTooltip>
          <LightTooltip
            title={"History"}
            placement="right-end"
            enterDelay={300}
            leaveDelay={200}
            PopperProps={{
              popperOptions: { modifiers: { offset: { enabled: true, offset: "10px, 0px" } } },
            }}
          >
            <IconButton size="small" onClick={() => props.onSelect(item, 3)}>
              <Icon fontSize="small" color="success">
                <DocumentCheckIcon />
              </Icon>
            </IconButton>
          </LightTooltip>
        </>
      )}
    </div>
  );
}

const Page = () => {
  const [listItem, setListItem] = useState([]);
  const [item, setItem] = useState(null);

  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openInfoGoal, setOpenInfoGoal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dataState, setDataState] = useState({});

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenInfo(false);
    setOpenDeleteDialog(false);
    setOpenInfoGoal(false);
    setItem(null);
  };

  const handleEdit = (data) => {
    setOpen(true);
    setItem(data);
  };

  const handleDelete = (id) => {
    setItem(id);
    setOpenDeleteDialog(true);
  };

  const handleEditInfoPlayerMatch = (data, type) => {
    setItem(data);
    if (type === 1) {
      setOpenInfo(true);
    }
    if (type === 2) {
      setOpenInfoGoal(true);
    }
  };

  const handleYesDelete = async () => {
    try {
      const data = await deleteMatch(item);
      toast.success("Delete player success");
      updatePageData();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const updatePageData = async () => {
    try {
      const data = await getAllMatch();

      if (data.status === CODE.SUCCESS) {
        let listItemFilter = [];
        if (value === 0) {
          listItemFilter = data?.data?.filter(
            (i) => i?.loaiTranDau === OBJECT_TYPE_MATCH.Practice.name
          );
        }
        if (value === 1) {
          listItemFilter = data?.data?.filter(
            (i) => i?.loaiTranDau === OBJECT_TYPE_MATCH.Friendly.name
          );
        }
        if (value === 2) {
          listItemFilter = data?.data?.filter(
            (i) =>
              i?.loaiTranDau === OBJECT_TYPE_MATCH.Official.name || i?.loaiTranDau === "chinhthuc"
          );
        }
        if (dataState?.status?.code) {
          listItemFilter = listItemFilter?.filter((i) => i?.status === dataState?.status?.name);
        }
        if (dataState?.checked) {
          listItemFilter = listItemFilter;
        } else {
          listItemFilter = listItemFilter.filter((i) => i?.shows);
        }
        setListItem(listItemFilter);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const search = async () => {
    try {
      let obj = {};
      obj.tuNgay = dataState?.tuNgay;
      obj.denNgay = dataState?.denNgay;
      obj.idTour = dataState?.tour?.IDTournaments;

      const data = await getByCaculate(obj);
      if (data.status === CODE.SUCCESS) {
        let listItemFilter = [];
        if (value === 0) {
          listItemFilter = data?.data?.filter(
            (i) => i?.loaiTranDau === OBJECT_TYPE_MATCH.Practice.name
          );
        }
        if (value === 1) {
          listItemFilter = data?.data?.filter(
            (i) => i?.loaiTranDau === OBJECT_TYPE_MATCH.Friendly.name
          );
        }
        if (value === 2) {
          listItemFilter = data?.data?.filter(
            (i) =>
              i?.loaiTranDau === OBJECT_TYPE_MATCH.Official.name || i?.loaiTranDau === "chinhthuc"
          );
        }
        if (dataState?.status?.code) {
          listItemFilter = listItemFilter?.filter((i) => i?.status === dataState?.status?.name);
        }
        if (dataState?.checked) {
          listItemFilter = listItemFilter;
        } else {
          listItemFilter = listItemFilter.filter((i) => i?.shows);
        }
        setListItem(listItemFilter);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getType = (value) => {
    switch (value) {
      case OBJECT_TYPE_MATCH.Practice.name:
        return OBJECT_TYPE_MATCH.Practice.name;
      case OBJECT_TYPE_MATCH.Friendly.name:
        return OBJECT_TYPE_MATCH.Friendly.name;
      case OBJECT_TYPE_MATCH.Official.name:
        return OBJECT_TYPE_MATCH.Official.name;
      default:
        return OBJECT_TYPE_MATCH.Official.name;
    }
  };

  const handleChangeData = (value, name) => {
    if (name === "checked") {
      setDataState((pre) => ({ ...pre, [name]: value.target.checked }));
    } else {
      setDataState((pre) => ({ ...pre, [name]: value }));
    }
  };

  const getListTournament = async () => {
    try {
      const data = await getAllTournaments();
      let dataFilter = dataState?.checked ? data?.data : data?.data?.filter((i) => i?.shows);
      setDataState((pre) => ({ ...pre, tournament: dataFilter }));
    } catch (error) {}
  };

  useEffect(() => {
    updatePageData();
    getListTournament();
  }, []);

  useEffect(() => {
    updatePageData();
  }, [value, dataState.status, dataState.checked]);

  useEffect(() => {
    search();
  }, [dataState.tuNgay, dataState.denNgay, dataState.tour]);

  const columns = [
    {
      title: "MatchDate",
      field: "matchDate",
      minWidth: "200px",
      align: "center",
      render: (rowData) => rowData?.matchDate && format(new Date(rowData?.matchDate), "dd/MM/yyyy"),
    },
    {
      title: "HomeTeam",
      field: "homeTeam",
      minWidth: "200px",
      render: (rowData) => rowData?.homeTeam?.teamName,
    },
    {
      title: "Away Team",
      field: "awayTeam",
      minWidth: "200px",
      render: (rowData) => rowData?.awayTeam?.teamAwayName,
    },
    {
      title: "Home Team Score",
      field: "homeTeamScore",
      minWidth: "170px",
      align: "center",
    },
    {
      title: "Away Team Score",
      field: "awayTeamScore",
      minWidth: "170px",
      align: "center",
    },
    {
      title: "Status",
      field: "status",
      minWidth: "200px",
      align: "center",
    },
    {
      title: "Match type",
      field: "loaiTranDau",
      minWidth: "250px",
      align: "center",
      render: (rowData) => getType(rowData?.loaiTranDau),
    },
    {
      title: "Action",
      field: "",
      maxWidth: 250,
      minWidth: 200,
      align: "center",
      render: (rowData) => (
        <MaterialButton
          item={rowData}
          onSelect={(rowData, method) => {
            if (method === 0) {
              handleEdit(rowData);
            } else if (method === 1) {
              handleDelete(rowData.matchID);
            } else if (method === 2) {
              handleEditInfoPlayerMatch(rowData, 1);
            } else if (method === 3) {
              handleEditInfoPlayerMatch(rowData, 2);
            } else {
              alert("Call Selected Here:" + rowData.id);
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Caneldar Fight | Football management system</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">List matches</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  onClick={handleClickOpen}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
          </Stack>

          <ManageCalendarSearch dataState={dataState} handleChangeData={handleChangeData} />

          <AppBar position="static" color="default" style={{ marginTop: 30 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                className="tab"
                style={{ minWidth: 200 }}
                label={OBJECT_TYPE_MATCH.Practice.name}
              />
              <Tab
                className="tab"
                style={{ minWidth: 200 }}
                label={OBJECT_TYPE_MATCH.Friendly.name}
              />
              <Tab
                className="tab"
                style={{ minWidth: 200 }}
                label={OBJECT_TYPE_MATCH.Official.name}
              />
            </Tabs>
          </AppBar>
          <TabPanel style={{ padding: 0 }} className="tabPalne" value={value} index={0}>
            <ManageCalendarTable columns={columns} listItem={listItem} />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} className="tabPalne" value={value} index={1}>
            <ManageCalendarTable columns={columns} listItem={listItem} />
          </TabPanel>
          <TabPanel style={{ padding: 0 }} className="tabPalne" value={value} index={2}>
            <ManageCalendarTable columns={columns} listItem={listItem} />
          </TabPanel>
        </Container>
      </Box>
      <div>
        {open && (
          <ManageCalendarDialog
            open={open}
            handleClose={handleClose}
            item={item}
            updatePageData={updatePageData}
          />
        )}
        {openInfo && (
          <DialogPlayerInfo
            open={openInfo}
            handleClose={handleClose}
            item={item}
            updatePageData={updatePageData}
          />
        )}
        {openInfoGoal && (
          <DialogGoalPlayerInfo
            open={openInfoGoal}
            handleClose={handleClose}
            item={item}
            updatePageData={updatePageData}
          />
        )}

        {openDeleteDialog && (
          <ConfirmDialog
            open={openDeleteDialog}
            text={"Confirm delete this match"}
            handleClose={handleClose}
            handleOk={handleYesDelete}
          />
        )}
      </div>
      <ToastContainer autoClose={1000} />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
