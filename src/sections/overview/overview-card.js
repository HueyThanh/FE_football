import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import DocumentCheckIcon from "@heroicons/react/24/solid/DocumentCheckIcon";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Icon,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { useEffect, useState } from "react";
import {
  getAllTournaments,
  thongKeByTour,
  thongKeCard,
} from "src/view/Tournaments/TournamentsServices";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { filterOptions } from "src/AppFunction";
import { getAllTeam } from "src/view/ManageTeam/ManageTeamServices";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import DialogGoalReport from "src/view/ManageCalendar/DialogGoalReport";
import { getGoalAway, getGoalHome } from "src/view/ManageCalendar/ManageCalendarServices";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    marginLeft: "-1.0em",
  },
}))(Tooltip);
export const OverviewCard = (props) => {
  const { orders = [], sx } = props;
  const [dataState, setDataState] = useState({});
  const [open, setOpen] = useState(false);
  const [listItems, setlistItems] = useState([]);
  const [listItemsReport, setlistItemsReport] = useState([]);
  const [listTeam, setlistTeam] = useState([]);
  const [item, setItem] = useState(null);

  const getAllTournament = async () => {
    try {
      const data = await getAllTournaments();
      const dataTeam = await getAllTeam();
      setlistItems(data?.data);
      setlistTeam(dataTeam?.data);
    } catch (error) {}
  };
  const handleChangeData = (value, name) => {
    setDataState((pre) => ({ ...pre, [name]: value }));
  };
  const convertData = (value) => {
    return {
      idtour: dataState?.tournaments?.IDTournaments,
      idteam: dataState?.team?.idteam,
    };
  };

  const updatePageData = async () => {
    try {
      const data = await thongKeCard(convertData(dataState));
      setlistItemsReport(data?.data);
    } catch (error) {}
  };

  const convertDataSearch = (value, isHome) => {
    return {
      idmatch: value?.idMatch,
      idteam: isHome ? value?.homeTeamId : value?.awayTeamId,
    };
  };
  const convertDataDetail = (homeData, awayData, data) => {
    return {
      home: homeData,
      away: awayData,
      homeName: data?.homeTeamName,
      awayName: data?.awayTeamName,
    };
  };

  const handleGetDetail = async (data) => {
    try {
      const dataGetGoalHome = await getGoalHome(convertDataSearch(data, true));
      const dataGetGoalAway = await getGoalAway(convertDataSearch(data, false));

      setItem(convertDataDetail(dataGetGoalHome?.data, dataGetGoalAway?.data, data));
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setItem({});
    setOpen(false);
  };
  useEffect(() => {
    getAllTournament();
    updatePageData();
  }, []);

  useEffect(() => {
    updatePageData();
  }, [dataState?.tournaments?.IDTournaments, dataState?.team?.idteam]);
  return (
    <Card className="form-container">
      <Box sx={{ display: "flex", justifyContent: "space-between" }} className="form-group">
        <CardHeader title="Goals statistics" />
        <ValidatorForm onSubmit={() => {}} style={{ display: "flex", gap: 5 }}>
          <Autocomplete
            className="mt-3"
            style={{
              minWidth: 250,
            }}
            id="combo-box"
            fullWidth
            options={listItems}
            onChange={(event, value) => handleChangeData(value, "tournaments")}
            value={dataState?.tournaments || null}
            getOptionLabel={(option) => option.tournamentsName || ""}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextValidator
                {...params}
                label="Tourments"
                variant="standard"
                value={dataState?.tournaments || ""}
              />
            )}
          />
          <Autocomplete
            className="mt-3"
            style={{
              minWidth: 250,
            }}
            id="combo-box"
            fullWidth
            options={listTeam}
            onChange={(event, value) => handleChangeData(value, "team")}
            value={dataState?.team || null}
            getOptionLabel={(option) => option.teamName || ""}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextValidator
                {...params}
                label="Team"
                variant="standard"
                value={dataState?.team || ""}
              />
            )}
          />
        </ValidatorForm>
      </Box>
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ background: "#EBEEFE" }}>Home Team</TableCell>
                {/* <TableCell style={{ background: "#EBEEFE" }}>Away Team</TableCell> */}
                <TableCell style={{ background: "#EBEEFE" }} align="center">
                  Home Goals
                </TableCell>
                {/* <TableCell style={{ background: "#EBEEFE" }} align="center">
                  Away Goals
                </TableCell> */}
                <TableCell style={{ background: "#EBEEFE" }} align="center">
                  Red Card Home
                </TableCell>
                {/* <TableCell style={{ background: "#EBEEFE" }} align="center">
                  Red Card Away
                </TableCell> */}
                <TableCell style={{ background: "#EBEEFE" }} align="center">
                  Yellow Card Home
                </TableCell>
                {/* <TableCell style={{ background: "#EBEEFE" }} align="center">
                  Yellow Card Away
                </TableCell> */}
                <TableCell style={{ background: "#EBEEFE" }} align="center">
                  Tournament
                </TableCell>
                <TableCell style={{ background: "#EBEEFE" }} align="center">
                  Detail
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listItemsReport.length <= 0 ? (
                <div style={{ minHeight: 100 }}></div>
              ) : (
                listItemsReport
                  .sort((a, b) => b?.point - a?.point)
                  ?.map((order) => {
                    return (
                      <TableRow hover key={order.id}>
                        <TableCell sx={{ minWidth: "150px" }}>{order.homeTeamName}</TableCell>
                        {/* <TableCell sx={{ minWidth: "150px" }}>{order.awayTeamName}</TableCell> */}
                        <TableCell align="center">{order.totalGoalHome}</TableCell>
                        {/* <TableCell align="center">{order.totalGoalAway}</TableCell> */}
                        <TableCell align="center">{order.totalRedHome}</TableCell>
                        {/* <TableCell align="center">{order.totalRedAway}</TableCell> */}
                        <TableCell align="center">{order.totalYellowHome}</TableCell>
                        {/* <TableCell align="center">{order.totalYellowAway}</TableCell> */}
                        <TableCell align="center">{order.nametour}</TableCell>
                        <TableCell align="center">
                          <LightTooltip
                            title={"History"}
                            placement="right-end"
                            enterDelay={300}
                            leaveDelay={200}
                            PopperProps={{
                              popperOptions: {
                                modifiers: { offset: { enabled: true, offset: "10px, 0px" } },
                              },
                            }}
                          >
                            <IconButton size="small" onClick={() => handleGetDetail(order)}>
                              <Icon fontSize="small" color="success">
                                <DocumentCheckIcon />
                              </Icon>
                            </IconButton>
                          </LightTooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      {open && <DialogGoalReport open={open} item={item} handleClose={handleClose} />}
    </Card>
  );
};

OverviewCard.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
