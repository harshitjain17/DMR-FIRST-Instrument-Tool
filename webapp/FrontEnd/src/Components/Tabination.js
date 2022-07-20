import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ContactsTable from './ContactsTable';
import QuickSpec from './QuickSpecTab';
import LocationTab from './LocationTab';

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
  const instrumentDetails = props.details;
  const objectLocation = props.details.location;
  const contactsArray = instrumentDetails.contacts ?? [];
  const instrumentTypes = instrumentDetails.instrumentTypes ?? [];

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
        <QuickSpec doi={instrumentDetails.doi} manufacturer={instrumentDetails.manufacturer} instrumentTypes={instrumentTypes}></QuickSpec>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <LocationTab instrumentDetails={instrumentDetails} objectLocation={objectLocation}/>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <ContactsTable contacts={contactsArray} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        Awards
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Typography variant="subtitle2" gutterBottom component="div">Acquisition Date: </Typography>{instrumentDetails.acquisitionDate}
        <Typography variant="subtitle2" gutterBottom component="div">Completion Date: </Typography>{instrumentDetails.completionDate}
      </TabPanel>

    </Box>
  );
}
