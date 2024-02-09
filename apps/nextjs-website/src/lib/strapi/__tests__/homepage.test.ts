import { StrapiHomepageCodec } from '@/lib/strapi/homepage';
import * as E from 'fp-ts/lib/Either';

const makeHomepageFromStrapiJson = () => ({
  data: {
    id: 2,
    attributes: {
      createdAt: '2024-02-09T08:42:28.486Z',
      updatedAt: '2024-02-09T09:21:55.636Z',
      publishedAt: '2024-02-09T08:44:21.612Z',
      comingsoonDocumentation: {
        id: 4,
        title: 'Title',
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
    },
  },
  meta: {},
});

describe('StrapiHomepageCodec', () => {
  it('should decode strapi homepage', () => {
    const jsonFromStrapi = makeHomepageFromStrapiJson();
    // Verify all the values are parsed properly, especially the nullable (e.g. links[0].target)
    const actual = StrapiHomepageCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
