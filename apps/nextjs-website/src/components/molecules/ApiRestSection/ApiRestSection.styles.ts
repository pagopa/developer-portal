import { Palette } from '@mui/material';

export const getStyles = (palette: Palette) => {
  const white = palette.common.white;
  return {
    select: {
      minWidth: { sx: 'auto', sm: '400px' },
      color: palette.text.primary,
      margin: 1,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: `${palette.primary.main} !important`, // !important is needed due to MUI that overwrite style via javascript
      },

      '& .MuiSelect-icon': {
        color: palette.primary.main,
      },
    },
    selectContainer: {
      background: white,
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
