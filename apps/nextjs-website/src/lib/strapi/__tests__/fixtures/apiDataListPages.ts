import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';
import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { mediaJpeg } from '../factories/media';

export const strapiApiDataListPages = {
  data: [
    {
      id: 1,
      attributes: {
        title: 'SEND API Documentation',
        description: 'Complete documentation for SEND APIs',
        seo: {
          metaTitle: 'SEND API Documentation',
          metaDescription: 'Complete documentation for SEND APIs',
        },
        bannerLinks: generateBannerLinks(2),
        updatedAt: '2024-01-02T00:00:00.000Z',
        product: {
          data: {
            attributes: {
              isVisible: true,
              name: 'SEND',
              slug: 'send',
              shortName: 'SEND',
              bannerLinks: generateBannerLinks(1),
              overview: { data: { id: 1 } },
              quickstart_guide: { data: { id: 1 } },
              api_data_list_page: {
                data: {
                  id: 1,
                  attributes: {
                    updatedAt: '2026-01-01T00:00:00.000Z',
                    apiData: {
                      data: [],
                    },
                  },
                },
              },
              guide_list_page: { data: { id: 1 } },
              tutorial_list_page: { data: { id: 1 } },
              release_note: { data: { id: 1 } },
              use_case_list_page: { data: { id: 1 } },
              tags: { data: [] },
            },
          },
        },
        apiData: {
          data: [
            {
              id: 1,
              attributes: {
                title: 'SEND Main API',
                description: 'Main SEND API for delivery notifications',
                icon: {
                  data: mediaJpeg(),
                },
                apiRestDetail: {
                  slug: 'send-main',
                  specUrls: [
                    {
                      id: 1,
                      url: 'https://example.com/api.yaml',
                      name: 'Main API',
                      hideTryIt: false,
                    },
                  ],
                },
                apiSoapDetail: undefined,
                tags: { data: undefined },
              },
            },
            {
              id: 2,
              attributes: {
                title: 'SEND SOAP API',
                description: 'SOAP API for legacy integrations',
                icon: {
                  data: {
                    attributes: {
                      name: 'soap-icon.svg',
                      alternativeText: 'SOAP Icon',
                      caption: undefined,
                      width: 48,
                      height: 48,
                      ext: '.svg',
                      mime: 'image/svg+xml',
                      size: 0.5,
                      url: 'https://example.com/soap-icon.svg',
                    },
                  },
                },
                apiRestDetail: undefined,
                apiSoapDetail: {
                  slug: 'send-soap',
                  repositoryUrl: 'https://github.com/pagopa/send-soap',
                  dirName: 'send-soap',
                },
                tags: { data: undefined },
              },
            },
          ],
        },
      },
    },
  ],
} satisfies StrapiApiDataListPages;

export const expectedApiDataListPageProps: ReadonlyArray<ApiDataListPageTemplateProps> =
  [
    {
      hero: {
        title: 'SEND API Documentation',
        subtitle: 'Complete documentation for SEND APIs',
      },
      product: {
        isVisible: true,
        name: 'SEND',
        slug: 'send',
        shortName: 'SEND',
        bannerLinks: expect.any(Array),
      },
      apiDetailSlugs: ['send-main', 'send-soap'],
      cards: [
        {
          title: 'SEND Main API',
          text: 'Main SEND API for delivery notifications',
          icon: 'https://example.com/example.jpg',
          href: '/it/send/api/send-main',
          labels: [{ label: 'REST' }],
        },
        {
          title: 'SEND SOAP API',
          text: 'SOAP API for legacy integrations',
          icon: 'https://example.com/soap-icon.svg',
          href: '/it/send/api/send-soap',
          labels: [{ label: 'SOAP' }],
        },
      ],
      bannerLinks: expect.any(Array),
      seo: {
        metaTitle: 'SEND API Documentation',
        metaDescription: 'Complete documentation for SEND APIs',
      },
      updatedAt: '2024-01-02T00:00:00.000Z',
      apiData: {
        data: expect.any(Array),
      },
    },
  ];
