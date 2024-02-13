import { StrapiHomepageCodec } from '@/lib/strapi/homepage';
import * as E from 'fp-ts/lib/Either';

const makeStrapiResponseJson = () => ({
  data: {
    id: 2,
    attributes: {
      createdAt: '2024-02-09T08:42:28.486Z',
      updatedAt: '2024-02-09T09:21:55.636Z',
      publishedAt: '2024-02-09T08:44:21.612Z',
      comingsoonDocumentation: {
        id: 4,
        title: 'aTitle',
        links: [
          {
            id: 5,
            text: 'aText',
            href: 'aUrl',
            target: '_self',
          },
          {
            id: 6,
            text: 'aText',
            href: 'aUrl',
            target: '_blank',
          },
          {
            id: 7,
            text: 'aText',
            href: 'aUrl',
            target: '_parent',
          },
          {
            id: 8,
            text: 'aText',
            href: 'aUrl',
            target: '_top',
          },
          {
            id: 9,
            text: 'aText',
            href: 'aUrl',
            target: null,
          },
        ],
      },
      productsShowcase: {
        id: 1,
        title: 'Scopri il nostro ecosistema',
        products: {
          data: [
            {
              id: 1,
              attributes: {
                name: 'IO, l’app dei servizi pubblici',
                description:
                  'Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma e interagisci in modo semplice e sicuro con i cittadini.',
                slug: 'app-io',
                createdAt: '2024-02-09T13:32:16.646Z',
                updatedAt: '2024-02-09T13:32:25.171Z',
                publishedAt: '2024-02-09T13:32:25.170Z',
                locale: 'it',
                logo: {
                  data: {
                    id: 2,
                    attributes: {
                      name: 'appIo.svg',
                      alternativeText: null,
                      caption: null,
                      width: 60,
                      height: 61,
                      formats: null,
                      hash: 'app_Io_714c6d0fd3',
                      ext: '.svg',
                      mime: 'image/svg+xml',
                      size: 1.9,
                      url: '/uploads/app_Io_714c6d0fd3.svg',
                      previewUrl: null,
                      provider: 'local',
                      provider_metadata: null,
                      createdAt: '2024-02-07T17:29:12.923Z',
                      updatedAt: '2024-02-07T17:29:12.923Z',
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  meta: {},
});

describe('StrapiHomepageCodec', () => {
  it('should decode strapi homepage', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    // Verify all the values are parsed properly, especially the nullable (e.g. links[0].target)
    const actual = StrapiHomepageCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
