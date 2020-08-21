import React, {useState} from 'react'
import 'date-fns'
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from "@material-ui/pickers";
  import { makeStyles } from '@material-ui/core/styles';
import { addMonths } from '../../helpers';
import { Grid } from '@material-ui/core';



function GridTimeFilter(props) {
    const Stime = new Date();
    const [startDate, setStartDate] = useState(Stime.setMonth(Stime.getMonth() - 1));
    const Etime = new Date();
    const [endDate, setEndDate] = useState(Etime);
    const [setTo, setFrom] = props.toFromDatesHandlers;
    const handleStartDateChange = (date) => { 
        setTo(addMonths(date,0))
        setStartDate(date)
      };
      const handleEndDateChange = (date) => {
        setFrom(addMonths(date,0))
        setEndDate(date)
      };
  
    const useStyles = makeStyles((theme) => ({
        formControl: {
            marginBottom: '20px',
            fullWidth: true,
            display: 'flex',
            wrap: 'nowrap'
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
        select:{
            width:'100%'
        }
    }));
    
    const classes = useStyles();
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.formControl}
              margin='dense'
              id="start-date-picker-dialog"
              label="Start Date"
              value = {startDate}
              onChange= {handleStartDateChange}
              format="dd-MM-yyyy"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.formControl}
              margin='dense'
              id="end-date-picker-dialog"
              label="End Date"
              value = {endDate}
              onChange = {handleEndDateChange}
              format="dd-MM-yyyy"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
        </MuiPickersUtilsProvider>
            </Grid>
        </Grid>

    )
}

export default GridTimeFilter
