import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import InstoolApi from '../Api/InstoolApi';
import log from 'loglevel';

import Content from './InstrumentDetail/Content';

export default function InstrumentPage({ instrumentId }) {
    const [instrumentData, setInstrumentData] = React.useState({ undefined });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                var response = await InstoolApi.get(`/instruments/${instrumentId}`)
                log.debug(`Server returned instrument details:\n${response.data}`);
                setInstrumentData(response.data);
            } catch (error) {
                log.error(`Fetching instrument details failed: ${error}`);
            }
        };
        fetchData();
    }, [instrumentId]);

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
                <Content instrumentData={instrumentData} />
            </Box>
        </div>
    );
}
