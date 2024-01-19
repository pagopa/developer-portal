import { translations } from '@/_contents/translations';
import { defaultOgTagImage } from '@/config';
import { Metadata, ResolvedMetadata } from 'next';

type MakeMetadataParams = {
  readonly parent?: ResolvedMetadata;
  readonly title?: string;
  readonly description?: string;
  readonly url?: string;
  readonly image?: string;
  readonly locale?: string;
};

type MakeMetadataFunction = (params: MakeMetadataParams) => Metadata;

export const makeMetadata: MakeMetadataFunction = ({
  parent,
  title,
  description,
  url,
  image: imageParam,
  locale,
}) => {
  const { shared } = translations;
  const previousTitle = parent?.title?.absolute || shared.siteTitle;
  const metadataTitle = title ? `${previousTitle} | ${title}` : previousTitle;
  const image = imageParam || defaultOgTagImage;
  const openGraph = getOpenGraphMetadata(
    metadataTitle,
    description,
    image,
    locale
  );
  const twitter = getTwitterMetadata(metadataTitle, description, image);

  return {
    title: metadataTitle,
    description: description || '',
    url: url || '',
    openGraph,
    twitter,
  };
};

const getOpenGraphMetadata = (
  title: string,
  description?: string,
  image?: string,
  locale = 'it_IT'
): Metadata['openGraph'] => ({
  title,
  type: 'website',
  locale,
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
