import * as E from 'fp-ts/lib/Either';
import { QuickStartGuidesCodec } from '@/lib/strapi/codecs/QuickStartGuidesCodec';
import { productJson } from '@/lib/strapi/__tests__/fixtures/product';
import { bannerLinksJson } from '@/lib/strapi/__tests__/fixtures/bannerLinksJson';

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
        product: productJson,
        bannerLinks: bannerLinksJson,
        seo: null,
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
        product: productJson,
        bannerLinks: [],
        seo: null,
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

describe('QuickStartGuidesCodec', () => {
  it('should decode strapi quickStartGuides', () => {
    const jsonFromStrapi = makeStrapiResponseJson();
    const actual = QuickStartGuidesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });

  it('should decode strapi quickStartGuides with nulls', () => {
    const jsonFromStrapi = makeStrapiResponseWithNullsJson();
    const actual = QuickStartGuidesCodec.decode(jsonFromStrapi);
    expect(E.isRight(actual)).toBeTruthy();
  });
});
