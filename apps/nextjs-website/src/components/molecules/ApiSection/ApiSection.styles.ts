import { theme } from '@pagopa/mui-italia';

export const styles = {
  select: {
    color: 'white',
    border: '1px solid white',
    margin: 1,
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
    '&:not(.Mui-disabled):hover::before': {
      borderColor: 'white',
    },
  },
  selectContainer: {
    background: '#0D1018',
  },
  soapContainer: {
    background: theme.palette.primary.dark,
    color: 'white',
    padding: '0 1rem',
  },
  soapButton: {
    cursor: 'pointer',
  },
};
