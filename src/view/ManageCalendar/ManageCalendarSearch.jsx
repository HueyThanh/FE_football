import React from 'react'
import { Autocomplete, Card, Grid } from '@mui/material';
import { filterOptions } from 'src/AppFunction';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { STATUS_MATCH } from 'src/AppConst';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel'

function ManageCalendarSearch(props) {
    let {
        dataState,
        handleChangeData
    } = props;
    return (
        <Card sx={{ p: 2, mt: 2 }}>
            <ValidatorForm onSubmit={() => { }}>
                <Grid container spacing={2}>
                    <Grid item md={3} sm={6} xs={12}>
                        <TextValidator
                            label={'From date'}
                            className='w-100 mt-3'
                            type='date'
                            name="tuNgay"
                            variant="standard"
                            value={dataState?.tuNgay || new Date()}
                            onChange={(event) => handleChangeData(event.target.value, "tuNgay")}
                        />
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                        <TextValidator
                            label={'To date'}
                            className='w-100 mt-3'
                            type='date'
                            name="denNgay"
                            variant="standard"
                            value={dataState?.denNgay || new Date()}
                            onChange={(event) => handleChangeData(event.target.value, "denNgay")}
                        />
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                        <Autocomplete
                            id="combo-box"
                            fullWidth
                            options={dataState?.tournament || []}
                            onChange={(event, value) => handleChangeData(value, "tour")}
                            value={dataState?.tour || null}
                            getOptionLabel={(option) => option.tournamentsName || ""}
                            filterOptions={filterOptions}
                            renderInput={(params) => (
                                <TextValidator
                                    {...params}
                                    label="Tournament"
                                    placeholder='Tournament'
                                    variant="standard"
                                    value={dataState?.tour || ""}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                        <Autocomplete
                            id="combo-box"
                            fullWidth
                            options={STATUS_MATCH}
                            onChange={(event, value) => handleChangeData(value, "status")}
                            value={dataState?.status || null}
                            getOptionLabel={(option) => option.name || ""}
                            filterOptions={filterOptions}
                            renderInput={(params) => (
                                <TextValidator
                                    {...params}
                                    label="Filter by status"
                                    placeholder='Fillter by status'
                                    variant="standard"
                                    value={dataState?.status || ""}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={3} sm={3} xs={12}>
                        <FormGroup sx={{ pt: 1 }} >
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="warning"
                                        checked={dataState?.checked}
                                        onChange={(value) => handleChangeData(value, "checked")}
                                    />} label="Is all" />
                        </FormGroup>
                    </Grid>
                </Grid>
            </ValidatorForm>
        </Card>
    )
}

export default ManageCalendarSearch
