import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Instrument, InstrumentStatus } from '../../Api/Model';
import { getCategories, getInstrumentTypeLabel } from '../../Api/ModelUtils';


interface QuickSpecTabProps {
    instrument: Instrument
}

export function QuickSpec({ instrument }: QuickSpecTabProps) {
    const categories = getCategories(instrument);
    const categoryAvailable = categories.length > 0;

    const instrumentTypeString = instrument.instrumentTypes.map(t => getInstrumentTypeLabel(t)).join(", ");
    const instrumentTypeAvailable = instrument.instrumentTypes.length > 0;

    return (
        <Box>
            {/* DOI */}
            <Grid container spacing={1}>
                <Grid item xs="auto">{instrument.doi && <Typography variant="subtitle2" gutterBottom component="div">Digital Object Identifier (DOI):</Typography>}</Grid>
                <Grid item xs="auto">{instrument.doi && <Typography variant="body2" gutterBottom>{instrument.doi}</Typography>}</Grid>
            </Grid>

            {/* Instrument Category */}
            <Grid container spacing={1}>
                <Grid item xs="auto">{categoryAvailable && <Typography variant="subtitle2" gutterBottom component="div">Instrument Category: </Typography>}</Grid>
                <Grid item xs="auto" >{categoryAvailable && <Typography variant="body2" gutterBottom> {categories.join(" - ")} </Typography>}</Grid>
            </Grid>

            {/* Instrument Types */}
            <Grid container spacing={1} >
                <Grid item xs="auto">{instrumentTypeAvailable && <Typography variant="subtitle2" gutterBottom component="div">Instrument Type: </Typography>}</Grid>
                <Grid item xs="auto">{instrumentTypeAvailable && <Typography variant="body2" gutterBottom> {instrumentTypeString} </Typography>}</Grid>
            </Grid>

            {/* Manufacturer */}
            <Grid container spacing={1}>
                <Grid item xs="auto">{instrument?.manufacturer && <Typography variant="subtitle2" gutterBottom component="div">Manufacturer: </Typography>}</Grid>
                <Grid item xs="auto">{instrument?.manufacturer && <Typography variant="body2" gutterBottom>{instrument?.manufacturer} </Typography>}</Grid>
            </Grid>

            {/* Model Number */}
            <Grid container spacing={1}>
                <Grid item xs="auto">{instrument?.modelNumber && <Typography variant="subtitle2" gutterBottom component="div">Model number: </Typography>}</Grid>
                <Grid item xs="auto">{instrument?.modelNumber && <Typography variant="body2" gutterBottom>{instrument?.modelNumber} </Typography>}</Grid>
            </Grid>

            {/* Serial Number */}
            <Grid container spacing={1}>
                <Grid item xs="auto">{instrument?.serialNumber && <Typography variant="subtitle2" gutterBottom component="div">Serial number: </Typography>}</Grid>
                <Grid item xs="auto">{instrument?.serialNumber && <Typography variant="body2" gutterBottom>{instrument?.serialNumber} </Typography>}</Grid>
            </Grid>

            {/* Status */}
            <Grid container spacing={1}>
                <Grid item xs="auto">{instrument?.status && <Typography variant="subtitle2" gutterBottom component="div">Status: </Typography>}</Grid>
                <Grid item xs="auto">{instrument?.status && <Typography variant="body2" gutterBottom>{instrument?.status === InstrumentStatus.Active ? "Active" : "Inactive"} </Typography>}</Grid>
            </Grid>

        </Box>
    )
}