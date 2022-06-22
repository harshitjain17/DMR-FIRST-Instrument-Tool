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




import React from 'react';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SearchResult from './SearchResult.json';
import "./DataTable.css";

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

// styling for No Rows Overlay
const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

// Function for No Rows Overlay
function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
};



export default function DataTable() {
  return (
    <div style={{ height: '360px', width: '100%' }}>
      <DataGrid
        rows={SearchResult}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        components={{ 
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress,
          NoRowsOverlay: CustomNoRowsOverlay }}
        componentsProps={{
          toolbar: { showQuickFilter: true },
        }}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};