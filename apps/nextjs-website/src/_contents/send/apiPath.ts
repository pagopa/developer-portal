import { Path } from '@/lib/types/path';

export const sendApiPath: Path = {
  name: 'API',
  path: '/send/api',
};

const sendB2BApiPathName = 'API B2B per le Pubbliche Amministrazioni';
export const sendB2BApiPath: Path = {
  name: sendB2BApiPathName,
  path: `${sendApiPath.path}?spec=${encodeURIComponent(sendB2BApiPathName)}`,
};

const sendNotificationsApiPathName = 'API B2B avanzamento notifiche';
export const sendNotificationsApiPath: Path = {
  name: sendNotificationsApiPathName,
  path: `${sendApiPath.path}?spec=${encodeURIComponent(
    sendNotificationsApiPathName
  )}`,
};
