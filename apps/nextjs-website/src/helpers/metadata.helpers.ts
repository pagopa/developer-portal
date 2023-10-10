import { translations } from '@/_contents/translations';
import { ResolvedMetadata } from 'next';
import { AbsoluteTemplateString } from 'next/dist/lib/metadata/types/metadata-types';
import { Twitter } from 'next/dist/lib/metadata/types/twitter-types';

export const getTitleFromMarkdown = (markdown: string): string => {
  const lines = markdown.split('\n').filter((line) => line !== '');
  const titles = lines.filter((line) => line.startsWith('#'));
  const title = titles[0]?.replace('# ', '').trim() ?? '';
  return title;
};

export const getTwitterMetadata = (title: string): Twitter => ({
  title,
  card: 'summary',
  site: '@pagopa',
  creator: '@pagopa',
});

export const getPreviousTitle = async (
  parent?: ResolvedMetadata
): Promise<string | AbsoluteTemplateString> => {
  const { shared } = translations;
  const previousTitle = parent?.title || shared.siteTitle;

  return previousTitle;
};
