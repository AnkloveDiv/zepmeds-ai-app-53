
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as ol from 'ol';
import { initializeDashboardSync } from './services/dashboardSubscription';

// Make ol globally available for OpenLayers map
window.ol = ol;

// Initialize dashboard synchronization
// This connects the app to the Zepmeds Ambulance dashboard
// Real dashboard URL and API key would be set in a production environment
initializeDashboardSync();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
