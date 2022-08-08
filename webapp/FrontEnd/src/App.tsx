import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import log from 'loglevel';

import { config } from './config/config';
import SearchTool from './Components/SearchTool/SearchTool';
import InstrumentPage from './Components/InstrumentDetail/InstrumentPage';
import './App.css';

log.debug(`Accessing server at ${config.url}`)
const mdTheme = createTheme();

function App() {
  let doi = window.location.pathname.startsWith("/doi/") ? window.location.pathname.substring(5) : null;
  if (!doi) {
    const queryParams = new URLSearchParams(window.location.search);
    doi = queryParams.get("id") ?? queryParams.get("doi");
  }

  return (
    <ThemeProvider theme={mdTheme}>
      {doi ? <InstrumentPage doi={doi} /> : <SearchTool />}
    </ThemeProvider>
  );

}
export default App;