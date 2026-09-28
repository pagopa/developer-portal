'use client';

import { Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const UserCancellationSnackbar = () => {
  const t = useTranslations('profile');
  const [show, setShow] = useState<boolean>(() => {
    const stored = sessionStorage.getItem('showUserCancellationSnackbar');
    sessionStorage.removeItem('showUserCancellationSnackbar');
    return stored === 'true';
  });

  return (
    <Snackbar
      open={show}
      autoHideDuration={3000}
      onClose={() => setShow(false)}
      message={t('personalData.deleteAccount.deleted')}
    />
  );
};

export default UserCancellationSnackbar;
