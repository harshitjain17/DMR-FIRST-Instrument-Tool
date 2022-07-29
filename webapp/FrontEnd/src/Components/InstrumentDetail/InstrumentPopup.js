import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import InstoolApi from '../../Api/InstoolApi';
import log from 'loglevel';

import InstrumentDetails from './InstrumentDetails';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function InstrumentPopup({ isOpen, instrumentId, handleClose }) {
    const [instrumentData, setInstrumentData] = React.useState({ undefined });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                var response = await InstoolApi.get(`/instruments/${instrumentId}`)
                log.debug(response.data);
                setInstrumentData(response.data);
            } catch (error) {
                log.error(`Fetching instrument details failed: ${error}`);
            }
        };
        instrumentId && fetchData();
    }, [instrumentId]);

    return (
        <div>
            <Dialog fullScreen open={isOpen}
                onClose={() => handleClose(false)} TransitionComponent={Transition}
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
                        <Button autoFocus color="inherit" onClick={() =>
                            window.open(`/?instrumentId=${instrumentId}`, "_blank")}>
                            Open in new Tab
                        </Button>
                    </Toolbar>
                </AppBar>
                <InstrumentDetails instrumentData={instrumentData} />
            </Dialog>
        </div>
    );
}
