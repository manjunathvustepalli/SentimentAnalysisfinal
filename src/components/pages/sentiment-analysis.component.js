import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './sentimental.scss'
import DonutChart from './chart/donut.chart';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SideNav from '../navigation/sidebar'
import { Redirect } from 'react-router-dom';
import Filter from '../Filter';


const useStyles = makeStyles((theme) => ({
    main: {

        fontSize: 16,
        fontWeight: "bold",
        color: "#CB0038",
    },
    filter: {
        color: "green",
    },
    formControl:{
        marginTop:'20px'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    dataDate:{
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginTop:50,
    },
    paper: {
        height: 140,
        width: 130,        
      },
}));


export default function SentimentalAnalysis() {
    const [chartType, setChartType] = useState('pie chart');
    const [redirect, setRedirect] = useState(false);
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const handleChange = (e) => {
        console.log(e.target.value)
        setChartType(e.target.value)
        if(e.target.value === 'Area chart'){
            setRedirect(true)
        }
    }

    return (
        <SideNav>
            {redirect && (<Redirect to={'/sentimentalanalysis/areachart'} />)}
            <div style={{ color: "green", fontSize: 20, backgroundColor: '#F7F7F7' }}> Sentimental Analysis
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item sm={8}>
                                <CardContent>
                                    Source wise Sentiment wise Distribution of Post
                                </CardContent>
                            </Grid>
                            <Grid item sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={chartType}
                                onChange={handleChange}
                                label="Chart type"
                            >
                                    <MenuItem value="">
                                    <em>None</em>
                                    </MenuItem>
                                    <MenuItem value='pie chart'>pie chart</MenuItem>
                                    <MenuItem value='Area chart'>Area chart</MenuItem>
                                </Select>
                            </FormControl>
                            </Grid>
                        </Grid>
                        
                        <Grid container direction="column" justify="center" alignItems="center" className={classes.dataDate}>
                            Data as per :<br/>
                            <b> 18th jun 2020</b>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid  container direction="row" justify="flex-start" alignItems="flex-start">
                            {['Twitter','Youtube','Facebook','Instagram','Other Electronic Media'].map((value,i) => (
                                <Grid key={i} item sm={4} className="chart-grid" > 
                                    <DonutChart/>
                                    <Button variant="outlined"> {value} </Button>
                                </Grid>
                            ))}
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.filter}>
                        <CardContent>
                            <Filter/>
                    </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
        </SideNav>
        
    );
}