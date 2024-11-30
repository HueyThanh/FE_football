import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
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
import { CODE } from "src/AppConst";
import ConfirmDialog from "src/view/Dialog/ConfirmDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ManageTeamAwayTable } from "src/view/ManageTeamAway/ManageTeamAwayTable";
import ManageTeamAwayDialog from "src/view/ManageTeamAway/ManageTeamAwayDialog";
import { deleteTeamAway, getAllTeamAway } from "src/view/ManageTeamAway/ManageTeamAwayServices";

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
      const data = await deleteTeamAway(item);
      toast.success("Delete team success");
      updatePageData();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const updatePageData = async () => {
    try {
      const data = await getAllTeamAway();
      if (data.status === CODE.SUCCESS) {
        let dataFilter = dataState?.checked ? data?.data : data?.data?.filter((i) => i?.shows);
        setListItem(dataFilter);
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
  }, [dataState]);

  useEffect(() => {
    updatePageData();
  }, []);

  const columns = [
    {
      title: "Team away name",
      field: "teamAwayName",
    },
    {
      title: "Country away",
      field: "countryAway",
    },
    {
      title: "Coach away Name",
      field: "coachAwayName",
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
              handleDelete(rowData.idAwayTeam);
            } else {
              alert("Call Selected Here:" + rowData.idAwayTeam);
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Team management | Football management system</title>
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
                <Typography variant="h4">List teams away</Typography>
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
            <ManageTeamAwayTable
              columns={columns}
              listItem={listItem}
              dataState={dataState}
              handleChangeData={handleChangeData}
            />
          </Stack>
        </Container>
      </Box>
      <div>
        {open && (
          <ManageTeamAwayDialog
            open={open}
            item={item}
            handleClose={handleClose}
            updatePageData={updatePageData}
          />
        )}
        {openDeleteDialog && (
          <ConfirmDialog
            open={openDeleteDialog}
            text={"Confirm delete this team"}
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