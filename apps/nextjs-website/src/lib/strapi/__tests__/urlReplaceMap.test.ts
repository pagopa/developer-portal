import * as Either from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { UrlReplaceMapCodec } from '../codecs/UrlReplaceMapCodec';
import { productJson } from './fixtures/product';
import { makeUrlReplaceMap } from '../makeProps/makeUrlReplaceMap';
import { mediaRasterJson } from './fixtures/media';

const strapiResponse = {
  data: {
    id: 1,
    attributes: {
      createdAt: '2024-09-30T10:12:44.888Z',
      updatedAt: '2024-09-30T10:12:45.562Z',
      publishedAt: '2024-09-30T10:12:45.561Z',
      urlToGuide: [
        {
          id: 1,
          url: 'aaaa',
          version: '2',
          guide: {
            data: {
              id: 1,
              attributes: {
                title: 'aaa',
                slug: 'aaaa',
                createdAt: '2024-09-30T10:12:08.182Z',
                updatedAt: '2024-09-30T10:12:24.805Z',
                publishedAt: '2024-09-30T10:12:24.802Z',
                locale: 'en',
                image: mediaRasterJson,
                mobileImage: mediaRasterJson,
                listItems: [
                  { id: 1, text: 'rhhtrhrthrt' },
                  { id: 2, text: 'fdsafdsagtyhtyh' },
                  { id: 3, text: 'hrhrhthrtyrth' },
                ],
                product: productJson,
                versions: [],
                bannerLinks: [],
                seo: null,
              },
            },
          },
        },
      ],
    },
  },
  meta: {},
};

describe('UrlReplaceMapCodec', () => {
  it('should decode strapi UrlReplaceMapCodec', () => {
    const decodeResponse = UrlReplaceMapCodec.decode(strapiResponse);
    expect(Either.isRight(decodeResponse)).toBeTruthy();
  });

  it('Should correctly convert the map into a record', () => {
    const validation = UrlReplaceMapCodec.decode(strapiResponse);
    const result = pipe(
      validation,
      Either.fold(
        (left) => {
          console.error('Error:', left);
          return null; // or handle the error as needed
        },
        (right) => {
          console.log('Success:', right);
          return right;
        }
      )
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const urlReplaceMap = makeUrlReplaceMap(result!);

    expect(urlReplaceMap).toEqual({
      aaaa: '/firma-con-io/guides/aaaa/2',
    });
  });
});
