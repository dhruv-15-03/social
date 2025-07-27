import { createTheme } from '@mui/material/styles';

// Minimal theme for faster initial load
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#f59e0b',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 12,
  },
  // Minimal component overrides for faster initial load
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f9fafb',
        },
        '*::-webkit-scrollbar': {
          width: '6px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#d1d5db',
          borderRadius: '3px',
        },
      },
    },
  },
});

export default lightTheme;
