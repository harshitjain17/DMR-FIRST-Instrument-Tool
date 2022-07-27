
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';

import { GetDeviceLocation } from '../../Utils/Helper';
import InstoolApi from '../../Api/InstoolApi';

export default function DeviceLocation({onAddressFound}) {
    // Snackbar
    const [open, setOpen] = React.useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    const [status, setStatus] = useState(null);
    const getLocation = async () => {
        if (!navigator.geolocation) {
            setOpen(true);
            setStatus('Geolocation is not supported by your browser');
        } else {
            try {
                const position = await GetDeviceLocation();
                const address = await InstoolApi.get(`/locate/address?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
                onAddressFound(address.data);
            } catch (error) {
                setOpen(true);
                setStatus('Unable to retrieve your location');
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'right', cursor: 'pointer' }}>
            <Link underline="hover" onClick={getLocation} variant="caption"> {'Use my Current Location'}</Link>
            <Snackbar
                open={open}
                autoHideDuration={1000}
                onClose={handleClose}
                message={status}
                action={action}
            />
        </Box>
    )
}