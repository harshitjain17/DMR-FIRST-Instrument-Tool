import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabination from './Tabination';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
// import { useParams } from "react-router-dom";


export default function InstrumentPageNewTab({instrumentData}) {
    // const params = useParams();
    // console.log(params);
    return (
        <div>
        <Dialog fullScreen>
            <AppBar sx={{ position: 'relative' }}>
            <Toolbar variant="dense">
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    {instrumentData.name}
                </Typography>
            </Toolbar>
            </AppBar>
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
                <Container maxWidth="lg" sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
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
                                <Typography variant="subtitle2" paragraph align='justify'>{instrumentData.description}</Typography>
                                </div>
                            </Paper>
                        </Grid>
                    
                    
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper
                                sx={{
                                    p: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '40vh',
                                }}
                            >
                                <Tabination details={instrumentData}/>
                                </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Dialog>
        </div>
  );
}
