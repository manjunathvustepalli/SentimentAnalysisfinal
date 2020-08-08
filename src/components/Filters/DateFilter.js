import React, {useState} from 'react'
import 'date-fns'
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from "@material-ui/pickers";
  import { makeStyles } from '@material-ui/core/styles';


function DateFilter(props) {

    const time = new Date();
    const [startDate, setStartDate] = useState(time);
    const [endDate, setEndDate] = useState(time);
    const [to,from,setTo,setFrom,addMonths] = props.toFromDatesHandlers;
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.formControl}
              margin="normal"
              id="start-date-picker-dialog"
              label="Start Date"
              value = {startDate}
              onChange= {handleStartDateChange}
              format="dd-MM-yyyy"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              className={classes.formControl}
              margin="normal"
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
    )
}

export default DateFilter
