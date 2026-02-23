import { mediaVectorJson } from './media';
import { bannerLinksJson } from '@/lib/strapi/__tests__/fixtures/bannerLinksJson';
import { Product } from '@/lib/types/product';

export const baseProductJson = {
  data: {
    id: 8,
    attributes: {
      isVisible: true,
      name: 'Firma con IO',
      slug: 'firma-con-io',
      shortName: 'Firma con IO',
    },
  },
};

export const productJson = {
  data: {
    id: 8,
    attributes: {
      name: 'Firma con IO',
      description:
        'Richiedi la Firma Elettronica Certificata su contratti e documenti. Le cittadine e i cittadini possono firmare direttamente sull’app IO.',
      slug: 'firma-con-io',
      createdAt: '2024-03-26T16:05:30.593Z',
      updatedAt: '2024-07-11T19:28:06.709Z',
      publishedAt: '2024-03-26T16:05:32.226Z',
      locale: 'it',
      shortName: 'Firma con IO',
      logo: mediaVectorJson,
      bannerLinks: bannerLinksJson,
      overview: { data: null },
      quickstart_guide: { data: null },
      api_data_list_page: { data: null },
      tutorial_list_page: { data: null },
      guide_list_page: { data: null },
      release_note: { data: null },
      use_case_list_page: { data: null },
    },
  },
};

export const productsJson = {
  data: [productJson.data],
};

export const product = {
  apiDataListPageUrl: '/it/pago-pa/api',
  isVisible: true,
  name: 'Piattaforma pagoPA',
  slug: 'pago-pa',
  shortName: 'pagoPA',
  description: undefined,
  hasApiDataListPage: true,
  hasGuideListPage: true,
  hasOverviewPage: true,
  hasQuickstartGuidePage: true,
  hasReleaseNotePage: false,
  hasTutorialListPage: true,
  hasUseCaseListPage: true,
  tags: [],
  bannerLinks: [
    {
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
                {
                  text: 'Area Riservata',
                  type: 'text',
                },
              ],
            },
            {
              text: '',
              type: 'text',
            },
          ],
        },
      ],
      theme: 'dark',
      icon: {
        name: 'headset_78d50d9321_5bd20d1a6b.svg',
        alternativeText: undefined,
        caption: undefined,
        width: 24,
        height: 24,
        ext: '.svg',
        mime: 'image/svg+xml',
        size: 0.31,
        url: 'http://0.0.0.0:1337/uploads/headset_78d50d9321_5bd20d1a6b_6d5b8d3ee1.svg',
      },
    },
    {
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
              children: [
                {
                  text: 'GitHub',
                  type: 'text',
                },
              ],
            },
            {
              text: '',
              type: 'text',
            },
          ],
        },
      ],
      theme: 'light',
      icon: {
        name: 'feedback_1504fc4fbf.svg',
        alternativeText: undefined,
        caption: undefined,
        width: 24,
        height: 24,
        ext: '.svg',
        mime: 'image/svg+xml',
        size: 0.26,
        url: 'http://0.0.0.0:1337/uploads/feedback_1504fc4fbf_042ed8f78b.svg',
      },
    },
  ],
} satisfies Product;
