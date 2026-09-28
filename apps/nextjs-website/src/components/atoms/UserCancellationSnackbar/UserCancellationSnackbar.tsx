'use client';

import { Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import useSessionStorageBoolean from './UserCancellationSnackbar.hook';

const UserCancellationSnackbar = () => {
  const t = useTranslations('profile');
  const [show, setShow] = useSessionStorageBoolean(
    'showUserCancellationSnackbar'
  );

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
