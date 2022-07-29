import React, { useState } from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';

import SearchEngine from './SearchEngine';
import GoogleMap from './GoogleMap';
import DataTable from '../Table/DataTable';
import { AppBar, Drawer, DrawerHeader } from './StyledComponents';

export default function SearchTool({ onRowSelected }) {
    const [response, setResponse] = useState([]);
    const [isMinimumTimeElapsed, onMinimumTimeElapsed] = useState();
    const [isLoading, setLoading] = useState();
    const [selectedLocation, selectLocation] = useState();

    const responseDataHandler = (responseData) => {
        setResponse(responseData);
    };

    const minimumTimeElapsedHandler = (params) => {
        onMinimumTimeElapsed(params);
    };

    const loadingHandler = (params) => {
        setLoading(params);
    };

    const selectLocationHandler = (params) => {
        selectLocation(params);
    };

    // breakpoints for responsiveness
    const xlargeScreen = useMediaQuery('(min-width:2560px)');

    return (

        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* navigation Bar */}
            <AppBar position="fixed">
                <Toolbar sx={{ pr: '24px' }} variant="dense">
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Instrument Locator
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Search Form */}
            <Drawer variant="permanent">
                <DrawerHeader />
                <SearchEngine
                    onSearchResponseAvailable={responseDataHandler}
                    onMinimumTimeElapsed={minimumTimeElapsedHandler}
                    onSetLoading={loadingHandler} />
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
                    height: '105vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mb: 2 }}>
                    <Grid container spacing={2}>

                        {/* Datatable */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper
                                sx={{
                                    p: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '48vh',
                                }}
                            >
                                <DataTable
                                    response={response}
                                    selectedLocation={selectedLocation}
                                    minimumTimeElapsed={isMinimumTimeElapsed}
                                    loading={isLoading}
                                    onRowSelected={onRowSelected} />
                            </Paper>
                        </Grid>

                        {/* Google Maps */}
                        <Grid item xs={12} md={7} lg={6}>
                            <Paper
                                sx={{
                                    p: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: xlargeScreen ? '47vh' : '40vh',
                                }}
                            >
                                <GoogleMap locations={response?.locations} onSelectLocation={selectLocationHandler} />
                            </Paper>
                        </Grid>
                    </Grid>
                    {/* <Copyright sx={{ pt: 4 }} /> */}
                </Container>
            </Box>
        </Box>
    )
}