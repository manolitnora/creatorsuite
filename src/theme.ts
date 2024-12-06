import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Custom color palette
const lightPalette = {
  primary: {
    main: '#2563eb', // Modern blue
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#7c3aed', // Vibrant purple
    light: '#a78bfa',
    dark: '#5b21b6',
    contrastText: '#ffffff',
  },
  success: {
    main: '#059669', // Emerald green
    light: '#34d399',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  error: {
    main: '#dc2626', // Modern red
    light: '#f87171',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#d97706', // Warm amber
    light: '#fbbf24',
    dark: '#b45309',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0284c7', // Sky blue
    light: '#38bdf8',
    dark: '#0369a1',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8fafc', // Light gray background
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b', // Slate gray
    secondary: '#64748b',
    disabled: '#94a3b8',
  },
};

// Create theme instance
const theme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    ...lightPalette,
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem',
        },
      },
    },
  },
});

export default theme;
