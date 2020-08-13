import React, {useState} from 'react'
import 'date-fns'
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from "@material-ui/pickers";
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment'


function SingleDate(props) {

    const setDate = props.singleDate
    const [calender, setCalender] = useState(new Date())
    const handleDateChange = (date) => {
        setCalender(date)
        setDate(moment(date).format('DD-MM-YYYY'));
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
              label="Select Date"
              value = {calender}
              onChange= {handleDateChange}
              format="dd-MM-yyyy"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
        </MuiPickersUtilsProvider>
    )
}

export default SingleDate
