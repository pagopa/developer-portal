import {
  breadcrumbItemByProduct,
  convertApiToStructuredDataSoftwareApplication,
  convertSeoToStructuredDataArticle,
  convertWebinarToStructuredDataEvent,
  getItemFromPaths,
  makeBreadcrumbList,
  makeEvent,
  makeFAQPage,
  makeHowTo,
  makeSoftwareApplication,
  makeWebPage,
  productToBreadcrumb,
  quickStartToStructuredDataHowTo,
  organization,
  website,
  convertBodyMetadataToStructuredData,
} from '@/helpers/structuredData.helpers';
import { Product } from '@/lib/products/types';
import { Webinar } from '@/lib/webinars/types';
import { ApiDataPageProps } from '@/app/[locale]/[productSlug]/api/[apiDataSlug]/page';
import { QuickStartGuidePageProps } from '@/app/[locale]/[productSlug]/quick-start/page';
import { SEO } from '@/lib/seo/types';
import {
  expectedStructuredDataOfTheMockBody,
  mockDocument,
} from '../__mocks__/structuredDataFromDocumentMock';

jest.mock('@/config', () => ({
  baseUrl: 'https://test.base.url',
  websiteName: 'Test Website Name',
  organizationInfo: {
    name: 'Test Organization',
    url: 'https://test.org.url',
    logo: 'https://test.org.url/logo.png',
  },
}));

