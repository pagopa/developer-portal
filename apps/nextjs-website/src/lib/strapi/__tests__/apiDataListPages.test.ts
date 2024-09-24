import * as E from 'fp-ts/lib/Either';
import { ApiDataListPagesCodec } from '@/lib/strapi/codecs/ApiDataListPagesCodec';
import { productJson } from '@/lib/strapi/__tests__/fixtures/product';
import { mediaVectorJson } from '@/lib/strapi/__tests__/fixtures/media';
import {
  apiDataRestJson,
  apiDataSoapJson,
} from '@/lib/strapi/__tests__/fixtures/apiData';

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 4,
      attributes: {
        title: 'API',
        description: null,
        createdAt: '2024-07-11T17:01:47.701Z',
        updatedAt: '2024-07-11T17:21:03.436Z',
        publishedAt: '2024-07-11T17:21:03.429Z',
        locale: 'it',
        apiData: {
          data: [apiDataRestJson],
        },
        product: productJson,
        bannerLinks: [],
        seo: null,
      },
    },
    {
      id: 2,
      attributes: {
        title: 'API',
        description: null,
        createdAt: '2024-07-11T17:00:52.314Z',
        updatedAt: '2024-07-11T17:21:13.031Z',
        publishedAt: '2024-07-11T17:00:55.504Z',
        locale: 'it',
        apiData: {
          data: [apiDataRestJson],
        },
        product: productJson,
        bannerLinks: [],
        seo: null,
      },
    },
    {
      id: 1,
      attributes: {
        title: 'API',
        description:
          'Esplora le API SOAP e REST per  integrarsi ed utilizzare la piattaforma pagoPA\n\n\n',
        createdAt: '2024-07-11T16:59:47.879Z',
        updatedAt: '2024-07-16T14:33:32.576Z',
        publishedAt: '2024-07-11T17:00:35.450Z',
        locale: 'it',
        apiData: {
          data: [apiDataSoapJson, apiDataRestJson],
        },
        product: productJson,
        bannerLinks: [
          {
            id: 2,
            title: 'Serve aiuto?',
            content: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'Apri un ticket utilizzando l’apposita funzione all’interno della tua ',
                    type: 'text',
                  },
                  {
                    url: 'https://selfcare.pagopa.it/auth/login?onSuccess=%2F',
                    type: 'link',
                    children: [
                      { bold: true, text: 'Area Riservata', type: 'text' },
                    ],
                  },
                  { text: '', type: 'text' },
                ],
              },
            ],
            theme: 'dark',
            subtitle: null,
            icon: mediaVectorJson,
          },
          {
            id: 3,
            title: 'Dicci cosa ne pensi',
            content: [
              {
                type: 'paragraph',
                children: [
                  {
                    text: 'Per chiarimenti sulle specifiche d’implementazione, come SACI e SANP, puoi aprire una segnalazione su ',
                    type: 'text',
                  },
                  {
                    url: 'https://github.com/pagopa/pagopa-api/issues',
                    type: 'link',
                    children: [{ text: 'GitHub', type: 'text' }],
                  },
                  { text: '', type: 'text' },
                ],
              },
            ],
            theme: 'light',
            subtitle: null,
            icon: mediaVectorJson,
          },
        ],
        seo: null,
      },
    },
    {
      id: 3,
      attributes: {
        title: 'API',
        description: null,
        createdAt: '2024-07-11T17:01:25.594Z',
        updatedAt: '2024-07-26T08:54:05.242Z',
        publishedAt: '2024-07-11T17:20:50.658Z',
        locale: 'it',
        apiData: {
          data: [apiDataRestJson],
        },
        product: productJson,
        bannerLinks: [],
        seo: null,
      },
    },
  ],
  meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 4 } },
});

describe('ApiDataListPagesCodec', () => {
  it('should decode strapi ApiDataListPagesCodec', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = ApiDataListPagesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
