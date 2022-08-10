import { AuthenticationParameters, Configuration } from 'msal';
import { MsalAuthProvider, LoginType, IMsalAuthProviderConfig } from 'react-aad-msal';
 
// Msal Configurations
const config : Configuration= {
  auth: {
    authority: 'https://login.microsoftonline.com/common',
    clientId: '<Client ID>',
    redirectUri: 'http://localhost:3000/callback'
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};
  
// Authentication Parameters
const authenticationParameters : AuthenticationParameters = {
  scopes: [
    '<property (i.e. user.read)>',
    'https://<your-tenant-name>.onmicrosoft.com/<your-application-name>/<scope (i.e. demo.read)>'
  ]
}
 
// Options
const options : IMsalAuthProviderConfig = {
  loginType: LoginType.Popup,
  tokenRefreshUri: window.location.origin + '/auth.html'
}
 
export const authProvider = new MsalAuthProvider(config, authenticationParameters, options)