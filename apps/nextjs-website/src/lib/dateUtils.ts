export const formatDate = (
  date: Date,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const localeString = locale === 'en' ? 'en-US' : 'it-IT';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: locale === 'en' ? 'UTC' : 'Europe/Rome',
  };

  return new Intl.DateTimeFormat(localeString, {
    ...defaultOptions,
    ...options,
  }).format(date);
};

export const formatTime = (
  date: Date,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const localeString = locale === 'en' ? 'en-US' : 'it-IT';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(localeString, {
    ...defaultOptions,
    ...options,
  }).format(date);
};

export const formatDateTime = (
  date: Date,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const localeString = locale === 'en' ? 'en-US' : 'it-IT';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: locale === 'en' ? 'UTC' : 'Europe/Rome',
  };

  return new Intl.DateTimeFormat(localeString, {
    ...defaultOptions,
    ...options,
  }).format(date);
};
