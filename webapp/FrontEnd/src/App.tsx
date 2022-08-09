import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import log from 'loglevel';

import { config } from './config/config';
import SearchTool from './Components/SearchTool/SearchTool';
import InstrumentPage from './Components/InstrumentDetail/InstrumentPage';
import './App.css';

// import { authProvider } from './Authentication/AuthProvider';
// import { AzureAD, AuthenticationState } from 'react-aad-msal';

log.debug(`Accessing server at ${config.url}`)
const mdTheme = createTheme();

function App() {
  let doi = window.location.pathname.startsWith("/doi/") ? window.location.pathname.substring(5) : null;
  if (!doi) {
    const queryParams = new URLSearchParams(window.location.search);
    doi = queryParams.get("id") ?? queryParams.get("doi");
  }

  return (
    <div>

      {/* Authentication */}
      {/* <AzureAD provider={authProvider}>
        <span>Only authenticated users can see me.</span>
      </AzureAD>
      <AzureAD provider={authProvider} forceLogin={true}>
        {
          ({login, logout, authenticationState, error, accountInfo}) => {
            switch (authenticationState) {
              case AuthenticationState.Authenticated:
                return (
                  <p>
                    <span>Welcome, {accountInfo.account.userName}!</span>
                    <span>{accountInfo.jwtIdToken}</span>
                    <button onClick={logout}>Logout</button>
                  </p>
                );
              case AuthenticationState.Unauthenticated:
                return (
                  <div>
                    {error && <p><span>An error occured during authentication, please try again!</span></p>}
                    <p>
                      <span>Hey stranger, you look new!</span>
                      <button onClick={login}>Login</button>
                    </p>
                  </div>
                );
              case AuthenticationState.InProgress:
                return (<p>Authenticating...</p>);
            }
          }
        }
      </AzureAD> */}
      <ThemeProvider theme={mdTheme}>
        {doi ? <InstrumentPage doi={doi} /> : <SearchTool />}
      </ThemeProvider>
    </div>
  );

}
export default App;