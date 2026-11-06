import { ResolvedMetadata } from 'next';
import {
  makeHreflangAlternates,
  makeMetadata,
} from '@/helpers/metadata.helpers';
import { baseUrl, websiteName } from '@/config';

const parent = {
  title: {
    absolute: 'Parent title',
  },
} as ResolvedMetadata;

it('should return the correct metadata when all fields are present', () => {
  const metadata = makeMetadata({
    parent,
    title: 'Title',
    description: 'Description',
    url: 'Url',
    image: 'Image',
  });

  expect(metadata).toEqual({
    title: 'Title | Parent title',
    description: 'Description',
    url: 'Url',
    openGraph: {
      title: 'Title | Parent title',
      type: 'website',
      locale: 'it_IT',
      description: 'Description',
      images: 'Image',
    },
    twitter: {
      title: 'Title | Parent title',
      description: 'Description',
      images: 'Image',
      card: 'summary',
      site: '@pagopa',
      creator: '@pagopa',
    },
  });
});

it('should return the correct metadata when title is missing', () => {
  const metadataWithoutTitle = makeMetadata({
    parent,
    description: 'Description',
    url: 'Url',
    image: 'Image',
  });

  expect(metadataWithoutTitle).toEqual({
    title: 'Parent title',
    description: 'Description',
    url: 'Url',
    openGraph: {
      title: 'Parent title',
      type: 'website',
      locale: 'it_IT',
      description: 'Description',
      images: 'Image',
    },
    twitter: {
      title: 'Parent title',
      description: 'Description',
      images: 'Image',
      card: 'summary',
      site: '@pagopa',
      creator: '@pagopa',
    },
  });
});

it('should return the correct metadata when description is missing', () => {
  const metadataWithoutDescription = makeMetadata({
    parent,
    title: 'Title',
    url: 'Url',
    image: 'Image',
  });

  expect(metadataWithoutDescription).toEqual({
    title: 'Title | Parent title',
    description: '',
    url: 'Url',
    openGraph: {
      title: 'Title | Parent title',
      type: 'website',
      locale: 'it_IT',
      description: '',
      images: 'Image',
    },
    twitter: {
      title: 'Title | Parent title',
      description: '',
      images: 'Image',
      card: 'summary',
      site: '@pagopa',
      creator: '@pagopa',
    },
  });
});

it('should return the correct metadata when url is missing', () => {
  const metadataWithoutUrl = makeMetadata({
    parent,
    title: 'Title',
    description: 'Description',
    image: 'Image',
  });

  expect(metadataWithoutUrl).toEqual({
    title: 'Title | Parent title',
    description: 'Description',
    url: '',
    openGraph: {
      title: 'Title | Parent title',
      type: 'website',
      locale: 'it_IT',
      description: 'Description',
      images: 'Image',
    },
    twitter: {
      title: 'Title | Parent title',
      description: 'Description',
      images: 'Image',
      card: 'summary',
      site: '@pagopa',
      creator: '@pagopa',
    },
  });
});

it('should return the correct metadata when image is missing', () => {
  const metadataWithoutImage = makeMetadata({
    parent,
    title: 'Title',
    description: 'Description',
    url: 'Url',
  });

  expect(metadataWithoutImage).toEqual({
    title: 'Title | Parent title',
    description: 'Description',
    url: 'Url',
    openGraph: {
      title: 'Title | Parent title',
      type: 'website',
      locale: 'it_IT',
      description: 'Description',
      images: `${baseUrl}/images/dev-portal-home.jpg`,
    },
    twitter: {
      title: 'Title | Parent title',
      description: 'Description',
      images: `${baseUrl}/images/dev-portal-home.jpg`,
      card: 'summary',
      site: '@pagopa',
      creator: '@pagopa',
    },
  });
});

it('should return the correct metadata when parent is missing', () => {
  const metadataWithoutParent = makeMetadata({
    title: 'Title',
    description: 'Description',
    url: 'Url',
    image: 'Image',
  });

  expect(metadataWithoutParent).toEqual({
    title: `Title | ${websiteName}`,
    description: 'Description',
    url: 'Url',
    openGraph: {
      title: `Title | ${websiteName}`,
      type: 'website',
      locale: 'it_IT',
      description: 'Description',
      images: 'Image',
    },
    twitter: {
      title: `Title | ${websiteName}`,
      description: 'Description',
      images: 'Image',
      card: 'summary',
      site: '@pagopa',
      creator: '@pagopa',
    },
  });
});

describe('makeHreflangAlternates', () => {
  const baseUrl = 'https://developer.pagopa.it';

  it('should generate hreflang alternates for Italian and English', () => {
    const result = makeHreflangAlternates(baseUrl, [
      { langCode: 'it', path: '/it' },
      { langCode: 'en', path: '/en' },
    ]);

    expect(result).toEqual({
      languages: {
        it: `${baseUrl}/it`,
        en: `${baseUrl}/en`,
        'x-default': `${baseUrl}/it`,
      },
    });
  });

  it('should generate alternates for Italian only', () => {
    const result = makeHreflangAlternates(baseUrl, [
      { langCode: 'it', path: '/it' },
    ]);

    expect(result).toEqual({
      languages: {
        it: `${baseUrl}/it`,
        'x-default': `${baseUrl}/it`,
      },
    });
  });

  it('should not generate x-default when Italian is missing', () => {
    const result = makeHreflangAlternates(baseUrl, [
      { langCode: 'en', path: '/en' },
    ]);

    expect(result).toEqual({
      languages: {
        en: `${baseUrl}/en`,
      },
    });
  });

  it('should support different localized slugs', () => {
    const result = makeHreflangAlternates(baseUrl, [
      { langCode: 'it', path: '/it/solutions/pagamenti' },
      { langCode: 'en', path: '/en/solutions/payments' },
    ]);

    expect(result).toEqual({
      languages: {
        it: `${baseUrl}/it/solutions/pagamenti`,
        en: `${baseUrl}/en/solutions/payments`,
        'x-default': `${baseUrl}/it/solutions/pagamenti`,
      },
    });
  });

  it('should return empty languages when no paths are provided', () => {
    const result = makeHreflangAlternates(baseUrl, []);

    expect(result).toEqual({
      languages: {},
    });
  });

  it('should use the provided baseUrl', () => {
    const result = makeHreflangAlternates('https://www.pagopa.it', [
      { langCode: 'it', path: '/it' },
    ]);

    expect(result).toEqual({
      languages: {
        it: 'https://www.pagopa.it/it',
        'x-default': 'https://www.pagopa.it/it',
      },
    });
  });

  it('should use canonical URL origin for localized paths', () => {
    const canonicalURL = 'https://www.pagopa.it/it/solutions';

    const result = makeHreflangAlternates(canonicalURL, [
      { langCode: 'it', path: '/it/solutions' },
      { langCode: 'en', path: '/en/solutions' },
    ]);

    expect(result).toEqual({
      languages: {
        it: 'https://www.pagopa.it/it/solutions',
        en: 'https://www.pagopa.it/en/solutions',
        'x-default': 'https://www.pagopa.it/it/solutions',
      },
    });
  });
});
