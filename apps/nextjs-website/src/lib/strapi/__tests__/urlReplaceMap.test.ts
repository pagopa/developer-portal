import {
  UrlReplaceMap,
  UrlReplaceMapCodec,
} from '../codecs/UrlReplaceMapCodec';
import * as Either from 'fp-ts/lib/Either';
import { baseProductJson } from './fixtures/product';
import { makeUrlReplaceMap } from '../makeProps/makeUrlReplaceMap';
import { pipe } from 'fp-ts/lib/function';

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
                image: {
                  data: {
                    id: 1,
                    attributes: {
                      name: 'download.jpeg',
                      alternativeText: null,
                      caption: null,
                      width: 3024,
                      height: 1964,
                      formats: {
                        thumbnail: {
                          name: 'thumbnail_download.jpeg',
                          hash: 'thumbnail_download_d1d23bf79f',
                          ext: '.jpeg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 241,
                          height: 156,
                          size: 10.06,
                          sizeInBytes: 10055,
                          url: 'http://localhost:1337/uploads/thumbnail_download_d1d23bf79f.jpeg',
                        },
                        small: {
                          name: 'small_download.jpeg',
                          hash: 'small_download_d1d23bf79f',
                          ext: '.jpeg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 500,
                          height: 325,
                          size: 43.12,
                          sizeInBytes: 43123,
                          url: 'http://localhost:1337/uploads/small_download_d1d23bf79f.jpeg',
                        },
                        large: {
                          name: 'large_download.jpeg',
                          hash: 'large_download_d1d23bf79f',
                          ext: '.jpeg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 1000,
                          height: 649,
                          size: 185.84,
                          sizeInBytes: 185840,
                          url: 'http://localhost:1337/uploads/large_download_d1d23bf79f.jpeg',
                        },
                        medium: {
                          name: 'medium_download.jpeg',
                          hash: 'medium_download_d1d23bf79f',
                          ext: '.jpeg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 750,
                          height: 487,
                          size: 104.22,
                          sizeInBytes: 104218,
                          url: 'http://localhost:1337/uploads/medium_download_d1d23bf79f.jpeg',
                        },
                      },
                      hash: 'download_d1d23bf79f',
                      ext: '.jpeg',
                      mime: 'image/jpeg',
                      size: 1207.47,
                      url: 'http://localhost:1337/uploads/download_d1d23bf79f.jpeg',
                      previewUrl: null,
                      provider: 'strapi-provider-upload-custom',
                      provider_metadata: null,
                      createdAt: '2024-09-24T16:19:29.152Z',
                      updatedAt: '2024-09-24T16:19:29.152Z',
                    },
                  },
                },
                mobileImage: {
                  data: {
                    id: 1,
                    attributes: {
                      name: 'download.jpeg',
                      alternativeText: null,
                      caption: null,
                      width: 3024,
                      height: 1964,
                      formats: {
                        thumbnail: {
                          name: 'thumbnail_download.jpeg',
                          hash: 'thumbnail_download_d1d23bf79f',
                          ext: '.jpeg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 241,
                          height: 156,
                          size: 10.06,
                          sizeInBytes: 10055,
                          url: 'http://localhost:1337/uploads/thumbnail_download_d1d23bf79f.jpeg',
                        },
                        small: {
                          name: 'small_download.jpeg',
                          hash: 'small_download_d1d23bf79f',
                          ext: '.jpeg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 500,
                          height: 325,
                          size: 43.12,
                          sizeInBytes: 43123,
                          url: 'http://localhost:1337/uploads/small_download_d1d23bf79f.jpeg',
                        },
                        large: {
                          name: 'large_download.jpeg',
                          hash: 'large_download_d1d23bf79f',
                          ext: '.jpeg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 1000,
                          height: 649,
                          size: 185.84,
                          sizeInBytes: 185840,
                          url: 'http://localhost:1337/uploads/large_download_d1d23bf79f.jpeg',
                        },
                        medium: {
                          name: 'medium_download.jpeg',
                          hash: 'medium_download_d1d23bf79f',
                          ext: '.jpeg',
                          mime: 'image/jpeg',
                          path: null,
                          width: 750,
                          height: 487,
                          size: 104.22,
                          sizeInBytes: 104218,
                          url: 'http://localhost:1337/uploads/medium_download_d1d23bf79f.jpeg',
                        },
                      },
                      hash: 'download_d1d23bf79f',
                      ext: '.jpeg',
                      mime: 'image/jpeg',
                      size: 1207.47,
                      url: 'http://localhost:1337/uploads/download_d1d23bf79f.jpeg',
                      previewUrl: null,
                      provider: 'strapi-provider-upload-custom',
                      provider_metadata: null,
                      createdAt: '2024-09-24T16:19:29.152Z',
                      updatedAt: '2024-09-24T16:19:29.152Z',
                    },
                  },
                },
                listItems: [
                  { id: 1, text: 'rhhtrhrthrt' },
                  { id: 2, text: 'fdsafdsagtyhtyh' },
                  { id: 3, text: 'hrhrhthrtyrth' },
                ],
                product: baseProductJson,
                versions: [],
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
      aaaa: 'firma-con-io/guides/aaaa/2',
    });
  });
});
