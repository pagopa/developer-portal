import { translations } from '@/_contents/translations';
import { ResolvedMetadata } from 'next';
import { Twitter } from 'next/dist/lib/metadata/types/twitter-types';

export const getTwitterMetadata = (title: string): Twitter => ({
  title,
  card: 'summary',
  site: '@pagopa',
  creator: '@pagopa',
});

export const getPreviousTitle = (parent?: ResolvedMetadata): string => {
  const { shared } = translations;
  const previousTitle = parent?.title?.absolute || shared.siteTitle;

  return previousTitle;
};
