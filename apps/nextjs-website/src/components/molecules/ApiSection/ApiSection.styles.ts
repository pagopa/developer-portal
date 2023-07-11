export const styles = {
  formControl: {
    alignSelf: 'center',
    '& .MuiFormLabel-root': {
      color: 'white !important', // TODO: find a way to override this
      marginTop: '7px',
      marginLeft: '8px',
    },
  },
  select: {
    color: 'white',
    margin: 1,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white !important', // TODO: find a way to override this
    },

    '& .MuiSelect-icon': {
      color: 'white',
    },
  },
  selectContainer: {
    background: '#0062C3',
    height: 72,
  },
  soapContainer: {
    background: '#0062C3',
    color: 'white',
    padding: '0 1rem',
  },
  soapButton: {
    cursor: 'pointer',
  },
};
