import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Tabination from './Tabination';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import log from 'loglevel';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InstrumentPage({isOpen, instrumentData, handleClose}) {
    const onClose = () => {
        handleClose(false);
    };

    log.debug(instrumentData);

    return (
        <div>
        <Dialog
            fullScreen
            open={isOpen}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
            <Toolbar variant="dense">
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                >
                    <CloseIcon />
                    </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    {instrumentData.name}
                </Typography>
                <Button autoFocus color="inherit" onClick={handleClose}>
                    Open in new tab
                </Button>
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
