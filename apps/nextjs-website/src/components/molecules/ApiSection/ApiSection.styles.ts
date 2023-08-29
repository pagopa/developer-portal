import { Palette } from '@mui/material';

export const getStyles = (palette: Palette) => {
  const white = palette.common.white;
  return {
    select: {
      minWidth: { sx: 'auto', sm: '400px' },
      color: white,
      margin: 1,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: `${white} !important`, // !important is needed due to MUI that overwrite style via javascript
      },

      '& .MuiSelect-icon': {
        color: white,
      },
    },
    selectContainer: {
      background: palette.primary.dark,
      height: 72,
      paddingRight: 2,
    },
    soapContainer: {
      background: palette.primary.dark,
      color: white,
      padding: '0 1rem',
    },
    soapButton: {
      cursor: 'pointer',
    },
  };
};
