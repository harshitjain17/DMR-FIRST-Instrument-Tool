import React, { useState } from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ExploreIcon from '@mui/icons-material/Explore';
import Button from '@mui/material/Button';

import SearchEngine, { SearchResponse } from './SearchEngine';
import GoogleMap from './GoogleMap';
import DataTable from '../Table/DataTable';
import { AppBar, Drawer, DrawerHeader } from './StyledComponents';

export default function SearchTool() {
    const [response, setResponse] = useState<SearchResponse | undefined>(undefined);
    const [isMinimumTimeElapsed, setMinimumTimeElapsed] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectedLocation, selectLocation] = useState<string | undefined>();

    return (

        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            
            {/* navigation Bar */}
            <AppBar position="fixed">
                <Toolbar sx={{ pr: '24px' }} variant="dense">
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                    <ExploreIcon/> Instrument Locator 
                    </Typography>
                    <Button sx={{'&:hover': {color: '#ffffff'}}} href="/.auth/login/aad" color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            {/* Search Form */}
            <Drawer variant="permanent">
                <DrawerHeader />
                <SearchEngine
                    onSearchResponseAvailable={(response) => setResponse(response)}
                    onMinimumTimeElapsed={(timeElapsed) => setMinimumTimeElapsed(timeElapsed)}
                    onSetLoading={(isLoading: boolean) => setLoading(isLoading)} />
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
                                    instruments={response?.instruments || []}
                                    searchLocation={response?.searchLocation}
                                    selectedLocation={selectedLocation}
                                    minimumTimeElapsed={isMinimumTimeElapsed}
                                    loading={isLoading} />
                            </Paper>
                        </Grid>

                        {/* Google Maps */}
                        <Grid item xs={6} md={6} lg={6}>
                            <GoogleMap locations={response?.locations ?? []} onSelectLocation={(locationId?: string ) => selectLocation(locationId)} />
                        </Grid>
                    </Grid>
                    {/* <Copyright sx={{ pt: 4 }} /> */}
                </Container>
            </Box>
        </Box>
    )
}