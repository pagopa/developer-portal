'use client';

import { Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const UserCancellationSnackbar = () => {
  const t = useTranslations('profile');
  const [show, setShow] = useState(false);

  if (sessionStorage.getItem('showUserCancellationSnackbar') === 'true') {
    setShow(true);
    sessionStorage.removeItem('showUserCancellationSnackbar');
  }

  return (
    /*
      autoHideDuration works only if onClose callback prop is set
    */
    <Snackbar
      open={show}
      autoHideDuration={3000}
      onClose={() => setShow(false)}
      message={t('personalData.deleteAccount.deleted')}
    />
  );
};

export default UserCancellationSnackbar;
