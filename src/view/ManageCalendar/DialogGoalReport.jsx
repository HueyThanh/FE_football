import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TableCell, Table, TableBody, TableHead, TableRow, Avatar, Box, Card } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

const DialogGoalReport = ({ open, handleClose, item }) => {
    const [dataState, setDataState] = useState(item);

    useEffect(() => {
        setDataState(item);
    }, [item]);

    return (
        <Dialog
            maxWidth="md"
            minWidth="md"
            width="md"
            onClose={handleClose}
            fullWidth
            open={open}
        >
            <ValidatorForm>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    History goal
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {['home'].map((team) => (
                            <Grid key={team} item md={12} sm={12} xs={12} container>
                                <SeverityPill color={"success"}>{team === 'home' ? 'Home team - ' + dataState?.homeName : 'Away team - ' + dataState?.awayName}</SeverityPill>
                                <Grid md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                    <Card className="form-container" sx={{ width: "100%" }}>
                                        <Scrollbar sx={{ flexGrow: 1 }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        {['Player name', 'JerseyNumber', 'Goal Time'].map((header) => (
                                                            <TableCell key={header} style={{ background: "#EBEEFE", width: "33%" }} align="center">{header}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataState?.[team]?.length > 0 ? (
                                                        dataState?.[team]?.map((order) => (
                                                            <TableRow key={order.id} hover>
                                                                <TableCell sx={{ width: "33%" }} align="center">
                                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                        <Avatar sx={{ mr: 1 }} src={order?.player?.photo} />
                                                                        <div>{order?.player?.fullName}</div>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell sx={{ width: "33%" }} align="center">{order?.player?.jerseyNumber}</TableCell>
                                                                <TableCell sx={{ width: "33%" }} align="center">{order?.goalTime}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={3} style={{ minHeight: 100 }} />
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Scrollbar>
                                    </Card>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} color="error">
                        Cancel
                    </Button>
                </DialogActions>
            </ValidatorForm>
        </Dialog>
    );
}

export default DialogGoalReport;
