'use client';

import { Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';

const UserCancellationSnackbar = () => {
  const t = useTranslations('profile');
  const showUserCancellationSnackbar =
    sessionStorage.getItem('showUserCancellationSnackbar') === 'true';
  if (showUserCancellationSnackbar) {
    sessionStorage.removeItem('showUserCancellationSnackbar');
  }

  return (
    <Snackbar
      open={showUserCancellationSnackbar}
      autoHideDuration={3000}
      message={t('personalData.deleteAccount.deleted')}
    />
  );
};

export default UserCancellationSnackbar;
