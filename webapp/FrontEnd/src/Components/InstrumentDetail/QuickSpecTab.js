import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function QuickSpec(props) {
    const { instrumentTypes, doi, manufacturer, modelNumber, serialNumber } = props;
    // gather all types and their categories
    const allTypes = instrumentTypes?.map(t => t?.category?.category)
        .concat(instrumentTypes?.map(t => t?.category))
        .concat(instrumentTypes)
        // Remove null (in case an instrument returns a level 1 or 2 type as it's type, so .category.category is null)
        .filter(type => !!type)
        // We only show the label anyway
        .map(type => type.label)
        // And now remove duplicates
        // In case an instrument is used for two characterization techniques, we want to see Characterization once
        .filter((item, index, list) => list.indexOf(item) === index)
        .join(', ');

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom component="div">Digital Object Identifier (DOI):</Typography>
            <Typography variant="body2" gutterBottom>{doi} </Typography>
            {/* <Typography variant="subtitle2" gutterBottom component="div">Cited as: </Typography> */}
            {/* <Typography variant="subtitle2" gutterBottom component="div">Instrument Category: </Typography> */}
            <Typography variant="subtitle2" gutterBottom component="div">Instrument Type: </Typography>
            <Typography variant="body2" gutterBottom>{allTypes} </Typography>
            {/* <List dense={true}>
                {allTypes?.filter(t => !!t).map(type =>
                    <ListItem disableGutters sx={{ display: 'list-item' }} disablePadding={true} key={type} >
                        <ListItemText primary={type}/>
                    </ListItem>
                )}
            </List> */}
            <Typography variant="subtitle2" gutterBottom component="div">Manufacturer: </Typography>
            <Typography variant="body2" gutterBottom>{manufacturer} </Typography>
            <Typography variant="subtitle2" gutterBottom component="div">Model number: </Typography>
            <Typography variant="body2" gutterBottom>{modelNumber} </Typography>
            <Typography variant="subtitle2" gutterBottom component="div">Serial number: </Typography>
            <Typography variant="body2" gutterBottom>{serialNumber} </Typography>
        </Box>
    )
}