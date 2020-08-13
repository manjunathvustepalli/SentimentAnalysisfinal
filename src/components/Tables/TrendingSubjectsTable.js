import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("#covid 19", "10,00,000", "10,00,000", "10,00,000"),
  createData("#covid 19", "10,00,000", "10,00,000", "10,00,000"),
  createData("#covid 19", "10,00,000", "10,00,000", "10,00,000"),
  createData("#covid 19", "10,00,000", "10,00,000", "10,00,000"),
  createData("#covid 19", "10,00,000", "10,00,000", "10,00,000"),
];

function TrendingSubjectsTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Hashtag</TableCell>
            <TableCell align="right">Total Feed</TableCell>
            <TableCell align="right">Total Liked</TableCell>
            <TableCell align="right">Total shared</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TrendingSubjectsTable;
