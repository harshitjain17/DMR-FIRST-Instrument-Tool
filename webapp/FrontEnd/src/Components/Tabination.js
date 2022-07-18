import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
          <Typography>{children}</Typography>
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
  const object = props.details;
  const objectLocation = props.details.location;

  
  // const ContactsArray = object.contacts;
  // ContactsArray.map((contact) => {
  //   return (contact.firstName + contact.lastName)
  // });
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
        <Tab label="Citation" {...a11yProps(0)} />
        <Tab label="Location" {...a11yProps(1)} />
        <Tab label="Research Experts" {...a11yProps(2)} />
        <Tab label="Awards" {...a11yProps(3)} />
        <Tab label="Important Dates" {...a11yProps(4)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        DOI: {object.doi}<br/>
        Citation:
      </TabPanel>

      <TabPanel value={value} index={1}>
        Address:
        <br/>
        {object.roomNumber}
        <br/>
        {objectLocation?.building}
        <br/>
        {objectLocation?.city} {objectLocation?.state} {objectLocation?.zip}
      </TabPanel>
      
      <TabPanel value={value} index={2}>
        {/* {ContactsArray} */}
      </TabPanel>
      
      <TabPanel value={value} index={3}>
        Awards
      </TabPanel>
      
      <TabPanel value={value} index={4}>
        Acquisition Date: {object.acquisitionDate} <br/>
        Completion Date: {object.completionDate}
      </TabPanel>
      
    </Box>
  );
}