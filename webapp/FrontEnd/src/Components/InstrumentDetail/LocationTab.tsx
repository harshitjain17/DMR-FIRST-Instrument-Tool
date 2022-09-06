import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Instrument, Location } from '../../Api/Model';
import { config } from '../../config/config';
import './LocationTab.css';

interface LocationTabProps {
    instrument: Instrument,
    location?: Location
}

export function LocationTab({instrument, location}: LocationTabProps) {
    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{width: "33%"}}>
                <Typography variant="subtitle2" gutterBottom component="div">Address: </Typography>
                <Typography variant="body2" gutterBottom component="div">
                    {instrument.roomNumber} {location?.building}<br />
                    {location?.street}<br />
                    {location?.city}, {location?.state} {location?.zip}
                </Typography>
            </Box>
            <Box sx={{width: "67%"}}>
                <iframe title="Map" width="500vw" height="200vh" frameBorder="0" allowFullScreen={true}
                        src={`https://www.google.com/maps/embed/v1/place?key=${config.apiKey}&q=${location?.building},${location?.street},${location?.city},${location?.state},${location?.country}`}>
                </iframe>
            </Box>
        </Box>
        
    );
}