import { ResolvedMetadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
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
    title: `${websiteName} | Title`,
    description: 'Description',
    url: 'Url',
    openGraph: {
      title: `${websiteName} | Title`,
      type: 'website',
      locale: 'it_IT',
      description: 'Description',
      images: 'Image',
    },
    twitter: {
      title: `${websiteName} | Title`,
      description: 'Description',
      images: 'Image',
      card: 'summary',
      site: '@pagopa',
      creator: '@pagopa',
    },
  });
});
