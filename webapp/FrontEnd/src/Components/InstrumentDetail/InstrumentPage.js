import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import InstoolApi from '../../Api/InstoolApi';
import log from 'loglevel';

import InstrumentDetails from './InstrumentDetails';

export default function InstrumentPage({ doi }) {
    const [instrumentData, setInstrumentData] = React.useState({ undefined });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                var response = await InstoolApi.get(`/instruments/${doi}`)
                log.debug(response.data);
                setInstrumentData(response.data);
            } catch (error) {
                log.error(`Fetching instrument details failed: ${error}`);
            }
        };
        fetchData();
    }, [doi]);

    return (
        <div>
            <Box>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar variant="dense">
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {instrumentData.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <InstrumentDetails instrumentData={instrumentData} />
            </Box>
        </div>
    );
}
