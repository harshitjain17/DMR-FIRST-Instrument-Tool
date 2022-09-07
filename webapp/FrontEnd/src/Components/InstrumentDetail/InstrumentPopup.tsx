import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide, { SlideProps } from '@mui/material/Slide';
import ButtonGroup from '@mui/material/ButtonGroup';

import InstrumentApi from '../../Api/InstrumentApi';

import InstrumentDetails from './InstrumentDetails';
import { Instrument } from '../../Api/Model';

const Transition = React.forwardRef(function Transition(props: SlideProps, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface InstrumentPopupProps {
    isOpen: boolean,
    doi: string,
    onPopupClose: () => void
}

export default function InstrumentPopup({ isOpen, doi, onPopupClose }: InstrumentPopupProps) {
    const [instrumentData, setInstrumentData] = React.useState<Instrument>();

    React.useEffect(() => {
        const fetchData = async () => {
                const response = await InstrumentApi.get(doi)
                setInstrumentData(response);
        };
        doi && fetchData();
    }, [doi]);

    return (
        <div>
            <Dialog fullScreen open={isOpen}
                onClose={() => onPopupClose()} TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar variant="dense">

                        <IconButton edge="start" color="inherit" onClick={() => onPopupClose()} aria-label="close">
                            <CloseIcon />
                        </IconButton>

                        <Typography textAlign="center" sx={{ ml: 'auto', flex: 1 }} variant="h6" component="div">
                            
                            {instrumentData?.name} {instrumentData?.modelNumber ? ": " + instrumentData?.modelNumber : null}
                            
                        </Typography>
                        
                        <ButtonGroup color="inherit" variant="text" aria-label="text button group">
                            <Button color="inherit" onClick={() =>
                                window.open(`/doi/${doi}`, "_blank")}>
                                Open in new Tab
                            </Button>
                            <Button sx={{'&:hover': {color: '#ffffff'}}} href="/.auth/login/aad" variant="text" color="inherit">Login</Button>
                        </ButtonGroup>
                        

                    </Toolbar>
                </AppBar>
                {instrumentData && <InstrumentDetails instrument={instrumentData} />}
            </Dialog>
        </div>
    );
}
