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
    fontFamily: `'Roboto Slab', serif`,
    h1: { fontFamily: `'Raleway', sans-serif`, fontWeight: 700 },
    h2: { fontFamily: `'Raleway', sans-serif`, fontWeight: 700 },
    h3: { fontFamily: `'Raleway', sans-serif`, fontWeight: 700 },
    h4: { fontFamily: `'Raleway', sans-serif`, fontWeight: 700 },
    h5: { fontFamily: `'Raleway', sans-serif`, fontWeight: 600 },
    h6: { fontFamily: `'Raleway', sans-serif`, fontWeight: 600 },
    subtitle1: { fontFamily: `'Raleway', sans-serif`, fontWeight: 600 },
    subtitle2: { fontFamily: `'Raleway', sans-serif`, fontWeight: 500 },
    body1: { fontFamily: `'Roboto Slab', serif`, lineHeight: 1.7 },
    body2: { fontFamily: `'Roboto Slab', serif`, lineHeight: 1.6 },
    button: { fontFamily: `'Raleway', sans-serif`, fontWeight: 600, textTransform: 'none' },
    caption: { fontFamily: `'Roboto Slab', serif` },
    overline: { fontFamily: `'Raleway', sans-serif`, fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: `'Raleway', sans-serif`,
          fontWeight: 600,
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
