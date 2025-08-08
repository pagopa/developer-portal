import { StrapiOverviews } from '@/lib/strapi/types/overviews';
import { product } from '@/lib/strapi/__tests__/fixtures/product';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';

export const dateNow = new Date();

export const strapiOverviews: StrapiOverviews = {
  data: [
    {
      id: 1,
      attributes: {
        title: 'Test Overview',
        subtitle: 'Test Subtitle',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        publishedAt: '2023-01-01T00:00:00.000Z',
        backgroundImage: {
          data: mediaJpeg(),
        },
        product: {
          data: {
            attributes: {
              ...product,
              bannerLinks: generateBannerLinks(1),
              overview: {
                data: {
                  id: 1,
                },
              },
              quickstart_guide: {
                data: {
                  id: 2,
                },
              },
              api_data_list_page: {
                data: {
                  id: 3,
                  attributes: {
                    apiData: {
                      data: [
                        {
                          id: 1,
                          attributes: {
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
                        },
                      ],
                    },
                  },
                },
              },
              tutorial_list_page: {
                data: {
                  id: 4,
                },
              },
              release_note: {
                data: {
                  id: 5,
                },
              },
              guide_list_page: {
                data: {
                  id: 6,
                },
              },
              logo: {
                data: mediaJpeg(),
              },
            },
          },
        },
        features: {
          title: 'Features Title',
          subtitle: 'Features Subtitle',
          items: [
            {
              id: 1,
              title: 'Feature 1',
              content: undefined,
              icon: {
                data: mediaJpeg(),
              },
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
              icon: {
                data: mediaJpeg(),
              },
            },
          ],
        },
        tutorialSection: {
          title: 'Tutorials Title',
          description: 'Tutorials Description',
          tutorials: {
            data: [
              {
                attributes: {
                  title: 'Tutorial 1',
                  slug: 'tutorial-1',
                  image: {
                    data: mediaJpeg(),
                  },
                  product: {
                    data: {
                      attributes: {
                        slug: 'test-product',
                        name: 'Test Product',
                        shortName: 'TestProd',
                      },
                    },
                  },
                  publishedAt: dateNow,
                },
              },
            ],
          },
        },
        whatsNew: {
          title: "What's New Title",
          subTitle: "What's New Subtitle",
          link: {
            text: 'View All',
            href: '/whats-new',
            target: '_self',
          },
          items: {
            data: [
              {
                attributes: {
                  title: 'News Item 1',
                  label: 'New',
                  comingSoon: false,
                  publishedAt: dateNow.toISOString(),
                  link: {
                    text: 'Read More',
                    href: '/news/item-1',
                    target: '_self',
                  },
                  image: {
                    data: mediaJpeg(),
                  },
                },
              },
            ],
          },
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
                  children: [
                    {
                      type: 'text',
                      text: 'Document content',
                    },
                  ],
                },
              ],
              linkText: 'Download',
              linkHref: '/documents/doc1.pdf',
              image: {
                data: mediaJpeg(),
              },
              mobileImage: {
                data: mediaJpeg(),
              },
            },
          ],
          guides: {
            data: [
              {
                attributes: {
                  title: 'Guide 1',
                  slug: 'guide-1',
                  listItems: [
                    { text: 'Guide item 1' },
                    { text: 'Guide item 2' },
                  ],
                  image: {
                    data: mediaJpeg(),
                  },
                  mobileImage: {
                    data: mediaJpeg(),
                  },
                },
              },
            ],
          },
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
};
