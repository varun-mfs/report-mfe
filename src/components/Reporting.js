import Table from '@material-ui/core/Table';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    // marginTop: '5px',
  },
});

function createData(name, age, sex, country, salary) {
  return { name, age, sex, country, salary };
}
// add data
const rows = [
createData('John', 45, 'Male', 'Canada', 5000),
createData('Mary', 25, 'Female', 'London', 8500),
createData('Nick', 31, 'Male', 'America', 7800),
];

export default function BasicTable() {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">  
        <TableHead>
          <TableRow>
            <TableCell>Agency Name</TableCell>
            {/* <TableCell align="right">Agency Name</TableCell> */}
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Link</TableCell>
            <TableCell align="right">Read Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
               {row.name}
              </TableCell>
              {/* <TableCell align="right">{row.age}</TableCell> */}
              <TableCell align="right">{row.sex}</TableCell>
              <TableCell align="right">{row.country}</TableCell>
              <TableCell align="right">{row.salary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
