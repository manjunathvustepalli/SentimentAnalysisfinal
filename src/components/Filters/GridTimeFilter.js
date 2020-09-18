import React, {useState} from 'react'
import 'date-fns'
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
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
      if(props.dateTime){
        setTo(date)
      }else {
        setTo(addMonths(date,0))
      }
        setStartDate(date)
      };
      const handleEndDateChange = (date) => {
        if(props.dateTime){
          setFrom(date)
        }else {
          setFrom(addMonths(date,0))
        }        
        setEndDate(date)
      };
  
    const useStyles = makeStyles((theme) => ({
        formControl: {
            fullWidth: true,
            margin:'10px'
        }
    }));
    
    const classes = useStyles();
    
    return (
      <div id="timeDate" style={{width:'100%'}}>
        <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              className={classes.formControl}
              id="start-date-picker-dialog"
              label="Start Date"
              value = {startDate}
              onChange= {handleStartDateChange}
              format="dd-MM-yyyy"
              variant="outlined"
              inputVariant="outlined"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              className={classes.formControl}
              id="end-date-picker-dialog"
              label="End Date"
              value = {endDate}
              onChange = {handleEndDateChange}
              format="dd-MM-yyyy"
              variant="outlined"
              inputVariant="outlined"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
        </MuiPickersUtilsProvider>
            </Grid>
        </Grid>

      </div>
    )
}

export default GridTimeFilter
