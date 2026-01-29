import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';
import { ApiDataPageProps } from '@/app/[locale]/[productSlug]/api/[apiDataSlug]/page';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { mediaJpeg } from '../factories/media';

export const strapiApiDataList: StrapiApiDataList = {
  data: [
    {
      id: 3,
      attributes: {
        seo: {
          metaTitle: 'SEND Main API',
          metaDescription: 'SEND Main API Documentation',
        },
        title: 'SEND Main',
        description: 'Main SEND API for delivery notifications',
        apiSoapDetail: undefined,
        apiRestDetail: {
          slug: 'send-main',
          specUrls: [
            {
              id: 3,
              url: 'https://raw.githubusercontent.com/pagopa/pn-delivery/pn-openapi-devportal/docs/openapi/api-external-b2b-pa-bundle.yaml',
              name: 'Main API',
              hideTryIt: true,
            },
          ],
        },
        tags: { data: undefined },
        icon: {
          data: mediaJpeg(),
        },
        product: {
          data: {
            attributes: {
              isVisible: true,
              name: 'Test Product',
              slug: 'test-product',
              tags: { data: [] },
              shortName: 'TP',
              bannerLinks: generateBannerLinks(1),
              overview: { data: { id: 0 } },
              quickstart_guide: { data: { id: 0 } },
              api_data_list_page: { data: undefined },
              guide_list_page: { data: { id: 0 } },
              tutorial_list_page: { data: { id: 0 } },
              release_note: { data: { id: 0 } },
              use_case_list_page: { data: { id: 0 } },
            },
          },
        },
        bannerLinks: generateBannerLinks(2),
      },
    },
    {
      id: 7,
      attributes: {
        seo: undefined,
        title: 'Documentazione SOAP',
        description:
          'Consulta tutti gli schemi XSD e WSDL che seguono le diverse release SANP',
        apiRestDetail: undefined,
        apiSoapDetail: {
          repositoryUrl: 'https://github.com/pagopa/pagopa-api/',
          dirName: 'pagopa-api',
          slug: 'pagopa-soap-api',
        },
        icon: {
          data: {
            attributes: {
              name: 'Code.svg',
              alternativeText: undefined,
              caption: undefined,
              width: 48,
              height: 48,
              ext: '.svg',
              mime: 'image/svg+xml',
              size: 0.24,
              url: 'https://cdn.dev.developer.pagopa.it/Code_7ebfbd1657.svg',
            },
          },
        },
        tags: { data: undefined },
        product: {
          data: {
            attributes: {
              isVisible: true,
              name: 'SOAP Product',
              slug: 'soap-product',
              shortName: 'SP',
              tags: { data: [] },
              bannerLinks: generateBannerLinks(1),
              overview: { data: { id: 0 } },
              quickstart_guide: { data: { id: 0 } },
              api_data_list_page: { data: undefined },
              guide_list_page: { data: { id: 0 } },
              tutorial_list_page: { data: { id: 0 } },
              release_note: { data: { id: 0 } },
              use_case_list_page: { data: { id: 0 } },
            },
          },
        },
        bannerLinks: [],
      },
    },
  ],
};

export const expectedApiDataPageProps: ReadonlyArray<ApiDataPageProps> = [
  {
    seo: {
      metaTitle: 'SEND Main API',
      metaDescription: 'SEND Main API Documentation',
    },
    title: 'SEND Main',
    apiSoapUrl: undefined,
    apiType: 'rest',
    apiDataSlug: 'send-main',
    restApiSpecUrls: [
      {
        url: 'https://raw.githubusercontent.com/pagopa/pn-delivery/pn-openapi-devportal/docs/openapi/api-external-b2b-pa-bundle.yaml',
        name: 'Main API',
        hideTryIt: true,
      },
    ],
    specUrlsName: 'SEND Main',
    apiSoapUrlList: [],
    product: {
      isVisible: true,
      name: 'Test Product',
      slug: 'test-product',
      shortName: 'TP',
      bannerLinks: expect.any(Array),
    },
    bannerLinks: expect.any(Array),
  },
  {
    seo: undefined,
    title: 'Documentazione SOAP',
    apiSoapUrl: 'https://github.com/pagopa/pagopa-api/',
    apiType: 'soap',
    apiDataSlug: 'pagopa-soap-api',
    restApiSpecUrls: [],
    specUrlsName: 'Documentazione SOAP',
    apiSoapUrlList: expect.any(Array),
    product: {
      isVisible: true,
      name: 'SOAP Product',
      slug: 'soap-product',
      shortName: 'SP',
      bannerLinks: expect.any(Array),
    },
    bannerLinks: expect.any(Array),
  },
];
