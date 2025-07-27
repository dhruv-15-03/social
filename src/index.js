import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import ReactQueryProvider from './providers/ReactQueryProvider';
import NotificationProvider from './Components/Notifications/NotificationProvider';
import lightTheme from './theme/optimizedTheme';

// Preload critical components
import { preloadCriticalComponents } from './utils/lazyComponents';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <NotificationProvider>
        <ReactQueryProvider>
          <Provider store={store}>
            <BrowserRouter>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <App />
              </ThemeProvider>
            </BrowserRouter>
          </Provider>
        </ReactQueryProvider>
      </NotificationProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// Preload critical components after initial render
setTimeout(() => {
  preloadCriticalComponents();
}, 100);

// Minimal web vitals reporting for development
if (process.env.NODE_ENV === 'development') {
  import('./reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals();
  });
}
