import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';


const columns = [
  { id: 'date', label: 'Date' },
  { id: 'time', label: 'Time' },
  {
    id: 'comment',
    label: 'Comment',
    align: 'left',
  },
  {
    id: 'reply',
    label: 'Reply',
  },
  {
    id: 'likes',
    label: 'Likes',
  },
];

const rows = [
    {
        date:'08-08-2020',
        time:'08:43:12',
        comment:'this is a comment to be displayed there',
        reply:'123',
        likes:'546'
    },
    {
        date:'08-08-2020',
        time:'08:43:12',
        comment:'this is a comment',
        reply:'123',
        likes:'546'
    },
    {
        date:'08-08-2020',
        time:'08:43:12',
        comment:'this is a comment to be displayed',
        reply:'123',
        likes:'546'
    },
    {
        date:'08-08-2020',
        time:'08:43:12',
        comment:'this is a comment to be displayed there, this is a comment',
        reply:'123',
        likes:'546'
    }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  formControl: {
    margin: '20px',
    width:'200px',
    display: 'flex',
    wrap: 'nowrap'
}
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sourceType, setSourceTypeChange] = useState([])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSourceTypeChange = (e) => {
      setSourceTypeChange(e.target.value)
  }

  return (
    <Paper className={classes.root} >
        <Grid container>
            <Grid item xs={6} align='center' >
                <Typography>
                    Source Wise Feeds
                </Typography>
            </Grid>
            <Grid item xs={6} align='center' >
            <FormControl variant="standard" className={classes.formControl}>
                <InputLabel id="source-select">Source type</InputLabel>
                    <Select
                        labelId="source-select"
                        id="select-source"
                        value={sourceType}
                        onChange={handleSourceTypeChange}
                        label="Source type"
                        >
                            {['Facebook','Twitter','Instagram','Youtube','Other Media'].map((source,i) => <MenuItem value={source} > {source} </MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
         
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
      );
}