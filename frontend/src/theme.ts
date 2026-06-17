import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
      dark: '#0b5b55',
      light: '#3e948f',
    },
    secondary: {
      main: '#c27b3b',
    },
    background: {
      default: '#f6f2ea',
      paper: '#ffffff',
    },
    text: {
      primary: '#10212d',
      secondary: '#52606d',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
  },
})