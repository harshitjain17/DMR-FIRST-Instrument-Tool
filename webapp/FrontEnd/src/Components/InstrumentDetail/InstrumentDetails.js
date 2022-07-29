import React from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Tabination from './Tabination';
import Content from './Description';

export default function InstrumentDetails({ instrumentData }) {
    console.log(instrumentData)
    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '80vh',
                overflow: 'auto',
            }}
        >

            <Container maxWidth="xlg" sx={{ mb: 2 }}>
                <Grid container spacing={2}>

                    <Content description={instrumentData?.description} capabilities={instrumentData?.capabilities} image={instrumentData?.image}/>

                    {/* Tabs (Quick Specs, Location, Awards, etc.) */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={{
                                p: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                            }}
                        >
                            <Tabination details={instrumentData} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}