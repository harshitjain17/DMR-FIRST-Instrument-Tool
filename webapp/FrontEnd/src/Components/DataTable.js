// // COLORFUL TABLE
// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import SearchResult from './SearchResult.json';
// import { 
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Avatar,
//     Grid,
//     Typography,
//     TablePagination,
//     TableFooter
//  } from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//     table: {
//       minWidth: 650,
//     },
//     tableContainer: {
//         borderRadius: 15,
//         margin: '10px 10px',
//         maxWidth: 950
//     },
//     tableHeaderCell: {
//         fontWeight: 'bold',
//         backgroundColor: theme.palette.primary.dark,
//         color: theme.palette.getContrastText(theme.palette.primary.dark)
//     },
//     avatar: {
//         backgroundColor: theme.palette.primary.light,
//         color: theme.palette.getContrastText(theme.palette.primary.light)
//     },
//     name: {
//         fontWeight: 'bold',
//         color: theme.palette.secondary.dark
//     },
//     status: {
//         fontWeight: 'bold',
//         fontSize: '0.75rem',
//         color: 'white',
//         backgroundColor: 'grey',
//         borderRadius: 8,
//         padding: '3px 10px',
//         display: 'inline-block'
//     }
//   }));

// let USERS = [], STATUSES = ['Active', 'Inactive'];
// for(let i=0; i<SearchResult.length; i++) {
//     USERS[i] = SearchResult[i];
// }

// export default function DataTable() {
//   const classes = useStyles();
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <TableContainer component={Paper} className={classes.tableContainer}>
//       <Table className={classes.table} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell className={classes.tableHeaderCell}>Institution</TableCell>
//             <TableCell className={classes.tableHeaderCell}>Instrument Type</TableCell>
//             <TableCell className={classes.tableHeaderCell}>Instrument Name</TableCell>
//             <TableCell className={classes.tableHeaderCell}>DOI</TableCell>
//             <TableCell className={classes.tableHeaderCell}>Location</TableCell>
//             <TableCell className={classes.tableHeaderCell}>Award</TableCell>
//             <TableCell className={classes.tableHeaderCell}>Status</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {USERS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//             <TableRow key={row.institution}>
//               <TableCell>
//                   <Grid container>
//                       <Grid item lg={2}>
//                           <Avatar alt={row.institution} src='.' className={classes.avatar}/>
//                       </Grid>
//                       <Typography className={classes.name}>{row.institution}</Typography>
//                   </Grid>
//                 </TableCell>
//               <TableCell><Typography color="textSecondary" variant="body2">{row.type}</Typography></TableCell>
//               <TableCell><Typography color="textSecondary" variant="body2">{row.name}</Typography></TableCell>
//               <TableCell><Typography color="textSecondary" variant="body2">{row.doi}</Typography></TableCell>
//               <TableCell><Typography color="textSecondary" variant="body2">{row.location}</Typography></TableCell>
//               <TableCell><Typography color="textSecondary" variant="body2">{row.award}</Typography></TableCell>
//               <TableCell>
//                   <Typography 
//                     className={classes.status}
//                     style={{backgroundColor: ((row.status === 'Active' && 'green') ||(row.status === 'Inactive' && 'red'))}}>
//                       {row.status}
//                   </Typography>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//         <TableFooter>
//         <TablePagination
//             rowsPerPageOptions={[5, 10, 15]}
//             component="div"
//             count={USERS.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onChangePage={handleChangePage}
//             onChangeRowsPerPage={handleChangeRowsPerPage}
//         />
//         </TableFooter>
//       </Table>
//     </TableContainer>
//   );
// };




// PROFESSINAL DATATABLE
import React from 'react';
import PropTypes from 'prop-types';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector
} from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import SearchResult from './SearchResult.json';

const columns = [
  { field: 'id', headerName: <b>ID</b>, type: 'number', width: 120 },
  { field: 'institution', headerName: <b>Institution</b>, width: 190 },
  { field: 'type', headerName: <b>Instrument Type</b>, width: 140 },
  { field: 'name', headerName: <b>Instrument Name</b>, width: 150 },
  { field: 'doi', headerName: <b>DOI</b>, width: 160 },
  { field: 'location', headerName: <b>Location</b>, width: 150 },
  { field: 'award', headerName: <b>Award</b>, width: 150 },
  { field: 'status', headerName: <b>Status</b>, width: 100 },
];

const getJson = (apiRef) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map((id) => {
    const row = {};
    visibleColumnsField.forEach((field) => {
      row[field] = apiRef.current.getCellParams(id, field).value;
    });
    return row;
  });

  // Stringify with some indentation
  return JSON.stringify(data, null, 2);
};

const exportBlob = (blob, filename) => {
  // Save the blob in a json file
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};

const JsonExportMenuItem = (props) => {
  const apiRef = useGridApiContext();
  const { hideMenu } = props;
  return (
    <MenuItem
      onClick={() => {
        const jsonString = getJson(apiRef);
        const blob = new Blob([jsonString], {
          type: 'text/json',
        });
        exportBlob(blob, 'DataGrid_demo.json');

        // Hide the export menu after the export
        hideMenu?.();
      }}
    >
    Export JSON
    </MenuItem>
  );
};

JsonExportMenuItem.propTypes = {
  hideMenu: PropTypes.func,
};

const csvOptions = { delimiter: ';' };

const CustomExportButton = (props) => (
  <GridToolbarExportContainer {...props}>
    <GridCsvExportMenuItem options={csvOptions} />
    <JsonExportMenuItem />
  </GridToolbarExportContainer>
);

const CustomToolbar = (props) => (
  <GridToolbarContainer {...props}>
    <CustomExportButton />
  </GridToolbarContainer>
);

export default function DataTable() {
  return (
    <div style={{ height: '360px', width: '450%' }}>
      <DataGrid
        rows={SearchResult}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        components={{ Toolbar: CustomToolbar }}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};