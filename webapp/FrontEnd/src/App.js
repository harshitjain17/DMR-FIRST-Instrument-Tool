import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import log from 'loglevel';
import initLogging from './logging';

import { config } from './config/config';
import SearchTool from './Components/SearchTool/SearchTool';
import InstrumentPage from './Components/InstrumentDetail/InstrumentPage';
import './App.css';


// Initialize the logging library, so that a user can toggle log levels with Ctrl-F12
initLogging();
log.debug(`Accessing server at ${config.url}`)
const mdTheme = createTheme();

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const instrumentId = queryParams.get("id") ?? queryParams.get("instrumentId");

  return (<ThemeProvider theme={mdTheme}>
    {instrumentId ? <InstrumentPage instrumentId={instrumentId} /> : <SearchTool />}
  </ThemeProvider>);

}
export default App;