describe('structuredData.helpers', () => {
  describe('breadcrumbItemByProduct', () => {
    it('returns undefined if product is undefined', () => {
      expect(
        breadcrumbItemByProduct('it', undefined, ['test'])
      ).toBeUndefined();
    });

    it('returns undefined if product has no slug', () => {
      expect(
        breadcrumbItemByProduct('it', {} as Product, ['test'])
      ).toBeUndefined();
    });

    it('returns undefined if paths are undefined', () => {
      expect(
        breadcrumbItemByProduct('it', { slug: 'test-slug' } as Product)
      ).toBeUndefined();
    });

    it('returns the correct breadcrumb item', () => {
      expect(
        breadcrumbItemByProduct('it', { slug: 'test-slug' } as Product, [
          'path1',
          'path2',
        ])
      ).toBe('https://test.base.url/it/test-slug/path1/path2');
    });
  });

  describe('productToBreadcrumb', () => {
    it('returns breadcrumb with undefined name and item if product is undefined', () => {
      expect(productToBreadcrumb('it')).toEqual({
        name: undefined,
        item: undefined,
      });
    });

    it('returns the correct breadcrumb for a product', () => {
      expect(
        productToBreadcrumb('it', {
          name: 'Test Product',
          slug: 'test-slug',
        } as Product)
      ).toEqual({
        name: 'Test Product',
        item: 'https://test.base.url/it/test-slug/overview',
      });
    });
  });

  describe('getItemFromPaths', () => {
    it('returns undefined if paths are undefined', () => {
      expect(getItemFromPaths('it')).toBeUndefined();
    });

    it('returns the correct item path', () => {
      expect(getItemFromPaths('it', ['path1', 'path2'])).toBe(
        'https://test.base.url/it/path1/path2'
      );
    });
  });

  describe('makeBreadcrumbList', () => {
    it('returns a WithContext<BreadcrumbList> from items', () => {
      const items = [
        { name: 'Home', item: 'https://test.base.url' },
        { name: 'Test', item: 'https://test.base.url/test' },
      ];
      expect(makeBreadcrumbList(items)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://test.base.url',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Test',
            item: 'https://test.base.url/test',
          },
        ],
      });
    });
  });

  describe('makeWebPage', () => {
    it('returns a WithContext<WebPage> using media for image if present', () => {
      const webpage = {
        name: 'Test Page',
        media: { url: 'https://test.image.url', width: 100, height: 100 },
      };
      expect(makeWebPage(webpage)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Test Page',
        media: { url: 'https://test.image.url', width: 100, height: 100 },
        isPartOf: website,
        author: organization,
        image: {
          '@type': 'ImageObject',
          url: 'https://test.image.url',
          width: '100',
          height: '100',
        },
      });
    });

    it('uses provided image over media', () => {
      const webpage = {
        name: 'Test Page',
        image: 'https://provided.image.url',
        media: { url: 'https://test.image.url', width: 100, height: 100 },
      };
      expect(makeWebPage(webpage)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Test Page',
        media: { url: 'https://test.image.url', width: 100, height: 100 },
        isPartOf: website,
        author: organization,
        image: 'https://provided.image.url',
      });
    });
  });

  describe('makeFAQPage', () => {
    it('returns a WithContext<FAQPage>', () => {
      const faqs = [
        { question: 'Q1', answer: 'A1' },
        { question: 'Q2', answer: 'A2' },
      ];
      expect(makeFAQPage(faqs)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Q1',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A1',
            },
          },
          {
            '@type': 'Question',
            name: 'Q2',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A2',
            },
          },
        ],
      });
    });
  });

  describe('makeHowTo', () => {
    it('returns a WithContext<HowTo>', () => {
      const howTo = {
        name: 'How to do it',
        step: [],
      };
      expect(makeHowTo(howTo)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to do it',
        step: [],
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'EUR',
          value: '0',
        },
      });
    });
  });

  describe('quickStartToStructuredDataHowTo', () => {
    it('converts QuickStartGuidePageProps to HowTo', () => {
      const quickStart: QuickStartGuidePageProps = {
        seo: {
          metaTitle: 'Quick Start Title',
          metaImage: { url: 'img', width: 10, height: 10 },
        } as SEO,
        abstract: { description: 'Abstract Desc', title: 'Abstract Title' },
        steps: [{ title: 'Step 1' }, { title: 'Step 2' }],
      } as unknown as QuickStartGuidePageProps;

      expect(quickStartToStructuredDataHowTo(quickStart)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Quick Start Title',
        description: 'Abstract Desc',
        image: {
          '@type': 'ImageObject',
          url: 'img',
          width: '10',
          height: '10',
        },
        step: [
          { '@type': 'HowToStep', text: 'Step 1' },
          { '@type': 'HowToStep', text: 'Step 2' },
        ],
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'EUR',
          value: '0',
        },
      });
    });
  });

  describe('makeEvent', () => {
    it('returns a WithContext<Event>', () => {
      const event = { name: 'Test Event' };
      expect(makeEvent(event)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Test Event',
        offers: {
          '@type': 'Offer',
          price: '0',
          availability: 'https://schema.org/InStock',
        },
      });
    });
  });

  describe('convertWebinarToStructuredDataEvent', () => {
    it('converts a Webinar to an Event', () => {
      const webinar: Webinar = {
        title: 'Test Webinar',
        startDateTime: '2024-01-01T10:00:00.000Z',
        endDateTime: '2024-01-01T11:00:00.000Z',
        description: 'Webinar Desc',
        imagePath: 'webinar-img.jpg',
        slug: 'test-webinar',
        speakers: [
          {
            name: 'Speaker 1',
            jobTitle: 'Job 1',
            avatar: { url: 'avatar1.jpg', width: 10, height: 10 },
          },
        ],
      } as unknown as Webinar;

      expect(convertWebinarToStructuredDataEvent(webinar)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Test Webinar',
        startDate: '2024-01-01T10:00:00.000Z',
        endDate: '2024-01-01T11:00:00.000Z',
        eventStatus: 'https://schema.org/EventScheduled',
        description: 'Webinar Desc',
        image: 'webinar-img.jpg',
        offers: {
          '@type': 'Offer',
          price: '0',
          availability: 'https://schema.org/InStock',
        },
        organizer: organization,
        location: {
          '@type': 'VirtualLocation',
          url: 'https://test.base.url/webinars/test-webinar',
        },
        performers: [
          {
            '@type': 'Person',
            name: 'Speaker 1',
            jobTitle: 'Job 1',
            image: {
              '@type': 'ImageObject',
              url: 'avatar1.jpg',
              width: '10',
              height: '10',
            },
          },
        ],
      });
    });
  });

  describe('makeSoftwareApplication', () => {
    it('returns a WithContext<SoftwareApplication>', () => {
      const app = { name: 'Test App' };
      expect(makeSoftwareApplication(app)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Test App',
        applicationCategory: 'Business',
        offers: {
          '@type': 'Offer',
          price: '0',
          availability: 'https://schema.org/InStock',
        },
      });
    });
  });

  describe('convertApiToStructuredDataSoftwareApplication', () => {
    it('returns undefined if api is undefined', () => {
      expect(
        convertApiToStructuredDataSoftwareApplication(undefined)
      ).toBeUndefined();
    });

    it('converts an ApiDataPageProps to SoftwareApplication', () => {
      const api: ApiDataPageProps = {
        specUrlsName: 'API Spec',
        product: { slug: 'test-product' } as Product,
        apiDataSlug: 'test-api',
      } as ApiDataPageProps;

      expect(convertApiToStructuredDataSoftwareApplication(api)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'API Spec',
        url: 'https://test.base.url/test-product/api/test-api',
        applicationCategory: 'Business',
        offers: {
          '@type': 'Offer',
          price: '0',
          availability: 'https://schema.org/InStock',
        },
      });
    });
  });

  describe('convertSeoToStructuredDataArticle', () => {
    it('returns undefined if seo is undefined', () => {
      expect(convertSeoToStructuredDataArticle(undefined)).toBeUndefined();
    });

    it('converts SEO to Article', () => {
      const seo: SEO = {
        metaTitle: 'SEO Title',
        metaDescription: 'SEO Desc',
        canonicalURL: 'https://seo.url',
        keywords: ['k1', 'k2'],
        metaImage: { url: 'seo-img.jpg', width: 20, height: 20 },
      } as unknown as SEO;

      expect(convertSeoToStructuredDataArticle(seo)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: 'SEO Title',
        description: 'SEO Desc',
        url: 'https://seo.url',
        author: organization,
        about: ['k1', 'k2'],
        image: {
          '@type': 'ImageObject',
          url: 'seo-img.jpg',
          width: '20',
          height: '20',
        },
      });
    });
  });

  describe('convertBodyMetadataToStructuredData', () => {
    it('returns undefined if bodyMetadata is undefined', () => {
      expect(convertBodyMetadataToStructuredData(undefined)).toBeUndefined();
    });

    it('returns undefined if bodyMetadata is empty string', () => {
      expect(convertBodyMetadataToStructuredData('')).toBeUndefined();
    });

    it('returns undefined if bodyMetadata is not valid yaml', () => {
      // Temporarily mock console.error to avoid noise in test output
      const consoleSpy = jest
        .spyOn(console, 'error')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(() => {});
      expect(
        convertBodyMetadataToStructuredData('invalid yaml: - -')
      ).toBeUndefined();
      consoleSpy.mockRestore();
    });

    it('returns undefined if bodyMetadata has no schema property', () => {
      const bodyMetadata = `
funzione: tutorial
livello: principiante
`;
      expect(convertBodyMetadataToStructuredData(bodyMetadata)).toBeUndefined();
    });

    it('returns schema from bodyMetadata', () => {
      const bodyMetadata = `
schema:
  '@context': https://schema.org
  '@type': HowTo
  name: Come aderire al servizio
  description: Tutorial che descrive il processo
`;
      expect(convertBodyMetadataToStructuredData(bodyMetadata)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Come aderire al servizio',
        description: 'Tutorial che descrive il processo',
      });
    });

    it('returns complex schema from mockBody', () => {
      // simulate the bodyMetadata string extracted by parseRawBody
      const bodyMetadata = mockDocument.split('---')[1];
      expect(convertBodyMetadataToStructuredData(bodyMetadata)).toEqual({
        '@context': 'https://schema.org',
        ...(typeof expectedStructuredDataOfTheMockBody[0] === 'object' &&
        expectedStructuredDataOfTheMockBody[0] !== null
          ? expectedStructuredDataOfTheMockBody[0]
          : {}),
      });
    });
  });
});
