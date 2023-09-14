import { Path } from '@/lib/types/path';

export const sendApiPath: Path = {
  name: 'API',
  path: '/send/api',
};

export const sendB2BApiPath: Path = {
  name: 'B2B API',
  path: `${sendApiPath.path}?spec=API%20B2B%20per%20le%20Pubbliche%20Amministrazioni`,
};

export const sendNotificationsApiPath: Path = {
  name: 'Notification API',
  path: `${sendApiPath.path}?spec=API%20B2B%20avanzamento%20notifiche`,
};
