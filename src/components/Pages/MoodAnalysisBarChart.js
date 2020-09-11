import React, { useState, useEffect, useContext } from 'react'
import SideNav from '../Navigation/SideNav'
import { Grid, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import FilterHeader from '../Filters/FilterHeader'
import FilterWrapper from '../Filters/FilterWrapper'
import AccordianFilters from '../Filters/AccordianFilters'
import { addMonths, getKeyArray, getDocCountByKey } from '../../helpers'
import Axios from 'axios';
import { MoodAnalysisAreaChartFilter } from '../../helpers/filter';
import BarChart from '../charts/BarChart'
import { MoodAnalysisFiltersContext } from '../../contexts/MoodAnalysisContext'
import useMountAndUpdateEffect from '../custom Hooks/useMountAndUpdateEffect'
import useDidUpdateEffect from '../custom Hooks/useDidUpdateEffect'


const useStyles = makeStyles((theme) => ({
    main: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#CB0038",
    },
    formControl: {
        margin: '20px',
        fullWidth: true,
        display: 'flex',
        wrap: 'nowrap'
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
var sortedData = {}

function MoodAnalysisBarChart(props) {
	var colors = {
		'joy':'#4C7A00',
		'sad':'#D8D8D8',
		'anger':'#FF5151',
		'anticipation':'#111D31',
		'disgust':'#D512CF',
		'surprise':'#FF6600',
		'fear':'#2000FF',
		'trust':'#0099FF',
		'positive':'#04E46C',
		'negative':'#CB0038',
		'neutral':'#FFC400'
	  }
    const classes = useStyles()
	const moodFilters = useContext(MoodAnalysisFiltersContext)
	const {
		keywords,
		setKeywords,
		keywordType, 
		setKeywordType,
		from,
		setFrom,
		to,
		setTo,
		sources,
		setSources,
		subSources,
		setSubSources,
		languages,
		setLanguages,
		moods,
		setMoods
	} = moodFilters
	const [refresh, setRefresh] = useState(true)
	const [chartType, setChartType] = useState(props.stack ? 'stack' :'bar') 
    const [data, setData] = useState({})
    const [dates, setDates] = useState([])
	const handleChange = (e) => {
		setChartType(e.target.value)
	}

	const fetchData = (changeInState) => {
		
		let query = {
			"aggs": {
			  "date-based-range": {
				"date_range": {
				  "field": "CreatedAt",
				  "format": "dd-MM-yyyy",
				  "ranges": [
					{ "from": from,"to": to}
				  ]
				},
				"aggs": {
				  "lang": {
					"terms": {
					  "field": "predictedLang.keyword"
					},
					"aggs": {
					  "Source": {
						"terms": {
						  "field": "Source.keyword"
						},
						"aggs":{
							"SubSource":{
								"terms":{
									"field": "SubSource.keyword"
								},
							
	
							"aggs": {
								"per-day": {
								  "date_histogram": {
									  "field": "CreatedAt",
									  "format": "yyyy-MM-dd", 
									  "calendar_interval": "day"
								  },
								"aggs": {
								  "Daily-Sentiment-Distro": {
									"terms": {
									  "field": "predictedMood.keyword"
									}
								  }
								}
								}
							}
						  }
						}
						}
					  }
					}
				  }
				}
			  }
			}
			if(keywordType === 'Screen Name'){
				query["query"] = {
					"terms": {
					  "User.ScreenName.keyword": keywords
					}
				  }
			} else if (keywordType === 'Hash Tags') {
				query["query"] =  {
					"terms": {
					  "HashtagEntities.Text.keyword": keywords
					}
				}
			}
		Axios.post(process.env.REACT_APP_URL,
			query,{
			 headers:{
				'Content-Type':'application/json'
			}
		})
	 .then( fetchedData => {
		 var sourceKeys,subSourceKeys
		 var uniqueSourceKeys = []
		 var uniqueSubSourceKeys = []
		 let languageBuckets = fetchedData.data.aggregations['date-based-range'].buckets[0].lang.buckets
		 var languageKeys = getKeyArray(languageBuckets)
		 if(languageKeys[0]){
			languageKeys.forEach((key,i) =>{
				let sourceBuckets = languageBuckets[i].Source.buckets
				sourceKeys = getKeyArray(sourceBuckets)
				sortedData[key] ={}
				sourceKeys.forEach((source,j) => {
				   if(!uniqueSourceKeys.includes(source)){
					   uniqueSourceKeys.push(source)
				   }
				   sortedData[key][source] ={}
				   let subSourceBuckets = sourceBuckets[j].SubSource.buckets
				   subSourceKeys = getKeyArray(subSourceBuckets)
				   subSourceKeys.forEach((subSource,k) => {
					if(!uniqueSubSourceKeys.includes(subSource)){
						uniqueSubSourceKeys.push(subSource)
					}
					sortedData[key][source][subSource] = {}
					let perDayBuckets = subSourceBuckets[k]['per-day'].buckets
					let perDayKeys = subSourceBuckets[k]['per-day'].buckets.map(item => item.key_as_string)
				   sortedData[key][source][subSource]['dates'] = perDayKeys
				   sortedData[key][source][subSource]['joy'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'joy'))
				   sortedData[key][source][subSource]['anticipation'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'anticipation'))
				   sortedData[key][source][subSource]['fear'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'fear'))
				   sortedData[key][source][subSource]['disgust'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'disgust'))
				   sortedData[key][source][subSource]['sad'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'sad'))
				   sortedData[key][source][subSource]['surprise'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'surprise'))
				   sortedData[key][source][subSource]['trust'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'trust'))
				   sortedData[key][source][subSource]['anger'] = perDayBuckets.map(item => getDocCountByKey(item['Daily-Sentiment-Distro'].buckets,'anger'))                })                  
			   });
			})
			if(changeInState){

				setSources(prev =>{
					let availableSourceKeys = {}
					uniqueSourceKeys.forEach(source =>{
						availableSourceKeys[source] = !!prev[source]
					})
					return availableSourceKeys
				})
	
				setLanguages(prev =>{
					let availableLanguageKeys = {}
					languageKeys.forEach(lang =>{
						availableLanguageKeys[lang] = !!prev[lang]
					})
					return availableLanguageKeys
				})
	

				setSubSources(prev =>{
					let availableSubSourceKeys = {}
					uniqueSubSourceKeys.forEach(subSource => {
						availableSubSourceKeys[subSource] = !!prev[subSource]
					})
					return availableSubSourceKeys
				})
	
				setMoods(prev =>{
					if(Object.keys(prev).length){
						return prev
					} else {
					   return {'joy':true,'anticipation':true,'fear':true,'disgust':true,'sad':true,'surprise':true,'trust':true,'anger':true}
					}})   	
			} else {

				setSources(prev =>{
					let availableSourceKeys = {}
					uniqueSourceKeys.forEach(source =>{
						availableSourceKeys[source] = true
					})					
					return availableSourceKeys
				})
	
				let availableLanguageKeys = {}
				languageKeys.forEach(lang =>{
					availableLanguageKeys[lang] = true
				})
				setLanguages(availableLanguageKeys)
	
				let availableSubSourceKeys = {}
				uniqueSubSourceKeys.forEach(subSource => {
					availableSubSourceKeys[subSource] = true
				})
				setSubSources(availableSubSourceKeys)
	
				setMoods(prev =>{
					if(Object.keys(prev).length){
						return prev
					} else {
					   return {'joy':true,'anticipation':true,'fear':true,'disgust':true,'sad':true,'surprise':true,'trust':true,'anger':true}
					}})   	
			}
		 } else {
			 setSources({})
			 setLanguages({})
			 setMoods({})
			 sortedData = {}
		 }
			 })
	 .catch(err => {
		 console.log(err)
	 })
	}

	useMountAndUpdateEffect(()=>{
        fetchData(true)
    },()=>{
        fetchData(true)
    },[from,to,refresh,keywords])

    useDidUpdateEffect(()=>{
        if(keywordType === 'Entire Data'){
            fetchData(false)
        }
	},[keywordType])

     useEffect(() => {
        const [finalData]  = MoodAnalysisAreaChartFilter(languages,moods,sources,subSources,sortedData,from,to)
        setDates(finalData.dates)
        let obj = []
        Object.keys(finalData).forEach(key => {
            if(key !== 'dates'){
                obj.push({
                    name:key,
                    color:colors[key],
                    data:finalData[key]
                })
            }
        })
        setData(obj)
    }, [languages, moods, subSources])

    useEffect(() => {
        const [finalData,availableSubSources]  = MoodAnalysisAreaChartFilter(languages,moods,sources,subSources,sortedData,from,to)
        setDates(finalData.dates)
        let obj = []
        Object.keys(finalData).forEach(key => {
            if(key !== 'dates'){
                obj.push({
                    name:key,
                    color:colors[key],
                    data:finalData[key]
                })
            }
        })
        setData(obj)
        let availableSubSourceKeys = {}
        availableSubSources.forEach(subSource =>{
            availableSubSourceKeys[subSource]  = true
        })
        setSubSources(availableSubSourceKeys)
    }, [sources]) 

    return (
        <SideNav>
            <div style={{ backgroundColor: '#F7F7F7', padding:'20px 0px 20px 20px', }}>
            {chartType === 'pie' && <Redirect to='/mood-analysis/pie-chart' />}
            {chartType === 'line' && <Redirect to='/mood-analysis/line-chart' />}
            {chartType === 'semi pie' && <Redirect to='/mood-analysis/semi-donut-chart' />}
            {chartType === 'area' && <Redirect to='/mood-analysis/area-chart' />}
            <Grid container spacing={2} >
                <Grid item md={8} sm={12}>
                    <Typography style={{ color:'#43B02A',fontSize:'30px',}}>
                        Mood Analysis
                    </Typography>
                    <Card className={classes.main}>
                        <Grid container spacing={3}>
                            <Grid item sm={8}>
                                <CardContent>
                                    Mood Wise Trend
                                </CardContent>
                            </Grid>
                            <Grid item sm={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Change Chart Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={chartType}
                                onChange={handleChange}
                                label="Change Chart Type"
                            >
                            <MenuItem value='area'>Area chart</MenuItem>
                            <MenuItem value='line'>Line chart</MenuItem>
                            <MenuItem value='bar'>Bar chart</MenuItem>
                            <MenuItem value='stack'>Stacked Bar chart</MenuItem>
                            <MenuItem value='pie'>Pie chart</MenuItem>
                            <MenuItem value='semi pie'>Semi Pie chart</MenuItem>                            </Select>
                            </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <BarChart data={data} stacking={chartType==='stack' ? 'normal' : ''} categories={dates} />
                        </Grid>
                    </Card>
                </Grid>
                <Grid item sm={12} md={4}  >
                    <Grid container spacing={3} style={{position:'sticky',top:'60px'}}>
                        <Grid item xs={12} >
                            <FilterHeader refresh={[refresh,setRefresh]} />
                        </Grid>
                        <Grid item xs={12}>
                            <FilterWrapper>
                                <AccordianFilters 
                                    toFromDatesHandlers={[setFrom,setTo,from,to]} 
                                    sources={[sources,setSources]} 
                                    languages={[languages,setLanguages]} 
                                    moods={[moods,setMoods]} 
                                    subSources={[subSources,setSubSources]}
									setKeywords={setKeywords}
									keywords={keywords}
                                    keywordTypes={[keywordType, setKeywordType]}
                                />
                            </FilterWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>       
        </SideNav>

    )
}

export default MoodAnalysisBarChart
