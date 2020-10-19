import { capitalize, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core'
import Axios from 'axios'
import React, { useEffect, useState } from 'react';
import AdminTable from '../Tables/AdminTable';
import Loader from '../LoaderWithBackDrop'
import {Auth} from './Auth'
function Admin() {
    const sourcesQueryKeys = {
        'facebook':'/getaddedfbpages',
        'instagram':'/getaddedinstagrampages',
        'blogger':'/getaddedbloggerpages',
        'telegram':'/getaddedtelegramchannels',
        'googlenews':'/getaddedgooglenewspages'
    }
    const [source, setSource] = useState('facebook')
    const [columns, setColumns] = useState([
        {
            title:'Pages',
            field:'name'
        }
    ])
    const [data, setData] = useState([]);
    const [newlyAddedWord, setNewlyAddedWord] = useState('');
    const [deletedWord, setDeletedWord] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [loaderOpen, setLoaderOpen] = useState(true);

    useEffect(() =>  {
        setLoaderOpen(true)
        Axios.get(`http://cors-anywhere.herokuapp.com/${process.env.REACT_APP_TUNNEL_URL}${sourcesQueryKeys[source]}`,Auth)
        .then(data=>{
            setData(data.data[Object.keys(data.data)[0]].map(item => {
                return {
                    name:item
                }
            }))
            setLoaderOpen(false)
        })
        .catch(err=>{
            setLoaderOpen(false)
            console.log(err,err.response)
        })
    },[source,refresh])

    useEffect(() => {
        setLoaderOpen(true)
        if(newlyAddedWord){
            const sourceAddQueryStrings={
            'facebook':'/fetchdatafromfb?fbpage=',
            'instagram':'/fetchdatafrominstagram?instapage=',
            'blogger':'/fetchdatafromblogger?bloggerpage=',
            'telegram':'/fetchdatafromtelegramchannel?telegramchannel=',
            'googlenews':'/fetchdatafromgooglenews?googlenewspage='
            }

            Axios.get(`http://cors-anywhere.herokuapp.com/${process.env.REACT_APP_TUNNEL_URL}${sourceAddQueryStrings[source]}${newlyAddedWord}`,Auth)
            .then(data => {
                setRefresh(prev => !prev)
                setLoaderOpen(false)
            })
            .catch(err => {
                setRefresh(prev => !prev)
                setLoaderOpen(false)
                console.log(err,err.response)
            })
        }
    }, [newlyAddedWord])

    useEffect(() => {
        setLoaderOpen(true)
        if(deletedWord){
            const sourceDeleteQueryStrings={
                'facebook':'/stopcrawlingfbpage?fbpage=',
                'instagram':'/stopcrawlinginstagrampage?instapage=',
                'blogger':'/stopcrawlingbloggerpage?bloggerpage=',
                'telegram':'/stopcrawlingtelegramchannel?telegramchannel=',
                'googlenews':'/stopcrawlinggooglenewspage?googlenewspage='
                }
            Axios.get(`http://cors-anywhere.herokuapp.com/${process.env.REACT_APP_TUNNEL_URL}${sourceDeleteQueryStrings[source]}${deletedWord}`,Auth)
            .then(data =>{
                console.log(data)
                setLoaderOpen(false)
                setRefresh(prev => !prev)
            })
            .catch(err =>{
                setLoaderOpen(false)
                console.log(err,err.response)
            })
        }
    }, [deletedWord])

    return (
        <div style={{width:'100%'}} >
            <Grid container spacing={2} >
            <Grid item xs={false} sm={3} />
            <Grid item xs={10} sm={6}>
                <FormControl variant="outlined" style={{width:'100%',marginTop:'30px'}}  >
                    <InputLabel id={'select-source'} > Select Source </InputLabel>
                    <Select
                        labelId="select-source"
                        value={source}
                        label={"Select Source"}
                        onChange={(e) =>{
                            setSource(e.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    >
                        <MenuItem value={'facebook'} > {'Facebook'} </MenuItem>
                        <MenuItem value={'instagram'} > {'Instagram'} </MenuItem>
                        <MenuItem value={'telegram'} > {'Telegram'} </MenuItem>
                        <MenuItem value={'googlenews'} > {'Google News'} </MenuItem>
                        <MenuItem value={'blogger'} > {'Blogger'} </MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={false} sm={3} />
            <Grid item xs={1} />
            <Grid item xs={10} >
                    <AdminTable
                        name={`${capitalize(source)} Pages `}
                        data={data}
                        source={source}
                        loaderOpen={loaderOpen}
                        columns={columns}
                        setNewlyAddedWord={setNewlyAddedWord}
                        setDeletedWord={setDeletedWord}
                    />
            </Grid>
            <Grid item xs={1} />
        </Grid>
        </div>
        )
}

export default Admin
