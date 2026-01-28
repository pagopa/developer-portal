import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';
import { GuideListPageProps } from '@/app/[productSlug]/guides/page';
import { product } from '@/lib/strapi/__tests__/fixtures/product';

const dateNow = new Date().toISOString();

export const strapiEmptyGuideListPagesData = {
  data: [],
  meta: {
    pagination: {
      page: 1,
      pageSize: 0,
      pageCount: 1,
      total: 0,
    },
  },
} satisfies StrapiGuideListPages;

export const strapiGuideListPagesData = {
  data: [
    {
      id: 48,
      title: 'Guide e manuali',
      description:
        'Per una conoscenza approfondita o dubbi puntuali, consulta i manuali e le guide disponibili per la piattaforma pagoPA.\n\n',
      product: {
        isVisible: true,
        tags: [],
        name: 'Piattaforma pagoPA',
        slug: 'pago-pa',
        shortName: 'pagoPA',
        bannerLinks: [
          {
            id: 384,
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
            id: 385,
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
        overview: 48,
        quickstart_guide: 48,
        release_note: undefined,
        api_data_list_page: {
          id: 45,
          api_data: [
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
            {
              apiRestDetail: {
                slug: 'gestione-posizioni-debitorie',
                specUrls: [
                  {
                    id: 1,
                    name: 'Specifica API REST',
                    url: 'https://raw.githubusercontent.com/pagopa/pagopa-api/master/specs/gestione-posizioni-debitorie.yaml',
                    hideTryIt: false,
                  },
                ],
              },
              apiSoapDetail: undefined,
            },
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
            {
              apiSoapDetail: undefined,
              apiRestDetail: undefined,
            },
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
            {
              apiRestDetail: undefined,
              apiSoapDetail: undefined,
            },
          ],
        },
        guide_list_page: 48,
        tutorial_list_page: 48,
        use_case_list_page: 42,
      },
      guidesByCategory: [
        {
          category: "Per l'integrazione",
          guides: [
            {
              title: 'SACI',
              slug: 'saci',
              listItems: [
                { text: 'Genera un codice IUV' },
                {
                  text: 'Comprendi la gestione delle operazioni di trasferimento fondi',
                },
                { text: 'Crea il flusso di rendicontazione' },
                { text: 'Riconcilia il flusso dei pagamenti' },
              ],
              image: {
                name: 'pagoPA Guide Manual.png',
                alternativeText: undefined,
                caption: undefined,
                width: 1156,
                height: 580,
                ext: '.png',
                mime: 'image/png',
                size: 236.84,
                url: 'http://0.0.0.0:1337/uploads/pago_PA_Guide_Manual_4246ba7771.png',
              },
              mobileImage: {
                name: 'saci.png',
                alternativeText: undefined,
                caption: undefined,
                width: 1156,
                height: 580,
                ext: '.png',
                mime: 'image/png',
                size: 236.84,
                url: 'http://0.0.0.0:1337/uploads/saci_9d9358115d.png',
              },
            },
            {
              title: 'SANP',
              slug: 'sanp',
              listItems: [
                { text: 'Conosci, usa e gestisci il prodotto pagoPA' },
                {
                  text: 'Esplora i principali casi d’uso per PSP ed Enti Creditori',
                },
                {
                  text: 'Scopri come un Ente Creditore può aderire e integrarsi in pagoPA',
                },
                {
                  text: 'Scopri come un PSP può aderire e integrarsi in pagoPA',
                },
              ],
              image: {
                name: 'sanp.png',
                alternativeText: undefined,
                caption: undefined,
                width: 1156,
                height: 580,
                ext: '.png',
                mime: 'image/png',
                size: 237.14,
                url: 'http://0.0.0.0:1337/uploads/sanp_b68c5c1525.png',
              },
              mobileImage: {
                name: 'sanp.png',
                alternativeText: undefined,
                caption: undefined,
                width: 1156,
                height: 580,
                ext: '.png',
                mime: 'image/png',
                size: 237.14,
                url: 'http://0.0.0.0:1337/uploads/sanp_b68c5c1525.png',
              },
            },
          ],
        },
        {
          category: "Per l'utilizzo",
          guides: [
            {
              title: 'Guida tecnica sugli avvisi di pagamento pagoPA',
              slug: 'avviso-pagamento',
              listItems: [
                { text: 'Scopri come si crea un avviso di pagamento' },
                { text: 'Usa i modelli grafici per la creazione di un avviso' },
                { text: 'Visualizza alcuni esempi' },
                {
                  text: 'Consulta le indicazioni per la produzione di un avviso di pagamento',
                },
              ],
              image: {
                name: 'guida-tecnica-sugli-avvisi-di-pagamento.png',
                alternativeText: undefined,
                caption: undefined,
                width: 1156,
                height: 580,
                ext: '.png',
                mime: 'image/png',
                size: 68.58,
                url: 'http://0.0.0.0:1337/uploads/guida_tecnica_sugli_avvisi_di_pagamento_df77a98f5f.png',
              },
              mobileImage: {
                name: 'guida-tecnica-sugli-avvisi-di-pagamento.png',
                alternativeText: undefined,
                caption: undefined,
                width: 1156,
                height: 580,
                ext: '.png',
                mime: 'image/png',
                size: 68.58,
                url: 'http://0.0.0.0:1337/uploads/guida_tecnica_sugli_avvisi_di_pagamento_df77a98f5f.png',
              },
            },
          ],
        },
      ],
      bannerLinks: [],
      seo: undefined,
      updatedAt: dateNow,
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 100,
      pageCount: 1,
      total: 1,
    },
  },
} satisfies StrapiGuideListPages;

export const guideListPagesProps = [
  {
    path: '/pago-pa/guides',
    abstract: {
      title: 'Guide e manuali',
      description:
        'Per una conoscenza approfondita o dubbi puntuali, consulta i manuali e le guide disponibili per la piattaforma pagoPA.\n\n',
    },
    guidesSections: [
      {
        title: "Per l'integrazione",
        guides: [
          {
            title: 'SACI',
            description: {
              title: 'guideListPage.cardSection.listItemsTitle',
              listItems: [
                'Genera un codice IUV',
                'Comprendi la gestione delle operazioni di trasferimento fondi',
                'Crea il flusso di rendicontazione',
                'Riconcilia il flusso dei pagamenti',
              ],
              translate: true,
            },
            imagePath:
              'http://0.0.0.0:1337/uploads/pago_PA_Guide_Manual_4246ba7771.png',
            mobileImagePath: 'http://0.0.0.0:1337/uploads/saci_9d9358115d.png',
            link: {
              label: 'guideListPage.cardSection.linkLabel',
              href: '/pago-pa/guides/saci',
              translate: true,
            },
          },
          {
            title: 'SANP',
            description: {
              title: 'guideListPage.cardSection.listItemsTitle',
              listItems: [
                'Conosci, usa e gestisci il prodotto pagoPA',
                'Esplora i principali casi d’uso per PSP ed Enti Creditori',
                'Scopri come un Ente Creditore può aderire e integrarsi in pagoPA',
                'Scopri come un PSP può aderire e integrarsi in pagoPA',
              ],
              translate: true,
            },
            imagePath: 'http://0.0.0.0:1337/uploads/sanp_b68c5c1525.png',
            mobileImagePath: 'http://0.0.0.0:1337/uploads/sanp_b68c5c1525.png',
            link: {
              label: 'guideListPage.cardSection.linkLabel',
              href: '/pago-pa/guides/sanp',
              translate: true,
            },
          },
        ],
      },
      {
        title: "Per l'utilizzo",
        guides: [
          {
            title: 'Guida tecnica sugli avvisi di pagamento pagoPA',
            description: {
              title: 'guideListPage.cardSection.listItemsTitle',
              listItems: [
                'Scopri come si crea un avviso di pagamento',
                'Usa i modelli grafici per la creazione di un avviso',
                'Visualizza alcuni esempi',
                'Consulta le indicazioni per la produzione di un avviso di pagamento',
              ],
              translate: true,
            },
            imagePath:
              'http://0.0.0.0:1337/uploads/guida_tecnica_sugli_avvisi_di_pagamento_df77a98f5f.png',
            mobileImagePath:
              'http://0.0.0.0:1337/uploads/guida_tecnica_sugli_avvisi_di_pagamento_df77a98f5f.png',
            link: {
              label: 'guideListPage.cardSection.linkLabel',
              href: '/pago-pa/guides/avviso-pagamento',
              translate: true,
            },
          },
        ],
      },
    ],
    product: product,
    bannerLinks: product.bannerLinks,
    seo: undefined,
    updatedAt: dateNow,
  },
] satisfies readonly GuideListPageProps[];
