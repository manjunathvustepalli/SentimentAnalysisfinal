import React, {useState} from 'react'
import 'date-fns'
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from "@material-ui/pickers";
  import { makeStyles } from '@material-ui/core/styles';


function SingleDate() {

    const time = new Date();
    const [date, setDate] = useState(time);

    const handleDateChange = (date) => {
        setDate(date);
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
              value = {date}
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
