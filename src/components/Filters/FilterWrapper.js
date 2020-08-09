import React from 'react'
import { CardContent, Card, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import styled from 'styled-components';

const IconWithText = styled.div`
  display: flex;
  align-items:center;
  justify-content:flex-start;
  font-size:20px;
  color:white
`;


function FilterWrapper( {children} ) {
    return (
        <Card style={{backgroundColor:'#2C3335'}}>
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <IconWithText>
                            <FilterListIcon style={{margin:'0 20px'}} /> 
                            <p> FILTERS </p>
                        </IconWithText>
                    </Grid>
                    <Grid item xs={12}>
                        { children }
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default FilterWrapper
