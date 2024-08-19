import * as E from 'fp-ts/lib/Either';
import { StrapiGuidesCodec } from '../guidesCodec';

export const guideImageJson = {
  data: {
    id: 4,
    attributes: {
      name: 'webinar-cover-io-remote-content.jpg',
      alternativeText: null,
      caption: null,
      width: 728,
      height: 416,
      hash: 'webinar_cover_io_remote_content_62f1f615b5',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 30.06,
      url: 'http://localhost:1337/uploads/webinar_cover_io_remote_content_62f1f615b5.jpg',
      previewUrl: null,
      provider: 'strapi-provider-upload-custom',
      provider_metadata: null,
      createdAt: '2024-04-15T14:25:47.773Z',
      updatedAt: '2024-08-19T13:39:34.462Z',
    },
  },
};

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
        title: 'test',
        slug: 'guide-1',
        createdAt: '2024-08-19T13:40:06.503Z',
        updatedAt: '2024-08-19T13:40:14.256Z',
        publishedAt: '2024-08-19T13:40:14.253Z',
        locale: 'it',
        versions: [
          {
            id: 3,
            main: true,
            dirname: 'aBQM7h48Vhhg8le4VIK8',
            version: 'v5.1',
          },
        ],
        listItems: [
          {
            id: 6,
            text: 'fdsfgd fsdfsd fsdf sdfsd',
          },
        ],
        image: guideImageJson,
        mobileImage: guideImageJson,
        product: {
          data: {
            id: 1,
            attributes: {
              name: 'CMS APP IO',
              description: 'Test desc ',
              slug: 'app-io',
              createdAt: '2024-02-15T09:57:22.179Z',
              updatedAt: '2024-07-17T15:08:58.315Z',
              publishedAt: '2024-02-15T09:57:24.401Z',
              locale: 'it',
              shortName: 'app-io',
            },
          },
        },
      },
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
});

describe('StrapiGuidesCodec', () => {
  it('should decode strapi guides', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiGuidesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
