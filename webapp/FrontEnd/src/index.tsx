import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import initLogging from './logging';
import log from 'loglevel';

// Initialize the logging library, so that a user can toggle log levels with Ctrl-F12
initLogging();

const rootElem = document.getElementById('root');
if (!rootElem) {
  throw new Error("React app could not find it's root element");
}
const root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(log.debug);
