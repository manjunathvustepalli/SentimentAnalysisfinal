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
import { Typography, Grid, FormControl, InputLabel, Select, MenuItem, Avatar } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ShareIcon from '@material-ui/icons/Share';
import { green } from '@material-ui/core/colors';

const columns = [
  { id: 'influencer', label: 'Influencer',align:'center' },
  { id: 'totalPosts', label: 'Total Posts',align:'center' },
  {
    id: 'enguagement',
    label: 'AVR. ENG/POST',
    align:'center'
  },
  {
    id: 'followers',
    label: 'Total Followers',
    align:'center'
  },
  {
    id: 'sentiment',
    label: 'Sentiment',
    align:'center'
  },
];

const rows = [
    {
    influencer: <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly'}}>
                  <Avatar src={require('../../imgs/k.JPG')} />
                  <span> E.Karthik </span>
                </div> ,
        totalPosts:500,
        enguagement:<div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly'}}>
                      <FavoriteIcon style={{ color: green[500] }}/>
                      <span> 500 </span>
                      <ChatBubbleIcon style={{ color: green[500] }} />
                      <span> 200 </span>
                      <ShareIcon style={{ color: green[500] }} />
                      <span> 100 </span>
                    </div>,
        followers:'1.2M',
        sentiment:<div style={{color:'green',fontWeight:'900'}}> POSTITIVE </div>
    },
    {
      influencer: <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly'}}>
                    <Avatar>TT</Avatar>
                    <span> Tanvir Tushar </span>
                  </div> ,
          totalPosts:200,
          enguagement:<div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly'}}>
                        <FavoriteIcon style={{ color: green[500] }}/>
                        <span> 200 </span>
                        <ChatBubbleIcon style={{ color: green[500] }} />
                        <span> 40 </span>
                        <ShareIcon style={{ color: green[500] }} />
                        <span> 30 </span>
                      </div>,
          followers:'1M',
          sentiment:<div style={{color:'green',fontWeight:'900'}}> POSTITIVE </div>
      },
      {
        influencer: <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly'}}>
                      <Avatar > TP </Avatar>
                      <span> Tanvir paros </span>
                    </div> ,
            totalPosts:100,
            enguagement:<div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly'}}>
                          <FavoriteIcon style={{ color: 'red' }}/>
                          <span> 90 </span>
                          <ChatBubbleIcon style={{ color: 'red' }} />
                          <span> 50 </span>
                          <ShareIcon style={{ color: 'red' }} />
                          <span> 20 </span>
                        </div>,
            followers:'990k',
            sentiment:<div style={{color:'red',fontWeight:'900'}}> NEGATIVE </div>
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


  return (
    <Paper className={classes.root} >         
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
        rowsPerPageOptions={[10, 20, 30]}
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