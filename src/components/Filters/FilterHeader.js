import React from 'react'
import FilterListIcon from '@material-ui/icons/FilterList';
import RefreshIcon from '@material-ui/icons/Refresh';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography, Box, Button } from '@material-ui/core';


function FilterHeader() {
    return (
        <Grid container>
            <Grid xs={6} item align='center'>
                        <Typography style={{fontSize:'15px', margin:'6px 0'}}>
                            Last Refresh at 15:06:15
                        </Typography>
                </Grid>
                <Grid xs={6} item align='right'>
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    >
                        Refresh
                    </Button>
            </Grid>

        </Grid>
    )
}

export default FilterHeader
