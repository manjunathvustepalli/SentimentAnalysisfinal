import React, {useState} from 'react'
import 'date-fns'
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from "@material-ui/pickers";
  import { makeStyles } from '@material-ui/core/styles';
import { addMonths } from '../../helpers';


function DateFilter(props) {
  const [setTo, setFrom,from,to] = props.toFromDatesHandlers;
  const Stime = new Date();
  const [startDate, setStartDate] = useState(new Date(from.split('-')[2],parseInt(from.split('-')[1])-1,from.split('-')[0])); 
  const Etime = new Date();
  const [endDate, setEndDate] = useState(new Date(to.split('-')[2],parseInt(to.split('-')[1])-1,to.split('-')[0]));
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
      <div id="side-filters-time-date" style={{width:'100%'}} >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.formControl}
              margin="normal"
              inputVariant="outlined"
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
              inputVariant="outlined"
              label="End Date"
              value = {endDate}
              onChange = {handleEndDateChange}
              format="dd-MM-yyyy"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
        </MuiPickersUtilsProvider>
      </div>
    )
}

export default DateFilter
