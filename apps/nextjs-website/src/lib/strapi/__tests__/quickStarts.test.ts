import * as E from 'fp-ts/lib/Either';
import { StrapiQuickStartsCodec } from '@/lib/strapi/quickStarts';

const product = {
  data: {
    id: 1,
    attributes: {
      name: 'CMS APP IO',
      description: 'Test desc ',
      slug: 'app-io',
      createdAt: '2024-02-15T09:57:22.179Z',
      updatedAt: '2024-02-27T11:13:34.014Z',
      publishedAt: '2024-02-15T09:57:24.401Z',
      locale: 'it',
      logo: {
        data: {
          id: 1,
          attributes: {
            name: 'Screenshot from 2024-02-20 17-03-22.png',
            alternativeText: null,
            caption: null,
            width: 2481,
            height: 1919,
            formats: {
              thumbnail: {
                name: 'thumbnail_Screenshot from 2024-02-20 17-03-22.png',
                hash: 'thumbnail_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                ext: '.png',
                mime: 'image/png',
                path: null,
                width: 202,
                height: 156,
                size: 5.63,
                url: '/uploads/thumbnail_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
              },
              large: {
                name: 'large_Screenshot from 2024-02-20 17-03-22.png',
                hash: 'large_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                ext: '.png',
                mime: 'image/png',
                path: null,
                width: 1000,
                height: 773,
                size: 48.63,
                url: '/uploads/large_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
              },
              medium: {
                name: 'medium_Screenshot from 2024-02-20 17-03-22.png',
                hash: 'medium_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                ext: '.png',
                mime: 'image/png',
                path: null,
                width: 750,
                height: 580,
                size: 33.57,
                url: '/uploads/medium_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
              },
              small: {
                name: 'small_Screenshot from 2024-02-20 17-03-22.png',
                hash: 'small_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
                ext: '.png',
                mime: 'image/png',
                path: null,
                width: 500,
                height: 387,
                size: 19.04,
                url: '/uploads/small_Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
              },
            },
            hash: 'Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e',
            ext: '.png',
            mime: 'image/png',
            size: 30.86,
            url: '/uploads/Screenshot_from_2024_02_20_17_03_22_4fe74a0a0e.png',
            previewUrl: null,
            provider: 'local',
            provider_metadata: null,
            createdAt: '2024-02-27T10:11:20.913Z',
            updatedAt: '2024-03-27T17:34:49.514Z',
          },
        },
      },
    },
  },
};

const makeStrapiResponseJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
        title: 'Test quick start',
        description: 'Some description',
        createdAt: '2024-05-15T13:50:06.837Z',
        updatedAt: '2024-05-16T10:00:31.762Z',
        publishedAt: '2024-05-15T14:35:57.031Z',
        locale: 'it',
        quickstartGuideItems: {
          data: [
            {
              id: 2,
              attributes: {
                title: 'Step 1',
                createdAt: '2024-05-16T09:59:13.112Z',
                updatedAt: '2024-05-16T10:05:21.561Z',
                publishedAt: '2024-05-16T10:05:21.558Z',
                locale: 'it',
                anchor: '01',
                parts: [
                  {
                    id: 3,
                    __component: 'parts.html',
                    html: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'some text',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 2,
                    __component: 'parts.code-block',
                    code: '// a BuildEnv instance ready to be used\nconst buildEnv = pipe(\n  makeBuildConfig(process.env),\n  E.map(makeBuildEnv),\n  E.getOrElseW((errors) => {\n    // eslint-disable-next-line functional/no-throw-statements\n    throw errors;\n  })\n);',
                    language: 'typescript',
                    showLineNumbers: true,
                  },
                  {
                    id: 2,
                    __component: 'parts.alert',
                    text: 'Alert',
                    title: 'NB',
                    severity: 'warning',
                  },
                  {
                    id: 2,
                    __component: 'parts.api-tester',
                    requestDescription: 'attributes: ',
                    responseDescription: 'response:',
                    requestAttributes: [
                      {
                        id: 1,
                        label: 'age',
                        value: '45',
                      },
                      {
                        id: 2,
                        label: 'name',
                        value: 'smith',
                      },
                    ],
                    requestCode: {
                      id: 3,
                      code: '{\n  "age": 45,\n  "name": "smith"\n}',
                      language: 'json',
                      showLineNumbers: null,
                    },
                    responseCode: {
                      id: 4,
                      code: '{\n  "token":  "fsd5fd4fsd5-4f5sf2efrtbt-12r78gs7"\n}',
                      language: 'json',
                      showLineNumbers: null,
                    },
                  },
                  {
                    id: 1,
                    __component: 'parts.embed-html',
                    html: '<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%">\n  <iframe\n    src="https://demo.arcade.software/DWHgngdrgv8TSKuLsVSQ?embed"\\n` +\n    frameborder="0"\n    loading="lazy"\\n` +\n    webkitallowfullscreen\n    mozallowfullscreen\n    allowfullscreen\n    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;"\n    title="Area Riservata -- SEND"\n  />\n</div>',
                  },
                ],
              },
            },
            {
              id: 3,
              attributes: {
                title: 'step 2',
                createdAt: '2024-05-16T10:05:49.357Z',
                updatedAt: '2024-05-16T10:06:04.286Z',
                publishedAt: '2024-05-16T10:05:53.040Z',
                locale: 'it',
                anchor: '02',
                parts: [
                  {
                    id: 4,
                    __component: 'parts.html',
                    html: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'finito',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        product: product,
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

const makeStrapiResponseWithNullsJson = () => ({
  data: [
    {
      id: 1,
      attributes: {
        title: 'Test quick start',
        description: 'Some description',
        createdAt: '2024-05-15T13:50:06.837Z',
        updatedAt: '2024-05-16T10:00:31.762Z',
        publishedAt: '2024-05-15T14:35:57.031Z',
        locale: 'it',
        quickstartGuideItems: {
          data: [
            {
              id: 2,
              attributes: {
                title: 'Step 1',
                createdAt: '2024-05-16T09:59:13.112Z',
                updatedAt: '2024-05-16T10:05:21.561Z',
                publishedAt: '2024-05-16T10:05:21.558Z',
                locale: 'it',
                anchor: '01',
                parts: [
                  {
                    id: 3,
                    __component: 'parts.html',
                    html: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'some text',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 2,
                    __component: 'parts.code-block',
                    code: '// a BuildEnv instance ready to be used\nconst buildEnv = pipe(\n  makeBuildConfig(process.env),\n  E.map(makeBuildEnv),\n  E.getOrElseW((errors) => {\n    // eslint-disable-next-line functional/no-throw-statements\n    throw errors;\n  })\n);',
                    language: null,
                    showLineNumbers: null,
                  },
                  {
                    id: 2,
                    __component: 'parts.alert',
                    text: null,
                    title: null,
                    severity: 'warning',
                  },
                  {
                    id: 2,
                    __component: 'parts.api-tester',
                    requestDescription: 'attributes: ',
                    responseDescription: 'response:',
                    requestAttributes: [
                      {
                        id: 1,
                        label: 'age',
                        value: '45',
                      },
                      {
                        id: 2,
                        label: 'name',
                        value: 'smith',
                      },
                    ],
                    requestCode: {
                      id: 3,
                      code: '{\n  "age": 45,\n  "name": "smith"\n}',
                      language: 'json',
                      showLineNumbers: null,
                    },
                    responseCode: {
                      id: 4,
                      code: '{\n  "token":  "fsd5fd4fsd5-4f5sf2efrtbt-12r78gs7"\n}',
                      language: 'json',
                      showLineNumbers: null,
                    },
                  },
                  {
                    id: 1,
                    __component: 'parts.embed-html',
                    html: '<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%">\n  <iframe\n    src="https://demo.arcade.software/DWHgngdrgv8TSKuLsVSQ?embed"\\n` +\n    frameborder="0"\n    loading="lazy"\\n` +\n    webkitallowfullscreen\n    mozallowfullscreen\n    allowfullscreen\n    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;"\n    title="Area Riservata -- SEND"\n  />\n</div>',
                  },
                ],
              },
            },
            {
              id: 3,
              attributes: {
                title: 'step 2',
                createdAt: '2024-05-16T10:05:49.357Z',
                updatedAt: '2024-05-16T10:06:04.286Z',
                publishedAt: '2024-05-16T10:05:53.040Z',
                locale: 'it',
                anchor: '02',
                parts: [
                  {
                    id: 4,
                    __component: 'parts.html',
                    html: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: 'some text',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        product: product,
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

describe('StrapiQuickStartsCodec', () => {
  it('should decode strapi webinars', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = StrapiQuickStartsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi webinars with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseWithNullsJson();
    const actual = StrapiQuickStartsCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
