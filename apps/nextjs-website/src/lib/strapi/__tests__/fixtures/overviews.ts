import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import { product } from '@/lib/strapi/__tests__/fixtures/product';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';

export const dateNow = new Date();

export const strapiOverviews = {
  data: [
    {
      id: 1,
      title: 'Test Overview',
      subtitle: 'Test Subtitle',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      publishedAt: '2023-01-01T00:00:00.000Z',
      backgroundImage: mediaJpeg(),
      product: {
        ...product,
        tags: [],
        bannerLinks: generateBannerLinks(1),
        overview: 1,
        quickstart_guide: 2,
        api_data_list_page: {
          id: 3,
          api_data: [
            {
              apiRestDetail: {
                slug: 'api-rest',
                specUrls: [
                  {
                    id: 1,
                    name: 'OpenAPI Spec',
                    url: '/api-rest/openapi.json',
                    hideTryIt: false,
                  },
                ],
              },
              apiSoapDetail: undefined,
            },
          ],
        },
        tutorial_list_page: 4,
        release_note: 5,
        guide_list_page: 6,
        use_case_list_page: 7,
        logo: mediaJpeg(),
      },
      features: {
        title: 'Features Title',
        subtitle: 'Features Subtitle',
        items: [
          {
            id: 1,
            title: 'Feature 1',
            content: undefined,
            icon: mediaJpeg(),
            theme: 'dark',
          },
        ],
      },
      startInfoSection: {
        title: 'Start Info Title',
        bottomLabel: 'Bottom Label',
        bottomLink: {
          text: 'Bottom Link',
          href: '/bottom-link',
        },
        items: [
          {
            title: 'Start Info Item',
            description: 'Start info description',
            path: '/start-path',
            icon: mediaJpeg(),
          },
        ],
      },
      tutorialSection: {
        title: 'Tutorials Title',
        showCardsLayout: false,
        description: 'Tutorials Description',
        tutorials: [
          {
            updatedAt: '2023-01-01T00:00:00.000Z',
            description: 'test description',
            icon: mediaJpeg(),
            title: 'Tutorial 1',
            tags: [],
            slug: 'tutorial-1',
            image: mediaJpeg(),
            product: {
              isVisible: true,
              slug: 'test-product',
              name: 'Test Product',
              shortName: 'TestProd',
            },
            publishedAt: dateNow.toISOString(),
          },
        ],
      },
      useCaseSection: {
        title: 'Use Cases Title',
        description: 'Use Cases Description',
        useCases: [
          {
            title: 'Use Case 1',
            tags: [],
            slug: 'use-case-1',
            publishedAt: '2023-01-01T00:00:00.000Z',
            coverImage: mediaJpeg(),
            product: {
              isVisible: true,
              slug: 'test-product',
              name: 'Test Product',
              shortName: 'TestProd',
            },
          },
        ],
      },
      whatsNew: {
        title: "What's New Title",
        subTitle: "What's New Subtitle",
        link: {
          text: 'View All',
          href: '/whats-new',
          target: '_self',
        },
        items: [
          {
            title: 'News Item 1',
            label: 'New',
            comingSoon: false,
            publishedAt: dateNow.toISOString(),
            link: {
              text: 'Read More',
              href: '/news/item-1',
              target: '_self',
            },
            image: mediaJpeg(),
          },
        ],
      },
      postIntegration: {
        title: 'Post Integration Title',
        description: 'Post Integration Description',
        guidesTitle: 'Guides Title',
        link: {
          text: 'Learn More',
          href: '/post-integration',
        },
        documents: [
          {
            title: 'Document 1',
            content: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Document content' }],
              },
            ],
            linkText: 'Download',
            linkHref: '/documents/doc1.pdf',
            image: mediaJpeg(),
            mobileImage: mediaJpeg(),
          },
        ],
        guides: [
          {
            title: 'Guide 1',
            slug: 'guide-1',
            listItems: [{ text: 'Guide item 1' }, { text: 'Guide item 2' }],
            image: mediaJpeg(),
            mobileImage: mediaJpeg(),
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
      bannerLinks: generateBannerLinks(3),
      seo: {
        metaTitle: 'SEO Title',
        metaDescription: 'SEO Description',
      },
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
} satisfies StrapiOverviews;

export const overviewPageProps: OverviewPageProps = {
  path: '/pago-pa/overview',
  updatedAt: '2023-01-01T00:00:00.000Z',
  product: {
    apiDataListPageUrl: '/pago-pa/api/api-rest',
    isVisible: true,
    name: 'Piattaforma pagoPA',
    slug: 'pago-pa',
    shortName: 'pagoPA',
    hasApiDataListPage: true,
    hasGuideListPage: true,
    hasOverviewPage: true,
    hasQuickstartGuidePage: true,
    hasReleaseNotePage: true,
    hasTutorialListPage: true,
    hasUseCaseListPage: true,
    description: undefined,
    tags: [],
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
    showCardsLayout: false,
    subtitle: 'Tutorials Description',
    list: [
      {
        updatedAt: '2023-01-01T00:00:00.000Z',
        showInOverview: true,
        image: {
          url: 'https://example.com/example.jpg',
          alternativeText: 'Example Image',
        },
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
        description: 'test description',
        title: 'Tutorial 1',
        name: 'shared.moreInfo',
        path: '/test-product/tutorials/tutorial-1',
      },
    ],
  },
  useCases: {
    title: 'Use Cases Title',
    description: 'Use Cases Description',
    list: [
      {
        showInOverview: true,
        coverImage: {
          url: 'https://example.com/example.jpg',
          alternativeText: 'Example Image',
        },
        title: 'Use Case 1',
        name: 'shared.moreInfo',
        path: '/test-product/use-cases/use-case-1',
        publishedAt: new Date('2023-01-01T00:00:00.000Z'),
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
};
