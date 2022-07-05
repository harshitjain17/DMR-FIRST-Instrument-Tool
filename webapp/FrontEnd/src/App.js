import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SearchEngine from './Components/SearchEngine';
import GoogleMap from './Components/GoogleMap';
import DataTable from './Components/DataTable';

import React, { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: "25%",
    width: `calc(75%)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: "25%",
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const mdTheme = createTheme();

function App() {
  const [response, setResponse] = useState([]);
  const [instrumentDropdown, setInstrumentDropdown] = useState([]);
  
  const instrumentDropdownHandler = (responseData) => {
    setInstrumentDropdown(responseData);
  };
  
  const responseDataHandler = (responseData) => {
    setResponse(responseData);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline/>
        
        {/* navigation Bar */}
        <AppBar position="fixed">
          <Toolbar sx={{pr: '24px'}} variant="dense">
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Instrument Locator
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* Search Form */}
        <Drawer 
          variant="permanent"
          sx={{
          width: "25%",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: "100%",
            boxSizing: 'border-box',
          }
          }}>
            <DrawerHeader/>
            <SearchEngine onSaveResponseData = {responseDataHandler} onSaveInstrumentDropdown = {instrumentDropdownHandler}/>
        </Drawer>

        {/* Right Section */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar/>
          <Container maxWidth="lg" sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              
              {/* Datatable */}
              <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 290,
                  }}
                >
                <DataTable response={response} instrumentDropdown={instrumentDropdown}/>
                </Paper>
              </Grid>
              
              {/* Google Maps */}
              <Grid item xs={12} md={7} lg={6}>
                <Paper
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 205,
                  }}
                >
                  <GoogleMap response={response}/>
                </Paper>
              </Grid>
              
            </Grid>
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );  
}
export default App;