import {
  getIncludeContent,
  parseUrlsFromMarkdown,
  replaceIncludes,
} from '../helpers/documentationParsing.helper';

const UrlParsingMetadata = {
  dirName: 'test-hash',
  docs: [
    { path: 'this-is-a-test', url: 'parsed-url' },
    { path: 'parent/parse-this', url: 'parsed-url' },
    { path: 'other-parent/parse-this', url: 'different-parsed-url' },
    {
      path: 'guide-with-hashtag/this-will-be-parsed',
      url: 'parsed-url-with-hashtag',
    },
    { path: 'http://localhost:3000/some-doc', url: 'parsed-localhost' },
    { path: 'https://www.external-link.com', url: 'do-not-parse' },
    { path: 'https://app.gitbook.com', url: 'must-parse-this' },
  ],
};

const GlobalMetadata = [
  UrlParsingMetadata,
  {
    dirName: 'second-test',
    docs: [
      {
        path: 'other-documentation',
        url: 'other-documentation-parsed-url',
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

  it('should not parse url if it is an external link', () => {
    const res = parseUrlsFromMarkdown(
      'This is a test string [external-link](https://www.external-link.com)',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual(
      'This is a test string [external-link](https://www.external-link.com)'
    );
  });

  it('should parse external urls from gitbook', () => {
    const res = parseUrlsFromMarkdown(
      'this is a test string [gitbook-link](https://app.gitbook.com)',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual(
      'this is a test string [gitbook-link](must-parse-this)'
    );
  });

  it('should simultaneously replace urls in parentheses, double quotes, and single quotes in a single string', () => {
    const res = parseUrlsFromMarkdown(
      `Markdown link [test](this-is-a-test.md), HTML double <a href="this-is-a-test.md">link</a>, and HTML single <a href='this-is-a-test.md'>link</a>`,
      UrlParsingMetadata
    );
    expect(res).toStrictEqual(
      `Markdown link [test](parsed-url), HTML double <a href="parsed-url">link</a>, and HTML single <a href='parsed-url'>link</a>`
    );
  });

  it.skip('should safely escape regex special characters in the target path during replacement', () => {
    const SpecialCharMetadata = {
      dirName: 'special-test',
      docs: [
        {
          path: 'path-with-[brackets] and (parentheses)',
          url: 'safe-parsed-url',
        },
      ],
    };

    const res = parseUrlsFromMarkdown(
      'Check out this weird link: [link](path-with-[brackets] and parentheses.md)',
      SpecialCharMetadata
    );
    expect(res).toStrictEqual(
      'Check out this weird link: [link](safe-parsed-url)'
    );
  });

  it('should parse html anchor tags with double quotes', () => {
    const res = parseUrlsFromMarkdown(
      'Text <a href="this-is-a-test.md">link</a> text',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual('Text <a href="parsed-url">link</a> text');
  });

  it('should parse html anchor tags with single quotes', () => {
    const res = parseUrlsFromMarkdown(
      "Text <a href='this-is-a-test.md'>link</a> text",
      UrlParsingMetadata
    );
    expect(res).toStrictEqual("Text <a href='parsed-url'>link</a> text");
  });

  it('should prioritize the correct match based on filePath context', () => {
    const res = parseUrlsFromMarkdown(
      'Check [this link](parse-this.md)',
      UrlParsingMetadata,
      [],
      'parent/current-file.md'
    );
    expect(res).toStrictEqual('Check [this link](parsed-url)');
  });

  it('should resolve to the other parent based on filePath context', () => {
    const res = parseUrlsFromMarkdown(
      'Check [this link](parse-this.md)',
      UrlParsingMetadata,
      [],
      'other-parent/current-file.md'
    );
    expect(res).toStrictEqual('Check [this link](different-parsed-url)');
  });

  it('should parse localhost links as internal links (allowing processing)', () => {
    const res = parseUrlsFromMarkdown(
      'Test [local](http://localhost:3000/some-doc)',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual('Test [local](parsed-localhost)');
  });

  it('should clean up "mention" suffix and parse correctly', () => {
    // Il codice fa .replace(' "mention"', '')
    const res = parseUrlsFromMarkdown(
      'User [test](this-is-a-test.md "mention")',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual('User [test](parsed-url)');
  });

  it('should ignore very short filenames (<= 1 char)', () => {
    const res = parseUrlsFromMarkdown('Check [a](a.md)', UrlParsingMetadata);
    expect(res).toStrictEqual('Check [a](a.md)');
  });

  it('should replace all occurrences of the same link', () => {
    const res = parseUrlsFromMarkdown(
      '[link](this-is-a-test.md) and again [link](this-is-a-test.md)',
      UrlParsingMetadata
    );
    expect(res).toStrictEqual(
      '[link](parsed-url) and again [link](parsed-url)'
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
