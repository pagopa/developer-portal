import { render } from '@testing-library/react';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { Thing } from 'schema-dts';
import { SEO } from '@/lib/seo/types';

jest.mock('@/helpers/structuredData.helpers', () => ({
  homeBreadCrumb: { name: 'Home', item: 'https://test.com' },
  organizationWithContext: { '@type': 'Organization', name: 'Test Org' },
  makeBreadcrumbList: jest.fn((items) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items,
  })),
  makeWebPage: jest.fn((page) => ({ '@type': 'WebPage', ...page })),
}));

describe('generateStructuredDataScripts', () => {
  it('renders script tags for default things (breadcrumbs, webpage, organization)', () => {
    const { container } = render(generateStructuredDataScripts({}));

    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(3);

    expect(JSON.parse(scripts[0].innerHTML)).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', item: 'https://test.com' }],
    });

    expect(JSON.parse(scripts[1].innerHTML)).toEqual({
      '@type': 'WebPage',
    });

    expect(JSON.parse(scripts[2].innerHTML)).toEqual({
      '@type': 'Organization',
      name: 'Test Org',
    });
  });

  it('renders script tags with custom breadcrumbs and seo', () => {
    const { container } = render(
      generateStructuredDataScripts({
        breadcrumbsItems: [{ name: 'Custom', item: 'https://custom.com' }],
        seo: {
          metaTitle: 'Custom Title',
          metaDescription: 'Custom Description',
          canonicalURL: 'https://custom.com',
          metaImage: { url: 'https://image.com' },
        } as unknown as SEO,
      })
    );

    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(3);

    expect(JSON.parse(scripts[0].innerHTML)).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: 'Home', item: 'https://test.com' },
        { name: 'Custom', item: 'https://custom.com' },
      ],
    });

    expect(JSON.parse(scripts[1].innerHTML)).toEqual({
      '@type': 'WebPage',
      name: 'Custom Title',
      description: 'Custom Description',
      url: 'https://custom.com',
      media: { url: 'https://image.com' },
    });
  });

  it('renders script tags for additional things, filtering out undefined values', () => {
    const { container } = render(
      generateStructuredDataScripts({
        things: [{ '@type': 'Event', name: 'Test Event' } as Thing, undefined],
      })
    );

    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(4);

    expect(JSON.parse(scripts[3].innerHTML)).toEqual({
      '@type': 'Event',
      name: 'Test Event',
    });
  });
});
