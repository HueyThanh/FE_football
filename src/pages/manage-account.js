import { useEffect, useState } from "react";
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
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { ManageAccountTable } from "src/view/ManageAccount/ManageAccountTable";
import ManageAccountDialog from "src/view/ManageAccount/ManageAccountDialog";

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
    </div>
  );
}

const Page = () => {
  const [listItem, setListItem] = useState([]);
  const [item, setItem] = useState(null);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (data) => {
    setOpen(true);
    setItem(data);
  };
  const handleDelete = (id) => {};

  useEffect(() => {
    //fake data
    setListItem([
      { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
      { name: "Zerya Betül", surname: "Baran", birthYear: 2017, birthCity: 34 },
    ]);
  }, []);

  const columns = [
    {
      title: "Thao tác",
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
              handleDelete(rowData.id);
            } else {
              alert("Call Selected Here:" + rowData.id);
            }
          }}
        />
      ),
    },
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Surname",
      field: "surname",
    },
    {
      title: "Birth Year",
      field: "birthYear",
    },
    {
      title: "Birth Place",
      field: "birthCity",
    },
  ];

  return (
    <>
      <Head>
        <title>Account management | Football management system</title>
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
                <Typography variant="h4">Account management</Typography>
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
            <ManageAccountTable columns={columns} listItem={listItem} />
          </Stack>
        </Container>
      </Box>
      <div>
        <ManageAccountDialog open={open} handleClose={handleClose} item={item} />
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
