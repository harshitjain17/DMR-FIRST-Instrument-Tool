// COLORFUL TABLE
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchResult from './SearchResult.json';
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Grid,
    Typography,
    TablePagination,
    TableFooter
 } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    },
    tableContainer: {
        borderRadius: 15,
        margin: '10px 10px',
        maxWidth: 950
    },
    tableHeaderCell: {
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    avatar: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.getContrastText(theme.palette.primary.light)
    },
    name: {
        fontWeight: 'bold',
        color: theme.palette.secondary.dark
    },
    status: {
        fontWeight: 'bold',
        fontSize: '0.75rem',
        color: 'white',
        backgroundColor: 'grey',
        borderRadius: 8,
        padding: '3px 10px',
        display: 'inline-block'
    }
  }));

let USERS = [];
// let STATUSES = ['Active', 'Inactive'];
for(let i=0; i<SearchResult.length; i++) {
    USERS[i] = SearchResult[i];
}

export default function DataTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaderCell}>Institution</TableCell>
            <TableCell className={classes.tableHeaderCell}>Instrument Type</TableCell>
            <TableCell className={classes.tableHeaderCell}>Instrument Name</TableCell>
            <TableCell className={classes.tableHeaderCell}>DOI</TableCell>
            <TableCell className={classes.tableHeaderCell}>Location</TableCell>
            <TableCell className={classes.tableHeaderCell}>Award</TableCell>
            <TableCell className={classes.tableHeaderCell}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {USERS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.institution}>
              <TableCell>
                  <Grid container>
                      <Grid item lg={2}>
                          <Avatar alt={row.institution} src='.' className={classes.avatar}/>
                      </Grid>
                      <Typography className={classes.name}>{row.institution}</Typography>
                  </Grid>
                </TableCell>
              <TableCell><Typography color="textSecondary" variant="body2">{row.type}</Typography></TableCell>
              <TableCell><Typography color="textSecondary" variant="body2">{row.name}</Typography></TableCell>
              <TableCell><Typography color="textSecondary" variant="body2">{row.doi}</Typography></TableCell>
              <TableCell><Typography color="textSecondary" variant="body2">{row.location}</Typography></TableCell>
              <TableCell><Typography color="textSecondary" variant="body2">{row.award}</Typography></TableCell>
              <TableCell>
                  <Typography 
                    className={classes.status}
                    style={{backgroundColor: ((row.status === 'Active' && 'green') ||(row.status === 'Inactive' && 'red'))}}>
                      {row.status}
                  </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={USERS.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </TableFooter>
      </Table>
    </TableContainer>
  );
};




// PROFESSINAL DATATABLE
// import React from 'react';
// import { DataGrid } from '@mui/x-data-grid';

// const columns = [
//   { field: 'id', headerName: 'ID', type: 'number', width: 120 },
//   { field: 'institution', headerName: 'Institution', width: 190 },
//   { field: 'type', headerName: 'Instrument Type', width: 140 },
//   { field: 'name', headerName: 'Instrument Name', width: 150 },
//   { field: 'doi', headerName: 'DOI', width: 160 },
//   { field: 'location', headerName: 'Location', width: 150 },
//   { field: 'award', headerName: 'Award', width: 150 },
//   { field: 'status', headerName: 'Status', width: 100 },
//   // { field: 'fullName', headerName: 'Full name', description: 'This column has a value getter and is not sortable.', sortable: false, width: 160,
//   //   valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//   // }
// ];

// const rows = [
//     {
//       id: 1,
//       institution: "Penn State University",
//       type: "Raman",
//       name: "Lucy",
//       doi: "riu8y87h4u4", 
//       location: "N-02B",
//       award: "433647492",    
//       status: "Active",
//     },
//     {
//       id: 2,
//       institution: "Penn State University",
//       type: "Auger S.",
//       name: "Auger",
//       doi: "364vrubfu4y58",
//       location: "N-01A",
//       award: "364228191",
//       status: "Active",
//     }
// ]
// export default function DataTable() {
//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSize={5}
//         rowsPerPageOptions={[5]}
//         checkboxSelection
//       />
//     </div>
//   );
// };