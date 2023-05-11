import { createTheme, ThemeProvider } from '@mui/material';
import { theme as muiItaliaTheme } from '@pagopa/mui-italia';

export const theme = createTheme(muiItaliaTheme, {
  palette: {
    background: {
      code: '#363C42',
    },
  },
});
