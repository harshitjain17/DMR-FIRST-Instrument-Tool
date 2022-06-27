import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SearchEngine from './Components/SearchEngine';
import GoogleMap2 from './Components/GoogleMap2';
import DataTable from './Components/DataTable';

import * as React from 'react';
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

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
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
      width: drawerWidth,
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

const mdTheme = createTheme();

function App() {

  const saveUserInputHandler = (enteredUserInput) => {
    const userInput = {
      ...enteredUserInput
    };
    console.log(userInput);
  };
  return (
    // <div>
    //   <NavBar/>
    //   <div className="d-flex flex-row">
    //     <div style={{width: "35%", height: "100%", display: "inline-block"}}><SearchEngine onSaveUserInput = {saveUserInputHandler}/></div>
    //     <div style={{width: "100%"}}>
    //       <DataTable/>
    //       <GoogleMap/>
    //     </div>
    //   </div>
    // </div>


    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline/>
        
        {/* navigation Bar */}
        <AppBar>
          <Toolbar sx={{pr: '24px'}}>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Instrument Locator
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* Search Form */}
        <Drawer 
          variant="permanent"
          sx={{
            width: '25%',
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: '100%', boxSizing: 'border-box' },
          }}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
          </Toolbar>
            <SearchEngine onSaveUserInput = {saveUserInputHandler}/>
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
          <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
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
                <DataTable/>
                </Paper>
              </Grid>
              
              {/* Google Maps */}
              <Grid item xs={12} md={5} lg={7}>
                {/* <Paper
                  sx={{
                    p: 2,
                    // display: 'flex',
                    // flexDirection: 'column',
                    height: 250,
                  }}
                > */}
                  <GoogleMap2/>
                {/* </Paper> */}
                
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