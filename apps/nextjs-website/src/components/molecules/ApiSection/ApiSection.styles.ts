import { Palette } from '@mui/material';

export const getStyles = (palette: Palette) => {
  const white = palette.common.white;
  return {
    formControl: {
      alignSelf: 'center',
      '& .MuiFormLabel-root': {
        color: `${white} !important`,
        marginTop: '7px',
        marginLeft: '8px',
      },
    },
    select: {
      color: white,
      margin: 1,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: `${white} !important`,
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
