import React from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Tabination from './Tabination';
import Description from './Description';
import { Instrument } from '../../Api/Model';

interface InstrumentDetailProps {
    instrument: Instrument
}
export default function InstrumentDetails({ instrument }: InstrumentDetailProps) {
    return (
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

            <Container maxWidth="xl" sx={{ mb: 2 }}>
                <Grid container spacing={2}>

                    <Description 
                            description={instrument?.description} 
                            capabilities={instrument?.capabilities} 
                            image={instrument?.images?.[0]}/>

                    {/* Tabs (Quick Specs, Location, Awards, etc.) */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={{
                                p: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '36vh',
                            }}
                        >
                            <Tabination instrument={instrument}  />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}