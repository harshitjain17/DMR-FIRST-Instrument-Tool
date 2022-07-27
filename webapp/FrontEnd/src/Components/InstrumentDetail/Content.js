import React from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Tabination from './Tabination';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function Content({ instrumentData }) {
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

                    {/* Description */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '55vh',
                            }}
                        >
                            <div style={{ overflowY: 'scroll' }}>
                                <Typography variant="h6" gutterBottom component="div"> DESCRIPTION </Typography>
                                <Typography variant="subtitle2" paragraph align='justify'>
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]} children={instrumentData.description}/>
                                </Typography>
                            </div>
                        </Paper>
                    </Grid>

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