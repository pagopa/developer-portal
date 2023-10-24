import { translations } from '@/_contents/translations';
import { MakeMetadataFunction } from '@/lib/types/makeMetadataFunction';
import { Metadata } from 'next';

export const makeMetadata: MakeMetadataFunction = ({
  parent,
  title,
  description,
  url,
  image,
}) => {
  const { shared } = translations;
  const previousTitle = parent?.title?.absolute || shared.siteTitle;
  const metadataTitle = title ? `${previousTitle} | ${title}` : previousTitle;

  return {
    title: metadataTitle,
    description: description || '',
    url: url || '',
    openGraph: getOpenGraphMetadata(metadataTitle, description, image),
    twitter: getTwitterMetadata(metadataTitle, description, image),
  };
};

const getOpenGraphMetadata = (
  title: string,
  description?: string,
  image?: string
): Metadata['openGraph'] => ({
  title,
  type: 'website',
  locale: 'it_IT',
  description: description || '',
  images: image,
});

const getTwitterMetadata = (
  title: string,
  description?: string,
  image?: string
): Metadata['twitter'] => ({
  title,
  description: description || '',
  images: image,
  card: 'summary',
  site: '@pagopa',
  creator: '@pagopa',
});
