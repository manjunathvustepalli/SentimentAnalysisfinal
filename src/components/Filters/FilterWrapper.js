import React from 'react'
import { CardContent, Card, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import styled from 'styled-components';

const IconWithText = styled.div`
  display: flex;
  align-items:center;
  justify-content:center;
`;


function FilterWrapper( {children} ) {
    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <IconWithText>
                            <FilterListIcon style={{margin:'0 20px'}} /> 
                            <p> Filters </p>
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
