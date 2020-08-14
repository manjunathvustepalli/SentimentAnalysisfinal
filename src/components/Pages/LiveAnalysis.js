import React from 'react'
import SideNav from '../Navigation/SideNav'
import { Card, Grid, TextField } from '@material-ui/core'
import MaterialTable from 'material-table'

function LiveAnalysis() {
    return (
        <SideNav>
            <Card>
                <Grid container spacing={5} style={{margin:'20px 0'}}>
                    <Grid item lg={3} md={2} sm={1} xs={0}>

                    </Grid>
                    <Grid item lg={6} md={8} sm={10} xs={12} align='center'>
                        <TextField 
                            type='text'
                            fullWidth
                            variant='standard'
                            label='Enter Keyword'
                        />
                    </Grid>
                    <Grid item lg={3} md={2} sm={1} xs={0}>

                    </Grid>
                    <Grid xs={12}>
                        <MaterialTable 
                            title='Live Analysis'
                            columns={[
                                {title:'Date',field:'date'},
                                {title:'Description',field:'tweet'},
                                {title:'Language',field:'language'},
                                {title:'Source',field:'source'},
                                {title:'Sub Source',field:'subSource'},
                                {title:'Sentiment',field:'sentiment'},
                                {title:'Mood',field:'mood'},
                            ]}
                            data={[
                                {
                                    date:'14-08-2020 3:45',
                                    tweet:'this is a comment',
                                    language:'Bengali',
                                    source:'Twitter',
                                    subSource:'Web',
                                    sentiment:'Negative',
                                    mood:'Anger'
                                },{
                                    date:'14-08-2020 3:45',
                                    tweet:'this is a comment',
                                    language:'English',
                                    source:'Facebook',
                                    subSource:'Mobile App',
                                    sentiment:'Negative',
                                    mood:'Anger'
                                },{
                                    date:'14-08-2020 3:45',
                                    tweet:'this is a comment',
                                    language:'English',
                                    source:'Twitter',
                                    subSource:'Web',
                                    sentiment:'Negative',
                                    mood:'Joy'
                                },{
                                    date:'14-08-2020 3:45',
                                    tweet:'this is a another comment',
                                    language:'bengali',
                                    source:'Youtube',
                                    subSource:'Web',
                                    sentiment:'Negative',
                                    mood:'Anticipation'
                                }
                            ]}
                            options={{
                                grouping:true
                            }}
                        />
                    </Grid>
                </Grid>
            </Card>
        </SideNav>
    )
}

export default LiveAnalysis
