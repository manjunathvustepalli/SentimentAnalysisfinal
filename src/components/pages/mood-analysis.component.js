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
import MoodAreaChart from './chart/MoodAreaChart' 
import SideNav from '../navigation/sidebar'
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
    const [chartType, setChartType] = useState('pie chart')
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const menus = [
       
    ]

    const handleChange = (e) => {
        setChartType(e.target.value)
    }

    return (
        <SideNav>
            <div style={{ color: "green", fontSize: 20, backgroundColor: '#F7F7F7' }}> Mood analysis
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item sm={8}>
                                <CardContent>
                                    Mood Wise Trend
                                </CardContent>
                            </Grid>
                            <Grid item sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">change Chart type</InputLabel>
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
                            {menus.map((listItem, index) => (
                                <ListItem button key={index}>
                                    <ListItemIcon>{listItem.icon}</ListItemIcon>
                                        <ListItemText primary={listItem.text} style={{color:'black'}} />
                                </ListItem>
        ))}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <MoodAreaChart/>
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