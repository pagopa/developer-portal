'use client';

import { Snackbar } from '@mui/material';
import { useState } from 'react';

const UserCancellationSnackbar = () => {
  const [show, setShow] = useState(false);
  const showUserCancellationSnackbar =
    sessionStorage.getItem('showUserCancellationSnackbar') === 'true';
  if (showUserCancellationSnackbar) {
    setShow(true);
    sessionStorage.removeItem('showUserCancellationSnackbar');
  }
  return (
    <Snackbar
      open={show}
      autoHideDuration={3000}
      onClose={() => setShow(false)}
      message={'personalData.deleteAccount.deleted'}
    />
  );
};

export default UserCancellationSnackbar;
