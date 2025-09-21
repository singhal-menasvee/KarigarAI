// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // earthy brown
      dark: '#5C3317',
      light: '#D2B48C',
    },
    secondary: {
      main: '#D2691E', // terracotta
      light: '#F4A460',
    },
    background: {
      default: '#FAF3E0', // warm parchment
      paper: '#FFF8F0',
    },
    text: {
      primary: '#2F2F2F',
      secondary: '#5A4632',
    },
  },
  typography: {
    fontFamily: `'Merriweather', 'Roboto', serif`,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    body1: { lineHeight: 1.7 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
