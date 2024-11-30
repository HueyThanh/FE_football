import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Avatar,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ManagePlayerTable } from "src/view/ManagePlayer/ManagePlayerTable";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import ManagePlayerDialog from "src/view/ManagePlayer/ManagePlayerDialog";
import ConfirmDialog from "src/view/Dialog/ConfirmDialog";
import { deletePlayer, getAllPlayer } from "src/view/ManagePlayer/ManagePlayerServices";
import { CODE } from "src/AppConst";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagePlayerSearch from "src/view/ManagePlayer/ManagePlayerSearch";
import { getAllTeam } from "src/view/ManageTeam/ManageTeamServices";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    marginLeft: "-1.0em",
  },
}))(Tooltip);

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
        </>
      )}
    </div>
  );
}

const Page = () => {
  const [listItem, setListItem] = useState([]);
  const [item, setItem] = useState(null);

  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [listTeam, setListTeam] = useState([]);
  const [dataState, setDataState] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenDeleteDialog(false);
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

  const handleYesDelete = async () => {
    try {
      const data = await deletePlayer(item);
      toast.success("Delete player success");
      updatePageData();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const updatePageData = async () => {
    try {
      const data = await getAllPlayer();
      if (data.status === CODE.SUCCESS) {
        let filteredList = dataState?.checked ? data?.data : data?.data?.filter((i) => i?.shows);
        //lọc theo id của team khi chọn team để hiển thị ra bảng
        if (dataState?.team?.idteam) {
          filteredList = filteredList.filter(
            (player) => player?.team?.idteam === dataState.team.idteam
          );
        }
        //lọc theo vị trí cầu thủ chơi để hiển thị ra bảng
        if (dataState?.position?.code) {
          filteredList = filteredList.filter(
            (player) => player?.position === dataState.position.name
          );
        }
        setListItem(filteredList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllTeams = async () => {
    try {
      const data = await getAllTeam();
      if (data.status === CODE.SUCCESS) {
        setListTeam(data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeData = (value, name) => {
    if (name === "checked") {
      setDataState((pre) => ({ ...pre, [name]: value.target.checked }));
    } else {
      setDataState((pre) => ({ ...pre, [name]: value }));
    }
  };

  useEffect(() => {
    updatePageData();
    getAllTeams();
  }, []);

  useEffect(() => {
    updatePageData();
  }, [dataState]);

  const columns = [
    {
      title: "Full name",
      field: "fullName",
      minWidth: 300,
      render: (rowData) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <div>
              <Avatar sx={{ mr: 1 }} src={rowData?.photo} />
            </div>
            <div>{rowData?.fullName}</div>
          </Box>
        );
      },
    },
    {
      title: "The team is competing",
      field: "team",
      minWidth: 250,
      render: (rowData) => rowData?.team?.teamName,
    },
    {
      title: "Position",
      field: "position",
      minWidth: 200,
      align: "center",
    },
    {
      title: "Jersey Number",
      field: "jerseyNumber",
      minWidth: 140,
      align: "center",
    },
    {
      title: "Date of birth",
      field: "dateOfBirth",
      minWidth: 150,
      align: "center",
      render: (rowData) =>
        rowData?.dateOfBirth && format(new Date(rowData?.dateOfBirth), "dd/MM/yyyy"),
    },
    {
      title: "Country",
      field: "country",
      minWidth: 100,
      align: "center",
    },
    
    {
      title: "Email",
      field: "email",
      minWidth: 250,
    },
    {
      title: "Phone",
      field: "phone",
      minWidth: 150,
    },
    {
      title: "Height",
      field: "height",
      minWidth: 100,
      align: "center",
    },
    {
      title: "Weight",
      field: "weight",
      minWidth: 100,
      align: "center",
    },
    {
      title: "Contract Start Date",
      field: "contractStartDate",
      minWidth: 190,
      align: "center",
      render: (rowData) =>
        rowData?.contractStartDate && format(new Date(rowData?.contractStartDate), "dd/MM/yyyy"),
    },
    {
      title: "Contract End Date",
      field: "contractEndDate",
      minWidth: 190,
      align: "center",
      render: (rowData) =>
        rowData?.contractEndDate && format(new Date(rowData?.contractEndDate), "dd/MM/yyyy"),
    },
    {
      title: "Action",
      field: "",
      maxWidth: 100,
      minWidth: 100,
      align: "center",
      render: (rowData) => (
        <MaterialButton
          item={rowData}
          onSelect={(rowData, method) => {
            if (method === 0) {
              handleEdit(rowData);
            } else if (method === 1) {
              handleDelete(rowData?.idplayer);
            } else {
              alert("Call Selected Here:" + rowData?.idplayer);
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Manage player information | Football management system</title>
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
                <Typography variant="h4">List player</Typography>
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
            <ManagePlayerSearch
              listTeam={listTeam}
              dataState={dataState}
              handleChangeData={handleChangeData}
            />
            <ManagePlayerTable columns={columns} listItem={listItem} />
          </Stack>
        </Container>
      </Box>
      <div>
        {open && (
          <ManagePlayerDialog
            open={open}
            item={item}
            handleClose={handleClose}
            updatePageData={updatePageData}
          />
        )}
        {openDeleteDialog && (
          <ConfirmDialog
            open={openDeleteDialog}
            text={"Confirm delete this player"}
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
