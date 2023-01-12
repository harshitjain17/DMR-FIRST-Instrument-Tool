import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Instrument } from '../../Api/Model';


interface DateTabProps {
    instrument: Instrument
}

export function DateTab({ instrument }: DateTabProps) {
    const acquired = instrument.acquisitionDate ? new Date(instrument.acquisitionDate).toLocaleDateString() : null;
    const commissioned = instrument.completionDate ? new Date(instrument.completionDate).toLocaleDateString() : null;
    const decommissioned = null;
    return (
        <Box>
            {/* DOI */}
            <Grid container spacing={1}>
                <Grid item xs="auto"><Typography variant="subtitle2" gutterBottom component="div">Acquired: </Typography></Grid>
                <Grid item xs="auto"><Typography variant="body2" gutterBottom>{acquired}</Typography></Grid>
            </Grid>

            {/* Instrument Category */}
            <Grid container spacing={1}>
                <Grid item xs="auto">{commissioned && <Typography variant="subtitle2" gutterBottom component="div">Commissioned: </Typography>}</Grid>
                <Grid item xs="auto" >{commissioned && <Typography variant="body2" gutterBottom> {commissioned} </Typography>}</Grid>
            </Grid>

            {/* Instrument Types */}
            <Grid container spacing={1} >
                <Grid item xs="auto">{decommissioned && <Typography variant="subtitle2" gutterBottom component="div">Decommissioned: </Typography>}</Grid>
                <Grid item xs="auto">{decommissioned && <Typography variant="body2" gutterBottom> {decommissioned} </Typography>}</Grid>
            </Grid>
        </Box>
    )
}