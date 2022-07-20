import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ContactsTable from './ContactsTable';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function Tabination(props) {

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Instrument Data
  const object = props.details;
  const objectLocation = props.details.location;
  const ContactsArray = object.contacts ?? [];

  // Displaying Instrument Types
  function InstrumentTypes() {
    var arr = [];
    for (var i = 0; i < object.instrumentTypes?.length; i++) {
      arr.push(object.instrumentTypes[i]?.label)
    };
    return arr.join(', ');
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Quick Specifications" {...a11yProps(0)} />
        <Tab label="Location" {...a11yProps(1)} />
        <Tab label="Research Experts" {...a11yProps(2)} />
        <Tab label="Awards" {...a11yProps(3)} />
        <Tab label="Important Dates" {...a11yProps(4)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Typography variant="subtitle2" gutterBottom component="div">Digital Object Identifier (DOI): {object?.doi} </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">Cited as: </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">Instrument Category: </Typography>
        <Typography >Instrument Type: {InstrumentTypes()} </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">Manufacturer: {object?.manufacturer} </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">Model Number: {object?.modelNumber} </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">Serial Number: {object?.serialNumber} </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">Status: {object?.status} </Typography>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Typography variant="subtitle2" gutterBottom component="div">Address: <br/>
          {object?.roomNumber} {objectLocation?.building}<br/>
          {objectLocation?.city} {objectLocation?.state} {objectLocation?.zip}
        </Typography>
      </TabPanel>
      
      <TabPanel value={value} index={2}>
        <ContactsTable contacts = {ContactsArray}/>
      </TabPanel>
      
      <TabPanel value={value} index={3}>
        Awards
      </TabPanel>
      
      <TabPanel value={value} index={4}>
        <Typography variant="subtitle2" gutterBottom component="div">Acquisition Date: {object?.acquisitionDate} </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">Completion Date: {object?.completionDate} </Typography>
      </TabPanel>
      
    </Box>
  );
}
