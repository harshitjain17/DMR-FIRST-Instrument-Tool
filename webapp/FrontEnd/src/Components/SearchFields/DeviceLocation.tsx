import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

import { GetDeviceLocation } from '../../Utils/Helper';
import LocationApi from "../../Api/LocationApi";


interface DeviceLocationProps {
    onAddressFound: (address: string) => void
}

export function DeviceLocation({ onAddressFound }: DeviceLocationProps) {
    // Snackbar
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = useState<string>('');

    const handleClose = (event: Event | React.SyntheticEvent, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={(event) => {setOpen(false); }}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );


    const getLocation = async () => {
        if (!navigator.geolocation) {
            setOpen(true);
            setStatus('Geolocation is not supported by your browser');
        } else {
            try {
                const position = await GetDeviceLocation();
                const address = await LocationApi.getAddress(position.coords);
                onAddressFound(address);
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