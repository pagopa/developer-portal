'use client';

import { Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const UserCancellationSnackbar = () => {
  const t = useTranslations('profile');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('showUserCancellationSnackbar');
    sessionStorage.removeItem('showUserCancellationSnackbar');
    if (stored === 'true') {
      setShow(true);
    }
  }, []);

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      open={show}
      autoHideDuration={3000}
      onClose={() => setShow(false)}
      message={t('personalData.deleteAccount.deleted')}
    />
  );
};

export default UserCancellationSnackbar;
