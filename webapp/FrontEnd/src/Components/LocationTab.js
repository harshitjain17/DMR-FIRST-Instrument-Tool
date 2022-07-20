import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { config } from '../config/config';

export default function LocationTab({instrumentDetails, objectLocation}) {
    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{width: "33%"}}>
            <Typography variant="subtitle2" gutterBottom component="div">Address: </Typography>
            <Typography variant="body2" gutterBottom component="div">
                {instrumentDetails.roomNumber} {objectLocation?.building}<br />
                {objectLocation?.street}<br />
                {objectLocation?.city}, {objectLocation?.state} {objectLocation?.zip}
            </Typography>
            </Box>
            <Box sx={{width: "67%"}}>
                <iframe title="Map" width="600" height="250" frameBorder="0" allowFullScreen={true}
                        src={`https://www.google.com/maps/embed/v1/place?key=${config.apiKey}&q=${objectLocation?.building},${objectLocation?.street},${objectLocation?.city},${objectLocation?.state},${objectLocation?.country}`}>
                </iframe>
            </Box>
        </Box>
        
    );
}