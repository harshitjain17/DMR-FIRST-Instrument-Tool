import * as React from 'react';
// import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Dialog from '@mui/material/Dialog';
import InstrumentApi from '../../Api/InstrumentApi';

import InstrumentDetails from './InstrumentDetails';
import { Instrument } from '../../Api/Model';

interface InstrumentPageProps {
    doi: string
}

export default function InstrumentPage({ doi }: InstrumentPageProps) {
    const [instrumentData, setInstrumentData] = React.useState<Instrument | undefined>(undefined);

    React.useEffect(() => {
        InstrumentApi.get(doi).then(i => setInstrumentData(i));
    }, [doi]);

    return (
        <div>
            <Dialog fullScreen open={true}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar variant="dense">
                        <Typography textAlign="center" sx={{ ml: 'auto', flex: 1 }} variant="h6" component="div">
                            {instrumentData?.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {instrumentData && <InstrumentDetails instrument={instrumentData} />}
            </Dialog>
        </div>
    );
}