import { StrapiGuidesPaginated } from '@/lib/strapi/types/guide';
import { GuideDefinition } from '@/helpers/makeDocs.helpers';
import { product } from '@/lib/strapi/__tests__/fixtures/product';

export const strapiEmptyGuideData = {
  data: [],
  meta: {
    pagination: {
      page: 1,
      pageSize: 0,
      pageCount: 1,
      total: 0,
    },
  },
} satisfies StrapiGuidesPaginated;

export const strapiGuideData = {
  data: [
    {
      attributes: {
        title: 'SACI',
        slug: 'saci',
        image: {
          data: {
            attributes: {
              name: 'pagoPA Guide Manual.png',
              alternativeText: null,
              caption: null,
              width: 1156,
              height: 580,
              ext: '.png',
              mime: 'image/png',
              size: 236.84,
              url: 'http://0.0.0.0:1337/uploads/pago_PA_Guide_Manual_4246ba7771.png',
            },
          },
        },
        mobileImage: {
          data: {
            attributes: {
              name: 'saci.png',
              alternativeText: null,
              caption: null,
              width: 1156,
              height: 580,
              ext: '.png',
              mime: 'image/png',
              size: 236.84,
              url: 'http://0.0.0.0:1337/uploads/saci_9d9358115d.png',
            },
          },
        },
        listItems: [
          {
            text: 'Genera un codice IUV',
          },
          {
            text: 'Comprendi la gestione delle operazioni di trasferimento fondi',
          },
          {
            text: 'Crea il flusso di rendicontazione',
          },
          {
            text: 'Riconcilia il flusso dei pagamenti',
          },
        ],
        versions: [
          {
            main: true,
            dirName: 'QdpcBdgV6Vin3SHiZyFM',
            version: '3.2.1',
          },
          {
            main: false,
            dirName: 'PXEYBQEZ9LagztJLF89O',
            version: '3.2.0',
          },
          {
            main: false,
            dirName: 'w0Q7L4P8ucTWqcitlbkJ',
            version: '3.1.0',
          },
          {
            main: false,
            dirName: 'NwSwJx0PH25LtVO7RbF5',
            version: '3.0.1',
          },
          {
            main: false,
            dirName: 'Dny2DKfeNer5ENutRdSp',
            version: '3.0.0',
          },
          {
            main: false,
            dirName: 'E6d6iTzjBzUfzNoZjadZ',
            version: '2.0.0',
          },
        ],
        bannerLinks: [],
        seo: null,
        product: {
          data: {
            attributes: {
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
                    data: {
                      attributes: {
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
                    data: {
                      attributes: {
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
                  },
                },
              ],
              overview: {
                data: {
                  id: 48,
                },
              },
              quickstart_guide: {
                data: {
                  id: 48,
                },
              },
              release_note: {
                data: undefined,
              },
              api_data_list_page: {
                data: {
                  id: 45,
                  attributes: {
                    apiData: {
                      data: [
                        {
                          id: 156,
                          attributes: {
                            apiSoapUrl:
                              'https://github.com/pagopa/pagopa-api/tree/develop/wsdl',
                            apiRestDetail: undefined,
                          },
                        },
                        {
                          id: 158,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'gestione-posizioni-debitorie',
                            },
                          },
                        },
                        {
                          id: 157,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'gestione-massiva-delle-posizioni-debitorie',
                            },
                          },
                        },
                        {
                          id: 159,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'gpd-fdr',
                            },
                          },
                        },
                        {
                          id: 160,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'gpd-recupero-receipt',
                            },
                          },
                        },
                        {
                          id: 170,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'flussi-di-rendicontazione',
                            },
                          },
                        },
                        {
                          id: 167,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'inserimento-posizioni-debitorie',
                            },
                          },
                        },
                        {
                          id: 168,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'elenco-IBAN-stazioni',
                            },
                          },
                        },
                        {
                          id: 164,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'pagamento-fe-ec',
                            },
                          },
                        },
                        {
                          id: 161,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'recupero-receipt',
                            },
                          },
                        },
                        {
                          id: 162,
                          attributes: {
                            apiSoapUrl: undefined,
                            apiRestDetail: {
                              slug: 'stampa-avvisi-pagamento',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
              guide_list_page: {
                data: {
                  id: 48,
                },
              },
              tutorial_list_page: {
                data: {
                  id: 48,
                },
              },
            },
          },
        },
      },
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
} satisfies StrapiGuidesPaginated;

export const guideProps = [
  {
    product: product,
    guide: {
      name: 'SACI',
      slug: 'saci',
    },
    seo: undefined,
    versions: [
      {
        main: true,
        dirName: 'QdpcBdgV6Vin3SHiZyFM',
        version: '3.2.1',
      },
      {
        main: false,
        dirName: 'PXEYBQEZ9LagztJLF89O',
        version: '3.2.0',
      },
      {
        main: false,
        dirName: 'w0Q7L4P8ucTWqcitlbkJ',
        version: '3.1.0',
      },
      {
        main: false,
        dirName: 'NwSwJx0PH25LtVO7RbF5',
        version: '3.0.1',
      },
      {
        main: false,
        dirName: 'Dny2DKfeNer5ENutRdSp',
        version: '3.0.0',
      },
      {
        main: false,
        dirName: 'E6d6iTzjBzUfzNoZjadZ',
        version: '2.0.0',
      },
    ],
    bannerLinks: product.bannerLinks,
  },
] satisfies readonly GuideDefinition[];
