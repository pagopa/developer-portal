import Markdoc from '@markdoc/markdoc';
import { parseContent } from '../parseContent';

const config = {
  assetsPrefix: '/assets/prefix',
  linkPrefix: '/assets/prefix',
};

describe('parseContent', () => {
  it('should parse heading', () => {
    expect(parseContent('# h1\n## h2', config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 1 }, ['h1']),
      new Markdoc.Tag('Heading', { level: 2 }, ['h2']),
    ]);
  });

  it('should parse paragraph', () => {
    expect(parseContent('This is a paragraph', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['This is a paragraph']),
    ]);
  });

  it('should convert href as expected', () => {
    expect(parseContent('[Guida](../../a/b.md)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '../../a/b' }, ['Guida']),
      ]),
    ]);
  });

  it('should parse hint', () => {
    expect(
      parseContent('{% hint style="info" %}\nText\n{% endhint %}\nText', config)
    ).toStrictEqual([
      new Markdoc.Tag(
        'Hint',
        {
          style: 'info',
        },
        [new Markdoc.Tag('Paragraph', {}, ['Text'])]
      ),
      new Markdoc.Tag('Paragraph', {}, ['Text']),
    ]);
  });

  it('should parse Image', () => {
    expect(
      parseContent(
        '<figure><img src="img-src.jpg" alt="anAlt"></figure>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Figure',
          {
            src: `${config.assetsPrefix}/img-src.jpg`,
            alt: 'anAlt',
          },
          []
        ),
      ]),
    ]);
    expect(
      parseContent(
        '<figure><img src="img-src.jpg" alt="anAlt"><figcaption>Caption</figcaption></figure>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Figure',
          {
            src: `${config.assetsPrefix}/img-src.jpg`,
            alt: 'anAlt',
          },
          ['Caption']
        ),
      ]),
    ]);
  });

  it('should parse swagger', () => {
    expect(
      parseContent(
        '{% swagger src="index.yaml" path="/p" method="post" %}\n[index.yaml](index.yaml)\n{% endswagger %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'Swagger',
        {
          src: 'index.yaml',
          path: '/p',
          method: 'post',
        },
        []
      ),
    ]);
  });

  it('should parse code block', () => {
    const code =
      '```javascript\n' +
      "console.log('Hello')\n" +
      "console.log('there')\n" +
      '```\n';
    expect(parseContent(code, config)).toStrictEqual([
      new Markdoc.Tag(
        'CodeBlock',
        {
          lineNumbers: true,
          language: 'javascript',
        },
        ["console.log('Hello')\nconsole.log('there')\n"]
      ),
    ]);
    expect(
      parseContent(
        '{% code title="i.js" overflow="wrap" lineNumbers="true" %}\n' +
          code +
          '{% endcode %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'CodeBlock',
        {
          title: 'i.js',
          overflow: 'wrap',
          lineNumbers: true,
          language: 'javascript',
        },
        ["console.log('Hello')\nconsole.log('there')\n"]
      ),
    ]);
  });

  it('should parse file', () => {
    const prefix = config.assetsPrefix;
    expect(parseContent('{% file src="p/a-src.jpg" %}', config)).toStrictEqual([
      new Markdoc.Tag('File', {
        src: `${prefix}/p/a-src.jpg`,
        filename: 'a-src',
      }),
    ]);
    expect(
      parseContent('{% file src="a-src.jpg" %}\nCaption\n{% endfile %}', config)
    ).toStrictEqual([
      new Markdoc.Tag('File', {
        src: `${prefix}/a-src.jpg`,
        filename: 'a-src',
        caption: 'Caption',
      }),
    ]);
  });
});
