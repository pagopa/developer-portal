import { ResolvedMetadata } from 'next';
import {
  makeHreflangAlternates,
  makeHreflangUrls,
  makeMetadata,
} from '@/helpers/metadata.helpers';
import { browserEnv } from '@/browserConfig';

const { baseUrl, websiteName } = browserEnv.config;

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
  it('should generate hreflang alternates for Italian and English', () => {
    const result = makeHreflangAlternates([
      { langCode: 'it', path: '/it' },
      { langCode: 'en', path: '/en' },
    ]);

    expect(result).toEqual({
      languages: {
        it: '/it',
        en: '/en',
        'x-default': '/it',
      },
    });
  });

  it('should generate alternates for Italian only', () => {
    const result = makeHreflangAlternates([{ langCode: 'it', path: '/it' }]);

    expect(result).toEqual({
      languages: {
        it: '/it',
        'x-default': '/it',
      },
    });
  });

  it('should not generate x-default when Italian is missing', () => {
    const result = makeHreflangAlternates([{ langCode: 'en', path: '/en' }]);

    expect(result).toEqual({
      languages: {
        en: '/en',
      },
    });
  });

  it('should support different localized slugs', () => {
    const result = makeHreflangAlternates([
      { langCode: 'it', path: '/it/solutions/pagamenti' },
      { langCode: 'en', path: '/en/solutions/payments' },
    ]);

    expect(result).toEqual({
      languages: {
        it: '/it/solutions/pagamenti',
        en: '/en/solutions/payments',
        'x-default': '/it/solutions/pagamenti',
      },
    });
  });

  it('should return empty languages when no paths are provided', () => {
    const result = makeHreflangAlternates([]);

    expect(result).toEqual({
      languages: {},
    });
  });

  it('should generate relative paths without a base URL', () => {
    const result = makeHreflangAlternates([{ langCode: 'it', path: '/it' }]);

    expect(result).toEqual({
      languages: {
        it: '/it',
        'x-default': '/it',
      },
    });
  });

  it('should generate alternates independently from canonical URL', () => {
    const result = makeHreflangAlternates([
      { langCode: 'it', path: '/it/solutions' },
      { langCode: 'en', path: '/en/solutions' },
    ]);

    expect(result).toEqual({
      languages: {
        it: '/it/solutions',
        en: '/en/solutions',
        'x-default': '/it/solutions',
      },
    });
  });
});

describe('makeHreflangUrls', () => {
  it('should generate relative URLs for localized paths', () => {
    const result = makeHreflangUrls([
      { langCode: 'it', path: '/it/solutions/pagamenti' },
      { langCode: 'en', path: '/en/solutions/payments' },
    ]);

    expect(result).toEqual({
      it: '/it/solutions/pagamenti',
      en: '/en/solutions/payments',
      'x-default': '/it/solutions/pagamenti',
    });
  });

  it('should generate Italian and x-default only', () => {
    const result = makeHreflangUrls([
      { langCode: 'it', path: '/it/solutions' },
    ]);

    expect(result).toEqual({
      it: '/it/solutions',
      'x-default': '/it/solutions',
    });
  });

  it('should not generate x-default when Italian is missing', () => {
    const result = makeHreflangUrls([
      { langCode: 'en', path: '/en/solutions' },
    ]);

    expect(result).toEqual({
      en: '/en/solutions',
    });
  });

  it('should return an empty object when no paths are available', () => {
    const result = makeHreflangUrls([]);

    expect(result).toEqual({});
  });
});
