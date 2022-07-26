import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function QuickSpec(props) {
    const { instrumentTypes, doi, manufacturer, modelNumber, serialNumber, status } = props;
    const allTypes = instrumentTypes?.map(t => t?.category?.category)
        .concat(instrumentTypes?.map(t => t?.category))
        // .concat(instrumentTypes)
        // Remove null (in case an instrument returns a level 1 or 2 type as it's type, so .category.category is null)
        .filter(type => !!type)
        // We only show the label anyway
        .map(type => type.label)
        // And now remove duplicates
        // In case an instrument is used for two characterization techniques, we want to see Characterization once
        .filter((item, index, list) => list.indexOf(item) === index)
        .join(' — ');


    return (
        <Box>
            {/* DOI */}
            <Grid container spacing={1}>
                <Grid item>{doi && <Typography variant="subtitle2" gutterBottom component="div">Digital Object Identifier (DOI):</Typography>}</Grid>
                <Grid item lg={8}>{doi && <Typography variant="body2" gutterBottom>https://doi.org/{doi}</Typography>}</Grid>
            </Grid>
            
            {/* Citation */}
            <Grid container spacing={1}>
                <Grid item>{doi && <Typography variant="subtitle2" gutterBottom component="div">Cited as: </Typography>}</Grid>
                <Grid item lg={8}>{doi && <Typography variant="body2" gutterBottom> https://... </Typography>}</Grid>
            </Grid>
            
            {/* Instrument Category */}
            <Grid container spacing={1}>
                <Grid item xs="auto">{instrumentTypes[0]?.category?.category.label && <Typography variant="subtitle2" gutterBottom component="div">Instrument Category: </Typography>}</Grid>
                <Grid item xs="auto" >{instrumentTypes[0]?.category?.category.label && <Typography noWrap variant="body2" gutterBottom> {allTypes} </Typography>}</Grid>
            </Grid>

            {/* Instrument Types */}
            <Grid container spacing={1} >
                <Grid item>{instrumentTypes[0] && <Typography variant="subtitle2" gutterBottom component="div">Instrument Type: </Typography>}</Grid>
                <Grid item lg={7} zeroMinWidth>{instrumentTypes[0] && <Typography noWrap variant="body2" gutterBottom> {instrumentTypes[0]?.label} </Typography>}</Grid>
            </Grid>            

            {/* Manufacturer */}
            <Grid container spacing={1}>
                <Grid item>{manufacturer && <Typography variant="subtitle2" gutterBottom component="div">Manufacturer: </Typography>}</Grid>
                <Grid item lg={8}>{manufacturer && <Typography variant="body2" gutterBottom>{manufacturer} </Typography>}</Grid>
            </Grid>

            {/* Model Number */}
            <Grid container spacing={1}>
                <Grid item>{modelNumber && <Typography variant="subtitle2" gutterBottom component="div">Model number: </Typography>}</Grid>
                <Grid item lg={8}>{modelNumber && <Typography variant="body2" gutterBottom>{modelNumber} </Typography>}</Grid>
            </Grid>

            {/* Serial Number */}
            <Grid container spacing={1}>
                <Grid item>{serialNumber && <Typography variant="subtitle2" gutterBottom component="div">Serial number: </Typography>}</Grid>
                <Grid item lg={8}>{serialNumber && <Typography variant="body2" gutterBottom>{serialNumber} </Typography>}</Grid>
            </Grid>

            {/* Status */}
            <Grid container spacing={1}>
                <Grid item>{status && <Typography variant="subtitle2" gutterBottom component="div">Status: </Typography>}</Grid>
                <Grid item lg={8}>{status && <Typography variant="body2" gutterBottom>{status==="A" ? "Active" : "Inactive" } </Typography>}</Grid>
            </Grid>
            
        </Box>
    )
}