import * as E from 'fp-ts/lib/Either';
import { ApiDataListCodec } from '@/lib/strapi/codecs/ApiDataListCodec';
import { mediaVectorJson } from '@/lib/strapi/__tests__/fixtures/media';
import { productJson } from './fixtures/product';
import { bannerLinksJson } from '@/lib/strapi/__tests__/fixtures/bannerLinksJson';

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 14,
      attributes: {
        seo: null,
        title: 'Gestione flussi di Rendicontazione',
        product: productJson,
        description:
          'API ad uso dei PSP ed EC per l’upload e il Download dei Flussi di Rendicontazione sul Nodo dei Pagamenti. ',
        createdAt: '2024-07-12T12:44:40.003Z',
        updatedAt: '2024-07-12T12:44:41.280Z',
        publishedAt: '2024-07-12T12:44:41.272Z',
        locale: 'it',
        apiSoapUrl: null,
        apiRestDetail: {
          id: 12,
          slug: 'flussi-di-rendicontazione',
          specUrls: [
            {
              id: 14,
              url: 'https://raw.githubusercontent.com/pagopa/pagopa-fdr/main/openapi/openapi_organization.json     ',
              name: 'Organization',
              hideTryIt: true,
            },
            {
              id: 13,
              url: 'https://raw.githubusercontent.com/pagopa/pagopa-fdr/main/openapi/openapi_psp.json',
              name: 'PSP',
              hideTryIt: true,
            },
          ],
        },
        icon: mediaVectorJson,
        bannerLinks: bannerLinksJson,
      },
    },
    {
      id: 2,
      attributes: {
        seo: null,
        title: 'Firma con IO Main',
        product: productJson,
        description: null,
        createdAt: '2024-07-11T17:14:58.618Z',
        updatedAt: '2024-07-11T17:15:11.267Z',
        publishedAt: '2024-07-11T17:15:11.254Z',
        locale: 'it',
        apiSoapUrl: null,
        apiRestDetail: {
          id: 2,
          slug: 'firma-con-io-main',
          specUrls: [
            {
              id: 2,
              url: 'https://raw.githubusercontent.com/pagopa/io-sign/latest/apps/io-func-sign-issuer/openapi.yaml',
              name: null,
              hideTryIt: true,
            },
          ],
        },
        icon: mediaVectorJson,
        bannerLinks: bannerLinksJson,
      },
    },
    {
      id: 7,
      attributes: {
        seo: null,
        title: 'Documentazione SOAP',
        product: productJson,
        description:
          'Consulta tutti gli schemi XSD e WSDL che seguono le diverse release SANP',
        createdAt: '2024-07-11T17:19:51.114Z',
        updatedAt: '2024-07-19T12:36:58.673Z',
        publishedAt: '2024-07-11T17:20:00.616Z',
        locale: 'it',
        apiSoapUrl: 'https://github.com/pagopa/pagopa-api/tree/develop/wsdl',
        apiRestDetail: null,
        icon: mediaVectorJson,
        bannerLinks: bannerLinksJson,
      },
    },
  ],
  meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 15 } },
});

describe('ApiDataListCodec', () => {
  it('should decode strapi ApiDataListCodec', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = ApiDataListCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
