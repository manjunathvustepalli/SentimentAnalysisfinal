import React from 'react'
import { CardContent, Card, Grid } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList';
import styled from 'styled-components';

const IconWithText = styled.div`
  display: flex;
  align-items:center;
  justify-content:center;
  font-size:20px;
  color:white
`;


function FilterWrapper( {children} ) {
    return (
        <Card style={{backgroundColor:'#2C3335',minHeight:'68vh'}}>
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <IconWithText style={{padding:'10px'}}>
                            <FilterListIcon /> 
                            <p>&nbsp;&nbsp;&nbsp;FILTERS </p>
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
