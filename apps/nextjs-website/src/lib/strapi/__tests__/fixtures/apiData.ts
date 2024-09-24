import { mediaVectorJson } from '@/lib/strapi/__tests__/fixtures/media';

export const apiDataRestJson = {
  id: 3,
  attributes: {
    seo: null,
    title: 'SEND Main',
    description: null,
    createdAt: '2024-07-11T17:16:21.322Z',
    updatedAt: '2024-07-11T17:16:22.916Z',
    publishedAt: '2024-07-11T17:16:22.910Z',
    locale: 'it',
    apiSoapUrl: null,
    apiRestDetail: {
      id: 3,
      slug: 'send-main',
      specUrls: [
        {
          id: 3,
          url: 'https://raw.githubusercontent.com/pagopa/pn-delivery/pn-openapi-devportal/docs/openapi/api-external-b2b-pa-bundle.yaml',
          name: null,
          hideTryIt: true,
        },
      ],
    },
    icon: mediaVectorJson,
  },
};

export const apiDataSoapJson = {
  id: 7,
  attributes: {
    seo: null,
    title: 'Documentazione SOAP',
    description:
      'Consulta tutti gli schemi XSD e WSDL che seguono le diverse release SANP',
    createdAt: '2024-07-11T17:19:51.114Z',
    updatedAt: '2024-07-19T12:36:58.673Z',
    publishedAt: '2024-07-11T17:20:00.616Z',
    locale: 'it',
    apiSoapUrl: 'https://github.com/pagopa/pagopa-api/tree/develop/wsdl',
    apiRestDetail: null,
    icon: {
      data: {
        id: 84,
        attributes: {
          name: 'Code.svg',
          alternativeText: null,
          caption: null,
          width: 48,
          height: 48,
          formats: null,
          hash: 'Code_7ebfbd1657',
          ext: '.svg',
          mime: 'image/svg+xml',
          size: 0.24,
          url: 'https://cdn.dev.developer.pagopa.it/Code_7ebfbd1657.svg',
          previewUrl: null,
          provider: 'aws-s3',
          provider_metadata: null,
          createdAt: '2024-07-11T17:12:48.071Z',
          updatedAt: '2024-07-11T17:12:48.071Z',
          related: [
            {
              __type: 'api::api-data.api-data',
              id: 10,
              title: 'Stampa Avvisi Pagamento',
              description:
                'API native per permettere ad Enti/Intermediari/Partner Tecnologici la stampa in self service degli avvisi di pagamento.',
              createdAt: '2024-07-12T11:08:17.145Z',
              updatedAt: '2024-07-12T12:34:11.463Z',
              publishedAt: '2024-07-12T12:34:11.457Z',
              locale: 'it',
              apiSoapUrl: null,
            },
            {
              __type: 'api::api-data.api-data',
              id: 7,
              title: 'Documentazione SOAP',
              description:
                'Consulta tutti gli schemi XSD e WSDL che seguono le diverse release SANP',
              createdAt: '2024-07-11T17:19:51.114Z',
              updatedAt: '2024-07-19T12:36:58.673Z',
              publishedAt: '2024-07-11T17:20:00.616Z',
              locale: 'it',
              apiSoapUrl:
                'https://github.com/pagopa/pagopa-api/tree/develop/wsdl',
            },
          ],
          isUrlSigned: true,
        },
      },
    },
  },
};
