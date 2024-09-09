import * as E from 'fp-ts/lib/Either';
import { OverviewsCodec } from '@/lib/strapi/codecs/overviewsCodec';
import { baseProductJson, productJson } from './fixtures/product';
import { mediaRasterJson, mediaVectorJson } from './fixtures/media';

const serviceModels = [
  {
    id: 1,
    title: 'Tassa sui rifiuti (TARI)',
    description:
      'Scheda e modelli di messaggi del servizio che invia comunicazioni in merito alla Tassa sui rifiuti (TARI)',
    href: '/app-io/guides/modelli-servizi/casa-e-utenze/tassa-sui-rifiuti-tari',
  },
  {
    id: 2,
    title: "Carta d'Identità Elettronica",
    description:
      "Scheda e modelli di messaggi del servizio che riguarda la richiesta e l'emissione della Carta d'Identità Elettronica",
    href: '/app-io/guides/modelli-servizi/servizi-anagrafici-e-civici/carta-didentita-elettronica',
  },
];

const bannerLinks = [
  {
    id: 64,
    title: 'first title',
    theme: 'light',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'text',
          },
        ],
      },
    ],
    subtitle: 'subtitle',
    icon: mediaVectorJson,
  },
  {
    id: 65,
    title: 'second title',
    theme: 'light',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'text',
          },
        ],
      },
    ],
    subtitle: 'subtitle',
    icon: mediaVectorJson,
  },
];

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 2,
      attributes: {
        title: 'Raccogli i servizi del tuo ente in un unico spazio',
        createdAt: '2024-08-21T13:21:42.844Z',
        updatedAt: '2024-08-22T07:33:11.968Z',
        publishedAt: '2024-08-21T14:59:10.372Z',
        locale: 'it',
        subtitle:
          "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
        backgroundImage: mediaRasterJson,
        product: productJson,
        relatedLinks: {
          id: 15,
          title: 'Link utili',
          links: [
            {
              id: 52,
              text: 'Consulta alcuni dei modelli utili per configurare i servizi su IO',
              href: 'https://developer.pagopa.it/app-io/overview#:~:text=Consulta%20alcuni%20dei%20modelli%20utili%20per%20configurare%20i%20servizi%20su%20IO',
              target: null,
            },
            {
              id: 53,
              text: 'Consulta FAQ e approfondimenti nella documentazione di supporto agli Enti',
              href: 'https://developer.pagopa.it/app-io/guides/supporto-agli-enti',
              target: null,
            },
            {
              id: 54,
              text: ' Scarica il contratto di adesione a IO',
              href: 'https://28648410-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FZugEhXfhuchEaSiqU3p5%2Fuploads%2FygbXW3iAtEO4zjdRaFKr%2FAccordo%20di%20Adesione%20IO_v.2.4_30_giugno_2024.pdf?alt=media',
              target: null,
            },
            {
              id: 55,
              text: ' Leggi kit di comunicazione',
              href: '/app-io/guides/kit-comunicazione',
              target: null,
            },
          ],
        },
        features: {
          id: 6,
          title: 'Perché l’app IO',
          subtitle:
            'Che tu sia un ente pubblico, centrale o locale, tramite IO potrai:',
          items: [
            {
              id: 59,
              title: 'Inviare messaggi',
              subtitle: null,
              theme: 'light',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Contatta le cittadine e i cittadini in modo rapido e sicuro',
                    },
                  ],
                },
              ],
              icon: mediaVectorJson,
            },
            {
              id: 60,
              title: 'Ottenere pagamenti',
              subtitle: null,
              theme: 'light',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Invia avvisi di pagamento e riduci i tempi di incasso',
                    },
                  ],
                },
              ],
              icon: mediaVectorJson,
            },
            {
              id: 61,
              title: 'Far firmare documenti',
              subtitle:
                'Richiedi la firma digitale di documenti e contratti grazie a Firma con IO',
              theme: 'light',
              content: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Richiedi la firma digitale di documenti e contratti grazie a Firma con IO',
                    },
                  ],
                },
              ],
              icon: mediaVectorJson,
            },
          ],
        },
        startInfoSection: {
          id: 1,
          title: 'Si comincia da qui',
          bottomLabel: 'Scopri tutti i dettagli dell’integrazione',
          items: [
            {
              id: 1,
              title: 'Quick Start',
              description:
                'Aderire a IO tramite l’Area Riservata, creare un servizio, verificare l’esistenza di un utente, inviare un messaggio: ecco come si fa',
              path: '/app-io/quick-start',
              icon: mediaVectorJson,
            },
            {
              id: 2,
              title: 'Documentazione API',
              description:
                "Esplora le API Rest per l'invio dei messaggi e la creazione di servizi sull'app IO",
              path: '/app-io/api',
              icon: mediaVectorJson,
            },
          ],
          bottomLink: {
            id: 48,
            text: 'Leggi la guida tecnica',
            href: 'https://developer.pagopa.it/app-io/overview#:~:text=Leggi%20la%20guida%20tecnica',
            target: '_blank',
          },
        },
        tutorialSection: {
          id: 2,
          title: 'Esplora i tutorial',
          description:
            'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi tutorial.',
          tutorials: {
            data: [
              {
                id: 10,
                attributes: {
                  title: 'Come allegare documenti a un Messaggio',
                  slug: 'come-allegare-documenti-a-un-messaggio',
                  createdAt: '2024-08-05T12:32:36.497Z',
                  updatedAt: '2024-08-08T08:25:43.654Z',
                  publishedAt: '2024-08-05T14:11:25.924Z',
                  locale: 'it',
                  image: mediaRasterJson,
                  product: baseProductJson,
                },
              },
              {
                id: 7,
                attributes: {
                  title:
                    'Come utilizzare correttamente servizi e messaggi in app IO',
                  slug: 'come-utilizzare-correttamente-servizi-e-messaggi-in-app-io',
                  createdAt: '2024-07-24T14:56:05.643Z',
                  updatedAt: '2024-08-06T12:41:25.713Z',
                  publishedAt: '2024-08-06T11:29:25.949Z',
                  locale: 'it',
                  image: mediaRasterJson,
                  product: baseProductJson,
                },
              },
            ],
          },
        },
        postIntegration: {
          id: 2,
          title: "Dopo l'integrazione",
          description:
            'Scopri cosa può fare un servizio su IO e come pubblicarlo in app. Leggi il manuale dei servizi per creare un servizio da zero o personalizza uno dei tanti modelli disponibili.',
          guidesTitle: 'Modelli dei servizi',
          documents: [
            {
              id: 1,
              title: 'Documento di test',
              content: [
                { type: 'paragraph', children: [{ type: 'text', text: '' }] },
              ],
              linkText: 'Vai al modello',
              linkHref:
                '/uploads/pago_pa_stampare_avviso_pagamento_0b04344a0e.png',
              image: mediaRasterJson,
              mobileImage: mediaRasterJson,
            },
          ],
          guides: {
            data: [
              {
                id: 4,
                attributes: {
                  title: 'First',
                  slug: 'slug',
                  createdAt: '2024-08-21T14:57:40.184Z',
                  updatedAt: '2024-08-22T15:23:17.709Z',
                  publishedAt: '2024-08-21T14:58:22.979Z',
                  locale: 'it',
                  image: mediaRasterJson,
                  listItems: [{ id: 31, text: 'title of the list item' }],
                  mobileImage: mediaRasterJson,
                },
              },
            ],
          },
          link: {
            id: 49,
            text: 'Vai al manuale dei servizi',
            href: '/app-io/guides/manuale-servizi',
            target: '_blank',
          },
          serviceModels,
        },
        bannerLinks,
      },
    },
    {
      id: 3,
      attributes: {
        title: 'Richiedi la firma di contratti e documenti',
        createdAt: '2024-08-22T07:34:05.159Z',
        updatedAt: '2024-08-22T07:36:37.072Z',
        publishedAt: '2024-08-22T07:36:37.068Z',
        locale: 'it',
        subtitle:
          'Con Firma con IO puoi inviare alle cittadine e ai cittadini documenti e contratti e richiedere loro di firmarli digitalmente in modo facile, veloce e sicuro.',
        backgroundImage: mediaRasterJson,
        product: { data: null },
        relatedLinks: null,
        features: null,
        startInfoSection: null,
        tutorialSection: null,
        postIntegration: null,
        bannerLinks: [],
      },
    },
    {
      id: 4,
      attributes: {
        title: 'Gestisci le notifiche in modo più semplice',
        createdAt: '2024-08-22T07:36:15.808Z',
        updatedAt: '2024-08-22T07:36:33.178Z',
        publishedAt: '2024-08-22T07:36:33.174Z',
        locale: 'it',
        subtitle:
          'Digitalizza e semplifica il modo in cui il tuo ente gestisce le comunicazioni a valore legale. Integrandoti con SEND, ti basterà depositare gli atti da notificare: sarà la piattaforma a occuparsi del loro invio, per via digitale o analogica.',
        backgroundImage: mediaRasterJson,
        product: productJson,
        relatedLinks: null,
        features: {
          id: 7,
          title: 'Perché usare SEND',
          subtitle:
            'SEND solleva gli enti da tutti gli adempimenti legati alla gestione delle comunicazioni a valore legale e permette di ridurre tempi e costi della notificazione verso cittadini e imprese.',
          items: [],
        },
        startInfoSection: {
          id: 2,
          title: 'Si comincia da qui',
          bottomLabel: null,
          items: [],
          bottomLink: null,
        },
        tutorialSection: {
          id: 3,
          title: 'Esplora i tutorial',
          description:
            'Quali sono le modalità di invio di una notifica? Come si segue il suo avanzamento? Risolvi ogni dubbio con questi brevi tutorial.',
          tutorials: { data: [] },
        },
        postIntegration: {
          id: 3,
          title: "Dopo l'integrazione",
          description:
            'Verifica che l’integrazione con SEND soddisfi i criteri minimi per poter operare in ambiente di staging.',
          guidesTitle: null,
          documents: [],
          guides: {
            data: [
              {
                id: 4,
                attributes: {
                  title: 'First',
                  slug: 'slug',
                  createdAt: '2024-08-21T14:57:40.184Z',
                  updatedAt: '2024-08-22T15:23:17.709Z',
                  publishedAt: '2024-08-21T14:58:22.979Z',
                  locale: 'it',
                  image: mediaRasterJson,
                  listItems: [{ id: 31, text: 'title of the list item' }],
                  mobileImage: mediaRasterJson,
                },
              },
            ],
          },
          serviceModels: serviceModels,
          link: null,
        },
        bannerLinks: [],
      },
    },
  ],
  meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 3 } },
});

describe('StrapiOverviewsCodec', () => {
  it('should decode strapi overviews', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = OverviewsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
