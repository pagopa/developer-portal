import { makeOverviewsProps } from '@/lib/strapi/makeProps/makeOverviews';
import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import {
  dateNow,
  strapiOverviews,
} from '@/lib/strapi/__tests__/fixtures/overviews';
import _ from 'lodash';
import { OverviewPageProps } from '@/app/[productSlug]/overview/page';
import { minimalDataSingleOverview } from '@/lib/strapi/__tests__/factories/overviews';

describe('makeOverviewsProps', () => {
  it('should transform strapi overviews to overview page props', () => {
    const result = makeOverviewsProps(_.cloneDeep(strapiOverviews));

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      path: '/pago-pa/overview',
      product: {
        apiDataListPageUrl: '/pago-pa/api/api-rest',
        name: 'Piattaforma pagoPA',
        slug: 'pago-pa',
        shortName: 'pagoPA',
        hasApiDataListPage: true,
        hasGuideListPage: true,
        hasOverviewPage: true,
        hasQuickstartGuidePage: true,
        hasReleaseNotePage: true,
        hasTutorialListPage: true,
        description: undefined,
        bannerLinks: [
          {
            title: 'Banner Link 1',
            content: undefined,
            icon: {
              alternativeText: 'Example Image',
              caption: undefined,
              ext: '.jpg',
              height: 600,
              mime: 'image/jpeg',
              name: 'example.jpg',
              size: 123456,
              url: 'https://example.com/example.jpg',
              width: 800,
            },
            theme: 'light',
          },
        ],
      },
      hero: {
        backgroundImage: 'https://example.com/example.jpg',
        altText: 'Example Image',
        title: 'Test Overview',
        subtitle: 'Test Subtitle',
      },
      feature: {
        title: 'Features Title',
        subtitle: 'Features Subtitle',
        items: [
          {
            iconUrl: 'https://example.com/example.jpg',
            content: undefined,
            title: 'Feature 1',
          },
        ],
      },
      startInfo: {
        title: 'Start Info Title',
        cta: {
          text: 'Bottom Label',
          label: 'Bottom Link',
          href: '/bottom-link',
        },
        cards: [
          {
            title: 'Start Info Item',
            text: 'Start info description',
            href: '/start-path',
            useSrc: true,
            iconName: 'https://example.com/example.jpg',
          },
        ],
      },
      tutorials: {
        title: 'Tutorials Title',
        subtitle: 'Tutorials Description',
        list: [
          {
            showInOverview: true,
            image: {
              url: 'https://example.com/example.jpg',
              alternativeText: 'Example Image',
            },
            title: 'Tutorial 1',
            name: 'shared.moreInfo',
            path: '/test-product/tutorials/tutorial-1',
          },
        ],
      },
      whatsNew: {
        title: "What's New Title",
        subtitle: "What's New Subtitle",
        link: {
          text: 'View All',
          url: '/whats-new',
          target: '_self',
        },
        items: [
          {
            comingSoon: false,
            title: 'News Item 1',
            publishedAt: dateNow,
            label: 'New',
            link: {
              text: 'Read More',
              url: '/news/item-1',
              target: '_self',
            },
            image: {
              alternativeText: 'Example Image',
              url: 'https://example.com/example.jpg',
            },
          },
        ],
      },
      postIntegration: {
        title: 'Post Integration Title',
        subtitle: 'Post Integration Description',
        listTitle: 'Guides Title',
        cta: {
          label: 'Learn More',
          href: '/post-integration',
        },
        guides: [
          {
            title: 'Document 1',
            description: {
              content: [
                {
                  children: [
                    {
                      text: 'Document content',
                      type: 'text',
                    },
                  ],
                  type: 'paragraph',
                },
              ],
              title: 'guideListPage.cardSection.listItemsTitle',
              translate: false,
            },
            imagePath: 'https://example.com/example.jpg',
            mobileImagePath: 'https://example.com/example.jpg',
            link: {
              label: 'Download',
              href: '/documents/doc1.pdf',
              translate: false,
            },
          },
          {
            title: 'Guide 1',
            description: {
              listItems: ['Guide item 1', 'Guide item 2'],
              title: 'guideListPage.cardSection.listItemsTitle',
              translate: false,
            },
            imagePath: 'https://example.com/example.jpg',
            mobileImagePath: 'https://example.com/example.jpg',
            link: {
              label: 'shared.goToGuide',
              href: 'guides/guide-1',
              translate: true,
            },
          },
        ],
        serviceModels: [
          {
            title: 'Service Model 1',
            description: 'Service model description',
            href: '/service-models/model-1',
          },
        ],
      },
      relatedLinks: {
        title: 'Related Links',
        links: [
          {
            text: 'Related Link 1',
            href: '/related-1',
          },
        ],
      },
      bannerLinks: [
        {
          title: 'Banner Link 1',
          content: undefined,
          icon: {
            alternativeText: 'Example Image',
            caption: undefined,
            ext: '.jpg',
            height: 600,
            mime: 'image/jpeg',
            name: 'example.jpg',
            size: 123456,
            url: 'https://example.com/example.jpg',
            width: 800,
          },
          theme: 'light',
        },
        {
          title: 'Banner Link 2',
          content: undefined,
          icon: {
            alternativeText: 'Example Image',
            caption: undefined,
            ext: '.jpg',
            height: 600,
            mime: 'image/jpeg',
            name: 'example.jpg',
            size: 123456,
            url: 'https://example.com/example.jpg',
            width: 800,
          },
          theme: 'light',
        },
        {
          title: 'Banner Link 3',
          content: undefined,
          icon: {
            alternativeText: 'Example Image',
            caption: undefined,
            ext: '.jpg',
            height: 600,
            mime: 'image/jpeg',
            name: 'example.jpg',
            size: 123456,
            url: 'https://example.com/example.jpg',
            width: 800,
          },
          theme: 'light',
        },
      ],
      seo: {
        metaTitle: 'SEO Title',
        metaDescription: 'SEO Description',
      },
    } satisfies OverviewPageProps);
  });

  it('should handle minimal data with null optional fields', () => {
    const result = makeOverviewsProps(_.cloneDeep(minimalDataSingleOverview()));

    expect(result).toHaveLength(1);
    expect(result[0].feature).toBeUndefined();
    expect(result[0].startInfo).toBeUndefined();
    expect(result[0].tutorials).toBeUndefined();
    expect(result[0].postIntegration).toBeUndefined();
    expect(result[0].relatedLinks).toBeUndefined();
    expect(result[0].whatsNew).toBeUndefined();
    expect(result[0].seo).toBeUndefined();
  });

  it('should handle empty data array', () => {
    const emptyData: StrapiOverviews = {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      },
    };

    const result = makeOverviewsProps(emptyData);

    expect(result).toHaveLength(0);
  });
});
