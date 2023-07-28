import Markdoc from '@markdoc/markdoc';
import { parseContent } from '../parseContent';

const config = {
  assetsPrefix: '/assets/prefix',
  linkPrefix: '/link/prefix',
  pagePath: '/path/to/page',
  isPageIndex: false,
};

describe('parseContent', () => {
  it('should ignore any <p> tag', () => {
    expect(parseContent('<p>Hello there!</p>', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['Hello there!']),
    ]);
  });
  it('should ignore any anchor tag', () => {
    expect(parseContent('<a href="#_o" id="_o"></a>', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, []),
    ]);
  });
  it('should parse heading', () => {
    expect(parseContent('# 🏠 h1🏠\n## h2', config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 1 }, ['h1']),
      new Markdoc.Tag('Heading', { level: 2 }, ['h2']),
    ]);
  });

  it('should parse the description from frontmatter and put after the title or on beginning', () => {
    const markdown = '---\ndescription: >-\n  This is\n  a description\n---\n';
    expect(parseContent(`${markdown}# A Title`, config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 1 }, ['A Title']),
      new Markdoc.Tag('Paragraph', {}, ['This is a description']),
    ]);
    expect(parseContent(`${markdown}A paragraph`, config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['This is a description']),
      new Markdoc.Tag('Paragraph', {}, ['A paragraph']),
    ]);
  });

  it('should parse paragraph', () => {
    expect(parseContent('This is a paragraph', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['This is a paragraph']),
    ]);
  });

  it('should convert href as expected', () => {
    expect(parseContent('[Guida](README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/path/to' }, ['Guida']),
      ]),
    ]);
    expect(parseContent('[Guida](b.md)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/path/to/b' }, ['Guida']),
      ]),
    ]);
    expect(parseContent('[Guida](../a/b.md)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/path/a/b' }, ['Guida']),
      ]),
    ]);
  });

  it('should convert href as expected given an index page', () => {
    const customConfig = { ...config, isPageIndex: true };
    expect(parseContent('[Guida](b.md)', customConfig)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/path/to/page/b' }, ['Guida']),
      ]),
    ]);
    expect(parseContent('[Guida](../a/b.md)', customConfig)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/path/to/a/b' }, ['Guida']),
      ]),
    ]);
  });

  it('should parse unordered list', () => {
    expect(parseContent('* Item', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: false }, [
        new Markdoc.Tag('Item', {}, ['Item']),
      ]),
    ]);
  });

  it('should parse ordered list', () => {
    expect(parseContent('1. Item', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: true }, [
        new Markdoc.Tag('Item', {}, ['Item']),
      ]),
    ]);
  });

  it('should parse task list', () => {
    expect(parseContent('* [ ] Item', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: false }, [
        new Markdoc.Tag('Item', { checked: false }, ['Item']),
      ]),
    ]);
    expect(parseContent('* [x] Item', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: false }, [
        new Markdoc.Tag('Item', { checked: true }, ['Item']),
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

  it('should parse img', () => {
    expect(
      parseContent('<img src="img-src.jpg" alt="anAlt">', config)
    ).toStrictEqual([
      new Markdoc.Tag('Image', {
        src: `${config.assetsPrefix}/img-src.jpg`,
        alt: 'anAlt',
      }),
    ]);
    expect(
      parseContent('<img src="../../../img-src.jpg" alt="anAlt">', config)
    ).toStrictEqual([
      new Markdoc.Tag('Image', {
        src: `${config.assetsPrefix}/img-src.jpg`,
        alt: 'anAlt',
      }),
    ]);
    expect(parseContent('![an-alt](../../img-src.jpg)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Image', {
          src: `${config.assetsPrefix}/img-src.jpg`,
          alt: 'an-alt',
        }),
      ]),
    ]);
  });

  it('should parse figure', () => {
    expect(
      parseContent(
        '<figure><img src="img-src.jpg" alt="anAlt"></figure>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Image', {
          src: `${config.assetsPrefix}/img-src.jpg`,
          alt: 'anAlt',
        }),
      ]),
    ]);
    expect(
      parseContent(
        '<figure><img src="img-src.jpg" alt="anAlt"><figcaption>Caption</figcaption></figure>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Image', {
          src: `${config.assetsPrefix}/img-src.jpg`,
          alt: 'anAlt',
          caption: 'Caption',
        }),
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

  it('should parse styled text', () => {
    expect(parseContent('This is **Bold**', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'This is ',
        new Markdoc.Tag('StyledText', { style: 'strong' }, ['Bold']),
      ]),
    ]);
    expect(parseContent('This is _Italic_', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'This is ',
        new Markdoc.Tag('StyledText', { style: 'italic' }, ['Italic']),
      ]),
    ]);
    expect(parseContent('This is `Code`', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'This is ',
        new Markdoc.Tag('StyledText', { style: 'code' }, ['Code']),
      ]),
    ]);
    expect(parseContent('This is ~~Strikethrough~~', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'This is ',
        new Markdoc.Tag('StyledText', { style: 'strikethrough' }, [
          'Strikethrough',
        ]),
      ]),
    ]);
  });

  it('should ignore mark tag', () => {
    expect(
      parseContent('This is <mark style="color:orange;">Mark</mark>', config)
    ).toStrictEqual([new Markdoc.Tag('Paragraph', {}, ['This is ', 'Mark'])]);
  });

  it('should parse quote', () => {
    const inlineQuote = '> « attività di riconciliazione del pagamento »';
    expect(parseContent(inlineQuote, config)).toStrictEqual([
      new Markdoc.Tag('Quote', {}, [
        new Markdoc.Tag('Paragraph', {}, [
          '« attività di riconciliazione del pagamento »',
        ]),
      ]),
    ]);

    expect(
      parseContent('> This is a quote.\n> Another line, same quote', config)
    ).toStrictEqual([
      new Markdoc.Tag('Quote', {}, [
        new Markdoc.Tag('Paragraph', {}, [
          'This is a quote.',
          ' ',
          'Another line, same quote',
        ]),
      ]),
    ]);
  });

  it('should parse tabs', () => {
    expect(
      parseContent(
        '{% tabs %}\n{% tab title="Tab 1" %}\nTab 1 Content\n{% endtab %}\n\n{% tab title="Tab 2" %}\nTab 2 Content\n{% endtab %}\n{% endtabs %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Tabs', { titles: ['Tab 1', 'Tab 2'] }, [
        new Markdoc.Tag('Paragraph', {}, ['Tab 1 Content']),
        new Markdoc.Tag('Paragraph', {}, ['Tab 2 Content']),
      ]),
    ]);

    expect(
      parseContent(
        '{% tabs %}\n{% tab title="Tab 1" %}\nTab 1 Content\n{% endtab %}\n\n{% tab title="Tab 2" %}\n\n{% endtab %}\n{% endtabs %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Tabs', { titles: ['Tab 1', 'Tab 2'] }, [
        new Markdoc.Tag('Paragraph', {}, ['Tab 1 Content']),
        '',
      ]),
    ]);
  });

  it('should parse expandable', () => {
    expect(
      parseContent(
        '<details>\n\n<summary>A Summary</summary>\n\nA Details\n\n</details>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Expandable', {}, [
        new Markdoc.Tag('ExpandableSummary', {}, ['A Summary']),
        new Markdoc.Tag('ExpandableDetails', {}, [
          new Markdoc.Tag('Paragraph', {}, ['A Details']),
        ]),
      ]),
    ]);
  });

  it('should parse table', () => {
    const table =
      '| col A | col B |\n| --------- | --------- |\n| 1 - A     | 1 - B     |\n| 2 - A     | 2 - B     |';
    expect(parseContent(table, config)).toStrictEqual([
      new Markdoc.Tag('Table', {}, [
        new Markdoc.Tag('TableHead', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableH', {}, ['col A']),
            new Markdoc.Tag('TableH', {}, ['col B']),
          ]),
        ]),
        new Markdoc.Tag('TableBody', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['1 - A']),
            new Markdoc.Tag('TableD', {}, ['1 - B']),
          ]),
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['2 - A']),
            new Markdoc.Tag('TableD', {}, ['2 - B']),
          ]),
        ]),
      ]),
    ]);
  });

  it('should parse embed', () => {
    const embed =
      '{% embed url="https://www.pagopa.it/" %}\n' +
      'This is a caption\n' +
      '{% endembed %}';
    expect(parseContent(embed, config)).toStrictEqual([
      new Markdoc.Tag(
        'Embed',
        {
          url: 'https://www.pagopa.it/',
        },
        [new Markdoc.Tag('Paragraph', {}, ['This is a caption'])]
      ),
    ]);

    expect(
      parseContent('{% embed url="https://www.pagopa.it/" %}\nhi', config)
    ).toStrictEqual([
      new Markdoc.Tag('Embed', {
        url: 'https://www.pagopa.it/',
      }),
      new Markdoc.Tag('Paragraph', {}, ['hi']),
    ]);
  });

  it('should parse strong html tag', () => {
    const strongText = '<strong>Text</strong>';
    expect(parseContent(strongText, config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('StyledText', { style: 'strong' }, ['Text']),
      ]),
    ]);
  });

  it('ignore table tag', () => {
    expect(
      parseContent(
        '<table data-card-size="large" data-view="cards"><thead></thead><tbody></tbody></table>',
        config
      )
    ).toStrictEqual([]);
    expect(
      parseContent(
        '<table data-header-hidden><thead></thead><tbody></tbody></table>',
        config
      )
    ).toStrictEqual([]);
  });
});
