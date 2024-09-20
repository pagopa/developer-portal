import * as E from 'fp-ts/lib/Either';
import { StrapiTutorialsCodec } from '../codecs/TutorialCodec';
import { productJson } from '@/lib/strapi/__tests__/fixtures/product';

const baseTutorialJson = {
  id: 1,
  attributes: {
    title: 'title',
    slug: 'tut-1',
    parts: [
      {
        id: 1,
        __component: 'parts.alert',
        text: 'test',
        title: 'test',
        severity: 'warning',
      },
      {
        id: 1,
        __component: 'parts.api-tester',
        requestDescription: 'test',
        responseDescription: 'res',
        responseCode: {
          id: 3,
          code: 'code res',
          showLineNumbers: true,
          language: null,
        },
        requestCode: {
          id: 2,
          code: 'code',
          showLineNumbers: false,
          language: 'xml',
        },
        requestAttributes: [
          {
            id: 1,
            label: 'att',
            value: '1',
          },
        ],
      },
      {
        id: 1,
        __component: 'parts.code-block',
        code: 'code block',
        showLineNumbers: true,
        language: 'shell',
      },
      {
        id: 1,
        __component: 'parts.embed-html',
        html: '<div>test <u>test</u></div>',
      },
      {
        id: 1,
        __component: 'parts.html',
        html: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'fsdfdsf sfsdf sdf sdf sd',
              },
            ],
          },
        ],
      },
      {
        id: 1,
        __component: 'parts.ck-editor',
        content: '<p>Ciao ciao ciao prova ciao</p>',
      },
    ],
    createdAt: '2024-06-04T12:34:13.309Z',
    updatedAt: '2024-06-04T12:42:01.642Z',
    publishedAt: '2024-06-04T12:34:38.692Z',
    locale: 'it',
    product: productJson,
    image: {
      data: null,
    },
    relatedLinks: null,
    bannerLinks: [],
  },
};

const makeStrapiResponseJson = () => ({
  data: [
    {
      ...baseTutorialJson,
      bannerLinks: [
        {
          id: 1,
          title: 'test',
          body: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'some desc',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          title: 'test 2',
          body: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'some desc',
                },
              ],
            },
          ],
        },
      ],
      relatedLinks: {
        id: 9,
        title: 'links',
        links: [
          {
            id: 21,
            text: 'click',
            href: 'http://localhost:1337/admin/content-manager/collection-types/api::tutorial.tutorial/1?plugins[i18n][locale]=it',
            target: '_blank',
          },
        ],
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

const makeStrapiResponseJsonWithNull = () => ({
  data: [
    {
      id: 1,
      attributes: {
        title: 'title',
        slug: 'tut-1',
        parts: [],
        createdAt: '2024-06-04T12:34:13.309Z',
        updatedAt: '2024-06-04T12:42:01.642Z',
        publishedAt: '2024-06-04T12:34:38.692Z',
        locale: 'it',
        product: productJson,
        image: {
          data: {
            id: 1,
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
              url: '/uploads/webinar_cover_io_remote_content_62f1f615b5.jpg',
              previewUrl: null,
              provider: 'strapi-provider-upload-custom',
              provider_metadata: null,
              createdAt: '2024-04-15T14:25:47.773Z',
              updatedAt: '2024-04-15T14:25:47.773Z',
            },
          },
        },
        relatedLinks: null,
        bannerLinks: [],
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

describe('TutorialCodec', () => {
  it('should decode strapi tutorials', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiTutorialsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi tutorials with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseJsonWithNull();
    const actual = StrapiTutorialsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
