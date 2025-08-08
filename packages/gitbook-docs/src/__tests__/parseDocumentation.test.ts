import {
  getIncludeContent,
  parseUrlsFromMarkdown,
  replaceIncludes,
} from '../helpers/documentationParsing.helper';

const UrlParsingMetadata = {
  dirName: 'test-hash',
  guides: [
    { guidePath: 'this-is-a-test', guideUrl: 'parsed-url' },
    { guidePath: 'parent/parse-this', guideUrl: 'parsed-url' },
    { guidePath: 'other-parent/parse-this', guideUrl: 'different-parsed-url' },
    {
      guidePath: 'guide-with-hashtag/this-will-be-parsed',
      guideUrl: 'parsed-url-with-hashtag',
    },
  ],
};

const GlobalMetadata = [
  UrlParsingMetadata,
  {
    dirName: 'second-test',
    guides: [
      {
        guidePath: 'other-documentation',
        guideUrl: 'other-documentation-parsed-url',
      },
    ],
  },
];

describe('parseUrlsFromMarkdown', () => {
  it('should parse url', () => {
    const res = parseUrlsFromMarkdown(
      'This is a test string [this-is-a-test](this-is-a-test.md)',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual(
      'This is a test string [this-is-a-test](parsed-url)'
    );
  });

  it('should not parse url if no metadata is provided', () => {
    const res = parseUrlsFromMarkdown(
      'This is a test string [this-is-a-test](this-is-a-test.md)',
      undefined
    );
    expect(res).toStrictEqual(
      'This is a test string [this-is-a-test](this-is-a-test.md)'
    );
  });
  it('should not parse url if metadata do not contain reference', () => {
    const res = parseUrlsFromMarkdown(
      'This is a test string [do-not-parse](do-not-parse.md)',
      undefined
    );
    expect(res).toStrictEqual(
      'This is a test string [do-not-parse](do-not-parse.md)'
    );
  });
  it('should correctly parse the right url', () => {
    const res = parseUrlsFromMarkdown(
      'This is a test string [this-is-a-test](parent/parse-this.md) and [this-is-a-test](other-parent/parse-this.md)',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual(
      'This is a test string [this-is-a-test](parsed-url) and [this-is-a-test](different-parsed-url)'
    );
  });
  it('should parse url with hashtag', () => {
    const res = parseUrlsFromMarkdown(
      'This is a test string [this-is-a-test](guide-with-hashtag/this-will-be-parsed.md#ending)',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual(
      'This is a test string [this-is-a-test](parsed-url-with-hashtag#ending)'
    );
  });
  it('should parse url referencing another guide', () => {
    const res = parseUrlsFromMarkdown(
      'This is a test string [this-is-a-test](this-references-another-guide/second-test)',
      UrlParsingMetadata,
      GlobalMetadata
    );
    expect(res).toStrictEqual(
      'This is a test string [this-is-a-test](other-documentation-parsed-url)'
    );
  });
});

describe('replaceIncludes', () => {
  it('should replace includes', async () => {
    const ret = await replaceIncludes(
      '{% include "somefile" %}',
      'This is the include content!'
    );
    expect(ret).toStrictEqual('This is the include content!');
  });
  it('should export include file content', async () => {
    const ret = await getIncludeContent(
      '__tests__/fixtures/reusable-content.md',
      __dirname
    );
    expect(ret).toStrictEqual('This is a test');
  });
});
