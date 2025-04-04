import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ContactsTab } from './ContactsTab';
import { QuickSpec } from './QuickSpecTab';
import { LocationTab } from './LocationTab';
import { AwardsTab } from './AwardTab';
import { PublicationsTab } from './PublicationsTab';
import { DateTab } from './DateTab';
import { Instrument } from '../../Api/Model';

interface TabPanelProps {
  children: React.ReactNode,
  selectedIndex: number,
  index: number
}

function TabPanel(props: TabPanelProps) {
  const { children, index, selectedIndex, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={selectedIndex !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {selectedIndex === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

interface TabinationProps {
  instrument: Instrument
}

export default function Tabination({ instrument }: TabinationProps) {

  const [selectedIndex, setSelectedTab] = React.useState<number>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{ display: 'flex', flexGrow: 1, bgcolor: 'background.paper', height: '100%' }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedIndex}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Quick Specifications" {...a11yProps(0)} />
        <Tab label="Location" {...a11yProps(1)} />
        <Tab label="Research Experts" {...a11yProps(2)} />
        <Tab label="Awards" {...a11yProps(3)} />
        <Tab label="Important Dates" {...a11yProps(4)} />
        {instrument.publications?.length > 0 && <Tab label="Publications" {...a11yProps(5)} />}
      </Tabs>

      <TabPanel selectedIndex={selectedIndex} index={0}>
        <QuickSpec instrument={instrument} />
      </TabPanel>

      <TabPanel selectedIndex={selectedIndex} index={1}>
        <LocationTab instrument={instrument} location={instrument.location} />
      </TabPanel>

      <TabPanel selectedIndex={selectedIndex} index={2}>
        <ContactsTab contacts={instrument.contacts ?? []} />
      </TabPanel>

      <TabPanel selectedIndex={selectedIndex} index={3}>
        <AwardsTab awards={instrument.awards} />
      </TabPanel>

      <TabPanel selectedIndex={selectedIndex} index={4}>
        <DateTab instrument={instrument} />
      </TabPanel>

      {instrument.publications?.length > 0 && 
        <TabPanel selectedIndex={selectedIndex} index={5}>
          <PublicationsTab publications={instrument.publications} />
        </TabPanel>
      }

    </Box>
  );
}
