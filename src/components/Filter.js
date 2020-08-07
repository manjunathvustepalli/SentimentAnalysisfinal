import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import CodeIcon from '@material-ui/icons/Code';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { TextField, Card, CardContent } from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';
import { IconButton } from '@material-ui/core';

const Filter =(props)=>{

    const { to,from,setFrom,setTo,addMonths } = props

    const [type, setType] = React.useState('');
    const handleChange = (event) => {
        setType(event.target.value);
      };


    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: '20px',
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
        <>
        <div className="filter-div-root" style={{backgroundColor:'white'}}>
                {/* <Card>
                    <CardContent>
                        <Grid container>
                            <Grid xs={5} style={{padding:'20px 0'}}>
                                <Button>
                                <ReplayIcon style={{}}/> Reload 
                                </Button>
                            </Grid>
                            <Grid xs={7}>

                            </Grid>
                        </Grid>
                    </CardContent>
                </Card> */}
                <Grid container justify="space-between" className="grid-user">  
                    <Typography inline variant="h6" align="left" className="refresh-text"><FilterListIcon/>&nbsp;Filter</Typography>
                    <Typography inline variant="body1" align="right"><MoreHorizIcon/></Typography>
                </Grid>

                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Keyword</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={type}
                    onChange={handleChange}
                    label="Key Word"
                    className={classes.select}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Type 1</MenuItem>
                    <MenuItem value={20}>Type 1</MenuItem>
                    <MenuItem value={30}>Type 1</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField id="outlined-basic" label="Enter Your Keyword" variant="outlined" />
                </FormControl>
                <Grid container  style={{margin:'30px 0'}} >
                    <Grid xs={6}>
                    <form noValidate>
  <TextField
    id="date"
    label="Start Date"
    type="date"
    onChange={(e) => setFrom(addMonths(new Date(e.target.value),0))}
    defaultValue={from}
    className={classes.textField}
    InputLabelProps={{
      shrink: true,
    }}
  />
</form>
                    </Grid>
                    <Grid xs={6}>
                    <form noValidate>
  <TextField
    id="date"
    label="End Date"
    type="date"
    onChange={(e) => setTo(addMonths(new Date(e.target.value),0))}
    defaultValue={to}
    className={classes.textField}
    InputLabelProps={{
      shrink: true,
    }}
  />
</form>
                    </Grid>
                </Grid>
            
                <Grid container style={{color:'black',fontSize:'small'}}>
                    <Grid xs={12} style={{padding:'10px 0',fontSize:'large',borderBottom:'1px solid #616C6F'}}>
                    <CodeIcon style={{margin:'0 10px',transform:'translateY(5px)'}}/> Source
                    </Grid>
                    <Grid item xs={6} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Twitter </span>
                    </Grid>
                    <Grid item xs={6} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Instagram </span>
                    </Grid>
                    <Grid item xs={6} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Facebook </span>
                    </Grid>
                    <Grid item xs={6} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Youtube </span>
                    </Grid>
                    <Grid item xs={6} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> All </span>
                    </Grid>
                    <Grid item xs={6} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Other  Media </span>
                    </Grid>
                </Grid>
                <Grid container style={{color:'black',fontSize:'small'}}>
                    <Grid xs={12} style={{padding:'10px 0',fontSize:'large',borderBottom:'1px solid #616C6F'}}>
                    <RecordVoiceOverIcon style={{margin:'0 10px',transform:'translateY(5px)'}}/> Languages
                    </Grid>
                    <Grid item xs={4} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Bangla </span>
                    </Grid>
                    <Grid item xs={4} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> English </span>
                    </Grid>
                    <Grid item xs={4} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> All </span>
                    </Grid>
                </Grid>
                <Grid container style={{color:'black',fontSize:'small'}}>
                    <Grid xs={12} style={{padding:'10px 0',fontSize:'large',borderBottom:'1px solid #616C6F'}}>
                     <InsertEmoticonIcon style={{margin:'0 10px',transform:'translateY(5px)'}} />
                        Sentiment
                    </Grid>
                    <Grid item xs={4} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Positive </span>
                    </Grid>
                    <Grid item xs={4} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Negative </span>
                    </Grid>
                    <Grid item xs={4} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> Neutral </span>
                    </Grid>
                    <Grid item xs={4} >
                    <Checkbox
                        style={{borderColor:'white'}}
                        color={'primary'}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <span> All </span>
                    </Grid>
                </Grid>
                <Grid >

                </Grid>
        </div>

        </>
    )
}

export default Filter;