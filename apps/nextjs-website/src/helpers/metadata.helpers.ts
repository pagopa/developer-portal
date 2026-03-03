import { defaultOgTagImage, websiteName } from '@/config';
import { SEO } from '@/lib/types/seo';
import { Metadata, ResolvedMetadata } from 'next';
import { SUPPORTED_LOCALES } from '@/locales';

type MakeMetadataParams = {
  readonly parent?: ResolvedMetadata;
  readonly title?: string;
  readonly description?: string;
  readonly url?: string;
  readonly image?: string;
  readonly langCode?: string;
};

type MakeMetadataFunction = (params: MakeMetadataParams) => Metadata;

export const makeMetadata: MakeMetadataFunction = ({
  parent,
  title,
  description,
  url,
  image: imageParam,
  langCode,
}) => {
  const previousTitle = parent?.title?.absolute || websiteName;
  const metadataTitle = title ? `${title} | ${previousTitle}` : previousTitle;
  const image = imageParam || defaultOgTagImage;
  const openGraph = getOpenGraphMetadata(
    metadataTitle,
    description,
    image,
    SUPPORTED_LOCALES.find(({ langCode: code }) => code === langCode)?.locale
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

export const makeMetadataFromStrapi = (seo: SEO): Metadata => {
  const baseMetadata = makeMetadata({
    title: seo.metaTitle,
    description: seo.metaDescription,
    url: seo.canonicalURL,
    image: seo.metaImage?.data?.attributes?.url,
  });

  const metadata: Metadata = {
    ...baseMetadata,
    keywords: seo.keywords,
    robots: seo.metaRobots,
    viewport: seo.metaViewport,
    alternates: {
      canonical: seo.canonicalURL,
    },
    openGraph: enhanceOpenGraphMetadata(baseMetadata.openGraph, seo),
    twitter: enhanceTwitterMetadata(baseMetadata.twitter, seo),
  };

  return metadata;
};

const enhanceOpenGraphMetadata = (
  baseOG: Metadata['openGraph'] | undefined,
  seo: SEO
): Metadata['openGraph'] => {
  if (!baseOG) return baseOG;

  const enhancedOG = { ...baseOG };

  // eslint-disable-next-line functional/no-expression-statements
  seo.metaSocial?.forEach((social) => {
    if (social.socialNetwork?.toLowerCase() === 'facebook') {
      // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
      enhancedOG.title = social.title || enhancedOG.title;
      // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
      enhancedOG.description = social.description || enhancedOG.description;
    }
  });

  return enhancedOG;
};

const enhanceTwitterMetadata = (
  baseTwitter: Metadata['twitter'] | undefined,
  seo: SEO
): Metadata['twitter'] => {
  if (!baseTwitter) return baseTwitter;

  const enhancedTwitter = { ...baseTwitter };

  // eslint-disable-next-line functional/no-expression-statements
  seo.metaSocial?.forEach((social) => {
    if (social.socialNetwork?.toLowerCase() === 'twitter') {
      // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
      enhancedTwitter.title = social.title || enhancedTwitter.title;
      // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
      enhancedTwitter.description =
        social.description || enhancedTwitter.description;
      // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
      if (social.site) enhancedTwitter.site = social.site;
      // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
      if (social.creator) enhancedTwitter.creator = social.creator;
    }
  });

  return enhancedTwitter;
};
